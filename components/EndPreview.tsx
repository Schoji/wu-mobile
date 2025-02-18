import { Colors } from "@/constants/Colors";
import { Block, Text } from "galio-framework";

export default function EndPreview() {
    return (
        <Block center>
            <Text p size={14} color={Colors.dark.text}>Have a marvelous day! 😊</Text>
        </Block>
    )
}