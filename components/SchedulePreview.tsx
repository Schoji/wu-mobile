import { Block, Text } from "galio-framework";
import PreviewHeader from "./PreviewHeader";
import timetable from "./dummydata/timetable.json"
import { Colors, scheduleColors } from "@/constants/Colors";

const formatDate = (inputDate: string | number | Date) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

export default function SchedulePreview() {
    // const today = new Date()
    const todayUnformatted = new Date("2025-01-07T10:00")
    const today = formatDate(todayUnformatted)
    const todaySchedule = timetable.filter(element => {return element.data == today})[0]
    const group = "L01/INF/2023/2024"
    const filteredSchedule = todaySchedule.przedmioty.filter(element => {return element.Grupy.includes(group)})
    // console.log(filteredSchedule)

    let max_value = 0, min_value = 24
    filteredSchedule.map(element => {
        const value = Number(element.Czas_od.split(":")[0])
        min_value = Math.min(min_value, value)
    })
    filteredSchedule.map(element => {
        const value = Number(element.Czas_do.split(":")[0])
        max_value = Math.max(max_value, value)
    })
    const scheduleLength = filteredSchedule.length
    const currentTimeHours = todayUnformatted.getHours();
    const currentTimeMinutes = todayUnformatted.getMinutes();
    const position = ((currentTimeHours - min_value) + (currentTimeMinutes / 60)) * (scheduleLength * 85 / (max_value - min_value));
   
    return (
        <Block style={[styles.container]}>
            <PreviewHeader headerName="Your Schedule"/>
            <Block style={styles.content}>
            <Block style={[styles.current, {top: position + 25}]}/>
                <Block row>
                    <Block space="evenly" style={{paddingLeft: 20, paddingRight: 10, height: scheduleLength * 85}}>
                        {[...Array(max_value - min_value + 1)].map((hour, index )=> 
                            <Block>
                                <Text p size={12} color={Colors.dark.grayedText} style={{fontWeight: 500}}>{index + 8 < 13 ? index + 8 + "AM" : index - 4 + "PM"} </Text>
                                <Block style={styles.spacer}/>
                            </Block>
                        )}
                    </Block>
                    <Block>
                
                        {filteredSchedule.map((element, index) => 
                            
                                <Block gap={5} style={[styles.subject, index == scheduleLength - 1 ? {borderRadius: 20} : null, {backgroundColor: scheduleColors[index % scheduleColors.length]}]} key={index}>
                                    <Text h5 style={{fontWeight: 500}}>{element.Zajęcia}</Text>
                                    <Block row space="between">
                                        <Text p size={14} color={Colors.dark.grayedText2}>{element.Czas_od}-{element.Czas_do}</Text>
                                        <Text p size={14} color={Colors.dark.grayedText2}>{element.Sala}</Text>
                                    </Block>       
                                </Block>
                            
                        )}
                    </Block>
                </Block>
            </Block>
        </Block>
    )
}
const styles = {
    container: {
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'column',
        gap: 5,
    },
    spacer: {
        marginLeft: 0,
        borderBottomColor: '#4d4d4d',
        borderBottomWidth: .5,
        width: '100%',
    },
    current: {
        position: "absolute",
        marginLeft: 0,
        borderBottomColor: '#FF0000',
        borderBottomWidth: .5,
        width: '100%',
        zIndex: 20,
    },
    content: {

    },
    subject: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        marginBottom: -15,
        width: 315,
    }
}