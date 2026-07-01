import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD-wlxjf7Nn5WC1Wg7-Rc_GY0XvFIlTv5M",
  authDomain: "serenus-app.firebaseapp.com",
  projectId: "serenus-app",
  storageBucket: "serenus-app.firebasestorage.app",
  messagingSenderId: "72637181302",
  appId: "1:72637181302:web:23c0fb7b72f658c8cfde57"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };