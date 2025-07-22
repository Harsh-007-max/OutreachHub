const mongoose = require("mongoose");
const tagsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  tagName: { type: String, required: true },
});
module.exports = mongoose.model("Tag",tagsSchema );
