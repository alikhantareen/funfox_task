const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Task = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    title: String,
    description: String
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", Task);