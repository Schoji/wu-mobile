import { useState } from "react";
import WebView from "react-native-webview";
import { getGrades } from "./scripts/grades";
import { getMyInfo } from "./scripts/personal_info";
import { getMyStudies } from "./scripts/studies_profile";
import { getMyTimetable } from "./scripts/timetables";
import { getMyLecturers} from "./scripts/lecturers";
import { Button, View } from "react-native";
import { ThemedText } from "./ThemedText";


export default function LoginScreen({ messageHandler }) {
    

    // List of URLs that are considered University URLs
    const UniversityURLs = [
        "https://wu.pm.szczecin.pl/WU/Grades.aspx", // My grades
        "https://wu.pm.szczecin.pl/WU/Wynik2.aspx", // My data
        "https://wu.pm.szczecin.pl/WU/Prowadzacy.aspx", // My lecturers
        "https://wu.pm.szczecin.pl/WU/TokStudiow.aspx", // My studies information
        // "https://plany.am.szczecin.pl/Plany/ZnajdzTok?Ukryj=True", // My timetable
    ]

    const headers = {
        "Accept-Language": "pl-PL",
    }

    const JavaScriptExecutables = [
        getGrades, getMyInfo, getMyLecturers, getMyStudies,
        //  getMyTimetable,
    ]

    const [webViewUrl, setWebViewUrl] = useState({ uri: UniversityURLs[0], headers: headers });
    const [injectedJavaScript, setInjectedJavaScript] = useState(JavaScriptExecutables[0]);


    const handleMessage = (event) => {
        const message = event.nativeEvent.data;
        var parsedMessage;
        try {
            parsedMessage = JSON.parse(message);
        } catch (error) {   
            console.log("Error parsing message: " + error);
            return null;
        }
        console.log(performance.now())
        // console.log(message);
        var messageType = Object.keys(parsedMessage)[0]
        console.log(messageType);
        switch (messageType) {
            case "MyGrades": {
                console.log("Grades received!")
                setWebViewUrl({ uri: UniversityURLs[1], headers: headers });
                setInjectedJavaScript(JavaScriptExecutables[1])
                break;
            }
            case "MyInfo": {
                console.log("Personal info received!")
                setWebViewUrl({ uri: UniversityURLs[2], headers: headers });
                setInjectedJavaScript(JavaScriptExecutables[2])
                break;
            }
            case "MyLecturers": {
                setWebViewUrl({ uri: UniversityURLs[3], headers: headers });
                setInjectedJavaScript(JavaScriptExecutables[3])
                // messageHandler(parsedMessage)
                break;
            }
            case "MyStudies": {
                console.log("Studies info received!")
                // setWebViewUrl({ uri: UniversityURLs[4], headers: headers });
                // setInjectedJavaScript(JavaScriptExecutables[4])
                break;
            }
            case "MyTimetable": {
                console.log("Timetable received!")
                setInjectedJavaScript("")
                messageHandler(parsedMessage)
                break;
            }
            case "Info" : {
                console.log("Info from:", webViewUrl.uri, parsedMessage[messageType]);
                break;
            }
            case "error:": {
                console.log("Error from:", webViewUrl.uri, parsedMessage[messageType]);
                break;
            }
            default: {
                console.log("Unknown message type: " + messageType + ":" + message);
            }
        }
        
    }

    // This function checks which URL the WebView is currently on
    const checkUrl = (state) => {
        const { nativeEvent } = state;
        const url = nativeEvent.url;

        //Debug
        if (url === "https://wu.pm.szczecin.pl/WU/Pusta.aspx") {
            console.log("Pusta.aspx detected, changing URL to Grades.aspx");
            setWebViewUrl({ uri: UniversityURLs[0], headers: headers });
            setInjectedJavaScript(JavaScriptExecutables[0])
        }

        if (url.includes("https://login.microsoftonline.com")) {
            console.log("User was not logged in, waiting for user to log in");
            return;
        }
        if (url.includes("https://plany.am.szczecin.pl/Plany/ZnajdzTok?")) {
            console.log("User is already searching for his timetable");
            if (injectedJavaScript != JavaScriptExecutables[4]) {
                setInjectedJavaScript(JavaScriptExecutables[4])
            }
        }

        switch(url) {
            case "https://wu.pm.szczecin.pl/WU/Pusta.aspx": {
                console.log("User has logged in, changing URL to Grades.aspx");
                setWebViewUrl({ uri: UniversityURLs[0], headers: headers})
                setInjectedJavaScript(JavaScriptExecutables[0])
                break;
            }
                
            case "https://plany.am.szczecin.pl/Plany/ZnajdzTok?Ukryj=True": {
                if (injectedJavaScript != JavaScriptExecutables[4]) {
                    setInjectedJavaScript(JavaScriptExecutables[4])
                    break;
                }
            }
        }
    }

    const Logout = () => {
        setWebViewUrl({ uri: "https://wu.pm.szczecin.pl/WU/Wyloguj.aspx", headers: headers });
        setInjectedJavaScript("")
    }

    return (
        <View style={{ flex: 1 }}>
            <WebView
                source={webViewUrl}
                javaScriptEnabled={true}
                onLoadEnd={(state) => checkUrl(state)}
                injectedJavaScript={injectedJavaScript}
                onMessage={handleMessage}
            />
            <View style={{height: 200}}>
                <Button title="Logout" onPress={Logout}/>
                <ThemedText>{injectedJavaScript}</ThemedText>
            </View>
        </View>
    )
}