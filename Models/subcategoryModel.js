const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  sequence: { 
    type: Number, 
    required: true, 
    unique: true,
  }, 
  image: { 
    type: String, 
  }, 
  status: { 
    type: String, 
    default: 'Active'
  }, 
}, {
  timestamps: true 
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
