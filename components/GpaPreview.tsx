import { Block, Icon, Text } from "galio-framework";
import { Colors } from "../constants/Colors";
import studiesprofile from "./dummydata/studiesprofile.json";
import userinfo from "./dummydata/userinfo.json";
import PreviewHeader from "./PreviewHeader";

export default function GpaPreview() {
    return (
        <Block style={[styles.container]}>
            <PreviewHeader headerName="Your GPA"/>
            <Block style={styles.gpaContainer}>
                <Block row space="between">
                    <Block>
                        <Text h5 bold style={{color: Colors.dark.text}}> {userinfo.imie} {userinfo.nazwisko} </Text>
                        <Text p style={{color: Colors.dark.grayedText}}> {userinfo["Nr albumu"]} </Text>
                    </Block>
                    <Block style={{marginTop: -20}}>
                        <Text h1 style={{fontFamily: "Poppins-SemiBold", color: Colors.dark.text}} size={64}> {studiesprofile["Średnia za semestr"]} </Text>
                        <Block row middle style={{marginTop: -20}}>
                            <Text h3 style={{fontFamily: "Poppins-SemiBold", color: Colors.dark.grayedText}}> {studiesprofile["Średnia za poprzedni semestr"]} </Text>
                            {parseFloat(studiesprofile["Średnia za semestr"]) > parseFloat(studiesprofile["Średnia za poprzedni semestr"]) ? 
                            <Icon name="arrow-up-right" family="feather" size={50} color={Colors.dark.greenText}/>
                            :
                            <Icon name="arrow-down-right" family="feather" size={50} color={Colors.dark.redText}/>
                            }
                        </Block>
                    </Block>
                </Block>
                <Block style={styles.spacer}></Block>
                {parseFloat(studiesprofile["Średnia za semestr"]) > parseFloat(studiesprofile["Średnia za poprzedni semestr"]) ? 
                <Text p size={16} color={Colors.dark.text}>Based on your previous GPA, your grades are better. Keep up with good work! 😊</Text>
                : parseFloat(studiesprofile["Średnia za semestr"]) == parseFloat(studiesprofile["Średnia za poprzedni semestr"]) ? 
                <Text p size={16} color={Colors.dark.text}>Based on your previous GPA, your grades are the same. Try to improve them next time! 😊</Text>
                :
                <Text p size={16} color={Colors.dark.text}>Based on your previous GPA, your grades are worse. Try to improve them next time! 😊</Text>
                }
            </Block>
        </Block>
    )
}
const styles = {
    container: {
        padding: 10,
        flexDirection: 'column',
        gap: 5
    },
    gpaContainer : {
        backgroundColor: Colors.dark.container,
        padding: 20,
        borderRadius: 10,
    },
    spacer: {
        marginLeft: 0,
        borderBottomColor: '#4d4d4d',
        borderBottomWidth: .5,
        width: '100%',
        marginBottom: 5,
    }
}