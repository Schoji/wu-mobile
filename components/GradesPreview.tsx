import { Block, Text } from "galio-framework";
import { useColorScheme } from "react-native";
import grades from './dummydata/grades.json';

export const GradesPreview = () => {
    let theme = useColorScheme();


    const themeTextStyle = theme === 'dark' ? styles.darkText : styles.lightText;

    const recentGrades = grades.MyGrades.slice(0, 1).map((grade) => ({
        ...grade, // Keep semester info
        Grades: grade.Grades
            .map((subject) => ({
                ...subject, // Keep subject info
                Records: subject.Records.filter((record) => record["Termin I"] !== "")
            }))
            .filter((subject) => subject.Records.length > 0) // Remove subjects with no valid records
    })).filter((grade) => grade.Grades.length > 0); // Remove semesters with no valid subjects

    return (
        <Block style={[styles.container]}>
            <Block row space="between" style={{marginLeft: 10, marginRight: 10}}>
                <Text h5 bold style={themeTextStyle}> Your grades</Text>
                <Text h5 bold style={styles.darkGreyedText}> See all </Text>
            </Block>
            <Block style={[styles.grades]}>
                {recentGrades.map((grade, index) => (
                <Block key={index}>
                    <Text h6 style={themeTextStyle}> {grade.Semester}</Text>
                    {grade.Grades.slice(0, 3).map((subject, index) => (
                        <Block key={index}>
                            <Text h6>{subject.SubjectName} </Text>
                            {subject.Records.reverse().slice(0,1).map((record, idx) => (
                                <Block key={idx}>
                                    <Text h6>{record["Termin I"]} </Text>
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
        height: 600,
        flexDirection: 'column',
    },
    darkText: {
        color: '#FEFEFE'
    },
    lightText: {
        color: '#333'
    },
    darkGreyedText: {
        color: '#8f8f8f'
    },
    grades: {
        marginLeft: 10,
        marginRight: 10,
        height: 600,
        flexDirection: 'column',
    }
}