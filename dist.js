require("dotenv").config();
const express = require("express");
const path = require("path");
const logger = require("morgan");
const app = express();
const port = 3000;
const Photo = require("./ori.js");
const _path = path.join(__dirname, "./dist");
// console.log(_path);
app.use("/", express.static(_path));
app.use(logger("tiny"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/about", function (req, res) {
  const main = async () => {
    const _data = {
      url: req.body.imageUrl
    };

    const new_photo = new Photo(_data);
    const t = await new_photo.save();
    console.log(t);
    console.log(_data)
  };
  main();
});

app.listen(port, () => {
  console.log(port + "에서 서버 동작 완료.");
});
