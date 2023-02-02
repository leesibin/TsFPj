/*eslint-disable*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PhotoSchema = new Schema({
  albumId: Number,
  이미지base64: String,
});

module.exports = mongoose.model("Photo", PhotoSchema);