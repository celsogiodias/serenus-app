import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function BreathingScreen({ navigation }) {
  const [phase, setPhase] = useState('pronto');
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycles, setCycles] = useState(0);

  const startBreathing = () => {
    setPhase('inspirar');
    setTimeLeft(4);
    setCycles(0);
  };

  useEffect(() => {
    if (phase === 'pronto') return;
    if (timeLeft <= 0) {
      if (phase === 'inspirar') { setPhase('segurar'); setTimeLeft(7); }
      else if (phase === 'segurar') { setPhase('expirar'); setTimeLeft(8); }
      else if (phase === 'expirar') {
        const newCycles = cycles + 1;
        if (newCycles >= 4) { setPhase('pronto'); return; }
        setCycles(newCycles);
        setPhase('inspirar');
        setTimeLeft(4);
      }
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, timeLeft, cycles]);

  return (
    <LinearGradient colors={['#0a0e27', '#1a1040']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Respiração 4-7-8</Text>
        <View style={styles.circle}>
          {phase === 'pronto' ? (
            <Text style={styles.phaseText}>Pronto?</Text>
          ) : (
            <>
              <Text style={styles.phaseText}>
                {phase === 'inspirar' ? 'Inspire' : phase === 'segurar' ? 'Segure' : 'Expire'}
              </Text>
              <Text style={styles.timer}>{timeLeft}</Text>
              <Text style={styles.cycleText}>Ciclo {cycles + 1}/4</Text>
            </>
          )}
        </View>
        {phase === 'pronto' && (
          <TouchableOpacity style={styles.button} onPress={startBreathing}>
            <Text style={styles.buttonText}>Começar</Text>
          </TouchableOpacity>
        )}
        {phase === 'pronto' && cycles > 0 && (
          <Text style={styles.doneText}>Exercício concluído! Respire normalmente.</Text>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 20 },
  back: { marginTop: 10, width: 40 },
  title: { color: 'white', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
  circle: {
    width: 220, height: 220, borderRadius: 110,
    borderWidth: 3, borderColor: '#9b59b6',
    alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
    marginTop: 60,
  },
  phaseText: { color: 'white', fontSize: 28, fontWeight: '600' },
  timer: { color: '#9b59b6', fontSize: 48, fontWeight: 'bold', marginTop: 5 },
  cycleText: { color: '#888', fontSize: 14, marginTop: 5 },
  button: { backgroundColor: '#9b59b6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 60, marginHorizontal: 40 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  doneText: { color: '#9b59b6', fontSize: 16, textAlign: 'center', marginTop: 20 },
});
