import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FRASES = [
  'Observe sua respiração entrando e saindo.',
  'Sinta o ar fresco entrando pelas narinas.',
  'Note o movimento do seu peito e abdômen.',
  'Apenas observe, sem julgar.',
  'Se sua mente vagar, traga-a de volta suavemente.',
  'Você está seguro neste momento.',
  'Cada respiração é um novo começo.',
  'Sinta o peso do seu corpo no chão.',
  'Observe os sons ao seu redor, sem se prender a eles.',
  'Acalme sua mente, como um lago sereno.',
];

export default function MindfulnessScreen() {
  const insets = useSafeAreaInsets();
  const [running, setRunning] = useState(false);
  const [tempo, setTempo] = useState(0);
  const [fraseIndex, setFraseIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTempo(t => t + 1);
        setFraseIndex(i => (i + 1) % FRASES.length);
      }, 10000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const formatTempo = (s) => {
    const m = Math.floor(s / 60);
    const seg = s % 60;
    return `${m.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  };

  return (
    <LinearGradient colors={['#0a0e27', '#1a1040']} style={{flex:1}}>
      <SafeAreaView style={{flex:1, paddingTop: insets.top + 8}}>
        <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:24}}>
          <Text style={{color:'#fff', fontSize:22, fontWeight:'bold', marginBottom:8}}>🧘 Mindfulness</Text>
          <Text style={{color:'#cbd5e1', fontSize:14, marginBottom:40, textAlign:'center'}}>
            Atenção plena no momento presente
          </Text>
          <View style={{backgroundColor:'rgba(255,255,255,0.08)', borderRadius:24, padding:30, alignItems:'center', width:'100%', marginBottom:30}}>
            <Text style={{color:'#fff', fontSize:20, textAlign:'center', lineHeight:30, fontStyle:'italic'}}>
              "{FRASES[fraseIndex]}"
            </Text>
          </View>
          <Text style={{color:'#fff', fontSize:48, fontWeight:'200', marginBottom:30}}>
            {formatTempo(tempo)}
          </Text>
          <TouchableOpacity onPress={() => { setRunning(!running); if (!running) { setTempo(0); setFraseIndex(0); } }}
            style={{backgroundColor:'#7c4dff', paddingVertical:16, paddingHorizontal:48, borderRadius:30}}>
            <Text style={{color:'#fff', fontSize:18, fontWeight:'600'}}>{running ? 'Parar' : 'Iniciar'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}