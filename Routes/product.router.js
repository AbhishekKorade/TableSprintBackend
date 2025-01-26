const express = require('express');
const Product = require('../Models/productModal');
const upload = require('../middleware/upload');
const router = express.Router();

// Add product
router.post('/api/products/addProduct', upload, async (req, res) => {
  try {
    const { name, subCategory, price, category } = req.body; // added category in body
    const image = req.file ? req.file.filename : null;

    const newProduct = new Product({
      name,
      subCategory,
      price,
      category, // Store category as well
      image,
    });

    await newProduct.save();
    res.status(201).send({ msg: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).send({ msg: 'Error creating product', error });
  }
});

// Get all products
router.get('/api/products/getAllProducts', async (req, res) => {
  try {
    const products = await Product.find().populate('category subCategory');
    res.status(200).send({ products });
  } catch (error) {
    res.status(500).send({ msg: 'Error fetching products', error });
  }
});

// Get single product by ID
router.get('/api/products/getProductById/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category subCategory');
    if (!product) {
      return res.status(404).send({ msg: 'Product not found' });
    }
    res.status(200).send({ product });
  } catch (error) {
    res.status(500).send({ msg: 'Error fetching product', error });
  }
});

// Get products by category
router.get('/api/products/getProductsByCategory/:categoryId', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId }).populate('subCategory');
    if (!products || products.length === 0) {
      return res.status(404).send({ msg: 'No products found for this category' });
    }
    res.status(200).send({ products });
  } catch (error) {
    res.status(500).send({ msg: 'Error fetching products', error });
  }
});

// Update product
router.put('/api/products/updateProduct/:id', upload, async (req, res) => {
  try {
    const { name, subCategory, price, category, status } = req.body;
    const image = req.file ? req.file.filename : null;

    // Create an object to hold the updated data
    const updatedData = {};

    // Only add the fields that are provided
    if (name) updatedData.name = name;
    if (subCategory) updatedData.subCategory = subCategory;
    if (price !== undefined) updatedData.price = price;  // Ensure price is not undefined
    if (category) updatedData.category = category;
    if (status) updatedData.status = status;  // Add status if provided
    if (image) updatedData.image = image;

    // Perform the update
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    
    if (!updatedProduct) {
      return res.status(404).send({ msg: 'Product not found' });
    }

    res.status(200).send({ msg: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).send({ msg: 'Error updating product', error });
  }
});



// Delete product
router.delete('/api/products/deleteProduct/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).send({ msg: 'Product not found' });
    }
    res.status(200).send({ msg: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).send({ msg: 'Error deleting product', error });
  }
});

module.exports = router;
