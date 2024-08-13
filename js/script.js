import { faker } from "https://esm.sh/@faker-js/faker/locale/de";

const url = "https://www.thebump.com/";

const like_btn = document.querySelector("#button-like");
const dislike_btn = document.querySelector("#button-dislike");
const meaning_btn = document.querySelector("#button-meaning");
const origin_btn = document.querySelector("#button-origin");

const export_btn = document.querySelector("#button-export");
const import_btn = document.querySelector("#button-import");
const file_input = document.querySelector("#file-input");

const generate_btn = document.querySelector("#button-generate");

const name_h = document.querySelector("#name_h");
const meaning_p = document.querySelector("#meaning_p");
const origin_p = document.querySelector("#origin_p");

const likes_list = document.querySelector("#likes_list");
const dislikes_list = document.querySelector("#dislikes_list");

let names = [];
let favourites = [];
let dislikes = [];
let name_index = 0;

let meaning = "";
let origin = "";

let len_names = 0;

generate_btn.onclick = function () {
  for (let i = 0; i < 2000; i++) {
    names[i] = faker.person.firstName("female");
  }

  names = [...new Set(names)];
  len_names = names.length;

  name_index = 0;
  update_card();
};

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
  name_h.innerHTML = names[name_index];
  meaning_p.innerHTML = "No meaning found. This site is not finished.";
  origin_p.innerHTML = "No meaning found. This site is not finished.";
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
