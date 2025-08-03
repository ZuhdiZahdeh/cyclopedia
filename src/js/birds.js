import { db } from "../js/firebase-config.js";
import { getDocs, collection } from "firebase/firestore";
import { playAudio } from "../js/audio-handler.js";
import { getCurrentLang(), translate } from "../js/lang-handler.js";

document.addEventListener("DOMContentLoaded", () => {
  loadBirds();
  setupTabs();
});

async function loadBirds() {
  const container = document.querySelector(".bird-card");
  const querySnapshot = await getDocs(collection(db, "categories", "birds", "items"));
	const lang = getCurrentLang();
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const name = data.name?.[lang] || "؟";
    const img = `/images/birds/${data.image}`;
    const audio = `/audio/${getCurrentLang()}/birds/${data.voices?.teacher}`;

    container.innerHTML += `
      <div class="bird-entry">
        <h3>${name}</h3>
        <img src="${img}" alt="${name}" onclick="playAudio('${audio}')" />
        <audio src="${audio}" controls></audio>
      </div>
    `;
  });
}

function setupTabs() {
  const tabs = document.querySelectorAll(".tabs button");
  const content = document.querySelector(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const selected = tab.dataset.tab;
      content.innerHTML = `<p>${translate(selected === "names" ? "Click a card to hear the name" : "Listen and match the sound")}</p>`;
    });
  });
}
