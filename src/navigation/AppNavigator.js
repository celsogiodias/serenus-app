import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

function PlaceholderScreen({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.title,
  },
});

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.primary,
            borderTopWidth: 1,
            height: 72,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: theme.colors.accent,
          tabBarInactiveTintColor: theme.colors.textSecondary,
        }}
      >
        <Tab.Screen name="Início" options={{ tabBarLabel: 'Início' }}>
          {() => <PlaceholderScreen title="Noite Serena" />}
        </Tab.Screen>
        <Tab.Screen name="Exercícios" options={{ tabBarLabel: 'Exercícios' }}>
          {() => <PlaceholderScreen title="Biblioteca de Exercícios" />}
        </Tab.Screen>
        <Tab.Screen name="Diário" options={{ tabBarLabel: 'Diário' }}>
          {() => <PlaceholderScreen title="Diário do Sono" />}
        </Tab.Screen>
        <Tab.Screen name="Ajustes" options={{ tabBarLabel: 'Ajustes' }}>
          {() => <PlaceholderScreen title="Configurações" />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
