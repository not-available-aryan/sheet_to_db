const mongoose = require("mongoose")

const LastProcessedRowSchema = new mongoose.Schema({
    formType: { type: String, required: true, unique: true },
    lastRowIndex: { type: Number, default: 0 }, // Stores last processed row index
  });
  
  module.exports = mongoose.model("LastProcessedRow", LastProcessedRowSchema);