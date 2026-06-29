import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PHASES = [
  { key: 'inhale', duration: 4000, label: 'Inspire', scale: 1.3, color: '#7dd3fc' },
  { key: 'hold', duration: 7000, label: 'Segure', scale: 1.3, color: '#c084fc' },
  { key: 'exhale', duration: 8000, label: 'Expire', scale: 1, color: '#fca5a5' },
];

export default function BreathingScreen() {
  const insets = useSafeAreaInsets();
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const faseRef = useRef(0);

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
            if (active) { setRunning(false); setPhase('idle'); }
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

  const currentPhase = PHASES.find(p => p.key === phase);
  const phaseLabel = currentPhase ? currentPhase.label : '';
  const phaseColor = currentPhase ? currentPhase.color : '#7c4dff';

  return (
    <LinearGradient colors={['#0a0e27', '#1a1040']} style={{flex:1}}>
      <SafeAreaView style={{flex:1, paddingTop: insets.top + 8}}>
        <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:24}}>
          <Text style={{color:'#fff', fontSize:22, fontWeight:'bold', marginBottom:8}}>🧘 Respiração 4-7-8</Text>
          <Text style={{color:'#cbd5e1', fontSize:14, marginBottom:40, textAlign:'center'}}>
            Inspire 4s • Segure 7s • Expire 8s
          </Text>
          <View style={{width:200, height:200, borderRadius:100, justifyContent:'center', alignItems:'center', backgroundColor: phaseColor, marginBottom:30}}>
            <Animated.View style={{width:180, height:180, borderRadius:90, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.2)', transform:[{scale: scaleAnim}]}}>
              <Text style={{fontSize:28, fontWeight:'600', color:'#fff'}}>{phaseLabel}</Text>
              <Text style={{fontSize:48, fontWeight:'200', color:'#fff'}}>{running ? timeLeft : ''}</Text>
            </Animated.View>
          </View>
          <TouchableOpacity onPress={() => { setRunning(!running); if (!running) setPhase('inhale'); }}
            style={{backgroundColor:'#7c4dff', paddingVertical:16, paddingHorizontal:48, borderRadius:30}}>
            <Text style={{color:'#fff', fontSize:18, fontWeight:'600'}}>{running ? 'Parar' : 'Iniciar'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}