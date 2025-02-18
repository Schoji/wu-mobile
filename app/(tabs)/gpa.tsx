
import { StyleSheet, Platform, View, Text, Switch, useColorScheme, ScrollView} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Greeter } from '@/components/Greeter';
import { GradesPreview } from '@/components/GradesPreview';
import GpaPreview from '@/components/GpaPreview';
import { Colors } from '@/constants/Colors';
import SchedulePreview from '@/components/SchedulePreview';
import ScholarshipsPreview from '@/components/ScholarshipsPreview';
import LecturersPreview from '@/components/LecturersPreview';
import EndPreview from '@/components/EndPreview';

export default function GPA() {

  // const { theme, toggleTheme } = useTheme();

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={{paddingBottom: 80}} bounces={false}>
        <Greeter/>
        <LecturersPreview/>
        <EndPreview/>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.dark.background,
  }})