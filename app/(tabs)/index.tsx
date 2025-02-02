import { Collapsible } from '@/components/Collapsible';
import { ThemedView } from '@/components/ThemedView';
import { gradientColors, Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Platform, View, Text, Switch, useColorScheme} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { Avatar, AvatarImage, Card, H1, H3, XStack, ScrollView, YStack, Progress, Button, ProgressIndicator } from 'tamagui';

import { getGrades } from '@/components/scripts/grades'
import { getMyInfo } from '@/components/scripts/personal_info'
import { useTheme } from '@/components/ThemeProvider';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const { theme, toggleTheme } = useTheme();

  const [webViewSource, setWebViewSource] = useState({ uri: 'https://wu.pm.szczecin.pl/' });
  const [grades, setGrades] = useState([]);
  const [myInfo, setMyInfo] = useState({})
  const [isHidden, setIsHidden] = useState(false);
  const [dataLoadingState, setDataLoadingState] = useState(false)
  const [dataLoadingProgress, setDataLoadingProgress] = useState(0)
  const [dataLoadingStage, setDataLoadingStage] = useState(0) // 0 - grades, 0 - personal info
  const [injectedJavaScript, setInjectedJavaScript] = useState(getGrades)

  const [sideBarOpenState, setSideBarOpenState] = useState(false)

  const handleMessage = (event: { nativeEvent: { data: any; }; }) => {
      const message = event.nativeEvent.data;
      
      if (message.startsWith('')) {
        console.log("Got grades.")
        switch (dataLoadingStage) {
          case 0: {
            setDataLoadingProgress(80)
            // console.log('Message from WebView:', message);
            setGrades(JSON.parse(message));
            setIsHidden(true);

            setDataLoadingStage(1)
            setWebViewSource({uri: "https://wu.pm.szczecin.pl/wu/Wynik2.aspx"})
            setInjectedJavaScript(getMyInfo)
            break;
          }
          case 1: {
            setDataLoadingProgress(100)
            // console.log('Message from WebView:', message);
            slowHideProgressBar()
            setMyInfo(JSON.parse(message));

            setDataLoadingStage(1)
            break;
          }
        }

      }
      
  };

const slowHideProgressBar = () => {
  setTimeout(() => {
    setDataLoadingState(false)
  }, 1500)
}

