const Home = require('../models/Home');

const getHome = async (req, res) => {
  try {
    const home = await Home.findOne();
    res.json(home || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateHome = async (req, res) => {
  const { title, subtitle, description, profileImage, roles, statistics, socialLinks } = req.body;

  try {
    let home = await Home.findOne();

    if (home) {
      home.title = title || home.title;
      home.subtitle = subtitle || home.subtitle;
      home.description = description || home.description;
      home.profileImage = profileImage || home.profileImage;
      home.roles = roles || home.roles;
      home.statistics = statistics || home.statistics;
      home.socialLinks = socialLinks || home.socialLinks;
      
      const updatedHome = await home.save();
      res.json(updatedHome);
    } else {
      const newHome = await Home.create({
        title,
        subtitle,
        description,
        profileImage,
        roles,
        statistics,
        socialLinks
      });
      res.status(201).json(newHome);
    }
  } catch (error) {
    console.error('Update Home Error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHome, updateHome };
