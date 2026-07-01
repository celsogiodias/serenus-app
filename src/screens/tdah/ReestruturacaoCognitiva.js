import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PERGUNTAS = [
  {
    id: 1,
    texto: "O que passou pela sua cabeça agora?",
    placeholder: "Ex: Não vou conseguir fazer isso..."
  },
  {
    id: 2,
    texto: "De 0 a 10, o quanto você acredita nesse pensamento?",
    tipo: 'escala',
    placeholder: "Digite um nÃºmero de 0 a 10"
  },
  {
    id: 3,
    texto: "Se um amigo tivesse esse pensamento, o que você diria a ele?",
    placeholder: "Ex: Você já fez coisas difíceis antes..."
  }
];

export default function ReestruturacaoCognitiva({ navigation }) {
  const [passo, setPasso] = useState(0);
  const [respostas, setRespostas] = useState({});
  const [input, setInput] = useState('');
  const [finalizado, setFinalizado] = useState(false);

  const perguntaAtual = PERGUNTAS[passo];

  const avancar = () => {
    if (!input.trim()) return;

    const novasRespostas = { ...respostas, [perguntaAtual.id]: input.trim() };
    setRespostas(novasRespostas);
    setInput('');

    if (passo < PERGUNTAS.length - 1) {
      setPasso(passo + 1);
    } else {
      setFinalizado(true);
    }
  };

  const reiniciar = () => {
    setPasso(0);
    setRespostas({});
    setInput('');
    setFinalizado(false);
  };

  if (finalizado) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Ionicons name="checkmark-circle" size={64} color="#9b59b6" />
          <Text style={styles.titulo}>Reflexão concluída</Text>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Pensamento original:</Text>
            <Text style={styles.cardText}>{respostas[1]}</Text>
            <Text style={styles.cardLabel}>Crença: {respostas[2]}/10</Text>
            <Text style={styles.cardLabel}>Nova perspectiva:</Text>
            <Text style={styles.cardText}>{respostas[3]}</Text>
          </View>
          <TouchableOpacity style={styles.botao} onPress={reiniciar}>
            <Text style={styles.botaoTexto}>Fazer outra reflexão</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.contador}>Pergunta {passo + 1} de {PERGUNTAS.length}</Text>
        <Text style={styles.pergunta}>{perguntaAtual.texto}</Text>

        {perguntaAtual.tipo === 'escala' ? (
          <View style={styles.escalaContainer}>
            {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
              <TouchableOpacity
                key={n}
                style={[styles.escalaBtn, input === String(n) && styles.escalaAtiva]}
                onPress={() => setInput(String(n))}
              >
                <Text style={[styles.escalaTexto, input === String(n) && styles.escalaTextoAtivo]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <TextInput
            style={styles.input}
            placeholder={perguntaAtual.placeholder}
            placeholderTextColor="#888"
            value={input}
            onChangeText={setInput}
            multiline
          />
        )}

        <TouchableOpacity
          style={[styles.botao, !input.trim() && styles.botaoDisabled]}
          onPress={avancar}
          disabled={!input.trim()}
        >
          <Text style={styles.botaoTexto}>
            {passo < PERGUNTAS.length - 1 ? 'Avançar' : 'Finalizar'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a2e' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  contador: { color: '#9b59b6', fontSize: 14, marginBottom: 16, textAlign: 'center' },
  pergunta: { color: '#fff', fontSize: 22, fontWeight: '600', marginBottom: 32, textAlign: 'center', lineHeight: 32 },
  input: {
    backgroundColor: '#2a1a3e', borderRadius: 12, padding: 16, color: '#fff',
    fontSize: 16, minHeight: 100, textAlignVertical: 'top', marginBottom: 24
  },
  escalaContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 24 },
  escalaBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#2a1a3e',
    justifyContent: 'center', alignItems: 'center'
  },
  escalaAtiva: { backgroundColor: '#9b59b6' },
  escalaTexto: { color: '#888', fontSize: 14, fontWeight: '600' },
  escalaTextoAtivo: { color: '#fff' },
  botao: { backgroundColor: '#9b59b6', padding: 16, borderRadius: 12, alignItems: 'center' },
  botaoDisabled: { opacity: 0.4 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
  titulo: { color: '#fff', fontSize: 24, fontWeight: '700', textAlign: 'center', marginVertical: 16 },
  card: { backgroundColor: '#2a1a3e', borderRadius: 12, padding: 20, marginBottom: 24 },
  cardLabel: { color: '#9b59b6', fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 4 },
  cardText: { color: '#ddd', fontSize: 16, lineHeight: 24 }
});


