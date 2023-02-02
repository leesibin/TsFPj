require("dotenv").config();
const express = require("express");
const path = require("path");
const logger = require("morgan");
const app = express();
const port = 3000;
const Photo = require("./db_ori.js");
const _path = path.join(__dirname, "./dist");
const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = new Server(server);

app.use("/", express.static(_path));
app.use(logger("tiny"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 파파고 번역 시작
let client_id = process.env.papago_id;
let client_secret = process.env.papago_secret;

let api_url = "https://openapi.naver.com/v1/papago/n2mt";
let request = require("request");
io.on("connection", (socket) => {
  socket.on("translate", (msg) => {
    const massages = msg.split("/");
    // const predictions = msg.split(":");
    // const prediction = predictions[1].split("%");
    // if (Number(prediction[0]) > 50) {
    //   console.log(prediction[0]);
    // }
    let options = {
      url: api_url,
      form: { source: "en", target: "ko", text: massages[1] },
      headers: {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret,
      },
    };
    request.post(options, function (error, response, body) {
      if (!error) {
        const rst = JSON.parse(body);
        io.emit(
          "translate",
          massages[0] + "/" + rst.message.result.translatedText
        );
      } else {
        console.log("error = " + response.statusCode);
      }
    });
  });
  socket.on("src", (src) => {
    // console.log(src);
    const main = async () => {
      const _data = {
        이미지base64: src,
      };
      const new_photo = new Photo(_data);
      const t = await new_photo.save();
    };
    main();
  });
});

server.listen(port, function () {
  console.log("translate app listening on port!");
});
