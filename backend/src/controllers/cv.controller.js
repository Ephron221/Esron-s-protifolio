const CV = require('../models/CV');

const getCV = async (req, res) => {
  try {
    const cv = await CV.findOne();
    res.json(cv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const fileUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    let cv = await CV.findOne();

    if (cv) {
      cv.fileUrl = fileUrl;
      cv.lastUpdated = Date.now();
      const updatedCV = await cv.save();
      res.json(updatedCV);
    } else {
      const newCV = await CV.create({
        fileUrl
      });
      res.status(201).json(newCV);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCV, uploadCV };
