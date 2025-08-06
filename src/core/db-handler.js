// 📁 src/core/db-handler.js
import { db } from "./firebase-config.js";
import { getDocs, collection } from "firebase/firestore";

export async function getItemsByCategory(category) {
  const colRef = collection(db, "categories", category, "items");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
