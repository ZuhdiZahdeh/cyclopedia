// cyclopedia-app/src/js/fruits.js
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase-config.js";
import { currentLang, translate } from "./lang-handler.js";
import { playAudio } from "./audio-handler.js";

document.addEventListener("DOMContentLoaded", () => {
  loadFruits();
  setupTabs();
});

async function loadFruits() {
  const container = document.querySelector(".fruit-card");
  container.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "categories", "fruits", "items"));

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const name = data.name?.[currentLang] || "؟";
    const image = `/images/fruits/${data.image}`;
    const sound = `/audio/${currentLang}/fruits/${data.voices?.teacher}`;
    const description = data.description?.[currentLang] || "";

    container.innerHTML += `
      <div class="fruit-entry card">
        <h3>${name}</h3>
        <img src="${image}" alt="${name}" onclick="playAudio('${sound}')" />
        <audio controls src="${sound}"></audio>
        <p>${description}</p>
      </div>
    `;
  });
}

function setupTabs() {
  const tabs = document.querySelectorAll(".tabs button");
  const tabContent = document.querySelector(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const selected = tab.dataset.tab;
      tabContent.innerHTML = getTabContent(selected);
    });
  });
}

function getTabContent(tab) {
  switch (tab) {
    case "names":
      return `<p>${translate("Click a card to hear the name")}</p>`;
    case "sounds":
      return `<p>${translate("Listen and match the sound")}</p>`;
    default:
      return "";
  }
}
