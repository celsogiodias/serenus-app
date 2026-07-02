import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@serenar_user_data';
const CLEAR_KEYS = ['@serenar_diary', '@serenar_panic'];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [userData, setUserData] = useState({
    nome: '',
    dataNascimento: '',
    planoSaude: '',
    psicologoNome: '',
    psicologoTel: '',
    psiquiatraNome: '',
    psiquiatraTel: '',
    emergenciaNome: '',
    emergenciaTel: '',
  });
  const [salvo, setSalvo] = useState(false);
  const [totalRegistros, setTotalRegistros] = useState(0);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const dados = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY) || '{}');
      if (dados.nome) setUserData(dados);
      const diary = JSON.parse(await AsyncStorage.getItem('@noite_serena_diary') || '[]');
      const panic = JSON.parse(await AsyncStorage.getItem('@noite_serena_panic') || '[]');
      setTotalRegistros(diary.length + panic.length);
    } catch (e) {}
  };

  const salvarDados = async () => {
    if (!userData.nome.trim()) {
      Alert.alert('Atenção', 'O nome é obrigatório.');
      return;
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  const limparDados = () => {
    Alert.alert('Limpar dados', 'Isso apagará todo o histórico de diário e crises.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: async () => {
        for (const key of CLEAR_KEYS) await AsyncStorage.removeItem(key);
        setTotalRegistros(0);
        Alert.alert('Pronto', 'Dados limpos.');
      }},
    ]);
  };

  const ligarEmergencia = () => {
    if (!userData.emergenciaTel) {
      Alert.alert('Sem contato', 'Cadastre um contato de emergência primeiro.');
      return;
    }
    const tel = userData.emergenciaTel.replace(/\D/g, '');
    const msg = encodeURIComponent(`Olá ${userData.emergenciaNome}, estou precisando de ajuda. (Enviado pelo Serenus)`);
    Linking.openURL(`https://wa.me/55${tel}?text=${msg}`);
  };

  const ligarProfissional = (nome, tel) => {
    if (!tel) return;
    const t = tel.replace(/\D/g, '');
    const msg = encodeURIComponent(`Olá ${nome}, estou precisando de suporte. (Enviado pelo Serenus)`);
    Linking.openURL(`https://wa.me/55${t}?text=${msg}`);
  };

  const atualizar = (campo, valor) => {
    setUserData(prev => ({ ...prev, [campo]: valor }));
  };

  return (
    <LinearGradient colors={['#0a0e27', '#1a1040']} style={{flex:1}}>
      <SafeAreaView style={{flex:1, paddingTop: insets.top + 8}}>
        <ScrollView contentContainerStyle={{padding:20}}>
          <Text style={{color:'#fff', fontSize:22, fontWeight:'bold', marginBottom:4}}>⚙️ Ajustes</Text>
          <Text style={{color:'#cbd5e1', fontSize:14, marginBottom:20}}>Seus dados ficam salvos apenas no seu celular.</Text>

          {/* Dados Pessoais */}
          <View style={{backgroundColor:'rgba(255,255,255,0.06)', borderRadius:16, padding:16, marginBottom:16}}>
            <Text style={{color:'#fff', fontSize:16, fontWeight:'600', marginBottom:12}}>👤 Dados Pessoais</Text>
            <Campo label="Nome *" value={userData.nome} onChange={v => atualizar('nome', v)} placeholder="Seu nome" />
            <Campo label="Data de nascimento" value={userData.dataNascimento} onChange={v => atualizar('dataNascimento', v)} placeholder="DD/MM/AAAA" />
            <Campo label="Plano de saúde" value={userData.planoSaude} onChange={v => atualizar('planoSaude', v)} placeholder="Qual plano?" />
          </View>

          {/* Profissionais */}
          <View style={{backgroundColor:'rgba(255,255,255,0.06)', borderRadius:16, padding:16, marginBottom:16}}>
            <Text style={{color:'#fff', fontSize:16, fontWeight:'600', marginBottom:12}}>🧑‍⚕️ Profissionais</Text>
            <Campo label="Psicólogo(a)" value={userData.psicologoNome} onChange={v => atualizar('psicologoNome', v)} placeholder="Nome" />
            <Campo label="Telefone" value={userData.psicologoTel} onChange={v => atualizar('psicologoTel', v)} placeholder="(11) 99999-9999" />
            {userData.psicologoTel ? (
              <TouchableOpacity onPress={() => ligarProfissional(userData.psicologoNome || 'Psicólogo', userData.psicologoTel)} style={{marginTop:6}}>
                <Text style={{color:'#22c55e', fontSize:13}}>📱 Chamar no WhatsApp</Text>
              </TouchableOpacity>
            ) : null}
            <View style={{height:12}} />
            <Campo label="Psiquiatra" value={userData.psiquiatraNome} onChange={v => atualizar('psiquiatraNome', v)} placeholder="Nome" />
            <Campo label="Telefone" value={userData.psiquiatraTel} onChange={v => atualizar('psiquiatraTel', v)} placeholder="(11) 99999-9999" />
            {userData.psiquiatraTel ? (
              <TouchableOpacity onPress={() => ligarProfissional(userData.psiquiatraNome || 'Psiquiatra', userData.psiquiatraTel)} style={{marginTop:6}}>
                <Text style={{color:'#22c55e', fontSize:13}}>📱 Chamar no WhatsApp</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Emergência */}
          <View style={{backgroundColor:'rgba(255,255,255,0.06)', borderRadius:16, padding:16, marginBottom:16}}>
            <Text style={{color:'#fff', fontSize:16, fontWeight:'600', marginBottom:12}}>🚨 Contato de Emergência</Text>
            <Campo label="Nome" value={userData.emergenciaNome} onChange={v => atualizar('emergenciaNome', v)} placeholder="Nome da pessoa" />
            <Campo label="Telefone" value={userData.emergenciaTel} onChange={v => atualizar('emergenciaTel', v)} placeholder="(11) 99999-9999" />
            {userData.emergenciaTel ? (
              <TouchableOpacity onPress={ligarEmergencia} style={{backgroundColor:'#ef4444', paddingVertical:12, borderRadius:30, alignItems:'center', marginTop:10}}>
                <Text style={{color:'#fff', fontSize:15, fontWeight:'600'}}>📞 Ligar agora</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Salvar */}
          <TouchableOpacity onPress={salvarDados} style={{backgroundColor:'#7c4dff', paddingVertical:14, borderRadius:30, alignItems:'center', marginBottom:16}}>
            <Text style={{color:'#fff', fontSize:16, fontWeight:'600'}}>{salvo ? '✅ Salvo!' : '💾 Salvar dados'}</Text>
          </TouchableOpacity>

          {/* Estatísticas */}
          <View style={{backgroundColor:'rgba(255,255,255,0.06)', borderRadius:16, padding:16, marginBottom:16}}>
            <Text style={{color:'#fff', fontSize:16, fontWeight:'600', marginBottom:12}}>📊 Estatísticas</Text>
            <View style={{flexDirection:'row', justifyContent:'space-between', paddingVertical:8}}>
              <Text style={{color:'#cbd5e1'}}>Total de registros</Text>
              <Text style={{color:'#fff', fontWeight:'600'}}>{totalRegistros}</Text>
            </View>
          </View>

          {/* Limpar */}
          <TouchableOpacity onPress={limparDados} style={{backgroundColor:'rgba(239,68,68,0.12)', paddingVertical:12, borderRadius:30, alignItems:'center', marginBottom:16}}>
            <Text style={{color:'#ef4444', fontSize:14}}>🗑️ Limpar todos os dados</Text>
          </TouchableOpacity>

          {/* Sobre */}
          <View style={{backgroundColor:'rgba(255,255,255,0.06)', borderRadius:16, padding:16, marginBottom:16}}>
            <Text style={{color:'#fff', fontSize:16, fontWeight:'600', marginBottom:12}}>ℹ️ Sobre</Text>
            <Text style={{color:'#cbd5e1'}}>Serenus v1.0.0</Text>
            <Text style={{color:'#cbd5e1', marginTop:4}}>Plataforma Multi-Crises</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function Campo({ label, value, onChange, placeholder }) {
  return (
    <View style={{marginBottom:8}}>
      <Text style={{color:'rgba(255,255,255,0.5)', fontSize:11, marginBottom:2}}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="rgba(255,255,255,0.2)" style={{backgroundColor:'rgba(255,255,255,0.06)', borderRadius:10, padding:10, color:'#fff', fontSize:14}} />
    </View>
  );
}