import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function QuebraDeTarefas({ navigation }) {
  const [tarefaPrincipal, setTarefaPrincipal] = useState('');
  const [subpassos, setSubpassos] = useState([]);
  const [passoAtual, setPassoAtual] = useState('');
  const [etapaConcluida, setEtapaConcluida] = useState({});
  const [iniciado, setIniciado] = useState(false);

  const adicionarPasso = () => {
    if (!passoAtual.trim()) return;
    setSubpassos([...subpassos, { id: Date.now(), texto: passoAtual.trim(), concluido: false }]);
    setPassoAtual('');
  };

  const toggleConcluido = (id) => {
    setSubpassos(subpassos.map(p =>
      p.id === id ? { ...p, concluido: !p.concluido } : p
    ));
  };

  const removerPasso = (id) => {
    setSubpassos(subpassos.filter(p => p.id !== id));
  };

  const iniciar = () => {
    if (!tarefaPrincipal.trim()) {
      Alert.alert('Atenção', 'Digite a tarefa principal primeiro.');
      return;
    }
    if (subpassos.length < 2) {
      Alert.alert('Atenção', 'Adicione pelo menos 2 subpassos.');
      return;
    }
    setIniciado(true);
  };

  const concluidos = subpassos.filter(p => p.concluido).length;
  const progresso = subpassos.length > 0 ? (concluidos / subpassos.length) * 100 : 0;

  const reiniciar = () => {
    setTarefaPrincipal('');
    setSubpassos([]);
    setPassoAtual('');
    setIniciado(false);
  };

  if (!iniciado) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.titulo}>Quebra de Tarefas</Text>
          <Text style={styles.subtitulo}>Transforme uma tarefa grande em micro-passos</Text>

          <Text style={styles.label}>Qual é a tarefa?</Text>
          <TextInput style={styles.input} placeholder="Ex: Organizar relatório mensal" placeholderTextColor="#666"
            value={tarefaPrincipal} onChangeText={setTarefaPrincipal} />

          <Text style={styles.label}>Subpassos (mínimo 2)</Text>
          <View style={styles.addRow}>
            <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Ex: Abrir o computador" placeholderTextColor="#666"
              value={passoAtual} onChangeText={setPassoAtual}
              onSubmitEditing={adicionarPasso} />
            <TouchableOpacity style={styles.addBtn} onPress={adicionarPasso}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {subpassos.map(p => (
            <View key={p.id} style={styles.passoRow}>
              <Ionicons name="ellipse-outline" size={18} color="#9b59b6" />
              <Text style={styles.passoTexto}>{p.texto}</Text>
              <TouchableOpacity onPress={() => removerPasso(p.id)}>
                <Ionicons name="close-circle" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          ))}

          {subpassos.length > 0 && (
            <TouchableOpacity style={styles.botao} onPress={iniciar}>
              <Text style={styles.botaoTexto}>Começar ({subpassos.length} passos)</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>{tarefaPrincipal}</Text>

        <View style={styles.progressoContainer}>
          <View style={styles.progressoBar}>
            <View style={[styles.progressoFill, { width: `${progresso}%` }]} />
          </View>
          <Text style={styles.progressoTexto}>{concluidos}/{subpassos.length} concluídos</Text>
        </View>

        {subpassos.map(p => (
          <TouchableOpacity key={p.id} style={[styles.passoCard, p.concluido && styles.passoConcluido]}
            onPress={() => toggleConcluido(p.id)}>
            <Ionicons name={p.concluido ? "checkmark-circle" : "ellipse-outline"}
              size={24} color={p.concluido ? "#2ecc71" : "#9b59b6"} />
            <Text style={[styles.passoCardTexto, p.concluido && styles.passoCardTextoConcluido]}>
              {p.texto}
            </Text>
          </TouchableOpacity>
        ))}

        {progresso === 100 && (
          <View style={styles.parabens}>
            <Ionicons name="trophy" size={48} color="#f1c40f" />
            <Text style={styles.parabensTexto}>Tarefa concluída! ðŸŽ‰</Text>
            <TouchableOpacity style={styles.botao} onPress={reiniciar}>
              <Text style={styles.botaoTexto}>Nova tarefa</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a2e' },
  scroll: { padding: 24, paddingBottom: 48 },
  titulo: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitulo: { color: '#888', fontSize: 14, marginBottom: 24 },
  label: { color: '#9b59b6', fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  input: { backgroundColor: '#2a1a3e', borderRadius: 10, padding: 14, color: '#fff', fontSize: 15, marginBottom: 12 },
  addRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  addBtn: { backgroundColor: '#9b59b6', width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  passoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#2a1a3e', borderRadius: 8, marginBottom: 6 },
  passoTexto: { color: '#ddd', fontSize: 14, flex: 1 },
  botao: { backgroundColor: '#9b59b6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
  progressoContainer: { marginVertical: 20 },
  progressoBar: { height: 8, backgroundColor: '#2a1a3e', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressoFill: { height: '100%', backgroundColor: '#9b59b6', borderRadius: 4 },
  progressoTexto: { color: '#888', fontSize: 13, textAlign: 'right' },
  passoCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#2a1a3e', padding: 16, borderRadius: 10, marginBottom: 8 },
  passoConcluido: { opacity: 0.6 },
  passoCardTexto: { color: '#fff', fontSize: 15, flex: 1 },
  passoCardTextoConcluido: { textDecorationLine: 'line-through', color: '#888' },
  parabens: { alignItems: 'center', marginTop: 32, gap: 12 }
});


