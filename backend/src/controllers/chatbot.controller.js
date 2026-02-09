const About = require('../models/About');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Service = require('../models/Service');

const getChatbotResponse = async (req, res) => {
  const { message } = req.body;
  const query = message.toLowerCase();

  try {
    const about = await About.findOne();
    const projects = await Project.find();
    const skills = await Skill.find();
    const services = await Service.find();

    let response = "I'm not sure about that. Try asking about my skills, projects, or how to contact me!";

    if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
      response = "Hello! I'm Esron's virtual assistant. How can I help you today?";
    } else if (query.includes('who are you') || query.includes('about')) {
      response = about ? `Esron is a ${about.subtitle}. ${about.biography.substring(0, 150)}...` : "Esron is a passionate Full-Stack Developer.";
    } else if (query.includes('skill') || query.includes('tech') || query.includes('stack')) {
      const skillNames = skills.map(s => s.name).join(', ');
      response = `Esron is proficient in: ${skillNames}.`;
    } else if (query.includes('project') || query.includes('work')) {
      const projectTitles = projects.map(p => p.title).slice(0, 3).join(', ');
      response = `Some of Esron's projects include: ${projectTitles}. You can see them all in the Projects section!`;
    } else if (query.includes('contact') || query.includes('email') || query.includes('hire')) {
      response = "You can contact Esron through the Contact page or by emailing esront21@gmail.com.";
    } else if (query.includes('service') || query.includes('offer')) {
      const serviceList = services.map(s => s.title).join(', ');
      response = `Esron offers services like: ${serviceList}.`;
    } else if (query.includes('education') || query.includes('study')) {
      const edu = about?.education?.[0];
      response = edu ? `Esron studied ${edu.degree} at ${edu.institution}.` : "Information about Esron's education can be found on the About page.";
    }

    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getChatbotResponse };
