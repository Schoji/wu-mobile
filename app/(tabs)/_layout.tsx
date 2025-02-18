import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import TapBar from '@/components/TapBar';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
      <Tabs
        tabBar={props=> <TapBar {...props}/>}
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              // position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="grades"
          options={{
            title: 'Grades',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="graduationcap" color={color} />,
          }}
        />
        <Tabs.Screen
          name="gpa"
          options={{
            title: 'GPA',
            tabBarIcon: ({ color }) => <Entypo size={28} name="bar-graph" color={color} />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="schedule"
          options={{
            title: 'Schedule',
            tabBarIcon: ({ color }) => <AntDesign size={28} name="calendar" color={color} />,
          }}
        />
        <Tabs.Screen
          name="scholarships"
          options={{
            title: 'Scholars',
            tabBarIcon: ({ color }) => <FontAwesome6 size={28} name="money-bill-wave" color={color} />,
          }}
        />
        {/* <Tabs.Screen
          name="explore"
          options={{
            title: 'Test api',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="test-tube" color={color} />,
          }}
        /> */}
      </Tabs>
  );
}
