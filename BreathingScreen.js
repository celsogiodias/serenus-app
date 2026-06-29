import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  SafeAreaView,
} from 'react-native';

const hexToRgb = (hex) => {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const rgbToHex = (r, g, b) => {
  const toHex = (c) => {
    const hex = Math.round(c).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return '#' + toHex(r) + toHex(g) + toHex(b);
};

const interpolateColor = (color1, color2, factor) => {
  const a = hexToRgb(color1);
  const b = hexToRgb(color2);
  return rgbToHex(
    a.r + (b.r - a.r) * factor,
    a.g + (b.g - a.g) * factor,
    a.b + (b.b - a.b) * factor,
  );
};

const GRADIENT_COLORS = Array.from({ length: 60 }, (_, i) =>
  interpolateColor('#0a0e27', '#1a1040', i / 59),
);

const PHASES = [
  { key: 'inhale', duration: 4000, label: 'Inspire', scale: 1.3, color: '#7dd3fc' },
  { key: 'hold', duration: 7000, label: 'Segure', scale: 1.3, color: '#c084fc' },
  { key: 'exhale', duration: 8000, label: 'Expire', scale: 1, color: '#1e3a8a' },
];

export default function BreathingScreen() {
  const [phase, setPhase] = useState('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const phaseIndexRef = useRef(0);

  useEffect(() => {
    if (!running) {
      return;
    }

    let active = true;
    const timeouts = [];
    const intervals = [];

    const startPhase = (index) => {
      if (!active) return;
      const current = PHASES[index];
      setPhase(current.key);
      setTimeLeft(Math.ceil(current.duration / 1000));
      phaseIndexRef.current = index;

      if (current.key !== 'hold') {
        Animated.timing(scaleAnim, {
          toValue: current.scale,
          duration: current.duration,
          useNativeDriver: true,
        }).start();
      }

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      intervals.push(interval);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        startPhase((index + 1) % PHASES.length);
      }, current.duration);
      timeouts.push(timeout);
    };

    startPhase(phaseIndexRef.current);

    return () => {
      active = false;
      intervals.forEach(clearInterval);
      timeouts.forEach(clearTimeout);
    };
  }, [running, scaleAnim]);

  const handleToggle = () => {
    if (running) {
      setRunning(false);
      setPhase('idle');
      setTimeLeft(0);
      phaseIndexRef.current = 0;
      scaleAnim.stopAnimation(() => scaleAnim.setValue(1));
    } else {
      setRunning(true);
    }
  };

  const currentPhase = PHASES.find((p) => p.key === phase);
  const phaseLabel = currentPhase ? currentPhase.label : 'Pronto';
  const phaseColor = currentPhase ? currentPhase.color : '#3b82f6';

  return (
    <View style={styles.container}>
      <View style={styles.gradient}>
        {GRADIENT_COLORS.map((color, i) => (
          <View key={i} style={{ flex: 1, backgroundColor: color }} />
        ))}
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.wrapper}>
          <View style={styles.header}>
            <Text style={styles.title}>Respiração 4-7-8</Text>
            <Text style={styles.subtitle}>
              Inspire pelo nariz, segure, expire pela boca
            </Text>
          </View>

          <View style={styles.center}>
            <Animated.View
              style={[
                styles.circle,
                {
                  transform: [{ scale: scaleAnim }],
                  backgroundColor: phaseColor,
                },
              ]}
            >
              <Text style={styles.circleText}>{phaseLabel}</Text>
            </Animated.View>
          </View>

          <View style={styles.bottom}>
            <Text style={styles.phaseText}>{phaseLabel}</Text>
            <Text style={styles.timerText}>
              {running ? timeLeft + 's' : '---'}
            </Text>

            <TouchableOpacity
              style={[styles.button, running ? styles.stopButton : styles.startButton]}
              onPress={handleToggle}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {running ? 'Parar' : 'Iniciar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    marginTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  bottom: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  phaseText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '200',
    color: '#ffffff',
    marginBottom: 24,
  },
  button: {
    width: '80%',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#3b82f6',
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});