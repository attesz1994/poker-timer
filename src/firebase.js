import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Replace this object with the one you just copied
const firebaseConfig = {
  apiKey: "AIzaSyBfcR8sBGgtJI1mvkJ82RByFsmBee7m8RE",
  authDomain: "poker-timer-mvp.firebaseapp.com",
  projectId: "poker-timer-mvp",
  storageBucket: "poker-timer-mvp.firebasestorage.app",
  messagingSenderId: "1004843878900",
  appId: "1:1004843878900:web:e9c90a529728eb2bdad1a1",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
