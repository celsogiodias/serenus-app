import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function HomeScreen({ navigation }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) return 'Boa madrugada, Celso';
    if (hour >= 6 && hour < 12) return 'Bom dia, Celso';
    if (hour >= 12 && hour < 18) return 'Boa tarde, Celso';
    return 'Boa noite, Celso';
  };

  const handleCheckIn = () => {
    Alert.alert('Check-in noturno', 'Como você está se sentindo?');
  };

  const cards = [
    {
      icon: '🌙',
      title: 'Check-in Noturno',
      subtitle: 'Registre como está se sentindo agora',
      onPress: handleCheckIn,
    },
    {
      icon: '🧘',
      title: 'Exercício de Respiração',
      subtitle: 'Técnica 4-7-8 para relaxar',
      onPress: () => navigation.navigate('Breathing'),
    },
    {
      icon: '📝',
      title: 'Diário do Sono',
      subtitle: 'Registre como foi sua noite',
      onPress: () => navigation.navigate('Diary'),
    },
  ];

  return (
    <LinearGradient
      colors={['#0a0e27', '#1a1040']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.title}>Noite Serena</Text>
          <Text style={styles.subtitle}>
            Sua jornada de relaxamento começa aqui
          </Text>

          <View style={styles.cardsContainer}>
            {cards.map((card, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={card.onPress}
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
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  greeting: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 10,
    opacity: 0.9,
  },
  title: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 30,
    opacity: 0.8,
  },
  cardsContainer: {
    marginTop: 10,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardSubtitle: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.7,
  },
});

export default HomeScreen;