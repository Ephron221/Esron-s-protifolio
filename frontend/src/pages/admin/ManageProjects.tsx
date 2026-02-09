import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Globe, Github, Save, X, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ProjectData } from '../../types';

const ManageProjects = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<ProjectData> | null>(null);

  const { data: projects, isLoading } = useQuery<ProjectData[]>(['projects'], async () => {
    const { data } = await api.get('/projects');
    return data;
  });

  const deleteMutation = useMutation(
    (id: string) => api.delete(`/projects/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['projects']);
      },
    }
  );

  const saveMutation = useMutation(
    (project: Partial<ProjectData>) => {
      if (project._id) {
        return api.put(`/projects/${project._id}`, project);
      }
      return api.post('/projects', project);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['projects']);
        setIsEditing(false);
        setCurrentProject(null);
      },
    }
  );

  const handleEdit = (project: ProjectData) => {
    setCurrentProject(project);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProject({
      title: '',
      description: '',
      technologies: [],
      image: '',
      githubLink: '',
      liveDemo: '',
      featured: false
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Projects</h1>
          <p className="text-gray-400">Add, edit or remove your portfolio projects</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Add New Project
        </button>
      </div>

      {isEditing && currentProject && (
        <div className="glass-dark p-8 rounded-2xl border border-primary/20 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{currentProject._id ? 'Edit Project' : 'New Project'}</h2>
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/5 rounded-full">
              <X size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Project Title</label>
                <input 
                  type="text" 
                  value={currentProject.title}
                  onChange={(e) => setCurrentProject({...currentProject, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea 
                  rows={4}
                  value={currentProject.description}
                  onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Technologies (comma separated)</label>
                <input 
                  type="text" 
                  value={currentProject.technologies?.join(', ')}
                  onChange={(e) => setCurrentProject({...currentProject, technologies: e.target.value.split(',').map(t => t.trim())})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={currentProject.image}
                    onChange={(e) => setCurrentProject({...currentProject, image: e.target.value})}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary"
                  />
                  <button className="p-2 bg-white/5 rounded-xl hover:bg-white/10">
                    <ImageIcon size={20} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">GitHub Link</label>
                  <input 
                    type="text" 
                    value={currentProject.githubLink}
                    onChange={(e) => setCurrentProject({...currentProject, githubLink: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Live Demo</label>
                  <input 
                    type="text" 
                    value={currentProject.liveDemo}
                    onChange={(e) => setCurrentProject({...currentProject, liveDemo: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 py-4">
                <input 
                  type="checkbox" 
                  id="featured"
                  checked={currentProject.featured}
                  onChange={(e) => setCurrentProject({...currentProject, featured: e.target.checked})}
                  className="w-5 h-5 accent-primary"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-400">Featured Project</label>
              </div>
              
              <button 
                onClick={() => saveMutation.mutate(currentProject)}
                disabled={saveMutation.isLoading}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3"
              >
                {saveMutation.isLoading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <><Save size={20} /> Save Project</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <div key={project._id} className="glass-dark rounded-2xl overflow-hidden border border-white/5 group">
            <div className="relative h-40">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => handleEdit(project)}
                  className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:text-primary transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(project._id)}
                  className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2 flex items-center justify-between">
                {project.title}
                {project.featured && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase">Featured</span>}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-4">{project.description}</p>
              <div className="flex items-center gap-4 text-gray-500">
                <a href={project.githubLink} target="_blank" rel="noreferrer" className="hover:text-white"><Github size={18} /></a>
                <a href={project.liveDemo} target="_blank" rel="noreferrer" className="hover:text-white"><Globe size={18} /></a>
                <div className="flex-1 flex justify-end gap-1">
                  {project.technologies.slice(0, 3).map(tech => (
                    <span key={tech} className="text-[10px] bg-white/5 px-2 py-0.5 rounded">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProjects;
