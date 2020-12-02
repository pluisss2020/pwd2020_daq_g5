const mongoose = require("mongoose");

const valueSchema = new mongoose.Schema(
  {
    temperature: Number,
    humidity: Number,
    gas: Number,
    createdAt: {type: Date, default: Date.now},
  },
  {
    timestamps: false,
  }
);

module.exports = Value = mongoose.model("values", valueSchema);
