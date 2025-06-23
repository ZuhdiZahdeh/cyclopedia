import { recordActivity } from './activity-handler.js';
import { db } from './firebase-config.js';
import { collection, query, where, getDocs } from 'firebase/firestore';

// بدء اللعبة
export async function startGame(category) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const lang = localStorage.getItem("language") || "ar";

  let words = await getWordsFromFirestore(category, lang);
  let currentIndex = 0;

  displayWord(words[currentIndex]);

  document.getElementById("nextBtn").onclick = async () => {
    await recordActivity(user, category);
    currentIndex = (currentIndex + 1) % words.length;
    displayWord(words[currentIndex]);
  };
}

// عرض الكلمة والصورة والصوت
function displayWord(wordObj) {
  document.getElementById("image").src = wordObj.image;
  document.getElementById("word").textContent = wordObj.word;
  const audio = new Audio(wordObj.audio);
  document.getElementById("playBtn").onclick = () => audio.play();
}

// جلب الكلمات من Firestore حسب الفئة واللغة
async function getWordsFromFirestore(category, language) {
  const colRef = collection(db, category);
  const q = query(colRef, where("lang", "==", language));
  const snapshot = await getDocs(q);

  const words = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    words.push({
      word: data.word,
      image: `/images/${category}/${data.image}`,
      audio: `/audio/${category}/${data.audio}`
    });
  });

  return words.length ? words : [{
    word: "No data",
    image: "/images/default.png",
    audio: "/audio/default.mp3"
  }];
}
