import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [ambientSoundEnabled, setAmbientSoundEnabled] = useState(false);

  const handleRateApp = () => {
    Alert.alert('Avaliação', 'Obrigado!');
  };

  const handleClearDiary = () => {
    Alert.alert(
      'Limpar diário',
      'Deseja mesmo apagar todos os registros do diário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Diário limpo!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível limpar o diário.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0e27', '#1a1040']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>⚙️ Ajustes</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Preferências</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Nome</Text>
              <Text style={styles.value}>Celso</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Notificações</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ true: '#7c4dff', false: '#555' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Som Ambiente</Text>
              <Switch
                value={ambientSoundEnabled}
                onValueChange={setAmbientSoundEnabled}
                trackColor={{ true: '#7c4dff', false: '#555' }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sobre</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Versão</Text>
              <Text style={styles.value}>1.0.0</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>App</Text>
              <Text style={styles.value}>Noite Serena</Text>
            </View>

            <TouchableOpacity
              style={styles.row}
              onPress={handleRateApp}
              activeOpacity={0.7}
            >
              <Text style={styles.action}>Avaliar app</Text>
              <Text style={styles.value}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Dados</Text>

            <TouchableOpacity
              style={styles.row}
              onPress={handleClearDiary}
              activeOpacity={0.7}
            >
              <Text style={styles.action}>Limpar diário</Text>
              <Text style={styles.value}>›</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    color: '#fff',
    fontSize: 16,
  },
  value: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
  },
  action: {
    color: '#fff',
    fontSize: 16,
  },
});