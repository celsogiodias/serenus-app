import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { auth } = useAuth();

  const login = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atencao', 'Preencha email e senha.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
    } catch (error) {
      let msg = 'Erro ao fazer login.';
      if (error.code === 'auth/user-not-found') msg = 'Usuario nao encontrado.';
      else if (error.code === 'auth/wrong-password') msg = 'Senha incorreta.';
      else if (error.code === 'auth/invalid-credential') msg = 'Email ou senha invalidos.';
      else if (error.code === 'auth/too-many-requests') msg = 'Muitas tentativas. Tente novamente mais tarde.';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <View style={styles.logoContainer}>
          <Ionicons name="moon" size={64} color="#9b59b6" />
          <Text style={styles.appNome}>Serenar</Text>
          <Text style={styles.appSubtitulo}>Bem-vindo de volta</Text>
        </View>

        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#666"
          value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <View style={styles.senhaContainer}>
          <TextInput style={[styles.input, { marginBottom: 0, flex: 1 }]}
            placeholder="Senha" placeholderTextColor="#666"
            value={senha} onChangeText={setSenha}
            secureTextEntry={!mostrarSenha} />
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)} style={styles.olho}>
            <Ionicons name={mostrarSenha ? 'eye-off' : 'eye'} size={22} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.botao, loading && styles.botaoDisabled]}
          onPress={login} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Entrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.linkTexto}>Nao tem conta? <Text style={styles.linkDestaque}>Cadastre-se</Text></Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a2e' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 48 },
  appNome: { color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 12 },
  appSubtitulo: { color: '#888', fontSize: 15, marginTop: 4 },
  input: { backgroundColor: '#2a1a3e', borderRadius: 12, padding: 16, color: '#fff', fontSize: 16, marginBottom: 16 },
  senhaContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  olho: { padding: 12, marginLeft: -48 },
  botao: { backgroundColor: '#9b59b6', padding: 16, borderRadius: 12, alignItems: 'center' },
  botaoDisabled: { opacity: 0.6 },
  botaoTexto: { color: '#fff', fontSize: 17, fontWeight: '600' },
  link: { marginTop: 24, alignItems: 'center' },
  linkTexto: { color: '#888', fontSize: 14 },
  linkDestaque: { color: '#9b59b6', fontWeight: '600' }
});