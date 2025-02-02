import { useState } from "react";
import WebView from "react-native-webview";
import { getGrades } from "./scripts/grades";
import { getMyInfo } from "./scripts/personal_info";
import { getMyStudies } from "./scripts/studies_profile";
import { getMyTimetable } from "./scripts/timetables";
import { Button, View } from "react-native";

export default function LoginScreen({ messageHandler }) {

    // List of URLs that are considered University URLs
    const UniversityURLs = [
        "https://wu.pm.szczecin.pl/WU/Grades.aspx", // My grades
        "https://wu.pm.szczecin.pl/WU/Wynik2.aspx", // My data
        // "https://wu.pm.szczecin.pl/WU/Prowadzacy.aspx", // My lecturers
        "https://wu.pm.szczecin.pl/WU/TokStudiow.aspx", // My studies information
        "https://plany.am.szczecin.pl/Plany/ZnajdzTok?Ukryj=True", // My timetable
    ]

    const headers = {
        "Accept-Language": "pl-PL",
    }

    const JavaScriptExecutables = [
        getGrades, getMyInfo, getMyStudies, getMyTimetable
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
        console.log(message);
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
            case "MyStudies": {
                console.log("Studies info received!")
                setWebViewUrl({ uri: UniversityURLs[3], headers: headers });
                setInjectedJavaScript(JavaScriptExecutables[3])
                break;
            }
            case "MyTimetable": {
                console.log("Timetable received!")
                setInjectedJavaScript("")
                messageHandler(parsedMessage)
                break;
            }
            case "Error:": {
                console.log("Error from:", webViewUrl,  parsedMessage[messageType]);
                break;
            }
            default: {
                console.log("Unknown message type: " + messageType)
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

        console.log(url)

        if (url.includes("https://login.microsoftonline.com")) {
            console.log("User was not logged in, waiting for user to log in");
            return;
        }
        if (url.includes("https://plany.am.szczecin.pl/Plany/ZnajdzTok?")) {
            console.log("User is already searching for his timetable");
            if (injectedJavaScript != JavaScriptExecutables[3]) {
                setInjectedJavaScript(JavaScriptExecutables[3])
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
                if (injectedJavaScript != JavaScriptExecutables[3]) {
                    setInjectedJavaScript(JavaScriptExecutables[3])
                    break;
                }
            }
        }
        console.log("Reload")
    }


    return (
        <View style={{ flex: 1 }}>
            <WebView
                source={webViewUrl}
                javaScriptEnabled={true}
                onLoadStart={(state) => checkUrl(state)}
                injectedJavaScript={injectedJavaScript}
                onMessage={handleMessage}
            />
            <View style={{height: 100}}>
                <Button title="Logout" onPress={() => {
                    setWebViewUrl({ uri: "https://wu.pm.szczecin.pl/WU/Wyloguj.aspx", headers: headers });
                    setInjectedJavaScript(JavaScriptExecutables[0])
                    setWebViewUrl({ uri: UniversityURLs[0], headers: headers });
                }}/>
            </View>
        </View>
    )
}