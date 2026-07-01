import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Linking,
  Animated,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

const PROFILES = [
  { key: 'SONO', label: 'Sono', default8D: false, allowToggle: true },
  { key: 'TAG', label: 'TAG', default8D: false, allowToggle: true },
  { key: 'TP', label: 'TP', default8D: false, allowToggle: false },
  { key: 'TDAH', label: 'TDAH', default8D: true, allowToggle: false },
  { key: 'ESTRESSE', label: 'Estresse', default8D: true, allowToggle: false },
];

const EXTERNAL_LINKS = {
  weightless: {
    youtube: 'https://www.youtube.com/watch?v=UfcAVejslrU',
    spotify: 'https://open.spotify.com/track/6kkwzB6hXLIONkEk9JciA6',
  },
  spiegel: {
    youtube: 'https://www.youtube.com/watch?v=1F2h6f6mzJ0',
    spotify: 'https://open.spotify.com/track/7zHd9LxIZB8WKosSWN9Umj',
  },
};

const MUSIC_DATA = {
  SONO: [
    { id: 'sono-1', title: 'Clair de Lune', artist: 'Debussy', bpm: 50, driveId: '1IcvqZbYMc50TF08Yewkn-qKc4-eFL0sr', evidence: 'Domínio pÃºblico' },
    { id: 'sono-2', title: 'Moonlight Sonata (1Âº mov.)', artist: 'Beethoven', bpm: 60, driveId: '1adhCCG_AgImaYOayJnDaEVZiwUppEsvW', evidence: 'Domínio pÃºblico' },
    { id: 'sono-3', title: 'Gymnopédie No. 1', artist: 'Satie', bpm: 60, driveId: '1JlwlykUX_AboSW8ZexqIYKHzwqU0-fte', evidence: 'Domínio pÃºblico' },
    { id: 'sono-4', title: 'Nocturne Op. 9 No. 2', artist: 'Chopin', bpm: 65, driveId: '1wEkGwISmn09m5ZyqEEoGrVcJIbQWlnZT', evidence: 'Domínio pÃºblico' },
  ],
  TAG: [
    { id: 'tag-1', title: 'Gymnopédie No. 1', artist: 'Satie', bpm: 60, driveId: '1JlwlykUX_AboSW8ZexqIYKHzwqU0-fte', evidence: 'Domínio pÃºblico' },
    { id: 'tag-2', title: 'Clair de Lune', artist: 'Debussy', bpm: 50, driveId: '1IcvqZbYMc50TF08Yewkn-qKc4-eFL0sr', evidence: 'Domínio pÃºblico' },
    { id: 'tag-3', title: 'Weightless', artist: 'Marconi Union', bpm: 60, external: EXTERNAL_LINKS.weightless, evidence: 'Link externo' },
    { id: 'tag-4', title: 'Spiegel im Spiegel', artist: 'Arvo PÃ¤rt', bpm: 70, external: EXTERNAL_LINKS.spiegel, evidence: 'Link externo' },
  ],
  TP: [
    { id: 'tp-1', title: 'Gymnopédie No. 1', artist: 'Satie', bpm: 60, driveId: '1JlwlykUX_AboSW8ZexqIYKHzwqU0-fte', evidence: 'Domínio pÃºblico' },
    { id: 'tp-2', title: 'Gnossienne No. 1', artist: 'Satie', bpm: 55, driveId: '1_DSNqY14ro8XvzJ-I3PMw-u-YvPf0rtz', evidence: 'Domínio pÃºblico' },
    { id: 'tp-3', title: 'Moonlight Sonata (1Âº mov.)', artist: 'Beethoven', bpm: 60, driveId: '1adhCCG_AgImaYOayJnDaEVZiwUppEsvW', evidence: 'Domínio pÃºblico' },
    { id: 'tp-4', title: 'Weightless', artist: 'Marconi Union', bpm: 60, external: EXTERNAL_LINKS.weightless, evidence: 'Link externo' },
  ],
  TDAH: [
    { id: 'tdah-1', title: 'Gymnopédie No. 1', artist: 'Satie', bpm: 60, driveId: '1JlwlykUX_AboSW8ZexqIYKHzwqU0-fte', evidence: 'Domínio pÃºblico' },
    { id: 'tdah-2', title: 'Concerto p/ Piano No. 21 (Andante)', artist: 'Mozart', bpm: 78, driveId: '1SLyDDyLcHqgX2ilOKNIVVowd5dSCpiK0', evidence: 'Domínio pÃºblico' },
    { id: 'tdah-3', title: 'Clair de Lune', artist: 'Debussy', bpm: 50, driveId: '1IcvqZbYMc50TF08Yewkn-qKc4-eFL0sr', evidence: 'Domínio pÃºblico' },
    { id: 'tdah-4', title: 'Weightless', artist: 'Marconi Union', bpm: 60, external: EXTERNAL_LINKS.weightless, evidence: 'Link externo' },
  ],
  ESTRESSE: [
    { id: 'estresse-1', title: 'Gymnopédie No. 1', artist: 'Satie', bpm: 60, driveId: '1JlwlykUX_AboSW8ZexqIYKHzwqU0-fte', evidence: 'Domínio pÃºblico' },
    { id: 'estresse-2', title: 'Moonlight Sonata (1Âº mov.)', artist: 'Beethoven', bpm: 60, driveId: '1adhCCG_AgImaYOayJnDaEVZiwUppEsvW', evidence: 'Domínio pÃºblico' },
    { id: 'estresse-3', title: 'Weightless', artist: 'Marconi Union', bpm: 60, external: EXTERNAL_LINKS.weightless, evidence: 'Link externo' },
    { id: 'estresse-4', title: 'Spiegel im Spiegel', artist: 'Arvo PÃ¤rt', bpm: 70, external: EXTERNAL_LINKS.spiegel, evidence: 'Link externo' },
  ],
};

