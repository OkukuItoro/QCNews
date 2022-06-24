const { Template } = require("ejs");
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

//Static files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/img", express.static(__dirname + "public/img"));
app.use("/js", express.static(__dirname + "public/js"));

//Template Enigne
app.set("views", "./src/views");
app.set("view engine", "ejs");

let topic;
function categoryFormatter(value) {
  if (value === "Science and Technology") {
    return "ScienceAndTechnology";
  } else if (
    value === "Africa" ||
    value === "Americas" ||
    value === "Asia" ||
    value === "Europe" ||
    value === "MiddleEast"
  ) {
    return `World_${value}`;
  } else return value;
}

const formatNewsDate = function (date1, date2) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date2);

  const hours = Math.abs(date1.getHours() - date2.getHours());
  const minutes = Math.abs(date1.getMinutes() - date2.getMinutes());

  if (daysPassed === 0) {
    // return "Today";
    if (hours === 0) {
      if (minutes === 0) {
        return "Moments ago";
      }
      return `${minutes} mins ago`;
    }
    if (hours > 0 && minutes === 0) {
      return `${hours === 1 ? "an hour" : hours} ${hours > 1 ? "hrs" : ""} ago`;
    }
    return `${hours} ${hours > 1 ? "hrs" : "hr"}, ${minutes} mins ago`;
  }
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed > 1 && daysPassed <= 7) return `${daysPassed} days ago`;

  const options = {
    day: "numeric",
    month: "long", //or 2-digits
    year: "numeric", //or 2-digits
    weekday: "long", //narrow, short
  };
  return new Intl.DateTimeFormat(options).format(date2);
};

app.get("/", (req, res) => {
  const options = {
    method: "GET",
    url: "https://bing-news-search1.p.rapidapi.com/news/trendingtopics",
    params: {
      textFormat: "Raw",
      safeSearch: "Off",
      setLang: "EN",
      mkt: "en-US",
    },
    headers: {
      "X-BingApis-SDK": "true",
      "X-RapidAPI-Host": "bing-news-search1.p.rapidapi.com",
      "X-RapidAPI-Key": process.env.BING_NEWS_SEARCH_API_TOKEN,
    },
  };

  axios
    .request(options)
    .then(function (response) {
      const newsAPI = response;
      console.log(newsAPI.data);
      res.render("news", { articles: newsAPI.data });
    })
    .catch(function (error) {
      if (error.response) {
        // console.error(error);
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.error("Error", error.message);
      }
    });
});

app.post("/", (req, res) => {
  topic = req.body.topic;
});

app.get("/category", (req, res) => {
  const options = {
    method: "GET",
    url: "https://bing-news-search1.p.rapidapi.com/news",
    params: {
      category: categoryFormatter(topic),
      safeSearch: "Off",
      textFormat: "Raw",
      setLang: "EN",
      mkt: "en-US",
      originalImg: true,
    },
    headers: {
      "X-BingApis-SDK": "true",
      "X-RapidAPI-Key": process.env.BING_NEWS_SEARCH_API_TOKEN,
      "X-RapidAPI-Host": "bing-news-search1.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      const categoryAPI = response;
      const categoryContent = categoryAPI.data;
      const newsArray = categoryContent.value;

      const categoryNews = newsArray
        .map((article) => {
          const newsDate = formatNewsDate(
            new Date(),
            new Date(article.datePublished)
          );
          const date = { date: newsDate };
          return {
            ...article,
            ...date,
          };
          // article.image.thumbnail.contentUrl,
          // article.provider[0].image.thumbnail.contentUrl
        })
        .sort((article1, article2) => article1.date - article2.date);

      res.render("categoryNews", {
        categoryNews,
        topic,
      });
    })
    .catch(function (error) {
      if (error.response) {
        // console.error(error);
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.error("Error", error.message);
      }
    });
});

//Port
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
