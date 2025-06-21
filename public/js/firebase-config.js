import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDQ8xTd9T_pdDGVeuG-XDFtl2TwwBkzyc",
  authDomain: "cyclopedia-edu.firebaseapp.com",
  projectId: "cyclopedia-edu",
  storageBucket: "cyclopedia-edu.firebasestorage.app",
  messagingSenderId: "1060215261508",
  appId: "1:1060215261508:web:89176b35858d88ccfaaf11",
  measurementId: "G-46FB22ZVNX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
