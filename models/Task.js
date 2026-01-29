
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: String },             // must exist in schema
  priority: { type: String, default: "Medium" }, // must exist in schema
  completed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
