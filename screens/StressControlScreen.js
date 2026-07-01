import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tecnicas = [
  { id: 'dialogo', icon: '🧠', nome: 'Dialogo Socratico', desc: 'Examine seus pensamentos com perguntas guiadas para encontrar uma perspectiva mais equilibrada.' },
  { id: 'sentidos', icon: '👁️', nome: 'Tecnica dos 5 Sentidos', desc: 'Ancore-se no presente usando os cinco sentidos: visao, audicao, tato, olfato e paladar.' },
  { id: 'ativacao', icon: '⚡', nome: 'Ativacao Comportamental', desc: 'Engaje-se em atividades prazerosas para aumentar a energia e reduzir a inercia emocional.' },
  { id: 'respiracao', icon: '🌬️', nome: 'Respiracao Diafragmatica', desc: 'Respire devagar usando o diafragma para acalmar o sistema nervoso e reduzir a tensao.' },
];

const perguntas = [
  'Que evidencias voce tem de que esse pensamento e verdadeiro?',
  'Que evidencias voce tem de que esse pensamento NAO e verdadeiro?',
  'Se um amigo seu estivesse com esse pensamento, o que voce diria a ele?',
  'Existe uma forma mais equilibrada de enxergar essa situacao?',
  'Como voce se sente agora depois de refletir sobre isso?',
];

