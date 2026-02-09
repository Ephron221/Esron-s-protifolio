import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Save, X, Code, Layout, Server, Database, Smartphone, Globe } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ServiceData } from '../../types';

const iconMap: Record<string, any> = {
  'Code': Code,
  'Layout': Layout,
  'Server': Server,
  'Database': Database,
  'Smartphone': Smartphone,
  'Globe': Globe
};

const ManageServices = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<ServiceData> | null>(null);

  const { data: services, isLoading } = useQuery<ServiceData[]>(['services'], async () => {
    const { data } = await api.get('/services');
    return data;
  });

  const deleteMutation = useMutation(
    (id: string) => api.delete(`/services/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['services']);
      },
    }
  );

  const saveMutation = useMutation(
    (service: Partial<ServiceData>) => {
      if (service._id) {
        return api.put(`/services/${service._id}`, service);
      }
      return api.post('/services', service);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['services']);
        setIsEditing(false);
        setCurrentService(null);
      },
    }
  );

  const handleEdit = (service: ServiceData) => {
    setCurrentService(service);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentService({
      title: '',
      description: '',
      icon: 'Code'
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Services</h1>
          <p className="text-gray-400">Manage the professional services you offer</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Add New Service
        </button>
      </div>

      {isEditing && currentService && (
        <div className="glass-dark p-8 rounded-2xl border border-primary/20 animate-in fade-in slide-in-from-top-4 duration-300 max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{currentService._id ? 'Edit Service' : 'New Service'}</h2>
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/5 rounded-full">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Service Title</label>
              <input 
                type="text" 
                value={currentService.title}
                onChange={(e) => setCurrentService({...currentService, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary"
                placeholder="e.g. Web Development"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Icon</label>
              <div className="grid grid-cols-6 gap-2">
                {Object.keys(iconMap).map(iconName => {
                  const Icon = iconMap[iconName];
                  return (
                    <button
                      key={iconName}
                      onClick={() => setCurrentService({...currentService, icon: iconName})}
                      className={`p-3 rounded-xl border transition-all ${currentService.icon === iconName ? 'bg-primary text-black border-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:border-primary/50'}`}
                    >
                      <Icon size={20} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <textarea 
                rows={4}
                value={currentService.description}
                onChange={(e) => setCurrentService({...currentService, description: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary resize-none"
                placeholder="Describe what you offer in this service..."
              ></textarea>
            </div>
            
            <button 
              onClick={() => saveMutation.mutate(currentService)}
              disabled={saveMutation.isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3"
            >
              {saveMutation.isLoading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <><Save size={20} /> Save Service</>}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service) => {
          const IconComponent = iconMap[service.icon] || Code;
          return (
            <div key={service._id} className="glass-dark p-6 rounded-2xl border border-white/5 group relative">
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(service)} className="p-2 hover:text-primary transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(service._id)} className="p-2 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <IconComponent className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageServices;
