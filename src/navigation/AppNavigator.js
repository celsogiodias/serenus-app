import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../theme';
import { useAuth } from '../../contexts/AuthContext';

// ─── Telas existentes ───
import HomeScreen from '../../screens/HomeScreen';
import BreathingScreen from '../../screens/BreathingScreen';
import DiaryScreen from '../../screens/DiaryScreen';
import MusicScreen from '../../screens/MusicScreen';
import PanicScreen from '../../screens/PanicScreen';
import MindfulnessScreen from '../../screens/MindfulnessScreen';
import SettingsScreen from '../../screens/SettingsScreen';

// ─── Telas de autenticação ───
import LoginScreen from '../../screens/LoginScreen';
import CadastroScreen from '../../screens/CadastroScreen';
import PerfilScreen from '../../screens/PerfilScreen';

// ─── Novas telas TDAH ───
import TdahScreen from '../../screens/tdah/TdahScreen';
import ReestruturacaoCognitiva from '../../screens/tdah/ReestruturacaoCognitiva';
import RegistroPensamentos from '../../screens/tdah/RegistroPensamentos';
import TecnicaDoAtraso from '../../screens/tdah/TecnicaDoAtraso';
import QuebraDeTarefas from '../../screens/tdah/QuebraDeTarefas';
import PlanejamentoSeEntao from '../../screens/tdah/PlanejamentoSeEntao';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ─── Ícones das abas ───
const TAB_ICONS = {
  'Início': '🌙',
  'Exercícios': '🧘',
  'Diário': '📝',
  'TDAH': '🧠',
  'Ajustes': '⚙️',
};

function TabIcon({ label, focused }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.5 }}>
        {TAB_ICONS[label] || '•'}
      </Text>
    </View>
  );
}

// ─── Stack: Exercícios ───
function ExerciciosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExerciciosHome" component={MindfulnessScreen} />
      <Stack.Screen name="Breathing" component={BreathingScreen} />
      <Stack.Screen name="Music" component={MusicScreen} />
      <Stack.Screen name="Panic" component={PanicScreen} />
    </Stack.Navigator>
  );
}

// ─── Stack: TDAH ───
function TdahStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TdahHome" component={TdahScreen} />
      <Stack.Screen name="ReestruturacaoCognitiva" component={ReestruturacaoCognitiva} />
      <Stack.Screen name="RegistroPensamentos" component={RegistroPensamentos} />
      <Stack.Screen name="TecnicaDoAtraso" component={TecnicaDoAtraso} />
      <Stack.Screen name="QuebraDeTarefas" component={QuebraDeTarefas} />
      <Stack.Screen name="PlanejamentoSeEntao" component={PlanejamentoSeEntao} />
    </Stack.Navigator>
  );
}

// ─── Abas principais (logado) ───
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        tabBarStyle: {
          backgroundColor: theme.colors.surface || '#1a0a2e',
          borderTopColor: '#9b59b6',
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: '#9b59b6',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Exercícios" component={ExerciciosStack} />
      <Tab.Screen name="Diário" component={DiaryScreen} />
      <Tab.Screen name="TDAH" component={TdahStack} />
      <Tab.Screen name="Ajustes" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

// ─── Telas de autenticação ───
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} />
    </Stack.Navigator>
  );
}

// ─── Loading ───
function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#9b59b6" />
    </View>
  );
}

// ─── Navegador raiz ───
export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      {user ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#1a0a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
