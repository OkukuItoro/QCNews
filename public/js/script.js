"use-strict";

//CATEGORIES CONNECTION TO SERVER
const topics = Array.from(document.getElementsByClassName("category-topics"));
const sectionTitle = document.getElementById("section-title");

topics.forEach((topic) => {
  topic.addEventListener("click", (e) => {
    const data = { topic: e.target.innerText };
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/", true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(data));
  });
});
