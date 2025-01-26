const express = require('express');
const Category = require('../Models/categoryModel')
const upload = require('../middleware/upload');  // Import middleware
const router = express.Router();

// Add category
router.post('/api/categories/addcategory', upload, async (req, res) => {
  
  try {
    const { name, sequence } = req.body;
    const image = req.file ? req.file.filename : null;  // Store the image filename

    const newCategory = new Category({
      name,
      sequence,
      image,  // Store image filename in the database
    });

    await newCategory.save();
    res.status(201).send({ msg: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: 'Error creating category', error });
  }
});


// Get all categories
router.get('/api/categories/getAllCategory', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).send({ msg: 'Error fetching categories', error });
  }
});

// Get single category by ID
router.get('/api/categories/getbycategoryId/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send({ msg: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).send({ msg: 'Error fetching category', error });
  }
});


// Update category
router.put('/api/categories/updateByCategoryId/:id', upload, async (req, res) => {
  try {
    const { name, sequence, status } = req.body; // Extract fields from request body
    const image = req.file ? req.file.filename : null; // Set image if a new file is uploaded

    // Create an object to hold the updated data
    const updatedData = {};

    // Only include fields that are provided in the request body
    if (name) updatedData.name = name;
    if (sequence) updatedData.sequence = sequence;
    if (status) updatedData.status = status;
    if (image) updatedData.image = image;

    // If no fields are provided, we won't modify the category
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).send({ msg: 'No valid fields provided to update' });
    }

    // Update the category with the provided data
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updatedData, // Pass the updated data object
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).send({ msg: 'Category not found' });
    }

    res.status(200).send({ msg: 'Category updated successfully', category: updatedCategory });
  } catch (error) {
    res.status(500).send({ msg: 'Error updating category', error });
  }
});



// Delete category
router.delete('/api/categories/deleteByCategoryId/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).send({ msg: 'Category not found' });
    }
    res.status(200).send({ msg: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).send({ msg: 'Error deleting category', error });
  }
});

module.exports = router;
