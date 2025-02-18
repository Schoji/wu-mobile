// import { StyleSheet, Image, Platform, View } from 'react-native';
// import { ThemedText } from '@/components/ThemedText';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { gradientColors } from '@/constants/Colors';
// import LoginScreen from '@/components/LoginScreen';
// import { useState } from 'react';
// export default function TabTwoScreen() {
//   const [message, setMessage] = useState({});
//   return (
//     <SafeAreaView style={styles.appBackground}>
//       <LoginScreen messageHandler={setMessage}/>
//       <ThemedText style={{ height: 300}}>
//         {JSON.stringify(message)}
//       </ThemedText>
//     </SafeAreaView>
//   );
// }


// const styles = StyleSheet.create({
//   appBackground: {
//     width: '100%',
//     height: '100%',
//     position: 'absolute',
//     flex: 1,
//     shadowColor: gradientColors[1],
//     shadowOffset: { width: 8, height: 0 },
//     shadowOpacity: 1,
//     shadowRadius: 100,
//     boxSizing: 'border-box',
//   },
//   appContent: {
//     flex: 1,
//   },
//   header: {
//     flex: 1,
//     backgroundColor: 'transparent',
//   },
//   appSection: {
//     borderRadius: 20,
//     flex: 1,
//   }
// });
