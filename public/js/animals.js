import { db } from "../js/firebase-config.js";
import { getDocs, collection } from "firebase/firestore";
import { playAudio } from "../js/audio-handler.js";
import { currentLang, translate } from "../js/lang-handler.js";

document.addEventListener("DOMContentLoaded", () => {
  loadAnimalCards();
  setupTabs();
});

async function loadAnimalCards() {
  const container = document.querySelector(".animal-card");
  const querySnapshot = await getDocs(collection(db, "categories", "animals", "items"));

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const name = data.name[currentLang];
    const image = `/images/animals/${data.image}`;
    const sound = `/audio/${currentLang}/animals/${data.voices.teacher}`;
    const description = data.description[currentLang];
    const baby = data.baby?.[currentLang] || "";
    const female = data.female?.[currentLang] || "";
    const category = data.category?.[currentLang]?.join(", ") || "";

    container.innerHTML += `
      <div class="animal-entry">
        <h3>${name}</h3>
        <img src="${image}" alt="${name}" />
        <audio controls src="${sound}"></audio>
        <ul>
          <li><strong>${translate("Category")}:</strong> ${category}</li>
          ${baby ? `<li><strong>${translate("Baby")}:</strong> ${baby}</li>` : ""}
          ${female ? `<li><strong>${translate("Female")}:</strong> ${female}</li>` : ""}
          <li><strong>${translate("Description")}:</strong> ${description}</li>
        </ul>
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
      return `<p>${translate("Listen and match the sound to the animal")}</p>`;
    case "family":
      return `<p>${translate("Learn names of baby and female animals")}</p>`;
    case "classify":
      return `<p>${translate("Classify animals into types")}</p>`;
    default:
      return "";
  }
}
