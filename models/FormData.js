const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  formData: { type: Object, required: true },
});

module.exports = mongoose.model('FormData', FormDataSchema);
