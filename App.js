import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import BreathingScreen from './screens/BreathingScreen';
import DiaryScreen from './screens/DiaryScreen';
import MindfulnessScreen from './screens/MindfulnessScreen';
import MusicScreen from './screens/MusicScreen';
import PanicScreen from './screens/PanicScreen';
import SettingsScreen from './screens/SettingsScreen';
import StressControlScreen from './screens/StressControlScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  'Início': '🏠',
  'Respirar': '🌬️',
  'Foco': '🧘',
  'Diário': '📝',
  'Músicas': '🎵',
  'Pânico': '🚨',
  'Estresse': '🧠',
  'Ajustes': '⚙️',
};

function TabIcon({ label, focused }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20 }}>{TAB_ICONS[label] || '•'}</Text>
    </View>
  );
}

function AppTabs() {
  const insets = useSafeAreaInsets();

  const getLabel = (routeName) => {
    const map = {
      'Home': 'Início',
      'Breathing': 'Respirar',
      'Mindfulness': 'Foco',
      'Diary': 'Diário',
      'Music': 'Músicas',
      'Panic': 'Pânico',
      'StressControl': 'Estresse',
      'Settings': 'Ajustes',
    };
    return map[routeName] || routeName;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon label={getLabel(route.name)} focused={focused} />,
        tabBarActiveTintColor: route.name === 'Panic' ? '#8B0000' : '#9b72cf',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: -2 },
        tabBarStyle: {
          backgroundColor: '#0d1128',
          borderTopColor: 'rgba(155,114,207,0.2)',
          borderTopWidth: 1,
          height: 55 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="Breathing" component={BreathingScreen} options={{ tabBarLabel: 'Respirar' }} />
      <Tab.Screen name="Mindfulness" component={MindfulnessScreen} options={{ tabBarLabel: 'Foco' }} />
      <Tab.Screen name="Panic" component={PanicScreen} options={{ tabBarLabel: 'Pânico' }} />
      <Tab.Screen name="StressControl" component={StressControlScreen} options={{ tabBarLabel: 'Estresse' }} />
      <Tab.Screen name="Music" component={MusicScreen} options={{ tabBarLabel: 'Músicas' }} />
      <Tab.Screen name="Diary" component={DiaryScreen} options={{ tabBarLabel: 'Diário' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Ajustes' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppTabs />
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}