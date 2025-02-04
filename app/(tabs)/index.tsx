
import { StyleSheet, Platform, View, Text, Switch, useColorScheme, ScrollView} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/components/ThemeProvider';
import { Greeter } from '@/components/Greeter';
import { StatusBar } from 'expo-status-bar';
import { GradesPreview } from '@/components/GradesPreview';

export default function HomeScreen() {

  // const { theme, toggleTheme } = useTheme();

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <Greeter/>
        <GradesPreview/>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    height: '100%',
  }})