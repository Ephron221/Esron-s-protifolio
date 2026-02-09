const mongoose = require('mongoose');

const aboutSchema = mongoose.Schema({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  biography: { type: String, required: true },
  aboutImage: { type: String, default: '' },
  education: [{
    institution: String,
    degree: String,
    year: String,
    description: String
  }],
  experience: [{
    company: String,
    position: String,
    duration: String,
    description: String
  }],
  goals: { type: String },
  interests: [{ type: String }],
  certifications: [{
    name: String,
    issuer: String,
    year: String,
    link: String
  }],
  languages: [{
    name: String,
    proficiency: String // e.g., Native, Fluent, Intermediate
  }],
  achievements: [{
    title: String,
    year: String,
    description: String
  }]
}, {
  timestamps: true
});

const About = mongoose.model('About', aboutSchema);
module.exports = About;
