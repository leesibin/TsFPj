const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PhotoSchema = new Schema({
  // albumId: Number,
  url: String,
});

module.exports = mongoose.model("Photo", PhotoSchema);
