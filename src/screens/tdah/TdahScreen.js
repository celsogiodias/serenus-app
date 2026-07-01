import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const modulos = [
  { nome: 'Reestruturação Cognitiva', icone: 'brain-outline', tela: 'ReestruturacaoCognitiva', cor: '#9b59b6' },
  { nome: 'Registro de Pensamentos', icone: 'document-text-outline', tela: 'RegistroPensamentos', cor: '#3498db' },
  { nome: 'Técnica do Atraso', icone: 'hourglass-outline', tela: 'TecnicaDoAtraso', cor: '#e67e22' },
  { nome: 'Quebra de Tarefas', icone: 'list-outline', tela: 'QuebraDeTarefas', cor: '#2ecc71' },
  { nome: 'Planejamento Se-Então', icone: 'git-branch-outline', tela: 'PlanejamentoSeEntao', cor: '#e74c3c' },
];

export default function TdahScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>Ferramentas TDAH</Text>
        <Text style={styles.subtitulo}>Técnicas baseadas na TCC</Text>

        {modulos.map((mod, i) => (
          <TouchableOpacity key={i} style={styles.card}
            onPress={() => navigation.navigate(mod.tela)}>
            <View style={[styles.iconeContainer, { backgroundColor: mod.cor + '20' }]}>
              <Ionicons name={mod.icone} size={28} color={mod.cor} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardNome}>{mod.nome}</Text>
              <Text style={styles.cardSeta}>â€º</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a2e' },
  scroll: { padding: 24 },
  titulo: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 8 },
  subtitulo: { color: '#888', fontSize: 15, marginBottom: 24 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#2a1a3e',
    padding: 16, borderRadius: 12, marginBottom: 10, gap: 16
  },
  iconeContainer: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardNome: { color: '#fff', fontSize: 16, fontWeight: '500' },
  cardSeta: { color: '#666', fontSize: 24 }
});


