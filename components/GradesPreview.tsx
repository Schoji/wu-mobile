import { Block, Icon, Text } from "galio-framework";
import { useColorScheme } from "react-native";
import grades from './dummydata/grades.json';
import { useFonts } from "expo-font";
import PreviewHeader from "./PreviewHeader";

export const GradesPreview = () => {
    let [fontsLoaded] = useFonts({
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
      });
    
      if (!fontsLoaded) {
        return <Text h1> Loading </Text>;
      }

    const recentGrades = grades.MyGrades.slice(0, 1).map((grade) => ({
        ...grade, // Keep semester info
        Oceny: grade.Oceny
            .map((subject) => ({
                ...subject, // Keep subject info
                Rekordy: subject.Rekordy.filter((record) => record["Termin I"] !== "")
            }))
            .filter((subject) => subject.Rekordy.length > 0) // Remove subjects with no valid records
    })).filter((grade) => grade.Oceny.length > 0); // Remove semesters with no valid subjects

    return (
        <Block style={[styles.container]}>
            <PreviewHeader headerName="Your grades"/>
            <Block style={[styles.grades]}>
                {recentGrades.map((grade, index) => (
                <Block key={index} gap={3}>
                    {/* <Text h6 style={themeTextStyle}> {grade.Semester}</Text> */}
                    {grade.Oceny.slice(0, 3).map((subject, index) => (
                        <Block key={index} style={styles.gradeContainer}>
                            {subject.Rekordy.reverse().slice(0,1).map((record, idx) => (
                                <Block key={idx} row middle style={{ padding: 20, height: 110 }}>
                                    <Block flex={12} gap={5}>
                                        <Block row gap={5} style={{alignItems: 'baseline'}}>
                                            <Text p>
                                            {subject.NazwaPrzedmiotu} 
                                            </Text>
                                            <Icon name="atom" family="font-awesome-5" size={14} color="#8f8f8f"/>
                                            
                                        </Block>
                                        <Text p size={14} style={styles.darkGreyedText}>ECTS {subject.ECTS} </Text>
                                        {/* <Text p>{record["Forma zajęć"]} </Text> */}
                                        <Text size={5}></Text>
                                        <Text p size={14} style={styles.darkGreyedText}>{record["Prowadzący"]}</Text>
                                    </Block> 
                                    {parseFloat(record["Termin I"]?.replace(",", ".")) % 1 == 0 ?
                                    <Block middle flex={4}>
                                        <Text h1 style={{fontFamily: "Poppins-SemiBold"}} size={64}>
                                            {parseFloat(record["Termin I"]?.replace(",", "."))}
                                        </Text>
                                    </Block>
                                    :
                                    <Block middle flex={6} row style={{alignItems: 'baseline'}}>
                                        <Text h1 style={{fontFamily: "Poppins-SemiBold"}} size={64}>
                                            {record["Termin I"]?.at(0)}
                                        </Text>
                                        <Text h1 style={[styles.darkGreyedText, {fontFamily: "Poppins-SemiBold", marginLeft: -5}]} size={32}>
                                            .{record["Termin I"]?.at(record["Termin I"].length - 1)}
                                        </Text>
                                    </Block>
                                    }               
                                </Block>
                            ))}
                        </Block>
                    ))}
                </Block>
                ))}
            </Block>
        </Block>
    )
};

const styles = {
    container: {
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'column',
        gap: 5,
    },
    darkText: {
        color: '#FEFEFE'
    },
    lightText: {
        color: '#030303'
    },
    darkGreyedText: {
        color: '#8f8f8f'
    },
    grades: {
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'column',
    },
    gradeContainer: {
        backgroundColor: '#DAF9FF',
        borderRadius: 20,
    },
}