const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  formType: { type: String, required: true }, // Form1, Form2, etc.
  formData: { type: Object, required: true },
});

module.exports = mongoose.model('FormData', FormDataSchema);
