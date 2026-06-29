import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TECNICAS = [
  {
    id: 'reestruturacao',
    titulo: '🧠 Reestruturação Cognitiva',
    tempo: '2 min',
    descricao: 'Identifique e substitua pensamentos automáticos negativos.',
    passos: [
      '1. Qual pensamento está passando pela sua cabeça agora?',
      '2. Ele é realmente verdade? Há evidências?',
      '3. Qual seria uma forma mais equilibrada de pensar?',
      '4. Substitua: "Tudo vai dar errado" → "Vou fazer o meu melhor".',
    ],
  },
  {
    id: '5sentidos',
    titulo: '👁️ Técnica dos 5 Sentidos',
    tempo: '1 min',
    descricao: 'Ancoragem sensorial para trazer de volta ao presente.',
    passos: [
      '5 coisas que você VÊ ao seu redor',
      '4 coisas que você PODE TOCAR',
      '3 sons que você OUVE',
      '2 cheiros que você SENTE',
      '1 sabor que você PERCEBE',
    ],
  },
  {
    id: 'diario_pensamento',
    titulo: '📝 Diário de Pensamento (ABC)',
    tempo: '3 min',
    descricao: 'Registro rápido: Ativador → Crença → Consequência.',
    passos: [
      'A — O que aconteceu (ativador)?',
      'B — O que você pensou na hora (crença)?',
      'C — Como se sentiu e agiu (consequência)?',
      'Agora reescreva B de forma mais realista.',
    ],
  },
  {
    id: 'ativacao',
    titulo: '⚡ Ativação Comportamental',
    tempo: '2 min',
    descricao: 'Micro-ação para quebrar o ciclo de inércia.',
    passos: [
      'Escolha UMA ação pequena e possível agora:',
      '• Levantar e beber água',
      '• Abrir a janela e respirar 3 vezes',
      '• Escrever uma frase sobre como se sente',
      '• Dar 10 passos pelo ambiente',
      'Faça agora. Não precisa ser perfeito.',
    ],
  },
  {
    id: 'resp_diafragmatica',
    titulo: '🌬️ Respiração Diafragmática',
    tempo: '2 min',
    descricao: 'Técnica fisiológica validada para redução imediata de estresse.',
    passos: [
      'Coloque uma mão no peito e outra na barriga.',
      'Inspire pelo nariz por 4 segundos (barriga infla).',
      'Segure por 2 segundos.',
      'Expire pela boca por 6 segundos (barriga desinfla).',
      'Repita 5 vezes.',
    ],
  },
];

export default function StressControlScreen() {
  const insets = useSafeAreaInsets();
  const [aberta, setAberta] = useState(null);

  const toggle = (id) => setAberta(aberta === id ? null : id);

  return (
    <LinearGradient colors={['#0a0e27', '#1a1040']} style={{flex:1}}>
      <SafeAreaView style={{flex:1, paddingTop: insets.top + 8}}>
        <ScrollView contentContainerStyle={{padding:20, paddingBottom:40}}>
          <Text style={{color:'#fff', fontSize:22, fontWeight:'bold', textAlign:'center', marginBottom:4}}>🧠 Controle de Estresse</Text>
          <Text style={{color:'rgba(255,255,255,0.4)', fontSize:12, textAlign:'center', marginBottom:20}}>Técnicas baseadas em Terapia Cognitivo-Comportamental</Text>

          {TECNICAS.map((tec) => {
            const isOpen = aberta === tec.id;
            return (
              <View key={tec.id} style={{backgroundColor:'rgba(255,255,255,0.06)', borderRadius:16, marginBottom:12, borderWidth:1, borderColor:'rgba(155,114,207,0.2)', overflow:'hidden'}}>
                <TouchableOpacity onPress={() => toggle(tec.id)} style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:16}}>
                  <View style={{flex:1}}>
                    <Text style={{color:'#fff', fontSize:15, fontWeight:'600'}}>{tec.titulo}</Text>
                    <Text style={{color:'rgba(255,255,255,0.4)', fontSize:12, marginTop:2}}>{tec.tempo} • {tec.descricao}</Text>
                  </View>
                  <Text style={{color:'#9b72cf', fontSize:18}}>{isOpen ? '▼' : '▶'}</Text>
                </TouchableOpacity>
                {isOpen && (
                  <View style={{paddingHorizontal:16, paddingBottom:16}}>
                    {tec.passos.map((passo, i) => (
                      <Text key={i} style={{color:'#cbd5e1', fontSize:13, lineHeight:20, marginBottom:4}}>{passo}</Text>
                    ))}
                  </View>
                )}
              </View>
            );
          })}

          <Text style={{color:'rgba(255,255,255,0.25)', fontSize:10, textAlign:'center', marginTop:10}}>
            Baseado em princípios da TCC (Beck, 2011) e técnicas de relaxamento com evidência científica.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}