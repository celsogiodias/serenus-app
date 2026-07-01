import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StressControlScreen = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const [respostas, setRespostas] = useState({
    1: '',
    2: null,
    3: '',
    4: '',
  });

  const totalSteps = 4;
  const isComplete = step === totalSteps;

  const updateResposta = (key, value) => {
    setRespostas((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const reset = () => {
    setRespostas({ 1: '', 2: null, 3: '', 4: '' });
    setStep(0);
  };

  const canProceed = () => {
    if (step === 0) return respostas[1].trim().length > 0;
    if (step === 1) return respostas[2] !== null;
    if (step === 2) return respostas[3].trim().length > 0;
    if (step === 3) return respostas[4].trim().length > 0;
    return true;
  };

  const renderProgress = () => (
    <View style={styles.progressContainer}>
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const isCurrent = idx === step;
        const isDone = idx < step;
        return (
          <View key={idx} style={styles.progressStep}>
            <View
              style={[
                styles.progressDot,
                isCurrent && styles.progressDotCurrent,
                isDone && styles.progressDotDone,
              ]}
            />
            {idx < totalSteps - 1 && (
              <View style={[styles.progressLine, isDone && styles.progressLineDone]} />
            )}
          </View>
        );
      })}
    </View>
  );

  const renderScale = () => (
    <View style={styles.scaleContainer}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
        const selected = respostas[2] === num;
        return (
          <TouchableOpacity
            key={num}
            style={[styles.scaleButton, selected && styles.scaleButtonSelected]}
            onPress={() => updateResposta(2, num)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.scaleButtonText,
                selected && styles.scaleButtonTextSelected,
              ]}
            >
              {num}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderQuestion = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>
              O que passou pela sua cabeça agora?
            </Text>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Ex: Não vou conseguir fazer isso..."
              placeholderTextColor="#666"
              value={respostas[1]}
              onChangeText={(text) => updateResposta(1, text)}
              textAlignVertical="top"
              maxLength={500}
            />
          </View>
        );
      case 1:
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>
              De 0 a 10, o quanto você acredita nesse pensamento?
            </Text>
            {renderScale()}
            <Text style={styles.scaleLabel}>
              {respostas[2] !== null
                ? `Intensidade: ${respostas[2]}/10`
                : 'Toque no nÃºmero para selecionar'}
            </Text>
          </View>
        );
      case 2:
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>
              Se um amigo tivesse esse pensamento, o que você diria a ele?
            </Text>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Ex: Você já fez coisas difíceis antes..."
              placeholderTextColor="#666"
              value={respostas[3]}
              onChangeText={(text) => updateResposta(3, text)}
              textAlignVertical="top"
              maxLength={500}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>Ponto de vista socrático</Text>

            <View style={styles.originalThoughtCard}>
              <Text style={styles.originalThoughtLabel}>
                Seu pensamento original:
              </Text>
              <Text style={styles.originalThoughtText}>
                "{respostas[1] || 'â€”'}"
              </Text>
            </View>

            <Text style={styles.questionSubTitle}>
              Agora, com base na sua reflexão, escreva uma forma mais equilibrada de pensar:
            </Text>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Ex: Posso tentar fazer o meu melhor, mesmo que não saia perfeito."
              placeholderTextColor="#666"
              value={respostas[4]}
              onChangeText={(text) => updateResposta(4, text)}
              textAlignVertical="top"
              maxLength={500}
            />

            <View style={styles.tipBox}>
              <Text style={styles.tipTitle}>Distorções cognitivas comuns:</Text>
              <Text style={styles.tipText}>
                Tudo ou nada â€¢ Catastrofização â€¢ Leitura mental â€¢ Personalização â€¢ Deveria/deve
              </Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const renderComplete = () => (
    <ScrollView contentContainerStyle={styles.completeContent}>
      <Ionicons name="checkmark-circle" size={80} color="#9b59b6" style={styles.checkIcon} />
      <Text style={styles.completeTitle}>Reflexão concluída</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Pensamento original:</Text>
        <Text style={styles.summaryText}>{respostas[1]}</Text>

        <Text style={styles.summaryLabel}>Crença: {respostas[2]}/10</Text>

        <Text style={styles.summaryLabel}>O que diria a um amigo:</Text>
        <Text style={styles.summaryText}>{respostas[3]}</Text>

        <Text style={styles.summaryLabel}>Pensamento equilibrado:</Text>
        <Text style={[styles.summaryText, styles.balancedThought]}>
          {respostas[4]}
        </Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={reset} activeOpacity={0.8}>
        <Text style={styles.primaryButtonText}>Fazer outra reflexão</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  if (isComplete) {
    return (
      <SafeAreaView style={styles.container}>
        {renderComplete()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack?.()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reestruturação Cognitiva</Text>
          <View style={styles.backButton} />
        </View>

        {renderProgress()}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {renderQuestion()}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.secondaryButton, styles.footerButton, step === 0 && styles.disabledButton]}
            onPress={handleBack}
            disabled={step === 0}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryButton, styles.footerButton, !canProceed() && styles.disabledButton]}
            onPress={handleNext}
            disabled={!canProceed()}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              {step === totalSteps - 1 ? 'Concluir' : 'Próxima'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a2e' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center', flex: 1 },
  progressContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32, paddingVertical: 16,
  },
  progressStep: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' },
  progressDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#666' },
  progressDotCurrent: { backgroundColor: '#9b59b6', width: 18, height: 18, borderRadius: 9 },
  progressDotDone: { backgroundColor: '#9b59b6' },
  progressLine: { flex: 1, height: 2, backgroundColor: '#666', marginHorizontal: 4 },
  progressLineDone: { backgroundColor: '#9b59b6' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, flexGrow: 1 },
  questionContainer: { backgroundColor: '#2a1a3e', borderRadius: 16, padding: 20, marginTop: 8 },
  questionTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 16, lineHeight: 28 },
  questionSubTitle: { color: '#fff', fontSize: 16, fontWeight: '500', marginTop: 16, marginBottom: 12, lineHeight: 24 },
  input: {
    backgroundColor: '#1a0a2e', color: '#fff', borderRadius: 12, borderWidth: 1,
    borderColor: '#9b59b6', padding: 16, minHeight: 120, fontSize: 16, textAlignVertical: 'top',
  },
  scaleContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 },
  scaleButton: {
    width: '18%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#1a0a2e', borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#666',
  },
  scaleButtonSelected: { backgroundColor: '#9b59b6', borderColor: '#9b59b6' },
  scaleButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  scaleButtonTextSelected: { color: '#fff', fontWeight: '700' },
  scaleLabel: { color: '#666', fontSize: 14, textAlign: 'center', marginTop: 4 },
  originalThoughtCard: {
    backgroundColor: '#1a0a2e', borderRadius: 12, padding: 16,
    borderLeftWidth: 4, borderLeftColor: '#9b59b6', marginBottom: 8,
  },
  originalThoughtLabel: { color: '#9b59b6', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  originalThoughtText: { color: '#fff', fontSize: 16, fontStyle: 'italic', lineHeight: 22 },
  tipBox: {
    backgroundColor: '#1a0a2e', borderRadius: 12, padding: 16, marginTop: 16,
    borderLeftWidth: 4, borderLeftColor: '#9b59b6',
  },
  tipTitle: { color: '#9b59b6', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  tipText: { color: '#fff', fontSize: 14, lineHeight: 22 },
  footer: { flexDirection: 'row', padding: 16, paddingBottom: 24 },
  footerButton: { flex: 1 },
  primaryButton: { backgroundColor: '#9b59b6', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryButton: {
    backgroundColor: 'transparent', borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#9b59b6', marginRight: 12,
  },
  secondaryButtonText: { color: '#9b59b6', fontSize: 16, fontWeight: '700' },
  disabledButton: { opacity: 0.4 },
  completeContent: { padding: 20, alignItems: 'center', flexGrow: 1, justifyContent: 'center' },
  checkIcon: { marginBottom: 16 },
  completeTitle: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 24 },
  summaryCard: { backgroundColor: '#2a1a3e', borderRadius: 16, padding: 20, width: '100%', marginBottom: 24 },
  summaryLabel: { color: '#9b59b6', fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 4 },
  summaryText: { color: '#fff', fontSize: 16, lineHeight: 22 },
  balancedThought: { color: '#2ecc71', fontWeight: '600' },
});

export default StressControlScreen;
