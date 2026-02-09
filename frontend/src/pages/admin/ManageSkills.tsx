import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { SkillData } from '../../types';

const ManageSkills = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Partial<SkillData> | null>(null);

  const { data: skills, isLoading } = useQuery<SkillData[]>(['skills'], async () => {
    const { data } = await api.get('/skills');
    return data;
  });

  const deleteMutation = useMutation(
    (id: string) => api.delete(`/skills/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['skills']);
      },
    }
  );

  const saveMutation = useMutation(
    (skill: Partial<SkillData>) => {
      if (skill._id) {
        return api.put(`/skills/${skill._id}`, skill);
      }
      return api.post('/skills', skill);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['skills']);
        setIsEditing(false);
        setCurrentSkill(null);
      },
    }
  );

  const handleEdit = (skill: SkillData) => {
    setCurrentSkill(skill);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentSkill({
      category: 'Frontend',
      name: '',
      level: 80
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Skills</h1>
          <p className="text-gray-400">Update your technical expertise and progress levels</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Add New Skill
        </button>
      </div>

      {isEditing && currentSkill && (
        <div className="glass-dark p-8 rounded-2xl border border-primary/20 animate-in fade-in slide-in-from-top-4 duration-300 max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{currentSkill._id ? 'Edit Skill' : 'New Skill'}</h2>
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/5 rounded-full">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Skill Name</label>
                <input 
                  type="text" 
                  value={currentSkill.name}
                  onChange={(e) => setCurrentSkill({...currentSkill, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary"
                  placeholder="e.g. React.js"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                <select 
                  value={currentSkill.category}
                  onChange={(e) => setCurrentSkill({...currentSkill, category: e.target.value as any})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-400">Proficiency Level: {currentSkill.level}%</label>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={currentSkill.level}
                onChange={(e) => setCurrentSkill({...currentSkill, level: parseInt(e.target.value)})}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            
            <button 
              onClick={() => saveMutation.mutate(currentSkill)}
              disabled={saveMutation.isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3"
            >
              {saveMutation.isLoading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <><Save size={20} /> Save Skill</>}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['Frontend', 'Backend', 'Database', 'Tools'].map((cat) => (
          <div key={cat} className="glass-dark p-6 rounded-2xl border border-white/5">
            <h2 className="text-xl font-bold mb-4 text-primary border-b border-primary/20 pb-2">{cat}</h2>
            <div className="space-y-4">
              {skills?.filter(s => s.category === cat).map((skill) => (
                <div key={skill._id} className="flex items-center justify-between group">
                  <div className="flex-1 mr-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{skill.name}</span>
                      <span className="text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary/50" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(skill)} className="p-1.5 hover:text-primary transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(skill._id)} className="p-1.5 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {skills?.filter(s => s.category === cat).length === 0 && (
                <p className="text-gray-600 text-sm italic">No skills added yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSkills;
