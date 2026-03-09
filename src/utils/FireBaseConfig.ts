import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtI5VY6CogjWhUB_ViPoDWu6NCdOcDKgM",
  authDomain: "pokedex-data-f240f.firebaseapp.com",
  projectId: "pokedex-data-f240f",
  storageBucket: "pokedex-data-f240f.appspot.com",
  messagingSenderId: "335725783029",
  appId: "1:335725783029:web:4b2b5030c87031d788a2bc",
  measurementId: "G-TYZSQ74QMM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const firebaseDB = getFirestore(app);

export const usersRef = collection(firebaseDB, "users");
export const pokemonListRef = collection(firebaseDB, "pokemonList");
