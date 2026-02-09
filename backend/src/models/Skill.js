const mongoose = require('mongoose');

const skillSchema = mongoose.Schema({
  category: { 
    type: String, 
    required: true,
    enum: ['Frontend', 'Backend', 'Database', 'Tools']
  },
  name: { type: String, required: true },
  level: { type: Number, required: true, min: 0, max: 100 },
}, {
  timestamps: true
});

const Skill = mongoose.model('Skill', skillSchema);
module.exports = Skill;
