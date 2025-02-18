import { Block, Icon, Text } from "galio-framework";
import PreviewHeader from "./PreviewHeader";
import scholarships from "./dummydata/scholarships.json"
import { Colors } from "@/constants/Colors";

function capitalize(SomeString: string) {
    return SomeString ? String(SomeString.at(0).toUpperCase() + SomeString.slice(1)) : ''
}

export default function ScholarshipsPreview() {
    const scholarship = scholarships["My scholarships"].at(-1)
    return (
        <Block style={styles.container}>
            <PreviewHeader headerName="Scholarships"/>
            <Block style={styles.content}>
                <Text h5 size={20} color={Colors.dark.text}>{capitalize(scholarship?.Nazwa)}</Text>
                <Text p size={16} color={Colors.dark.grayedText}>{scholarship?.["Data złożenia"]}</Text>
                <Text p size={16} color={Colors.dark.grayedText}>{scholarship?.Rok}</Text>
                <Block right>
                    <Text h3 color={Colors.dark.redText} style={{fontWeight: 500}}>{scholarship?.["Status decyzji"].toUpperCase()}</Text>
                    <Text p size={14} color={Colors.dark.grayedText} style={{fontWeight: 500}}>{scholarship?.["Powód zmiany decyzji"]}{" "}
                        <Icon name="external-link" family="feather" size={20} color={Colors.dark.grayedText}/>
                    </Text>
                </Block>
                <Block style={styles.spacer}></Block>
                {scholarship?.["Status decyzji"] == "pozytywna" ?
                <Text p size={16} color={Colors.dark.text}>Good job! Enjoy your scholarship 😊</Text>
                :
                <Text p size={16} color={Colors.dark.text}>Don't worry, you will get there next time ✌🏻</Text>
                }
            </Block>
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
        padding: 20,
        borderRadius: 20,
        backgroundColor: Colors.dark.container,
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