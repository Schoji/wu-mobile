import { Colors, accentColor } from "@/constants/Colors";
import { BlurView } from "expo-blur";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { Block, Text } from "galio-framework";
import { StyleSheet, TouchableOpacity } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function TapBar({state, descriptors, navigation}) {

    const icons = {
        index: (props) => <AntDesign name="home" size={32} color={Colors.dark.grayedText} {...props} />,
        gpa: (props) => <Entypo name="bar-graph" size={26} color={Colors.dark.grayedText} {...props} />,
        grades: (props) => <IconSymbol name="graduationcap" size={26} color={Colors.dark.grayedText} {...props} />,
        schedule: (props) => <AntDesign name="calendar" size={26} color={Colors.dark.grayedText} {...props} />,
        scholarships: (props) => <FontAwesome6 name="money-bill-wave" size={26} color={Colors.dark.grayedText} {...props} />,
    }

    return (
        <BlurView intensity={75} tint="dark" style={styles.tabBarContainer}> 
            <Block row style={styles.tabBar}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;

                    const isFocused = state.index === index;
                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };
                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };
                    return (
                        <TouchableOpacity
                            key={route.key}
                            style={route.name === "index" ? styles.homeItem : styles.tabBarItem}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                        >
                            {route.name === "index" ?
                            icons[route.name]({color: Colors.light.text})
                            :
                            icons[route.name]({color: isFocused ? accentColor : Colors.dark.grayedText})
                            }
                            
                            {route.name !== "index" ?
                            <Text p size={11} color={isFocused ? accentColor : Colors.dark.grayedText}>{label}</Text>
                            : null }
                        </TouchableOpacity>
                    )
                })}
            </Block>
        </BlurView>
    )
}
const styles = StyleSheet.create({
    tabBarContainer: {
        position: "absolute",
        width: "100%",
        bottom: 0,
        height: 100,
        borderRadius: 10,
        overflow: "hidden", // Important for BlurView
    },
    tabBar: {
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: Colors.dark.container,
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 25,
        borderCurve: 'continuous',
        shadowColor: "black",
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 10,
        shadowOpacity: 0.1,
    },
    tabBarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    homeItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: accentColor,
        borderRadius: 50,
    }
})