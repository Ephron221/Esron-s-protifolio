const Document = require('../models/Document');

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDocument = async (req, res) => {
  const { title, type, fileUrl, description } = req.body;
  try {
    const document = await Document.create({
      title,
      type,
      fileUrl,
      description
    });
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (document) {
      document.title = req.body.title || document.title;
      document.type = req.body.type || document.type;
      document.fileUrl = req.body.fileUrl || document.fileUrl;
      document.description = req.body.description || document.description;

      const updatedDocument = await document.save();
      res.json(updatedDocument);
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (document) {
      await document.deleteOne();
      res.json({ message: 'Document removed' });
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDocuments, createDocument, updateDocument, deleteDocument };
