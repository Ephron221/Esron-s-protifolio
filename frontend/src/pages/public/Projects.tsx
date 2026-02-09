import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '../../hooks/usePortfolio';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Github, ExternalLink, Search } from 'lucide-react';

const Projects = () => {
  const { data: projects, isLoading } = useProjects();
  const [filter, setFilter] = useState('All');

  if (isLoading) return <LoadingSpinner />;

  const dummyProjects = [
    {
      _id: '1',
      title: 'E-Commerce Platform',
      description: 'A full-featured online store with payment integration and admin dashboard.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
      githubLink: '#',
      liveDemo: '#',
      featured: true
    },
    {
      _id: '2',
      title: 'AI Image Generator',
      description: 'Generate stunning images from text prompts using OpenAI API.',
      technologies: ['React', 'Tailwind', 'OpenAI'],
      image: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?w=800&q=80',
      githubLink: '#',
      liveDemo: '#',
      featured: false
    },
    {
      _id: '3',
      title: 'Task Management App',
      description: 'Real-time collaborative task manager for agile teams.',
      technologies: ['TypeScript', 'Firebase', 'Next.js'],
      image: 'https://images.unsplash.com/photo-1484480974693-6ff0a00bf1f1?w=800&q=80',
      githubLink: '#',
      liveDemo: '#',
      featured: true
    }
  ];

  const displayProjects = projects || dummyProjects;
  
  const allTechnologies = ['All', ...new Set(displayProjects.flatMap(p => p.technologies))];

  const filteredProjects = filter === 'All' 
    ? displayProjects 
    : displayProjects.filter(p => p.technologies.includes(filter));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="section-title">My <span className="text-primary">Projects</span></h1>
      
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {allTechnologies.map(tech => (
          <button
            key={tech}
            onClick={() => setFilter(tech)}
            className={`px-6 py-2 rounded-full transition-all border ${
              filter === tech 
                ? 'bg-primary text-black border-primary font-bold' 
                : 'glass text-gray-400 border-white/10 hover:border-primary/50'
            }`}
          >
            {tech}
          </button>
        ))}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-2xl overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <a href={project.githubLink} className="p-3 bg-white/10 rounded-full hover:bg-primary hover:text-black transition-all">
                    <Github size={24} />
                  </a>
                  <a href={project.liveDemo} className="p-3 bg-white/10 rounded-full hover:bg-primary hover:text-black transition-all">
                    <ExternalLink size={24} />
                  </a>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map(tech => (
                    <span key={tech} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <Search size={48} className="mx-auto mb-4 opacity-20" />
          <p>No projects found matching the selected technology.</p>
        </div>
      )}
    </div>
  );
};

export default Projects;
