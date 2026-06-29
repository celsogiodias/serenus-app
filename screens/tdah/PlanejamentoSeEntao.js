import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PlanejamentoSeEntao({ navigation }) {
  const [planos, setPlanos] = useState([]);
  const [se, setSe] = useState('');
  const [entao, setEntao] = useState('');
  const [editando, setEditando] = useState(false);

  const sugestoes = [
    { se: 'Se eu sentir vontade de procrastinar', entao: 'então vou fazer apenas 5 minutos da tarefa' },
    { se: 'Se eu me distrair com o celular', entao: 'então vou colocá-lo no modo avião por 30 min' },
    { se: 'Se eu me sentir sobrecarregado', entao: 'então vou escrever 3 passos mínimos' },
    { se: 'Se bater o impulso de comprar algo', entao: 'então vou esperar 24h antes de decidir' },
  ];

  const adicionar = () => {
    if (!se.trim() || !entao.trim()) {
      Alert.alert('Atenção', 'Preencha o "Se" e o "Então".');
      return;
    }
    setPlanos([{ id: Date.now(), se: se.trim(), entao: entao.trim(), ativo: true }, ...planos]);
    setSe('');
    setEntao('');
  };

  const toggleAtivo = (id) => {
    setPlanos(planos.map(p => p.id === id ? { ...p, ativo: !p.ativo } : p));
  };

  const excluir = (id) => {
    setPlanos(planos.filter(p => p.id !== id));
  };

  const usarSugestao = (s) => {
    setSe(s.se);
    setEntao(s.entao);
    setEditando(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>Planejamento Se-Então</Text>
        <Text style={styles.subtitulo}>
          Crie planos automáticos: "Se X acontecer, então farei Y"
        </Text>

        {!editando && planos.length === 0 && (
          &lt;>
            <Text style={styles.sugestoesTitulo}>Sugestões para começar:</Text>
            {sugestoes.map((s, i) => (
              <TouchableOpacity key={i} style={styles.sugestaoCard} onPress={() => usarSugestao(s)}>
                <Text style={styles.sugestaoTexto}>{s.se}, {s.entao}</Text>
                <Ionicons name="add-circle" size={22} color="#9b59b6" />
              </TouchableOpacity>
            ))}
          </>
        )}

        {(editando || planos.length > 0) && (
          <View style={styles.form}>
            <Text style={styles.label}>SE</Text>
            <TextInput style={styles.input} placeholder="Se acontecer..." placeholderTextColor="#666"
              value={se} onChangeText={setSe} multiline />
            <Text style={styles.label}>ENTÃO</Text>
            <TextInput style={styles.input} placeholder="Então eu vou..." placeholderTextColor="#666"
              value={entao} onChangeText={setEntao} multiline />
            <View style={styles.formBotoes}>
              <TouchableOpacity style={styles.botao} onPress={adicionar}>
                <Text style={styles.botaoTexto}>Salvar plano</Text>
              </TouchableOpacity>
              {planos.length > 0 && (
                <TouchableOpacity onPress={() => { setEditando(false); setSe(''); setEntao(''); }}>
                  <Text style={styles.cancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {planos.length > 0 && (
          &lt;>
            <Text style={styles.listaTitulo}>Meus planos ({planos.length})</Text>
            {planos.map(p => (
              <View key={p.id} style={[styles.planoCard, !p.ativo && styles.planoInativo]}>
                <View style={styles.planoHeader}>
                  <TouchableOpacity onPress={() => toggleAtivo(p.id)}>
                    <Ionicons name={p.ativo ? "toggle" : "toggle-outline"} size={28} color={p.ativo ? "#2ecc71" : "#666"} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => excluir(p.id)}>
                    <Ionicons name="trash-outline" size={18} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.planoSe}>🔹 {p.se}</Text>
                <Text style={styles.planoEntao}>➡️ {p.entao}</Text>
                <Text style={styles.planoStatus}>{p.ativo ? 'Ativo' : 'Pausado'}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a2e' },
  scroll: { padding: 24, paddingBottom: 48 },
  titulo: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitulo: { color: '#888', fontSize: 14, marginBottom: 24, lineHeight: 20 },
  sugestoesTitulo: { color: '#9b59b6', fontSize: 15, fontWeight: '600', marginBottom: 12 },
  sugestaoCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#2a1a3e',
    padding: 14, borderRadius: 10, marginBottom: 8, gap: 8
  },
  sugestaoTexto: { color: '#ccc', fontSize: 13, flex: 1, lineHeight: 18 },
  form: { marginBottom: 24 },
  label: { color: '#9b59b6', fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: '#2a1a3e', borderRadius: 10, padding: 14, color: '#fff', fontSize: 15, minHeight: 48, marginBottom: 8 },
  formBotoes: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8 },
  botao: { backgroundColor: '#9b59b6', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10 },
  botaoTexto: { color: '#fff', fontSize: 15, fontWeight: '600' },
  cancelarTexto: { color: '#888', fontSize: 14 },
  listaTitulo: { color: '#fff', fontSize: 17, fontWeight: '600', marginBottom: 12, marginTop: 8 },
  planoCard: { backgroundColor: '#2a1a3e', borderRadius: 10, padding: 16, marginBottom: 10 },
  planoInativo: { opacity: 0.5 },
  planoHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  planoSe: { color: '#ddd', fontSize: 14, marginBottom: 4 },
  planoEntao: { color: '#9b59b6', fontSize: 14, fontWeight: '500' },
  planoStatus: { color: '#666', fontSize: 12, marginTop: 8, textAlign: 'right' }
});
