import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@Serenar_user_data';
const FALLBACK_KEY = '@serenus_user_data';

export default function EmergencyScreen() {
  const insets = useSafeAreaInsets();
  const [nome, setNome] = useState('');
  const [tel, setTel] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadEmergencyContact(); }, []);

  const loadEmergencyContact = async () => {
    try {
      let raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) raw = await AsyncStorage.getItem(FALLBACK_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.emergenciaNome) setNome(String(data.emergenciaNome));
        if (data.emergenciaTel) setTel(String(data.emergenciaTel));
      }
    } catch (e) {}
  };

  const handleSave = async () => {
    if (!nome.trim() || !tel.trim()) {
      Alert.alert('Atencao', 'Preencha o nome e o telefone do contato.');
      return;
    }
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) : {};
      const updated = { ...existing, emergenciaNome: nome.trim(), emergenciaTel: tel.trim() };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSaved(true);
      Alert.alert('Sucesso', 'Contato de emergencia salvo.');
    } catch (e) {
      Alert.alert('Erro', 'Nao foi possivel salvar.');
    }
  };

  const ligarWhatsApp = async () => {
    const cleanTel = tel.replace(/\D/g, '');
    if (!cleanTel) return;
    const msg = encodeURIComponent(`Ola ${nome.trim()}, estou precisando de ajuda. (Enviado pelo Serenar)`);
    await Linking.openURL(`https://wa.me/55${cleanTel}?text=${msg}`);
  };

  return (
    <LinearGradient colors={['#0a0e27', '#1a1040']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 16 }}>
            <Text style={{ fontSize: 26, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 8 }}>🚨 Emergencia</Text>
            <Text style={{ fontSize: 16, color: '#b0b0c3', textAlign: 'center', marginBottom: 24 }}>
              Cadastre quem voce quer acionar em caso de crise
            </Text>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#d0d0e0', fontSize: 14, marginBottom: 8, fontWeight: '600' }}>Nome do contato</Text>
              <TextInput style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 14, color: '#fff', fontSize: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' }}
                placeholder="Nome da pessoa" placeholderTextColor="#888"
                value={nome} onChangeText={setNome} autoCapitalize="words" />
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: '#d0d0e0', fontSize: 14, marginBottom: 8, fontWeight: '600' }}>Telefone</Text>
              <TextInput style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 14, color: '#fff', fontSize: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' }}
                placeholder="(11) 99999-9999" placeholderTextColor="#888"
                value={tel} onChangeText={setTel} keyboardType="phone-pad" />
            </View>

            <TouchableOpacity onPress={handleSave} style={{ backgroundColor: '#4f46e5', borderRadius: 12, paddingVertical: 16, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Salvar Contato</Text>
            </TouchableOpacity>

            {saved && (
              <View style={{ marginTop: 24, alignItems: 'center' }}>
                <Text style={{ color: '#4ade80', fontSize: 15, marginBottom: 12, textAlign: 'center' }}>
                  Contato de emergencia salvo!
                </Text>
                <TouchableOpacity onPress={ligarWhatsApp} style={{ backgroundColor: '#25D366', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>📞 Ligar para {nome.trim()} no WhatsApp</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}