export default function StressControlScreen() {
  const insets = useSafeAreaInsets();
  const [activeId, setActiveId] = useState(null);
  const [etapa, setEtapa] = useState('inicio');
  const [pensamentoOriginal, setPensamentoOriginal] = useState('');
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [respostaAtual, setRespostaAtual] = useState('');

  const resetDialogo = () => {
    setEtapa('inicio'); setPensamentoOriginal(''); setPerguntaAtual(0); setRespostas([]); setRespostaAtual('');
  };

  const handleProximaPergunta = () => {
    if (!respostaAtual.trim()) return;
    const novasRespostas = [...respostas, respostaAtual.trim()];
    setRespostas(novasRespostas); setRespostaAtual('');
    if (perguntaAtual < perguntas.length - 1) {
      setPerguntaAtual(perguntaAtual + 1);
    } else {
      setEtapa('resumo');
    }
  };

  const renderDialogo = () => (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      {etapa === 'inicio' && (
        <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 24, marginBottom: 20 }}>
          <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 10 }}>🧠</Text>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#333', textAlign: 'center', marginBottom: 12 }}>Dialogo Socratico</Text>
          <Text style={{ fontSize: 16, color: '#555', textAlign: 'center', lineHeight: 22, marginBottom: 20 }}>
            Uma conversa guiada com voce mesmo para examinar pensamentos angustiantes e encontrar uma perspectiva mais equilibrada.
          </Text>
          <TouchableOpacity onPress={() => setEtapa('escrevendo')} style={{ backgroundColor: '#667eea', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Comecar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveId(null)} style={{ borderWidth: 1, borderColor: '#667eea', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ color: '#667eea', fontSize: 16, fontWeight: '600' }}>Voltar as tecnicas</Text>
          </TouchableOpacity>
        </View>
      )}

      {etapa === 'escrevendo' && (
        <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 24, marginBottom: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#333', textAlign: 'center', marginBottom: 16 }}>
            Qual pensamento esta passando pela sua cabeca agora?
          </Text>
          <TextInput style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, fontSize: 16, color: '#333', minHeight: 100, backgroundColor: '#f9f9f9', marginBottom: 16 }}
            value={pensamentoOriginal} onChangeText={setPensamentoOriginal} multiline
            placeholder="Escreva aqui o que voce esta pensando..." placeholderTextColor="#888" textAlignVertical="top" />
          <TouchableOpacity onPress={() => setEtapa('perguntas')}
            style={{ backgroundColor: pensamentoOriginal.trim() ? '#667eea' : '#a0a0a0', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 12 }}
            disabled={!pensamentoOriginal.trim()}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Proxima</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setEtapa('inicio')} style={{ borderWidth: 1, borderColor: '#667eea', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ color: '#667eea', fontSize: 16, fontWeight: '600' }}>Voltar</Text>
          </TouchableOpacity>
        </View>
      )}

      {etapa === 'perguntas' && (
        <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 24, marginBottom: 20 }}>
          <Text style={{ textAlign: 'center', color: '#667eea', fontWeight: '600', marginBottom: 10 }}>
            Pergunta {perguntaAtual + 1} de {perguntas.length}
          </Text>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#333', textAlign: 'center', marginBottom: 16 }}>{perguntas[perguntaAtual]}</Text>
          <TextInput style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, fontSize: 16, color: '#333', minHeight: 100, backgroundColor: '#f9f9f9', marginBottom: 16 }}
            value={respostaAtual} onChangeText={setRespostaAtual} multiline
            placeholder="Sua resposta..." placeholderTextColor="#888" textAlignVertical="top" />
          <TouchableOpacity onPress={handleProximaPergunta}
            style={{ backgroundColor: respostaAtual.trim() ? '#667eea' : '#a0a0a0', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 12 }}
            disabled={!respostaAtual.trim()}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Proxima</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setEtapa('escrevendo')} style={{ borderWidth: 1, borderColor: '#667eea', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ color: '#667eea', fontSize: 16, fontWeight: '600' }}>Voltar ao pensamento</Text>
          </TouchableOpacity>
        </View>
      )}

      {etapa === 'resumo' && (
        <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 24, marginBottom: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#333', textAlign: 'center', marginBottom: 16 }}>Resumo do Dialogo Socratico</Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#444', marginTop: 14, marginBottom: 4 }}>Pensamento original:</Text>
          <Text style={{ fontSize: 15, color: '#555', lineHeight: 22 }}>{pensamentoOriginal}</Text>
          {respostas.map((r, i) => (
            <View key={i}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#444', marginTop: 14, marginBottom: 4 }}>{perguntas[i]}</Text>
              <Text style={{ fontSize: 15, color: '#555', lineHeight: 22 }}>{r}</Text>
            </View>
          ))}
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#444', marginTop: 14, marginBottom: 4 }}>Nova perspectiva mais equilibrada:</Text>
          <Text style={{ fontSize: 15, color: '#555', lineHeight: 22, marginBottom: 20 }}>{respostas[3] || 'Voce ainda esta refletindo sobre isso.'}</Text>
          <TouchableOpacity onPress={() => setActiveId(null)} style={{ backgroundColor: '#667eea', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Sim, me sinto melhor</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={resetDialogo} style={{ borderWidth: 1, borderColor: '#667eea', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ color: '#667eea', fontSize: 16, fontWeight: '600' }}>Ainda estou angustiado</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
        {activeId ? (
          activeId === 'dialogo' ? renderDialogo() : (
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
              <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 24, marginBottom: 20 }}>
                <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 10 }}>{tecnicas.find(t => t.id === activeId).icon}</Text>
                <Text style={{ fontSize: 22, fontWeight: '700', color: '#333', textAlign: 'center', marginBottom: 12 }}>{tecnicas.find(t => t.id === activeId).nome}</Text>
                <Text style={{ fontSize: 16, color: '#555', textAlign: 'center', lineHeight: 22, marginBottom: 20 }}>{tecnicas.find(t => t.id === activeId).desc}</Text>
                {activeId === 'sentidos' && (
                  <Text style={{ fontSize: 16, color: '#555', lineHeight: 24, marginBottom: 20 }}>
                    Observe ao seu redor:{'\n\n'}
                    5 coisas que voce consegue ver{'\n'}
                    4 coisas que voce consegue tocar{'\n'}
                    3 coisas que voce consegue ouvir{'\n'}
                    2 coisas que voce consegue sentir o cheiro{'\n'}
                    1 coisa que voce consegue provar{'\n\n'}
                    Esse exercicio ajuda a trazer a atencao de volta ao presente.
                  </Text>
                )}
                {activeId === 'ativacao' && (
                  <Text style={{ fontSize: 16, color: '#555', lineHeight: 24, marginBottom: 20 }}>
                    Escolha uma atividade pequena e prazerosa, como ouvir musica, caminhar, tomar banho ou ligar para um amigo. {'\n\n'}
                    Agende um horario para realiza-la hoje e observe como seu humor se altera ao cumprir o compromisso consigo mesmo.
                  </Text>
                )}
                {activeId === 'respiracao' && (
                  <Text style={{ fontSize: 16, color: '#555', lineHeight: 24, marginBottom: 20 }}>
                    Sente-se confortavelmente, com uma mao no peito e outra no abdome.{'\n\n'}
                    1. Inspire lentamente pelo nariz, sentindo o abdome subir.{'\n'}
                    2. Segure a respiracao por alguns segundos.{'\n'}
                    3. Expire devagar pela boca, soltando o ar completamente.{'\n\n'}
                    Repita por cerca de 5 minutos, mantendo o ritmo calmo e regular.
                  </Text>
                )}
                <TouchableOpacity onPress={() => setActiveId(null)} style={{ borderWidth: 1, borderColor: '#667eea', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
                  <Text style={{ color: '#667eea', fontSize: 16, fontWeight: '600' }}>Voltar as tecnicas</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )
        ) : (
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            <Text style={{ fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 6 }}>Controle do Estresse</Text>
            <Text style={{ fontSize: 16, color: '#e0e0e0', marginBottom: 20 }}>Escolha uma tecnica para praticar agora.</Text>
            {tecnicas.map(tec => (
              <TouchableOpacity key={tec.id} onPress={() => setActiveId(tec.id)}
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 14 }}>
                <Text style={{ fontSize: 32, marginRight: 16 }}>{tec.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 4 }}>{tec.nome}</Text>
                  <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }}>{tec.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}