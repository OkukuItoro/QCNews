"use-strict";

//CATEGORIES CONNECTION TO SERVER
const categoryLinks = Array.from(
  document.getElementsByClassName("categories__item")
);
const sectionTitle = document.querySelector(".news-content__title");

const categoryTile = document.querySelector(".news-content__tile");

categoryLinks.forEach((link) => {
  const originalHtml = link.innerHTML;
  if (link.innerText === "Top Stories") {
    const newHtml = `<a href="/" class="categories__item--link">${originalHtml}</a>`;
    link.innerHTML = newHtml;
  } else {
    const newHtml = `<a href="/category" class="categories__item--link">${originalHtml}</a>`;
    link.innerHTML = newHtml;
  }
});

// categoryTile.addEventListener("click", (event) => {
//   if (event.target.className === "news-content__tile--text-link") {
//     document.querySelector("news-content__tile--text-link").click();
//   }
// });

categoryLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const data = { topic: e.target.innerText };
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/", true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(data));
  });
});
