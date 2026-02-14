const CV = require('../models/CV');
const asyncHandler = require('express-async-handler');

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

module.exports = { getCV, uploadCV };
