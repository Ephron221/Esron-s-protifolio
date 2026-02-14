const express = require('express');
const router = express.Router();
const {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
} = require('../controllers/document.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/').get(getDocuments).post(protect, createDocument);

router
  .route('/:id')
  .get(getDocumentById) // Changed from just get(protect, getDocumentById)
  .put(protect, updateDocument)
  .delete(protect, deleteDocument);

module.exports = router;
