const mongoose = require('mongoose');

const testimonialSchema = mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, default: '' },
  content: { type: String, required: true },
  image: { type: String, default: '' },
  stars: { type: Number, default: 5 }
}, {
  timestamps: true
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
module.exports = Testimonial;
