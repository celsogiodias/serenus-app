import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';

import HomeScreen from './screens/HomeScreen';
import BreathingScreen from './screens/BreathingScreen';
import DiaryScreen from './screens/DiaryScreen';
import MindfulnessScreen from './screens/MindfulnessScreen';
import MusicScreen from './screens/MusicScreen';
import PanicScreen from './screens/PanicScreen';
import SettingsScreen from './screens/SettingsScreen';
import StressControlScreen from './screens/StressControlScreen';
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import EmergencyScreen from './screens/EmergencyScreen';

const Tab = createBottomTabNavigator();
const SettingsStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

function getIcon(routeName) {
  const map = { Home: '🏠', Breathing: '🌬️', Mindfulness: '🧘', Diary: '📝', Music: '🎵', Panic: '🚨', StressControl: '🧠', Settings: '⚙️' };
  return map[routeName] || '';
}

function getLabel(routeName) {
  const map = { Home: 'Início', Breathing: 'Respirar', Mindfulness: 'Foco', Diary: 'Diário', Music: 'Músicas', Panic: 'Pânico', StressControl: 'Estresse', Settings: 'Ajustes' };
  return map[routeName] || '';
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
            <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
      <SettingsStack.Screen name="Emergency" component={EmergencyScreen} />
      <SettingsStack.Screen name="Perfil" component={PerfilScreen} />
    </SettingsStack.Navigator>
  );
}

function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Cadastro" component={CadastroScreen} />
    </AuthStack.Navigator>
  );
}

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: () => <Text style={{ fontSize: 22 }}>{getIcon(route.name)}</Text>,
        tabBarLabel: getLabel(route.name),
        tabBarStyle: { backgroundColor: '#1a0a2e', borderTopColor: 'rgba(155,114,207,0.2)', borderTopWidth: 1 },
        tabBarActiveTintColor: '#9b72cf',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Breathing" component={BreathingScreen} />
      <Tab.Screen name="Mindfulness" component={MindfulnessScreen} />
      <Tab.Screen name="Diary" component={DiaryScreen} />
      <Tab.Screen name="Music" component={MusicScreen} />
      <Tab.Screen name="Panic" component={PanicScreen} />
      <Tab.Screen name="StressControl" component={StressControlScreen} />
      <Tab.Screen name="Settings" component={SettingsStackScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a0a2e' }}>
        <ActivityIndicator size="large" color="#9b72cf" />
      </View>
    );
  }
  return user ? <BottomTabs /> : <AuthStackScreen />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}