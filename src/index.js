const path = require("path");
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = "80";

app.use(cors());

const API = "https://getpocket.com/v3/get";
const DEFAULT_QUERY = {
  consumer_key: "87219-0aaf660c14baf59e044df42b",
  access_token: "f1d879fd-14d8-950f-08b4-157dce",
  sort: "newest",
  detailType: "complete",
  tag: "cyberman"
};

var data;

// const getTag = (tag_item) => {
//    return tag_item.tag;
// }

const strip = item => {
  time = item.time_added;
  title = item.resolved_title;
  description = item.excerpt;
  image = item.top_image_url;

  var tags = [];

  // tags = Object.values(item.tags).forEach(getTag);
  tags = Object.keys(item.tags);

  return {
    time,
    title,
    description,
    image,
    tags
  };
};

const getData = async () => {
  try {
    data_response = await axios.post(API, DEFAULT_QUERY);
    data = Object.values(data_response.data.list)
      .map(x => strip(x))
      .reverse();
    // console.log(data_response.data.list);
  } catch (error) {
    console.error(error);
  }
};

getData();

app.get("/", (req, res) => {
  res.send(data);
  //console.log("data: ", data);
});

app.get("/refresh", (req, res) => {
  getData();
  res.send("OK");
});

app.listen(8080, () => {
  console.log(`Listening to requests on http://localhost:80`);
});