const getDriveUrl = (id) => `https://drive.google.com/uc?export=download&id=${id}`;

export default function MusicScreen() {
  const insets = useSafeAreaInsets();

  const [activeProfile, setActiveProfile] = useState('SONO');
  const [eightDByProfile, setEightDByProfile] = useState(() => {
    const init = {};
    PROFILES.forEach((p) => { init[p.key] = p.default8D; });
    return init;
  });
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const soundRef = useRef(null);
  const panIntervalRef = useRef(null);
  const panDirectionRef = useRef(-1);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const activeProfileConfig = PROFILES.find((p) => p.key === activeProfile);
  const is8DActive = eightDByProfile[activeProfile] || false;

  const clearPanEffect = () => {
    if (panIntervalRef.current) {
      clearInterval(panIntervalRef.current);
      panIntervalRef.current = null;
    }
  };

  const applyPanEffect = useCallback(async (sound, enabled) => {
    clearPanEffect();
    if (!sound) return;
    try {
      await sound.setVolumeAsync(1, enabled ? panDirectionRef.current : 0);
    } catch (error) {
      console.warn('Erro ao aplicar volume/pan', error);
    }
    if (enabled) {
      panIntervalRef.current = setInterval(() => {
        panDirectionRef.current *= -1;
        if (soundRef.current) {
          soundRef.current.setVolumeAsync(1, panDirectionRef.current).catch(() => {});
        }
      }, 2000);
    }
  }, []);

  const stopPlayback = useCallback(async () => {
    clearPanEffect();
    if (soundRef.current) {
      try {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        }
      } catch (error) {
        console.warn('Erro ao parar reprodução', error);
      }
      soundRef.current = null;
    }
    setCurrentTrackId(null);
    setIsPlaying(false);
  }, []);

  const onPlaybackStatusUpdate = useCallback((status) => {
    if (!status.isLoaded) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(status.isPlaying);
    if (status.didJustFinish) {
      stopPlayback();
    }
  }, [stopPlayback]);

  const playTrack = useCallback(async (item) => {
    await stopPlayback();
    await new Promise(resolve => setTimeout(resolve, 300));
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: getDriveUrl(item.driveId) },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
      setCurrentTrackId(item.id);
      setIsPlaying(true);
    } catch (error) {
      console.error('Erro ao tocar mÃºsica', error);
      setCurrentTrackId(null);
      setIsPlaying(false);
    }
  }, [stopPlayback, onPlaybackStatusUpdate]);

  const cleanupSound = useCallback(async () => {
    clearPanEffect();
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch (error) {
        console.warn('Erro ao descarregar áudio', error);
      }
      soundRef.current = null;
    }
  }, []);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });
  }, []);

  useEffect(() => {
    return () => { cleanupSound(); };
  }, [cleanupSound]);

  useEffect(() => {
    if (soundRef.current && currentTrackId) {
      applyPanEffect(soundRef.current, is8DActive);
    }
  }, [is8DActive, currentTrackId, applyPanEffect]);

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(0);
    }
  }, [isPlaying, pulseAnim]);

  const handleProfileChange = (key) => {
    if (key !== activeProfile) {
      stopPlayback();
      setActiveProfile(key);
    }
  };

  const toggle8D = () => {
    if (!activeProfileConfig.allowToggle) return;
    setEightDByProfile((prev) => ({ ...prev, [activeProfile]: !prev[activeProfile] }));
  };

  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const get8DStatusText = () => {
    if (!activeProfileConfig.allowToggle) {
      if (activeProfileConfig.key === 'TP') return '8D não recomendado para TP';
      return '8D ativo';
    }
    return is8DActive ? 'Ligado' : 'Desligado';
  };

  const renderTabs = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer} contentContainerStyle={styles.tabContent}>
      {PROFILES.map((profile) => {
        const isActive = profile.key === activeProfile;
        return (
          <TouchableOpacity key={profile.key} onPress={() => handleProfileChange(profile.key)} style={[styles.tab, isActive && styles.tabActive]}>
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{profile.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const render8DCard = () => (
    <View style={styles.card}>
      <View style={styles.eightDRow}>
        <View style={styles.eightDInfo}>
          <Text style={styles.eightDTitle}>Efeito 8D</Text>
          <Text style={styles.eightDDescription}>{get8DStatusText()}</Text>
        </View>
        {activeProfileConfig.allowToggle ? (
          <Switch value={is8DActive} onValueChange={toggle8D} trackColor={{ false: 'rgba(255,255,255,0.15)', true: '#9b72cf' }} thumbColor={is8DActive ? '#ffffff' : '#cccccc'} ios_backgroundColor="rgba(255,255,255,0.15)" />
        ) : (
          <View style={styles.eightDBadge}>
            <Text style={styles.eightDBadgeText}>{activeProfileConfig.key === 'TP' ? '8D não recomendado' : '8D ativo'}</Text>
          </View>
        )}
      </View>
      {isPlaying && (
        <TouchableOpacity style={styles.stopButton} onPress={stopPlayback} activeOpacity={0.7}>
          <Text style={styles.stopButtonText}>â¹ Parar reprodução</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSongCard = (item) => {
    const isCurrent = currentTrackId === item.id;
    const isPublic = !!item.driveId;

    return (
      <View key={item.id} style={[styles.card, isCurrent && styles.cardPlaying]}>
        <View style={styles.songHeader}>
          <View style={styles.songInfo}>
            <Text style={styles.songTitle}>{item.title}</Text>
            <Text style={styles.songArtist}>{item.artist} â€¢ ~{item.bpm} BPM</Text>
          </View>
          {isCurrent && (
            <Animated.View style={[styles.pulseDot, { opacity: pulseAnim, transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] }) }] }]} />
          )}
        </View>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, isPublic ? styles.badgePublic : styles.badgeExternal]}>
            <Text style={styles.badgeText}>{item.evidence}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          {isPublic ? (
            <TouchableOpacity onPress={() => playTrack(item)} style={[styles.actionButton, styles.playButton]} activeOpacity={0.8}>
              <Text style={styles.actionButtonText}>{isCurrent ? 'â–¶ Tocando' : 'â–¶ Tocar'}</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={() => openLink(item.external.youtube)} style={[styles.actionButton, styles.youtubeButton]} activeOpacity={0.8}>
                <Text style={styles.actionButtonText}>â–¶ YouTube</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openLink(item.external.spotify)} style={[styles.actionButton, styles.spotifyButton]} activeOpacity={0.8}>
                <Text style={styles.actionButtonText}>ðŸŽ§ Spotify</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#0a0e27', '#1a1040']} style={styles.container}>
      <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}>
          <Text style={styles.headerTitle}>Musicoterapia</Text>
          <Text style={styles.headerSubtitle}>Selecione o perfil e a mÃºsica</Text>
          {renderTabs()}
          {render8DCard()}
          <Text style={styles.sectionTitle}>MÃºsicas para {activeProfileConfig.label}</Text>
          {MUSIC_DATA[activeProfile].map((item) => renderSongCard(item))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#ffffff' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
  tabContainer: { marginTop: 20, marginBottom: 8 },
  tabContent: { paddingRight: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(155,114,207,0.2)' },
  tabActive: { backgroundColor: '#9b72cf', borderColor: '#9b72cf' },
  tabText: { color: '#ffffff', fontWeight: '500' },
  tabTextActive: { color: '#ffffff', fontWeight: '700' },
  card: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(155,114,207,0.2)', borderRadius: 16, padding: 16, marginBottom: 12 },
  cardPlaying: { borderColor: '#9b72cf', backgroundColor: 'rgba(155,114,207,0.12)' },
  eightDRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eightDInfo: { flex: 1, paddingRight: 12 },
  eightDTitle: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  eightDDescription: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  eightDBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: 'rgba(155,114,207,0.2)' },
  eightDBadgeText: { color: '#9b72cf', fontWeight: '600', fontSize: 12 },
  stopButton: { marginTop: 14, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  stopButtonText: { color: '#ffffff', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginTop: 8, marginBottom: 12 },
  songHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  songInfo: { flex: 1, paddingRight: 12 },
  songTitle: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  songArtist: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  pulseDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#9b72cf' },
  badgeRow: { flexDirection: 'row', marginTop: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgePublic: { backgroundColor: 'rgba(155,114,207,0.2)' },
  badgeExternal: { backgroundColor: 'rgba(255,255,255,0.1)' },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#9b72cf' },
  actions: { flexDirection: 'row', marginTop: 14 },
  actionButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginHorizontal: 4 },
  playButton: { backgroundColor: '#9b72cf' },
  youtubeButton: { backgroundColor: '#ff4444' },
  spotifyButton: { backgroundColor: '#1db954' },
  actionButtonText: { color: '#ffffff', fontWeight: '700' },
});
