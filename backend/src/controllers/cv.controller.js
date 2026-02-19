const CV = require('../models/CV');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');

// @desc    Get the single CV
// @route   GET /api/cv
// @access  Public
const getCV = asyncHandler(async (req, res) => {
  // Using findOne() ensures that we always get a single object or null.
  const cv = await CV.findOne({}); 
  
  if (cv) {
    res.json(cv);
  } else {
    // It's better to send a 404 if no CV is found, but for now,
    // returning an empty object is safer for the existing frontend.
    res.status(404).json({ message: 'No CV has been uploaded.' });
  }
});

// @desc    Upload or replace the CV
// @route   POST /api/cv/upload
// @access  Private
const uploadCV = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded.');
  }

  // There should only ever be one CV document in the collection.
  // Find it and update it, or create a new one if it doesn't exist.
  let cv = await CV.findOne({});

  if (cv) {
    // Update existing CV
    cv.fileUrl = `/uploads/${req.file.filename}`;
    cv.lastUpdated = Date.now();
  } else {
    // Create new CV
    cv = new CV({
      fileUrl: `/uploads/${req.file.filename}`,
      user: req.user._id, // Assuming you have a user associated with the CV
    });
  }

  const updatedCV = await cv.save();
  res.status(201).json(updatedCV);
});

// @desc    Delete the CV
// @route   DELETE /api/cv
// @access  Private
const deleteCV = asyncHandler(async (req, res) => {
  const cv = await CV.findOne({});

  if (cv) {
    // Extract the file name from the URL
    const filename = path.basename(cv.fileUrl);
    const filePath = path.join(__dirname, '..', '..', 'uploads', filename);

    // Use a try-catch block to handle file system errors
    try {
      // Check if the file exists before attempting to delete it
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      await cv.deleteOne();
      res.json({ message: 'CV removed' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error removing CV file' });
    }
  } else {
    res.status(404);
    throw new Error('CV not found');
  }
});

module.exports = { getCV, uploadCV, deleteCV };
