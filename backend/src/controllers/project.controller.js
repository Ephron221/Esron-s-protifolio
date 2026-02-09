const Project = require('../models/Project');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  const { title, description, technologies, image, githubLink, liveDemo, featured } = req.body;

  try {
    const project = await Project.create({
      title,
      description,
      technologies,
      image,
      githubLink,
      liveDemo,
      featured
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, technologies, image, githubLink, liveDemo, featured } = req.body;

  try {
    const project = await Project.findById(id);

    if (project) {
      project.title = title || project.title;
      project.description = description || project.description;
      project.technologies = technologies || project.technologies;
      project.image = image || project.image;
      project.githubLink = githubLink || project.githubLink;
      project.liveDemo = liveDemo || project.liveDemo;
      project.featured = featured !== undefined ? featured : project.featured;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
