import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TecnicaDoAtraso({ navigation }) {
  const [tempo, setTempo] = useState(10);
  const [ativo, setAtivo] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(10);
  const intervalRef = useRef(null);

  const iniciar = (segundos) => {
    setTempo(segundos);
    setSegundosRestantes(segundos);
    setAtivo(true);

    intervalRef.current = setInterval(() => {
      setSegundosRestantes(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setAtivo(false);
          Alert.alert('â° Tempo esgotado', 'Agora pergunte-se: essa ação é necessária?');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelar = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setAtivo(false);
    setSegundosRestantes(tempo);
  };

  const opcoes = [5, 10, 15, 30, 60];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="hourglass-outline" size={64} color="#9b59b6" />
        <Text style={styles.titulo}>Técnica do Atraso</Text>
        <Text style={styles.descricao}>
          Quando sentir vontade de agir por impulso, pare e espere alguns segundos antes de decidir.
        </Text>

        {ativo ? (
          <View style={styles.timerContainer}>
            <Text style={styles.timerNumero}>{segundosRestantes}</Text>
            <Text style={styles.timerLabel}>segundos</Text>
            <TouchableOpacity style={styles.botaoCancelar} onPress={cancelar}>
              <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.pergunta}>Quanto tempo você quer esperar?</Text>
            <View style={styles.opcoes}>
              {opcoes.map(s => (
                <TouchableOpacity key={s} style={styles.opcao} onPress={() => iniciar(s)}>
                  <Text style={styles.opcaoTexto}>{s}s</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.dicaContainer}>
              <Ionicons name="bulb-outline" size={20} color="#f1c40f" />
              <Text style={styles.dicaTexto}>
                Comece com 10s. Aumente conforme praticar.
              </Text>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a2e' },
  content: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  titulo: { color: '#fff', fontSize: 24, fontWeight: '700', marginTop: 16, marginBottom: 12 },
  descricao: { color: '#aaa', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 32, paddingHorizontal: 16 },
  timerContainer: { alignItems: 'center', marginVertical: 32 },
  timerNumero: { color: '#9b59b6', fontSize: 80, fontWeight: '700' },
  timerLabel: { color: '#888', fontSize: 18, marginTop: -8 },
  botaoCancelar: { marginTop: 32, padding: 12, paddingHorizontal: 32, borderRadius: 8, borderWidth: 1, borderColor: '#e74c3c' },
  botaoCancelarTexto: { color: '#e74c3c', fontSize: 16 },
  pergunta: { color: '#fff', fontSize: 16, marginBottom: 20 },
  opcoes: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  opcao: {
    backgroundColor: '#2a1a3e', paddingVertical: 16, paddingHorizontal: 24,
    borderRadius: 12, borderWidth: 1, borderColor: '#9b59b6'
  },
  opcaoTexto: { color: '#9b59b6', fontSize: 18, fontWeight: '600' },
  dicaContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2a1a3e', padding: 16, borderRadius: 10, gap: 12 },
  dicaTexto: { color: '#ccc', fontSize: 13, flex: 1 }
});


