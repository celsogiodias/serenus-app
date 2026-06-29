import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STORAGE_KEY = '@noite_serena_panic';

const GROUNDING_STEPS = [
  { label: 'Veja 5 coisas', desc: 'Olhe ao redor e identifique 5 objetos diferentes' },
  { label: 'Toque em 4', desc: 'Sinta 4 texturas ao seu redor' },
  { label: 'Ouça 3 sons', desc: 'Pare e escute 3 sons diferentes' },
  { label: 'Cheire 2', desc: 'Sinta 2 aromas ou cheiros próximos' },
  { label: 'Sinta 1', desc: 'Perceba 1 sensação no seu corpo' },
];

const PHASES = [
  { key: 'inhale', duration: 4000, label: 'Inspire', scale: 1.3, color: '#7dd3fc' },
  { key: 'hold1', duration: 4000, label: 'Segure', scale: 1.3, color: '#c084fc' },
  { key: 'exhale', duration: 4000, label: 'Expire', scale: 1, color: '#fca5a5' },
  { key: 'hold2', duration: 4000, label: 'Segure', scale: 1, color: '#c084fc' },
];

export default function PanicScreen() {
  const insets = useSafeAreaInsets();
  const [etapa, setEtapa] = useState('inicio');
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [groundingIndex, setGroundingIndex] = useState(0);
  const [intensidade, setIntensidade] = useState(5);
  const [historicoVisible, setHistoricoVisible] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [criseAtiva, setCriseAtiva] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const faseRef = useRef(0);
  const inicioCrise = useRef(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(d => {
      if (d) setRegistros(JSON.parse(d));
    });
  }, []);

  useEffect(() => {
    if (!running) return;
    let active = true;
    const timeouts = [];
    const intervals = [];

    const startPhase = (index) => {
      if (!active) return;
      const current = PHASES[index];
      setPhase(current.key);
      setTimeLeft(Math.ceil(current.duration / 1000));
      faseRef.current = index;

      Animated.timing(scaleAnim, {
        toValue: current.scale,
        duration: current.duration,
        useNativeDriver: true,
      }).start();

      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
      intervals.push(interval);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        const next = (index + 1) % PHASES.length;
        if (next === 0) {
          const ciclos = Math.floor(faseRef.current / PHASES.length) + 1;
          if (ciclos >= 4) {
            if (active) {
              setRunning(false);
              setPhase('idle');
              setEtapa('grounding');
              setGroundingIndex(0);
            }
            return;
          }
        }
        startPhase(next);
      }, current.duration);
      timeouts.push(timeout);
    };

    startPhase(0);

    return () => {
      active = false;
      intervals.forEach(clearInterval);
      timeouts.forEach(clearTimeout);
    };
  }, [running, scaleAnim]);

  const iniciarCrise = async () => {
    inicioCrise.current = Date.now();
    const novaCrise = {
      id: Date.now(),
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      duracao: 0,
      intensidade: 5,
      status: 'em_andamento',
    };
    setCriseAtiva(novaCrise);
    setIntensidade(5);
    setEtapa('respiracao');
    setRunning(true);
  };

  const avancarGrounding = () => {
    if (groundingIndex < GROUNDING_STEPS.length - 1) {
      setGroundingIndex(groundingIndex + 1);
    } else {
      finalizarCrise();
    }
  };

  const voltarGrounding = () => {
    if (groundingIndex > 0) setGroundingIndex(groundingIndex - 1);
  };

  const finalizarCrise = async () => {
    if (!criseAtiva) return;
    const duracao = Math.round((Date.now() - inicioCrise.current) / 60000);
    const registroFinal = {
      ...criseAtiva,
      duracao: duracao < 1 ? 1 : duracao,
      intensidade,
      status: 'concluida',
    };
    const existentes = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY) || '[]');
    const semAndamento = existentes.filter(r => r.id !== criseAtiva.id);
    semAndamento.unshift(registroFinal);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(semAndamento));
    setRegistros(semAndamento);
    setCriseAtiva(null);
    setEtapa('concluido');
  };

  useEffect(() => {
    return () => {
      if (criseAtiva && inicioCrise.current) {
        (async () => {
          const duracao = Math.round((Date.now() - inicioCrise.current) / 60000);
          const registro = { ...criseAtiva, duracao: duracao < 1 ? 1 : duracao, intensidade, status: 'interrompida' };
          const existentes = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY) || '[]');
          const semAndamento = existentes.filter(r => r.id !== criseAtiva.id);
          semAndamento.unshift(registro);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(semAndamento));
        })();
      }
    };
  }, [criseAtiva, intensidade]);

  const currentPhase = PHASES.find(p => p.key === phase);
  const phaseLabel = currentPhase ? currentPhase.label : '';
  const phaseColor = currentPhase ? currentPhase.color : '#7c4dff';

  return (
    <LinearGradient colors={['#0a0e27', '#1a1040']} style={{flex:1}}>
      <SafeAreaView style={{flex:1, paddingTop: insets.top + 8}}>
        {etapa === 'inicio' && (
          <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:24}}>
            <Text style={{fontSize:48, marginBottom:16}}>💜</Text>
            <Text style={{color:'#fff', fontSize:28, fontWeight:'bold', textAlign:'center', marginBottom:8}}>Controle de Crise</Text>
            <Text style={{color:'#cbd5e1', fontSize:16, textAlign:'center', marginBottom:40}}>Se estiver em crise, respire fundo e inicie o protocolo.</Text>
            <TouchableOpacity onPress={iniciarCrise} style={{backgroundColor:'#ef4444', paddingVertical:20, paddingHorizontal:40, borderRadius:40, alignItems:'center', marginBottom:20}}>
              <Text style={{fontSize:22, fontWeight:'bold', color:'#fff'}}>😰 Estou em crise</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setHistoricoVisible(true)} style={{backgroundColor:'rgba(255,255,255,0.08)', paddingVertical:14, paddingHorizontal:30, borderRadius:30, alignItems:'center'}}>
              <Text style={{color:'#7c4dff', fontSize:16}}>📊 Histórico de crises ({registros.length})</Text>
            </TouchableOpacity>
          </View>
        )}
        {etapa === 'respiracao' && (
          <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:24}}>
            <Text style={{color:'#fff', fontSize:18, marginBottom:20, textAlign:'center'}}>Respire comigo. Você está seguro.</Text>
            <View style={{width:180, height:180, borderRadius:90, justifyContent:'center', alignItems:'center', backgroundColor: phaseColor, marginBottom:20}}>
              <Animated.View style={{width:160, height:160, borderRadius:80, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.2)', transform:[{scale: scaleAnim}]}}>
                <Text style={{fontSize:24, fontWeight:'600', color:'#fff'}}>{phaseLabel}</Text>
                <Text style={{fontSize:36, fontWeight:'200', color:'#fff'}}>{running ? timeLeft : ''}</Text>
              </Animated.View>
            </View>
            <Text style={{color:'#cbd5e1', fontSize:14, textAlign:'center', marginBottom:10}}>Inspire 4s • Segure 4s • Expire 4s • Segure 4s</Text>
            <Text style={{color:'#cbd5e1', fontSize:12, textAlign:'center', marginBottom:30}}>Respiração quadrada</Text>
            <TouchableOpacity onPress={() => { setRunning(false); setPhase('idle'); setEtapa('grounding'); setGroundingIndex(0); }} style={{backgroundColor:'rgba(255,255,255,0.12)', paddingVertical:12, paddingHorizontal:30, borderRadius:30}}>
              <Text style={{color:'#fff', fontSize:14}}>Pular → Grounding</Text>
            </TouchableOpacity>
          </View>
        )}
        {etapa === 'grounding' && (
          <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:24}}>
            <Text style={{color:'#fff', fontSize:22, fontWeight:'bold', marginBottom:8}}>🧠 Técnica 5-4-3-2-1</Text>
            <Text style={{color:'#cbd5e1', fontSize:14, marginBottom:30, textAlign:'center'}}>Reconecte-se com o ambiente</Text>
            <View style={{backgroundColor:'rgba(255,255,255,0.08)', borderRadius:24, padding:30, alignItems:'center', width:'100%', marginBottom:20}}>
              <Text style={{fontSize:48, marginBottom:12}}>{['👁️','✋','👂','👃','🧠'][groundingIndex]}</Text>
              <Text style={{color:'#fff', fontSize:24, fontWeight:'bold', marginBottom:8}}>{GROUNDING_STEPS[groundingIndex].label}</Text>
              <Text style={{color:'#cbd5e1', fontSize:16, textAlign:'center'}}>{GROUNDING_STEPS[groundingIndex].desc}</Text>
            </View>
            <View style={{flexDirection:'row', gap:12}}>
              {groundingIndex > 0 && (
                <TouchableOpacity onPress={voltarGrounding} style={{backgroundColor:'rgba(255,255,255,0.08)', paddingVertical:14, paddingHorizontal:24, borderRadius:30}}>
                  <Text style={{color:'#fff', fontSize:16}}>← Voltar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={avancarGrounding} style={{backgroundColor:'#7c4dff', paddingVertical:14, paddingHorizontal:24, borderRadius:30}}>
                <Text style={{color:'#fff', fontSize:16}}>{groundingIndex < GROUNDING_STEPS.length - 1 ? 'Próximo →' : 'Finalizar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {etapa === 'concluido' && (
          <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:24}}>
            <Text style={{fontSize:64, marginBottom:16}}>💜</Text>
            <Text style={{color:'#fff', fontSize:28, fontWeight:'bold', textAlign:'center', marginBottom:8}}>Você conseguiu</Text>
            <Text style={{color:'#cbd5e1', fontSize:16, textAlign:'center', marginBottom:8}}>A crise está passando. Você está seguro.</Text>
            <Text style={{color:'#7c4dff', fontSize:14, marginBottom:30}}>Crise registrada automaticamente.</Text>
            <View style={{backgroundColor:'rgba(255,255,255,0.08)', borderRadius:16, padding:20, width:'100%', marginBottom:30}}>
              <Text style={{color:'#cbd5e1', marginBottom:8}}>Intensidade da crise:</Text>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                {[1,2,3,4,5,6,7,8,9,10].map(v => (
                  <TouchableOpacity key={v} onPress={() => setIntensidade(v)} style={{width:30, height:30, borderRadius:15, alignItems:'center', justifyContent:'center', backgroundColor: intensidade === v ? '#7c4dff' : 'rgba(255,255,255,0.08)'}}>
                    <Text style={{color:'#fff', fontSize:11}}>{v}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity onPress={finalizarCrise} style={{backgroundColor:'#7c4dff', paddingVertical:16, paddingHorizontal:40, borderRadius:30, marginBottom:12}}>
              <Text style={{color:'#fff', fontSize:18, fontWeight:'600'}}>Salvar intensidade e voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEtapa('inicio')} style={{backgroundColor:'rgba(255,255,255,0.08)', paddingVertical:12, paddingHorizontal:30, borderRadius:30}}>
              <Text style={{color:'rgba(255,255,255,0.6)', fontSize:14}}>Voltar ao início</Text>
            </TouchableOpacity>
          </View>
        )}
        <Modal visible={historicoVisible} transparent animationType="fade">
          <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.7)', justifyContent:'center', padding:24}}>
            <View style={{backgroundColor:'#1a1040', borderRadius:24, padding:24, maxHeight:'80%'}}>
              <Text style={{color:'#fff', fontSize:20, fontWeight:'bold', marginBottom:16}}>📊 Histórico de Crises</Text>
              {registros.length === 0 ? (
                <Text style={{color:'rgba(255,255,255,0.4)', textAlign:'center', marginVertical:30}}>Nenhum registro ainda.</Text>
              ) : (
                <ScrollView style={{maxHeight:400}}>
                  {registros.map(item => (
                    <View key={item.id} style={{backgroundColor:'rgba(255,255,255,0.06)', borderRadius:12, padding:12, marginBottom:8}}>
                      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <Text style={{color:'#fff', fontWeight:'600'}}>{item.data}</Text>
                        <Text style={{color:'#cbd5e1', fontSize:12}}>{item.hora}</Text>
                      </View>
                      <View style={{flexDirection:'row', marginTop:4, alignItems:'center'}}>
                        <Text style={{color:'#cbd5e1', marginRight:16}}>⏱ {item.duracao}min</Text>
                        <Text style={{color:'#cbd5e1', marginRight:16}}>Intensidade: {item.intensidade}/10</Text>
                        <Text style={{color: item.status === 'interrompida' ? '#f97316' : '#22c55e', fontSize:12}}>{item.status === 'interrompida' ? '⏹ Interrompida' : '✅ Concluída'}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}
              <TouchableOpacity onPress={() => setHistoricoVisible(false)} style={{backgroundColor:'rgba(255,255,255,0.08)', paddingVertical:12, borderRadius:30, alignItems:'center', marginTop:12}}>
                <Text style={{color:'#fff', fontSize:14}}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}