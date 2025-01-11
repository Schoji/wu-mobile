import { StyleSheet, Image, Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Avatar, AvatarImage, Card, H1, H2, H3, XStack, YStack } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gradientColors } from '@/constants/Colors';
export default function TabTwoScreen() {
  return (
    <ThemedView style={styles.appBackground}>
      <LinearGradient
        colors={gradientColors}
        style={styles.appBackground}
      />
      <SafeAreaView style={styles.appContent}>
        <XStack margin={10} justifyContent='space-between' alignItems='center'>
          <H1 style={{fontSize: 32, fontWeight: 'bold'}}>
            Hi, Stella
          </H1>
          <Avatar circular size={48} style={{borderWidth: 3, borderColor: 'white'}}>
            <AvatarImage 
              src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
            />
          </Avatar>
        </XStack>
        <H3 style={{marginLeft: 10, fontSize: 18, fontWeight: 'bold'}}>Your grades</H3>
        <ThemedView style={styles.appSection}>
          <Card>
            
          </Card>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  appBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    flex: 1,
    shadowColor: gradientColors[1],
    shadowOffset: { width: 8, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 100,
    boxSizing: 'border-box',
  },
  appContent: {
    flex: 1,
  },
  header: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  appSection: {
    borderRadius: 20,
    flex: 1,
  }
});
