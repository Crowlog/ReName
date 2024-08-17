import { faker } from "https://esm.sh/@faker-js/faker/locale/de";
import { male_names, male_weights, male_name_total, female_names, female_weights, female_name_total } from "./names.js";

const url = "https://www.thebump.com/";

const selectors = {
  gender: document.querySelector("#gender-select"),
  generator: document.querySelector("#generator-select"),
  likeBtn: document.querySelector("#btn-like"),
  dislikeBtn: document.querySelector("#btn-dislike"),
  meaningBtn: document.querySelector("#btn-meaning"),
  originBtn: document.querySelector("#btn-origin"),
  exportBtn: document.querySelector("#btn-export"),
  importBtn: document.querySelector("#btn-import"),
  fileInput: document.querySelector("#file-input"),
  generateBtn: document.querySelector("#btn-generate"),
  nameText: document.querySelector("#name"),
  meaningText: document.querySelector("#meaning"),
  originText: document.querySelector("#origin"),
  likesList: document.querySelector("#likes-list"),
  dislikesList: document.querySelector("#dislikes-list"),
};

let state = {
  names: [],
  favourites: [],
  dislikes: [],
  nameIndex: 0,
  gender: "0",
  generator: "0",
  lenNames: 0,
};

selectors.gender.addEventListener("change", (event) => {
  state.gender = event.target.value;
});

selectors.generator.addEventListener("change", (event) => {
  state.generator = event.target.value;
});

selectors.generateBtn.addEventListener("click", generateNames);
selectors.likeBtn.addEventListener("click", () => updateNameList("favourites"));
selectors.dislikeBtn.addEventListener("click", () => updateNameList("dislikes"));
selectors.meaningBtn.addEventListener("click", () => openNameLink());
selectors.originBtn.addEventListener("click", () => openNameLink());
selectors.exportBtn.addEventListener("click", exportData);
selectors.importBtn.addEventListener("change", importData);

function generateNames() {
  state.names = [];

  if (state.generator === "faker") {
    generateFakerNames();
  } else if (state.generator === "list") {
    generateListNames(state.gender);
  } else {
    generateWeightedNames(state.gender);
  }

  state.lenNames = state.names.length;
  alert(state.lenNames);
  state.nameIndex = 0;
  updateCard();
}

function generateFakerNames() {
  const uniqueNames = newSet();
  while (uniqueNames.size < 2000) {
    uniqueNames.add(faker.person.firstName(state.gender));
  }
  state.names = Array.from(uniqueNames);
}

function generateListNames(gender) {
  state.names = gender === "male" ? male_names : gender === "female" ? female_names : male_names.concat(female_names);

  shuffleArray(state.names);
}

function generateWeightedNames(gender) {
  let namePool = [],
    weights = [],
    totalWeight = 0;

  if (gender === "male") {
    ({ namePool, weights, totalWeight } = { namePool: male_names, weights: male_weights, totalWeight: male_name_total });
  } else if (gender === "female") {
    ({ namePool, weights, totalWeight } = {
      namePool: female_names,
      weights: female_weights,
      totalWeight: female_name_total,
    });
  } else {
    namePool = male_names.concat(female_names);
    weights = male_weights.concat(female_weights);
    totalWeight = male_name_total + female_name_total;
  }

  for (let i = 0; i < 2000; i++) {
    const rand = Math.random() * totalWeight;
    let cumulativeWeight = 0;

    for (let j = 0; j < weights.length; j++) {
      cumulativeWeight += weights[j];
      if (rand <= cumulativeWeight) {
        state.names.push(namePool[j]);
        break;
      }
    }
  }

  state.names = [...newSet(state.names)];
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateNameList(listName) {
  const list = state[listName];
  list.unshift(state.names[state.nameIndex]);
  state.names.splice(state.nameIndex, 1);
  updateUIList(listName, list[0]);
  state.nameIndex = 0;
  updateCard();
}

function updateUIList(listName, name) {
  const listElement = listName === "favourites" ? selectors.likesList : selectors.dislikesList;
  const entry = document.createElement("li");
  entry.textContent = name;
  listElement.prepend(entry);
}

function updateCard() {
  selectors.nameText.innerHTML = state.names[state.nameIndex] || "names unavailable";
  selectors.meaningText.innerHTML = "No meaning found. This site is not finished.";
  selectors.originText.innerHTML = "No meaning found. This site is not finished.";
}

function openNameLink() {
  const name = state.names[state.nameIndex];
  const link = `${url}b/${name}-baby-name`;
  window.open(link, "_blank");
}

function exportData() {
  const data = `nam: ${state.names.join(",")}\ndis: ${state.dislikes.join(",")}\nfav: ${state.favourites.join(",")}`;
  const blob = newBlob([data], { type: "text/plain" });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "rename_export.txt";
  downloadLink.click();
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = newFileReader();
  reader.onload = (e) => {
    const lines = e.target.result.split("\n");
    state.names = lines[0].substring(5).split(",").reverse();
    state.dislikes = lines[1].substring(5).split(",").reverse();
    state.favourites = lines[2].substring(5).split(",").reverse();

    selectors.likesList.innerHTML = "";
    selectors.dislikesList.innerHTML = "";

    state.favourites.forEach((name) => updateUIList("favourites", name));
    state.dislikes.forEach((name) => updateUIList("dislikes", name));

    state.nameIndex = 0;
    updateCard();
  };
  reader.readAsText(file);
}

updateCard();