const progressStages = {
  "https://idp.pm.szczecin.pl/External/Callback" : 10,
  "https://wu.pm.szczecin.pl/WU/LoginIdentity.aspx" : 20,
  "https://wu.pm.szczecin.pl/WU/Pusta.aspx" : 30,
  "https://wu.pm.szczecin.pl/WU/Grades.aspx": 60,
}
  
  const colorTheme = useMemo(() =>
  StyleSheet.create({
    default: {
      backgroundColor: Colors[theme.dark ? "dark" : "light"]["background"],
      
    },
    defaultColor: {
      color: Colors[theme.dark ? "dark" : "light"]["text"]
    }
  }), [theme]);


  return (
    <View style = {styles.root}>
      <SafeAreaView style={!isHidden ? styles.webview : styles.hidden}>
        <WebView
          source={webViewSource}
          javaScriptEnabled={true}
          onMessage={handleMessage}
          // injectedJavaScript={injectedJavaScript}
          onLoadStart={(state) => {
            const { nativeEvent } = state
            const url = nativeEvent.url

            if (dataLoadingState == true) {
              if (progressStages.hasOwnProperty(url)) {
                setDataLoadingProgress(Number(progressStages[url as keyof typeof progressStages]))
              }
            }
            if (url == "https://wu.pm.szczecin.pl/wu/" && dataLoadingStage == 0) {
              setWebViewSource({ uri: 'https://wu.pm.szczecin.pl/WU/Grades.aspx' });
            }
            if (url == "https://idp.pm.szczecin.pl/o365") {
              setIsHidden(true)
              setDataLoadingState(true)
              console.log("Loading grades...")
            }
          }

          }
          onNavigationStateChange={(navState) => {
            const url = navState.url
            if (url == "https://wu.pm.szczecin.pl/WU/Pusta.aspx") {
              console.log("changing urls..")
              setWebViewSource({ uri: 'https://wu.pm.szczecin.pl/WU/Grades.aspx' });
            }
          }}
        />
      </SafeAreaView>
      <View style={isHidden ? styles.grades : styles.hidden}>    
        <ThemedView style={styles.appBackground}>
        <LinearGradient
          colors={gradientColors}
          style={styles.appBackground}
        />
        <SafeAreaView style={styles.appContent}>
          {sideBarOpenState &&
          <ScrollView style={[styles.sideBar, colorTheme.default,{
            right: insets.right, top: insets.top,

            }]}>
            <Button onPress={() => {setSideBarOpenState(false)}}>Close sideBar</Button>
            <Button
                onPress={() => {
                  setSideBarOpenState(false)
                  setWebViewSource({ uri: 'https://wu.pm.szczecin.pl/WU/Wyloguj.aspx' });
                  setGrades([]);
                  setIsHidden(false);
                  setDataLoadingProgress(0)
                  setDataLoadingStage(0)
                  setInjectedJavaScript(getGrades)
                }}
              > Logout </Button>
              <Text>Dark Mode: {theme.dark ? 'Enabled' : 'Disabled'}</Text>
              <Switch
                value={theme.dark ? true : false}
                onValueChange={toggleTheme}
              />
              {Object.keys(myInfo).map((key, index) => 
                <H3 key={index}>{key}:{myInfo[key]}</H3>
              )}
          </ScrollView>
          }
          <ScrollView> 
            <XStack margin={10} justifyContent='space-between' alignItems='center'>
              <H1 style={[colorTheme.defaultColor,{fontSize: 32, fontWeight: 'bold'}]}> Hi,
                {Object.keys(myInfo).length > 0 ?
                  " " + myInfo.imie
                :
                " Stella"
                }
              </H1>
              <Avatar circular size={48} asChild
                style={{borderWidth: 3, borderColor: 'white'}}>
                <Button
                  onPress={() => {
                    setSideBarOpenState(true)
                  }}
                  backgroundColor="transparent"
                  padding={0}
                  borderWidth={0}
                >
                <AvatarImage
                  src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
                />
                </Button>
                
              </Avatar>
            </XStack>
            <H3 style={{marginLeft: 10, fontSize: 18, fontWeight: 'bold'}}>Your grades</H3>
            <ThemedView style={[colorTheme.default, {borderRadius: 20, padding: 5, minHeight: "150%"}]}>
              {grades.map((semester, index) => 
                <Collapsible title={semester.Semester} key={index} style={colorTheme.default}>
                  <View style={[styles.card, colorTheme.default]}>
                  {semester.Grades.map((subject, index) => (
                    <View key={index} style={styles.grade}>
                      <XStack>
                        <YStack flex={2}>
                          <H3 style={{ fontSize: 16, lineHeight: 30}}>{subject.SubjectName}</H3>
                          <H3 style={{ fontSize: 14, color: "gray", lineHeight: 20}}>Punkty ECTS: {subject.Subjects[subject.Subjects.length - 1]["Punkty ECTS"]}</H3>
                          <XStack alignItems='center' marginTop={20} gap={5}>
                            <Avatar circular size={24}>
                              <AvatarImage
                                src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
                              />
                            </Avatar>
                            <H3 style={{ lineHeight: 30, fontSize: 14, color: "gray"}}>
                              {subject.Subjects[subject.Subjects.length - 1]["Prowadzący"]}
                            </H3>
                          </XStack>
                        </YStack>
                        <YStack flex={1} justifyContent='center' alignItems='center'>
                          <H3 style={{ lineHeight: 70, fontSize: 64, fontStyle: "semibold"}}>
                            {!Number.isNaN(parseFloat(subject.Subjects[subject.Subjects.length - 1]["Termin I"].replace(",", "."))) ? parseFloat(subject.Subjects[subject.Subjects.length - 1]["Termin I"].replace(",", ".")) : "0"}
                          </H3>
                        </YStack>
                      </XStack>
                    </View>
                  ))}
                  </View>
                </Collapsible>
                
              )}
              
              {dataLoadingState == true ? 
              <ThemedView style={{flex: 1}}>
                  <Text>Data is loading</Text>
                  <Progress key={0} value={dataLoadingProgress}>
                    <Progress.Indicator animation="bouncy" />
                  </Progress>
                </ThemedView>
              : null}
              </ThemedView>
              
              
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
        
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  hidden: {
    width: 0,
    height: 0,
    opacity: 0, // Ensures invisibility
    position: 'absolute', // Removes it from the flow of the layout
  },
  grades: {
    flex: 1,
  },
  gradesContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  appBackground: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      flex: 1,
      shadowColor: gradientColors[1],
      shadowOffset: { width: 8, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 100,
      boxSizing: 'border-box',
  },
  card: {
    flex: 1,
    gap: 5,

  },
  appContent: {
    flex: 1,
    paddingBottom: 49,
  },
  header: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  grade: {
    flex: 1,
    backgroundColor: '#DAF9FF',
    borderRadius: 5,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5,
  },
  sideBar: {
    position: "absolute",
    alignSelf: "flex-end",
    width: 300,
    minHeight: "100%",
    zIndex: 3,
    top: 0,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    gap: 5,
  },
});