import { faker } from "https://esm.sh/@faker-js/faker/locale/de";
import { male_names } from "./names.js";
import { male_weights } from "./names.js";
import { male_name_total } from "./names.js";
import { female_names } from "./names.js";
import { female_weights } from "./names.js";
import { female_name_total } from "./names.js";

const url = "https://www.thebump.com/";

const gender_sel = document.querySelector("#gender-select");
const generator_sel = document.querySelector("#generator-select");

const like_btn = document.querySelector("#btn-like");
const dislike_btn = document.querySelector("#btn-dislike");
const meaning_btn = document.querySelector("#btn-meaning");
const origin_btn = document.querySelector("#btn-origin");

const export_btn = document.querySelector("#btn-export");
const import_btn = document.querySelector("#btn-import");
const file_input = document.querySelector("#file-input");

const generate_btn = document.querySelector("#btn-generate");

const name_txt = document.querySelector("#name");
const meaning_txt = document.querySelector("#meaning");
const origin_txt = document.querySelector("#origin");

const likes_list = document.querySelector("#likes-list");
const dislikes_list = document.querySelector("#dislikes-list");

let names = [];
let favourites = [];
let dislikes = [];
let name_index = 0;
let gender = 0;
let generator = 0;

let meaning = "";
let origin = "";

let len_names = 0;

gender_sel.addEventListener("change", function (event) {
  gender = event.target.value;
});
generator_sel.addEventListener("change", function (event) {
  generator = event.target.value;
});

generate_btn.onclick = function () {
  if (generator == "faker") {
    names = [];
    for (let i = 0; i < 2000; i++) {
      names[i] = faker.person.firstName(gender);
    }

    names = [...new Set(names)];
  } else if (generator == "list") {
    names = [];
    generate_names(gender);
  } else {
    names = [];
    generate_names_weighted(gender);
  }

  len_names = names.length;
  alert("Number of Names Generated: " + String(names.length));

  name_index = 0;
  update_card();
};

function generate_names(g) {
  if (g == "male") {
    names = male_names;
  } else if (g == "female") {
    names = female_names;
  } else {
    names = male_names.concat(female_names);
  }

  shuffleArray(names);
}

function generate_names_weighted(g) {
  let w_names = [];
  let weights = [];
  let name_total = 0;

  if (g == "male") {
    w_names = male_names;
    weights = male_weights;
    name_total = male_name_total;
  } else if (g == "female") {
    w_names = female_names;
    weights = female_weights;
    name_total = female_name_total;
  } else {
    w_names = male_names.concat(female_names);
    weights = male_weights.concat(female_weights);
    name_total = male_name_total + female_name_total;
  }

  for (let i = 0; i < 2000; i++) {
    let rand = Math.floor(Math.random() * (name_total + 1));
    let cum_weight = 0;

    for (let j = 0; j < weights.length; j++) {
      cum_weight += weights[j];
      if (rand <= cum_weight) {
        names.push(w_names[j]);
        break;
      }
    }
  }

  // Remove duplicates
  //names = [...new Set(names)];
  //shuffleArray(names);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

update_card();

like_btn.onclick = function () {
  like_name(name_index);
  update_card();
};

dislike_btn.onclick = function () {
  dislike_name(name_index);
  update_card();
};

meaning_btn.onclick = function () {
  let link = url + "b/" + names[name_index] + "-baby-name";
  tab = window.open(link, "_blank");
};

origin_btn.onclick = function () {
  let link = url + "b/" + names[name_index] + "-baby-name";
  window.open(link, "_blank");
};

function like_name(index) {
  favourites.unshift(names[index]);
  names.splice(index, 1);
  name_index++;

  var entry = document.createElement("li");
  entry.appendChild(document.createTextNode(favourites[0]));
  likes_list.prepend(entry);
}

function dislike_name(index) {
  dislikes.unshift(names[index]);
  names.splice(index, 1);
  name_index++;

  var entry = document.createElement("li");
  entry.appendChild(document.createTextNode(dislikes[0]));
  dislikes_list.prepend(entry);
}

function push_name(index) {
  names.push[names[index]];
  names.splice(index, 1);
  name_index++;
}

function update_card() {
  name_txt.innerHTML = names[name_index];
  meaning_txt.innerHTML = "No meaning found. This site is not finished.";
  origin_txt.innerHTML = "No meaning found. This site is not finished.";
}

export_btn.onclick = function () {
  export_data();
};

function export_data() {
  const names_string = names.join(",");
  const dislikes_string = dislikes.join(",");
  const favourites_string = favourites.join(",");

  const export_string = `nam: ${names_string}\ndis: ${dislikes_string}\nfav: ${favourites_string}`;

  const blob = new Blob([export_string], { type: "text/plain" });
  const _url = URL.createObjectURL(blob);
  const ele = document.createElement("A");
  ele.href = _url;
  ele.download = "rename_export.txt";
  ele.click();
}

file_input.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const contents = e.target.result;
      import_data(contents);
    };
    reader.readAsText(file);
  }
});

function import_data(data) {
  const lines = data.split("\n");

  names = lines[0].substring(5).split(",").reverse();
  dislikes = lines[1].substring(5).split(",").reverse();
  favourites = lines[2].substring(5).split(",").reverse();

  // Clear existing lists
  likes_list.innerHTML = "";
  dislikes_list.innerHTML = "";

  // Update the UI
  favourites.forEach((name) => {
    var entry = document.createElement("li");
    entry.appendChild(document.createTextNode(name));
    likes_list.prepend(entry);
  });

  dislikes.forEach((name) => {
    var entry = document.createElement("li");
    entry.appendChild(document.createTextNode(name));
    dislikes_list.prepend(entry);
  });

  name_index = 0;
  update_card();
}
