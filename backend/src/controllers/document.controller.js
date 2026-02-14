const Document = require('../models/Document');
const asyncHandler = require('express-async-handler');

// @desc    Get all documents
// @route   GET /api/documents
// @access  Public
const getDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({}).sort({ createdAt: -1 });
  res.json(documents);
});

// @desc    Get single document by ID
// @route   GET /api/documents/:id
// @access  Public
const getDocumentById = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (document) {
    res.json(document);
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
});

// @desc    Create a document
// @route   POST /api/documents
// @access  Private
const createDocument = asyncHandler(async (req, res) => {
  const { title, type, description, fileUrl } = req.body;

  const document = new Document({
    title,
    type,
    description,
    fileUrl,
    user: req.user._id,
  });

  const createdDocument = await document.save();
  res.status(201).json(createdDocument);
});

// @desc    Update a document
// @route   PUT /api/documents/:id
// @access  Private
const updateDocument = asyncHandler(async (req, res) => {
  const { title, type, description, fileUrl } = req.body;

  const document = await Document.findById(req.params.id);

  if (document) {
    document.title = title || document.title;
    document.type = type || document.type;
    document.description = description || document.description;
    document.fileUrl = fileUrl || document.fileUrl;

    const updatedDocument = await document.save();
    res.json(updatedDocument);
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
});

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (document) {
    await document.remove(); // Use remove() instead of deleteOne() to trigger middleware if any
    res.json({ message: 'Document removed' });
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
});

module.exports = {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
