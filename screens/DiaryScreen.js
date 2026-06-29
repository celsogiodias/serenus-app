import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STORAGE_KEY = '@noite_serena_diary';

export default function DiaryScreen() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [texto, setTexto] = useState('');
  const [humor, setHumor] = useState(3);
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(d => {
      if (d) setRegistros(JSON.parse(d));
    });
  }, []);

  const salvar = async () => {
    if (!texto.trim()) return;
    const registro = {
      id: Date.now(),
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      texto: texto.trim(),
      humor,
    };
    const existentes = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY) || '[]');
    existentes.unshift(registro);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existentes));
    setRegistros(existentes);
    setTexto('');
    setHumor(3);
    setModalVisible(false);
  };

  const emojiHumor = (v) => ['😫', '😟', '😐', '🙂', '😄'][v - 1];

  return (
    <LinearGradient colors={['#0a0e27', '#1a1040']} style={{flex:1}}>
      <SafeAreaView style={{flex:1, paddingTop: insets.top + 8}}>
        <ScrollView contentContainerStyle={{padding:20}}>
          <Text style={{color:'#fff', fontSize:22, fontWeight:'bold', marginBottom:6}}>📝 Diário do Sono</Text>
          <Text style={{color:'#cbd5e1', fontSize:14, marginBottom:20}}>Registre como foi sua noite</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}
            style={{backgroundColor:'rgba(255,255,255,0.08)', borderRadius:16, padding:16, alignItems:'center', marginBottom:20}}>
            <Text style={{color:'#7c4dff', fontSize:16}}>+ Novo registro</Text>
          </TouchableOpacity>
          {registros.map(item => (
            <View key={item.id} style={{backgroundColor:'rgba(255,255,255,0.06)', borderRadius:12, padding:14, marginBottom:10}}>
              <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:6}}>
                <Text style={{color:'#fff', fontWeight:'600'}}>{item.data}</Text>
                <Text style={{color:'#cbd5e1', fontSize:12}}>{item.hora} {emojiHumor(item.humor)}</Text>
              </View>
              <Text style={{color:'#cbd5e1', fontSize:14, lineHeight:20}}>{item.texto}</Text>
            </View>
          ))}
        </ScrollView>
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.7)', justifyContent:'center', padding:24}}>
            <View style={{backgroundColor:'#1a1040', borderRadius:24, padding:24}}>
              <Text style={{color:'#fff', fontSize:20, fontWeight:'bold', marginBottom:16}}>Novo registro</Text>
              <TextInput value={texto} onChangeText={setTexto} placeholder="Como foi sua noite?" placeholderTextColor="rgba(255,255,255,0.3)" multiline style={{backgroundColor:'rgba(255,255,255,0.06)', borderRadius:12, padding:14, color:'#fff', fontSize:15, minHeight:100, marginBottom:16, textAlignVertical:'top'}} />
              <Text style={{color:'#cbd5e1', marginBottom:8}}>Humor: {emojiHumor(humor)}</Text>
              <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:20}}>
                {[1,2,3,4,5].map(v => (
                  <TouchableOpacity key={v} onPress={() => setHumor(v)}
                    style={{width:50, height:50, borderRadius:25, alignItems:'center', justifyContent:'center', backgroundColor: humor === v ? '#7c4dff' : 'rgba(255,255,255,0.08)'}}>
                    <Text style={{fontSize:22}}>{emojiHumor(v)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={salvar} style={{backgroundColor:'#7c4dff', paddingVertical:14, borderRadius:30, alignItems:'center', marginBottom:10}}>
                <Text style={{color:'#fff', fontSize:16, fontWeight:'600'}}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{alignItems:'center'}}>
                <Text style={{color:'rgba(255,255,255,0.5)', fontSize:14}}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}