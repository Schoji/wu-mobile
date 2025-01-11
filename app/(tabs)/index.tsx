import { Collapsible } from '@/components/Collapsible';
import { ThemedView } from '@/components/ThemedView';
import { gradientColors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Platform, View, Text, Button} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { Avatar, AvatarImage, Card, H1, H3, XStack, ScrollView, YStack, Progress, ProgressIndicator } from 'tamagui';

export default function HomeScreen() {

  const injectedJavaScript = `
  console.log("-------------------------------------------------------------------------");

function showForms() {
    var showAllForms = document.getElementsByClassName("mb-2")[0].getElementsByTagName("input")[0];
    if (showAllForms.checked == false) {
        showAllForms.checked = true;
        var link = showAllForms.getAttribute("onclick");
        eval(link);
    }
}

function getGrades() {
    grades = []
    var showAllForms = document.getElementsByClassName("mb-2")[0].getElementsByTagName("input")[0];
    var terms = document.getElementsByClassName("mb-4");
    for (term of terms) {
        var semesterHeader = term.getElementsByTagName("div")[0].getElementsByTagName("div")[0];
        var semester = semesterHeader.getElementsByTagName("span")[0].textContent;
        var structure = semesterHeader.getElementsByTagName("span")[1].textContent;

        var subjects = term.getElementsByTagName("div")[0]
            .getElementsByTagName("div")[1]
            .getElementsByTagName("div")[0]
            .getElementsByTagName("table")[0]
            .getElementsByTagName("tbody")[0]
            .querySelectorAll(":scope > tr");

        let subjectList = [];
        for (let subject of subjects) {
            if (
                (subject.classList.contains("rgRow") || subject.classList.contains("rgAltRow")) &&
                subject.classList.length == 1
            ) {
                var subjectName = subject.getElementsByTagName("td")[0].textContent;
            } else {
                var gradeTable = subject.querySelectorAll("table")[0];
                var gradeHead = subject.querySelectorAll("thead")[0].querySelectorAll("tr")[0].querySelectorAll("th");
                var gradeBody1 = subject.querySelectorAll("tbody")[0].querySelectorAll("tr");
                let subjectTypeGrades = [];
                for (var i = 0; i < gradeBody1.length; i++) {
                    var gradeBody = subject.querySelectorAll("tbody")[0].querySelectorAll("tr")[i].querySelectorAll("td");
                    var tempSubject = {};
                    var subjectType = gradeBody1[i].firstChild.textContent;
                    for (var j = 0; j < gradeHead.length; j++) {
                        var colName;
                        if (gradeHead[j].childElementCount == 0) {
                            colName = gradeHead[j].textContent;
                        } else {
                            colName = gradeHead[j].querySelectorAll("span")[0].textContent;
                        }
                        tempSubject[colName.trim()] = gradeBody[j].textContent.trim();
                    }
                    subjectTypeGrades.push(tempSubject);
                }
                subjectList.push({
                    SubjectName: subjectName,
                    Subjects: subjectTypeGrades,
                });
            }
        }
        grades.push({
            Semester: semester,
            Structure: structure,
            Grades: subjectList,
        });
    }
    return grades
}
// attemptToFetchGrades()

function checkCollapse(callback) {
    const maxWaitTime = 15000; // Total max wait time
    const maxDelay = 10000; // Maximum delay between checks (10 seconds)
    const minDelay = 500; // Initial delay (500ms)
    const delayIncrement = 1.5; // Factor to increase the delay each time
    let elapsedTime = 0;
    let currentDelay = minDelay;

    function checkTerms() {
        const terms = Array.from(document.getElementsByClassName("mb-4"));
        let allExpanded = true;

        terms.forEach((term) => {
            const termHeader = term.getElementsByTagName("div")[0].getElementsByTagName("div")[0];
            if (termHeader && termHeader.classList.contains("header-collapsed")) {
                termHeader.querySelector("a").click();
                allExpanded = false; // At least one term is still collapsed
            }
        });

        if (allExpanded) {
            console.log("All terms are visible");
            if (typeof callback === "function") callback(); // Trigger the callback only if all terms are expanded
        } else if (elapsedTime >= maxWaitTime) {
            console.log("Max wait time reached. Some terms are still collapsed.");
        } else {
            elapsedTime += currentDelay;
            currentDelay = Math.min(currentDelay * delayIncrement, maxDelay); // Increment delay up to maxDelay
            setTimeout(checkTerms, currentDelay); // Re-check after the updated delay
        }
    }

    checkTerms(); // Start the checking loop
}
showForms()
checkCollapse(() => {
    window.ReactNativeWebView.postMessage(JSON.stringify(getGrades()));
})
  `;

const webViewRef = useRef<WebView>(null);
const [webViewSource, setWebViewSource] = useState({ uri: 'https://wu.pm.szczecin.pl/' });
const [grades, setGrades] = useState([]);
const [isHidden, setIsHidden] = useState(false);
const [dataLoadingState, setDataLoadingState] = useState(false)
const [dataLoadingProgress, setDataLoadingProgress] = useState(0)

const handleMessage = (event: { nativeEvent: { data: any; }; }) => {
    const message = event.nativeEvent.data;
    
    if (message.startsWith('[')) {
      console.log("Got grades.")
      setDataLoadingProgress(100)
      // console.log('Message from WebView:', message);
      slowHideProgressBar()
      setGrades(JSON.parse(message));
      setIsHidden(true);
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
  
  


return (
  <View style = {styles.root}>
    <SafeAreaView style={!isHidden ? styles.webview : styles.hidden}>
      <WebView
        ref={webViewRef}
        source={webViewSource}
        javaScriptEnabled={true}
        onMessage={handleMessage}
        injectedJavaScript={injectedJavaScript}
        onLoadStart={(state) => {
          const { nativeEvent } = state
          const url = nativeEvent.url

          if (dataLoadingState == true) {
            if (progressStages.hasOwnProperty(nativeEvent.url)) {
              setDataLoadingProgress(Number(progressStages[nativeEvent.url as keyof typeof progressStages]))
            }
          }
          if (nativeEvent.url == "https://wu.pm.szczecin.pl/wu/") {
            setWebViewSource({ uri: 'https://wu.pm.szczecin.pl/WU/Grades.aspx' });
          }
          if (nativeEvent.url == "https://idp.pm.szczecin.pl/o365") {
            setIsHidden(true)
            setDataLoadingState(true)
            console.log("Loading grades...")
          }
        }

        }
        onNavigationStateChange={(navState) => {

          if (navState.url == "https://wu.pm.szczecin.pl/WU/Pusta.aspx") {
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
        <ScrollView> 
          <XStack margin={10} justifyContent='space-between' alignItems='center'>
            <H1 style={{fontSize: 32, fontWeight: 'bold'}}>
              Hi, Stella
            </H1>
            <Avatar circular size={48} style={{borderWidth: 3, borderColor: 'white'}}>
              <AvatarImage
                src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
              />
            </Avatar>
          </XStack>
          <H3 style={{marginLeft: 10, fontSize: 18, fontWeight: 'bold'}}>Your grades</H3>
          <ThemedView style={{backgroundColor: "white", borderRadius: 20, padding: 5, minHeight: "150%"}}>
            {grades.map((semester, index) => 
              <Collapsible title={semester.Semester} key={index}>
                <View style={styles.card}>
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
                        <H3 style={{ lineHeight: 70, fontSize: 64, fontStyle: "semibold"}}>{parseFloat(subject.Subjects[subject.Subjects.length - 1]["Termin I"].replace(",", "."))}</H3>
                      </YStack>
                    </XStack>
                  </View>
                ))}
                </View>
              </Collapsible>
              
            )}
            <Button
              title="Log Out and Retry"
              onPress={() => {
                setWebViewSource({ uri: 'https://wu.pm.szczecin.pl/WU/Wyloguj.aspx' });
                setGrades([]);
                setIsHidden(false);
                setDataLoadingProgress(0)
              }}
            />
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
  }
});