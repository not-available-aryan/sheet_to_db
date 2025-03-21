const mongoose = require("mongoose");

const FormDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  formType: { type: String, required: true },
  formData: { type: Object, required: true },
  totalScore: { type: [Number], default: [] }, // Store multiple scores
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FormData", FormDataSchema);