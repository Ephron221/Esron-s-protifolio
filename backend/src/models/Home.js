const mongoose = require('mongoose');

const homeSchema = mongoose.Schema({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  roles: [{ type: String }],
  statistics: [{
    label: { type: String, default: '' },
    value: { type: String, default: '' }
  }],
  socialLinks: [{
    platform: { type: String, default: '' },
    url: { type: String, default: '' },
    icon: { type: String, default: '' }
  }]
}, {
  timestamps: true
});

const Home = mongoose.model('Home', homeSchema);
module.exports = Home;
