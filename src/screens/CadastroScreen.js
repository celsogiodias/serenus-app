import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { auth } = useAuth();

  const cadastrar = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (senha.length &lt; 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não conferem.');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), senha);
    } catch (error) {
      let msg = 'Erro ao cadastrar.';
      if (error.code === 'auth/email-already-in-use') msg = 'Este email já está em uso.';
      else if (error.code === 'auth/invalid-email') msg = 'Email inválido.';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        <View style={styles.logoContainer}>
          <Ionicons name="moon" size={48} color="#9b59b6" />
          <Text style={styles.appNome}>Criar Conta</Text>
          <Text style={styles.appSubtitulo}>Noite Serena</Text>
        </View>

        <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#666"
          value={nome} onChangeText={setNome} />

        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#666"
          value={email} onChangeText={setEmail} keyboardType="email-address"
          autoCapitalize="none" />

        <View style={styles.senhaContainer}>
          <TextInput style={[styles.input, { marginBottom: 0, flex: 1 }]}
            placeholder="Senha (mín. 6 caracteres)" placeholderTextColor="#666"
            value={senha} onChangeText={setSenha}
            secureTextEntry={!mostrarSenha} />
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}
            style={styles.olho}>
            <Ionicons name={mostrarSenha ? 'eye-off' : 'eye'} size={22} color="#666" />
          </TouchableOpacity>
        </View>

        <TextInput style={styles.input} placeholder="Confirmar senha" placeholderTextColor="#666"
          value={confirmarSenha} onChangeText={setConfirmarSenha}
          secureTextEntry={!mostrarSenha} />

        <TouchableOpacity style={[styles.botao, loading && styles.botaoDisabled]}
          onPress={cadastrar} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>Criar conta</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => navigation.goBack()}>
          <Text style={styles.linkTexto}>Já tem conta? <Text style={styles.linkDestaque}>Fazer login</Text></Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a2e' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  appNome: { color: '#fff', fontSize: 24, fontWeight: '700', marginTop: 8 },
  appSubtitulo: { color: '#888', fontSize: 14, marginTop: 4 },
  input: {
    backgroundColor: '#2a1a3e', borderRadius: 12, padding: 16,
    color: '#fff', fontSize: 16, marginBottom: 14
  },
  senhaContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  olho: { padding: 12, marginLeft: -48 },
  botao: { backgroundColor: '#9b59b6', padding: 16, borderRadius: 12, alignItems: 'center' },
  botaoDisabled: { opacity: 0.6 },
  botaoTexto: { color: '#fff', fontSize: 17, fontWeight: '600' },
  link: { marginTop: 24, alignItems: 'center' },
  linkTexto: { color: '#888', fontSize: 14 },
  linkDestaque: { color: '#9b59b6', fontWeight: '600' }
});
