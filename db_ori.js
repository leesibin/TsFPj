require("dotenv").config();
const mongoose = require("mongoose");
const USER = "mevn";
const PWD = 12345;
const HOST = "127.0.0.1:27017";
// const USER = process.env.dbtest2id;
// const PWD = process.env.dbtest2pw;
// const HOST = process.env.dbhost;
const DB = "mdb";
const mongodbURL = `mongodb://${USER}:${PWD}@${HOST}/${DB}`;
// mongoose.set('useFindAndModify', false) // 6.0 이후부터는 자동관리
mongoose.set("strictQuery", false); // 6.0 이후 권장사항
mongoose
  .connect(mongodbURL, { useNewUrlParser: true })
  .then(() => console.log("connection successful"))
  .catch((err) => console.log(err));
const Photo = require("./db_schema.js");
module.exports = Photo;
