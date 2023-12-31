const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Group = new mongoose.Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    name: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Group", Group);
