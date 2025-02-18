import { Block, Icon, Text } from "galio-framework";
import PreviewHeader from "./PreviewHeader";
import { Colors } from "@/constants/Colors";
import lecturers from "./dummydata/lecturers.json";

export default function LecturersPreview() {
    const formattedLecturers = lecturers["MyLecturers"].toReversed().at(-1)
    const formattedLecturersKey = Object.keys(formattedLecturers)[0]
    const data = formattedLecturers[formattedLecturersKey].slice(0, 3)
    return (
        <Block style={styles.container}>
            <PreviewHeader headerName="Lecturers"/>
            {data.map((row, key) => 
                <Block gap={10} style={styles.content}>
                    <Text p bold color={Colors.dark.text}>{row.Przedmiot}</Text>
                    {row["Forma zajęć"].sort((a, b) => {
                        const order = ["Audytorium", "Ćwiczenia", "Laboratorium", "Końcowa"]
                        return order.indexOf(a["Forma zajęć"]) - order.indexOf(b["Forma zajęć"])
                    })
                    .map((subject, index) =>
                        <Block space="around" row>
                            <Text p size={14} flex={1} color={Colors.dark.grayedText}>
                                {subject["Forma zajęć"]} {" "}
                                {subject["Forma zajęć"] == "Audytorium" ?
                                <Icon name="university" family="font-awesome-5" size={12} color={Colors.dark.grayedText}/>
                                : subject["Forma zajęć"] == "Laboratorium" ?
                                <Icon name="university" family="font-awesome-5" size={12} color={Colors.dark.grayedText}/>
                                : subject["Forma zajęć"] == "Ćwiczenia" ?
                                <Icon name="university" family="font-awesome-5" size={12} color={Colors.dark.grayedText}/>
                                :
                                <Icon name="construction" family="MaterialIcons" size={12} color={Colors.dark.grayedText}/>
                                }
                            </Text>
                            <Text p size={14} color={Colors.dark.text}>{subject.Prowadzący}</Text>         
                        </Block>
                    )}
                    
                </Block>
            )}
        </Block>
    )
}
const styles = {
    container: {
        margin: 10,
        flexDirection: 'column',
        gap: 5,
    },
    content: {
        padding: 15,
        borderRadius: 20,
        backgroundColor: Colors.dark.container,
        gap: 10,
    },
    spacer: {
        marginLeft: 0,
        borderBottomColor: '#4d4d4d',
        borderBottomWidth: .5,
        width: '100%',
        marginBottom: 5,
        marginTop: 5,
    },

}