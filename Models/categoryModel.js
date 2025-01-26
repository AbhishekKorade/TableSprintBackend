const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  sequence: { type: Number, required: true },
  image: { type: String },  // Path to the uploaded image
  status: { type: String, default: 'Active' }  // Default value set to 'active'
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
