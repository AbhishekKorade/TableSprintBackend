const express = require('express');
const SubCategory = require('../Models/subcategoryModel');
const upload = require('../middleware/upload');
const router = express.Router();

// Add subcategory
router.post('/api/subcategories/addSubcategory', upload, async (req, res) => {
  try {
    const { name, category, sequence } = req.body;  // Include sequence
    const image = req.file ? req.file.filename : null;  // Handle image upload

    if (!name || !category || !sequence) {
      return res.status(400).send({ msg: 'Name, category, and sequence are required' });
    }

    const newSubCategory = new SubCategory({
      name,
      category,
      sequence,  // Add sequence to the new subcategory
      image,
    });

    await newSubCategory.save();
    res.status(201).send({ msg: 'SubCategory created successfully', subCategory: newSubCategory });
  } catch (error) {
    res.status(500).send({ msg: 'Error creating subcategory', error });
  }
});

// Get all subcategories
router.get('/api/subcategories/getAllSubcategory', async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate('category');  // Populate the category for each subcategory
    res.status(200).send({ subCategories });
  } catch (error) {
    res.status(500).send({ msg: 'Error fetching subcategories', error });
  }
});

// Get single subcategory by ID
router.get('/api/subcategories/getbySubcategoryId/:id', async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate('category');  // Populate the category for the subcategory
    if (!subCategory) {
      return res.status(404).send({ msg: 'SubCategory not found' });
    }
    res.status(200).send({ subCategory });
  } catch (error) {
    res.status(500).send({ msg: 'Error fetching subcategory', error });
  }
});

// Get subcategories by category ID
router.get('/api/subcategories/getSubCtegorybyCategoryId/:categoryId', async (req, res) => {
  try {
    const subCategories = await SubCategory.find({ category: req.params.categoryId }).populate('category');  // Populate the category field
    if (!subCategories || subCategories.length === 0) {
      return res.status(404).send({ msg: 'No subcategories found for this category' });
    }
    res.status(200).send({ subCategories });
  } catch (error) {
    res.status(500).send({ msg: 'Error fetching subcategories', error });
  }
});

// Update subcategory
router.put('/api/subcategories/updateSubcategory/:id', upload, async (req, res) => {
  try {
    // Extract fields from the request body
    const { name, category, sequence, status } = req.body;

    // Check if the file (image) is provided, otherwise set to null
    const image = req.file ? req.file.filename : null;

    // Create an object to store the updated data
    const updatedData = {};

    // Only add fields that are provided in the request body
    if (name) updatedData.name = name;
    if (category) updatedData.category = category;
    if (sequence) updatedData.sequence = sequence;
    if (status) updatedData.status = status;
    if (image) updatedData.image = image;

    // If the status is not provided, set it to 'Active' by default
    if (!status && !updatedData.status) {
      updatedData.status = 'Active';
    }

    // Find the subcategory by ID and update it with the provided data
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedSubCategory) {
      return res.status(404).send({ msg: 'SubCategory not found' });
    }

    res.status(200).send({ msg: 'SubCategory updated successfully', subCategory: updatedSubCategory });
  } catch (error) {
    res.status(500).send({ msg: 'Error updating subcategory', error });
  }
});



// Delete subcategory
router.delete('/api/subcategories/deleteSubcategory/:id', async (req, res) => {
  try {
    const deletedSubCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!deletedSubCategory) {
      return res.status(404).send({ msg: 'SubCategory not found' });
    }
    res.status(200).send({ msg: 'SubCategory deleted successfully' });
  } catch (error) {
    res.status(500).send({ msg: 'Error deleting subcategory', error });
  }
});

module.exports = router;
