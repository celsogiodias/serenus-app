import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RegistroPensamentos({ navigation }) {
  const [situacao, setSituacao] = useState('');
  const [pensamento, setPensamento] = useState('');
  const [emocao, setEmocao] = useState('');
  const [intensidade, setIntensidade] = useState(5);
  const [registros, setRegistros] = useState([]);
  const [mostrandoForm, setMostrandoForm] = useState(true);

  const salvar = () => {
    if (!situacao.trim() || !pensamento.trim()) {
      Alert.alert('Atenção', 'Preencha pelo menos a situação e o pensamento.');
      return;
    }
    const novo = {
      id: Date.now(),
      situacao: situacao.trim(),
      pensamento: pensamento.trim(),
      emocao: emocao.trim() || '(não informada)',
      intensidade,
      data: new Date().toLocaleString('pt-BR')
    };
    setRegistros([novo, ...registros]);
    setSituacao('');
    setPensamento('');
    setEmocao('');
    setIntensidade(5);
  };

  const excluir = (id) => {
    setRegistros(registros.filter(r => r.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {mostrandoForm ? (
          <View style={styles.form}>
            <Text style={styles.titulo}>Registro de Pensamentos</Text>
            <Text style={styles.subtitulo}>Identifique o que passa pela sua cabeça</Text>

            <Text style={styles.label}>Situação</Text>
            <TextInput style={styles.input} placeholder="O que aconteceu?" placeholderTextColor="#666"
              value={situacao} onChangeText={setSituacao} multiline />

            <Text style={styles.label}>Pensamento automático</Text>
            <TextInput style={styles.input} placeholder="O que passou pela sua cabeça?" placeholderTextColor="#666"
              value={pensamento} onChangeText={setPensamento} multiline />

            <Text style={styles.label}>Emoção (opcional)</Text>
            <TextInput style={styles.input} placeholder="Ex: ansiedade, frustração, tristeza" placeholderTextColor="#666"
              value={emocao} onChangeText={setEmocao} />

            <Text style={styles.label}>Intensidade: {intensidade}/10</Text>
            <View style={styles.escalaContainer}>
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <TouchableOpacity key={n} style={[styles.escalaBtn, intensidade === n && styles.escalaAtiva]}
                  onPress={() => setIntensidade(n)}>
                  <Text style={[styles.escalaTexto, intensidade === n && styles.escalaTextoAtivo]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.botao} onPress={salvar}>
              <Text style={styles.botaoTexto}>Salvar registro</Text>
            </TouchableOpacity>

            {registros.length > 0 && (
              <TouchableOpacity style={styles.verLista} onPress={() => setMostrandoForm(false)}>
                <Text style={styles.verListaTexto}>Ver histórico ({registros.length})</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.listaContainer}>
            <View style={styles.listaHeader}>
              <TouchableOpacity onPress={() => setMostrandoForm(true)}>
                <Ionicons name="arrow-back" size={24} color="#9b59b6" />
              </TouchableOpacity>
              <Text style={styles.titulo}>Histórico</Text>
              <View style={{ width: 24 }} />
            </View>

            {registros.length === 0 ? (
              <Text style={styles.vazio}>Nenhum registro ainda</Text>
            ) : (
              registros.map(r => (
                <View key={r.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardData}>{r.data}</Text>
                    <TouchableOpacity onPress={() => excluir(r.id)}>
                      <Ionicons name="trash-outline" size={18} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.cardLabel}>Situação:</Text>
                  <Text style={styles.cardText}>{r.situacao}</Text>
                  <Text style={styles.cardLabel}>Pensamento:</Text>
                  <Text style={styles.cardText}>{r.pensamento}</Text>
                  <Text style={styles.cardLabel}>Emoção: {r.emocao} | Intensidade: {r.intensidade}/10</Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a2e' },
  scroll: { padding: 24, paddingBottom: 48 },
  form: {},
  titulo: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitulo: { color: '#888', fontSize: 14, marginBottom: 24 },
  label: { color: '#9b59b6', fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  input: {
    backgroundColor: '#2a1a3e', borderRadius: 10, padding: 14, color: '#fff',
    fontSize: 15, minHeight: 48, textAlignVertical: 'top'
  },
  escalaContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  escalaBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#2a1a3e', justifyContent: 'center', alignItems: 'center' },
  escalaAtiva: { backgroundColor: '#9b59b6' },
  escalaTexto: { color: '#888', fontSize: 12, fontWeight: '600' },
  escalaTextoAtivo: { color: '#fff' },
  botao: { backgroundColor: '#9b59b6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
  verLista: { marginTop: 16, alignItems: 'center' },
  verListaTexto: { color: '#9b59b6', fontSize: 14 },
  listaContainer: {},
  listaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  vazio: { color: '#666', textAlign: 'center', marginTop: 48, fontSize: 16 },
  card: { backgroundColor: '#2a1a3e', borderRadius: 10, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardData: { color: '#666', fontSize: 12 },
  cardLabel: { color: '#9b59b6', fontSize: 13, fontWeight: '600', marginTop: 8 },
  cardText: { color: '#ddd', fontSize: 14, marginTop: 2, lineHeight: 20 }
});


