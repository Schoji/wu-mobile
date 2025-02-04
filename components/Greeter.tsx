import { useColorScheme } from "react-native"
import { Block, Button, Text } from 'galio-framework';


export const Greeter = () => {
    
    let theme = useColorScheme();
    const themeTextStyle = theme === 'dark' ? styles.darkText : styles.lightText;

    return (
        <Block style={[styles.container]}>
            <Text h3 bold style={themeTextStyle}> Hi, Tom</Text>
            <Button onlyIcon icon="bell" color="transparent" iconFamily="feather" iconSize={24} iconColor="#fff" style={{ width: 24, height: 24 }}>warning</Button>
        </Block>
    )
}

const styles = {
    container: {
        marginLeft: 30,
        marginRight: 30,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        height: 100,
    },
    darkText: {
        color: '#FEFEFE'
    },
    lightText: {
        color: '#333'
    }
}