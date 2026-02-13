const express = require('express');
const router = express.Router();
const { getDocuments, createDocument, updateDocument, deleteDocument } = require('../controllers/document.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', getDocuments);
router.post('/', protect, createDocument);
router.put('/:id', protect, updateDocument);
router.delete('/:id', protect, deleteDocument);

module.exports = router;
