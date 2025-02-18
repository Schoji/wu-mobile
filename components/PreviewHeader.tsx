import { Colors } from "@/constants/Colors";
import { Block, Text } from "galio-framework";

type PreviewHeaderProps = {
    headerName: string;
}
export default function PreviewHeader(props: PreviewHeaderProps) {
    return (
        <Block row space="between" style={{marginLeft: 10, marginRight: 10}}>
            <Text h5 bold style={{color: Colors.dark.text}}> {props.headerName} </Text>
            <Text h5 bold style={{color: Colors.dark.grayedText}}> See all </Text>
        </Block>
    )
}