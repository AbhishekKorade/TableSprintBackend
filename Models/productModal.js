const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Product name
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',  // Reference to Category
    required: true 
  },
  subCategory: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SubCategory',  // Reference to SubCategory
    required: true 
  },
  price: { 
    type: Number, 
    required: false 
  },
  image: { 
    type: String  // Path to the uploaded image
  },
  status: { 
    type: String, 
    default: 'Active'  // Default status value is 'Active'
  },
}, { timestamps: true });  // Added timestamps for createdAt and updatedAt

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
