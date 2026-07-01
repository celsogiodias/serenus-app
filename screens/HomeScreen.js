import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CARDS = [
  { title: '🧠 Controle de Estresse', subtitle: 'Técnicas TCC', screen: 'StressControl' },
  { title: '📝 Diário do Sono', subtitle: 'Registre sua noite', screen: 'Diary' },
  {
    title: '🚨 Emergência',
    subtitle: 'Contato rápido',
    icon: '🚨',
    color: '#ef4444',
    action: 'emergencia',
  },
  { title: '🎵 Músicas', subtitle: 'Terapia sonora', screen: 'Music' },
  { title: '🟠 Pânico', subtitle: 'Crises registradas', screen: 'Panic' },
  { title: '⚙️ Ajustes', subtitle: 'Configurações', screen: 'Settings' },
];

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const handleEmergencia = async () => {
    try {
      const dados = JSON.parse(await AsyncStorage.getItem('@serenus_user_data') || '{}');
      if (dados.emergenciaTel) {
        const tel = dados.emergenciaTel.replace(/\D/g, '');
        const msg = encodeURIComponent(`Olá ${dados.emergenciaNome || 'socorro'}, estou precisando de ajuda. (Enviado pelo Serenus)`);
        Linking.openURL(`https://wa.me/55${tel}?text=${msg}`);
      } else {
        navigation.navigate('Settings');
      }
    } catch (e) {
      navigation.navigate('Settings');
    }
  };

  return (
    <LinearGradient colors={['#9b72cf', '#0a1628']} style={{flex:1}}>
      <SafeAreaView style={{flex:1, paddingTop: insets.top + 8}}>
        <ScrollView contentContainerStyle={{padding:20}}>
          <Text style={{color:'#fff', fontSize:28, fontWeight:'bold', textAlign:'center', marginBottom:4}}>Serenus</Text>
          <Text style={{color:'rgba(255,255,255,0.5)', fontSize:14, textAlign:'center', marginBottom:30}}>Sua plataforma de bem-estar</Text>
          <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between'}}>
            {CARDS.map((item, index) => {
              const isEmergencia = item.action === 'emergencia';
              return (
                <TouchableOpacity
                  key={index}
                  onPress={isEmergencia ? handleEmergencia : () => navigation.navigate(item.screen)}
                  activeOpacity={0.8}
                  style={{
                    width: '48%',
                    backgroundColor: isEmergencia
                      ? 'rgba(239,68,68,0.15)'
                      : item.title.includes('Pânico')
                      ? 'rgba(251,146,60,0.35)'
                      : 'rgba(255,255,255,0.06)',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 14,
                    borderWidth: 1,
                    borderColor: isEmergencia
                      ? 'rgba(239,68,68,0.3)'
                      : item.title.includes('Pânico')
                      ? 'rgba(251,146,60,0.7)'
                      : 'rgba(155,114,207,0.2)',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{fontSize:36, marginBottom:10}}>{item.icon || item.title.split(' ')[0]}</Text>
                  <Text style={{color:'#fff', fontSize:15, fontWeight:'600', textAlign:'center'}}>{item.title}</Text>
                  <Text style={{color:'rgba(255,255,255,0.4)', fontSize:12, textAlign:'center', marginTop:4}}>{item.subtitle}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}