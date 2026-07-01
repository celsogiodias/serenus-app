import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function DiaryScreen({ navigation }) {
  const [texto, setTexto] = useState('');
  const [humor, setHumor] = useState('');

  const salvar = () => {
    if (!texto.trim()) {
      Alert.alert('Atenção', 'Escreva algo sobre sua noite.');
      return;
    }
    Alert.alert('Salvo', 'Registro do sono salvo com sucesso!');
    setTexto('');
    setHumor('');
  };

  const humores = ['😴', '😊', '😐', '😢', '😰'];

  return (
    <LinearGradient colors={['#0a0e27', '#1a1040']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Diário do Sono</Text>
        <Text style={styles.subtitle}>Como foi sua noite?</Text>

        <Text style={styles.label}>Como você está se sentindo?</Text>
        <View style={styles.humoresRow}>
          {humores.map((h) => (
            <TouchableOpacity
              key={h}
              style={[styles.humorBtn, humor === h && styles.humorAtivo]}
              onPress={() => setHumor(h)}
            >
              <Text style={styles.humorText}>{h}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Relato da noite</Text>
        <TextInput
          style={styles.input}
          placeholder="Descreva como foi seu sono..."
          placeholderTextColor="#666"
          value={texto}
          onChangeText={setTexto}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={salvar}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 20 },
  back: { marginTop: 10, width: 40 },
  title: { color: 'white', fontSize: 28, fontWeight: 'bold', marginTop: 10 },
  subtitle: { color: '#aaa', fontSize: 16, marginBottom: 30 },
  label: { color: 'white', fontSize: 16, marginBottom: 10, marginTop: 10 },
  humoresRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  humorBtn: { padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)' },
  humorAtivo: { backgroundColor: '#9b59b6' },
  humorText: { fontSize: 28 },
  input: {
    backgroundColor: '#2a1a3e', borderRadius: 12, padding: 16,
    color: 'white', fontSize: 16, height: 150, textAlignVertical: 'top',
    marginBottom: 20,
  },
  button: { backgroundColor: '#9b59b6', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 17, fontWeight: '600' },
});
