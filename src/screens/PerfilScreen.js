import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function PerfilScreen() {
  const { user, logout } = useAuth();

  const confirmarLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color="#9b59b6" />
        </View>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={20} color="#2ecc71" />
          <Text style={styles.infoTexto}>Conta verificada via email</Text>
        </View>

        <TouchableOpacity style={styles.botao} onPress={confirmarLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.botaoTexto}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a2e' },
  content: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2a1a3e', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  email: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  infoCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#2a1a3e',
    padding: 14, borderRadius: 10, gap: 8, marginVertical: 24
  },
  infoTexto: { color: '#ccc', fontSize: 14 },
  botao: {
    flexDirection: 'row', backgroundColor: '#e74c3c', padding: 14, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 32
  },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
