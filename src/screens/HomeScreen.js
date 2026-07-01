import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia, Celso';
  if (hour < 18) return 'Boa tarde, Celso';
  return 'Boa noite, Celso';
};

const cards = [
  { icon: '🧘', title: 'Respiração', subtitle: 'Técnica 4-7-8', route: 'Breathing' },
  { icon: '🧠', title: 'Mindfulness', subtitle: 'Atenção plena guiada', route: 'Mindfulness' },
  { icon: '🎵', title: 'Musicoterapia', subtitle: 'Sons terapêuticos + 8D', route: 'Music' },
  { icon: '🧠', title: 'Controle de Estresse', subtitle: 'Técnicas TCC + diálogo socrático', route: 'StressControl' },
  { icon: '🆘', title: 'Crise de Ansiedade', subtitle: 'Respiração + grounding + histórico', route: 'Panic' },
  { icon: '🎯', title: 'Ferramentas TDAH', subtitle: 'Pensamentos, atraso, tarefas', route: 'Tdah' },
  { icon: '📝', title: 'Diário do Sono', subtitle: 'Registre sua noite', route: 'Diary' },
  { icon: '⚙️', title: 'Configurações', subtitle: 'Dados e contatos', route: 'Settings' },
  { icon: '👤', title: 'Perfil', subtitle: 'Sua conta', route: 'Perfil' },
];

const HomeScreen = ({ navigation }) => {
  const greeting = getGreeting();

  return (
    <LinearGradient
      colors={['#0a0e27', '#1a1040']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.title}>Serenar</Text>
          <Text style={styles.subtitle}>Sua jornada de relaxamento e foco</Text>

          <View style={styles.cardsContainer}>
            {cards.map((card, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => navigation.navigate(card.route)}
                activeOpacity={0.8}
              >
                <Text style={styles.cardIcon}>{card.icon}</Text>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  container: { padding: 20 },
  greeting: { color: 'white', fontSize: 18, marginBottom: 10 },
  title: { color: 'white', fontSize: 36, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { color: 'white', fontSize: 16, opacity: 0.8, marginBottom: 30 },
  cardsContainer: { marginTop: 10 },
  card: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 20, marginBottom: 15 },
  cardIcon: { fontSize: 32, marginBottom: 10 },
  cardTitle: { color: 'white', fontSize: 20, fontWeight: '600', marginBottom: 6 },
  cardSubtitle: { color: 'white', fontSize: 14, opacity: 0.7 },
});

export default HomeScreen;
