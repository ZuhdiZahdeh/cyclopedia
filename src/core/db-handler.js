// 📁 src/core/db-handler.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; // ✅ هذا السطر هو المهم!

export async function getItemsByCategory(category) {
  const colRef = collection(db, "categories", category, "items");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
