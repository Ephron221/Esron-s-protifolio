const About = require('../models/About');

const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();

    if (about) {
      Object.assign(about, req.body);
      const updatedAbout = await about.save();
      res.json(updatedAbout);
    } else {
      const newAbout = await About.create(req.body);
      res.status(201).json(newAbout);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAbout, updateAbout };
