require("dotenv").config();
const express = require("express");
const path = require("path");
const logger = require("morgan");
const app = express();
const port = 3000;
const Photo = require("./db_ori.js");
// 몽고 DB 전송을 위한
const _path = path.join(__dirname, "./dist");
const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = new Server(server);

app.use("/", express.static(_path));
app.use(logger("tiny"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 보내진 prediction을 파파고로 번역 시작
let client_id = process.env.papago_id;
let client_secret = process.env.papago_secret;
let api_url = "https://openapi.naver.com/v1/papago/n2mt";
let request = require("request");
io.on("connection", (socket) => {
  socket.on("translate", (msg) => {
    const massages = msg.split("/");
    // prediction만 번역하기 위해 split으로 데이터 분리

    // base64를 통한 이미지 파일 생성 test 중..
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
          // 번역된 내용과 id를 다시 같이 담아 프론트로 전송
        );
      } else {
        console.log("error = " + response.statusCode);
      }
    });
  });

  // base64를 담은 src 데이터를 전송받아 몽고DB에 전송
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
