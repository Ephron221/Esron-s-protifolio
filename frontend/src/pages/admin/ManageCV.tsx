import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, FileText, CheckCircle, AlertCircle, Eye, Trash2 } from 'lucide-react';
import api, { BASE_URL } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageCV = () => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const { data: cvData, isLoading } = useQuery(['cv'], async () => {
    const { data } = await api.get('/cv');
    return data;
  });

  const uploadMutation = useMutation(
    (formData: FormData) => api.post('/cv/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cv']);
        setUploadStatus('success');
        setFile(null);
        setTimeout(() => setUploadStatus('idle'), 5000);
      },
      onError: () => {
        setUploadStatus('error');
        setTimeout(() => setUploadStatus('idle'), 5000);
      }
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append('cv', file);
    uploadMutation.mutate(formData);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Manage CV</h1>
        <p className="text-gray-400">Upload and update your curriculum vitae (PDF format only)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Upload size={20} className="text-primary" /> Upload New CV
          </h2>
          
          <div className="relative group">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="border-2 border-dashed border-white/10 group-hover:border-primary/50 rounded-2xl p-12 text-center transition-all">
              <FileText size={48} className="mx-auto mb-4 text-gray-600 group-hover:text-primary transition-colors" />
              <p className="text-gray-400">
                {file ? file.name : 'Click or drag PDF here to upload'}
              </p>
              <p className="text-xs text-gray-600 mt-2">Max file size: 5MB</p>
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || uploadStatus === 'uploading'}
            className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50"
          >
            {uploadStatus === 'uploading' ? (
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Upload size={20} /> Upload CV
              </>
            )}
          </button>

          {uploadStatus === 'success' && (
            <div className="flex items-center gap-2 text-secondary-success justify-center animate-in fade-in slide-in-from-top-2">
              <CheckCircle size={20} /> CV uploaded successfully!
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex items-center gap-2 text-secondary-error justify-center animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} /> Failed to upload CV.
            </div>
          )}
        </div>

        {/* Current CV Info */}
        <div className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText size={20} className="text-primary" /> Current CV Information
          </h2>
          
          {cvData ? (
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <FileText size={32} />
                  </div>
                  <div>
                    <p className="font-bold truncate max-w-[200px]">Curriculum_Vitae.pdf</p>
                    <p className="text-xs text-gray-500">Last updated: {new Date(cvData.lastUpdated).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a 
                    href={`${BASE_URL}${cvData.fileUrl}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2 glass rounded-lg hover:bg-white/10 transition-all text-sm"
                  >
                    <Eye size={16} /> Preview
                  </a>
                  <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="bg-yellow-500/5 border border-yellow-500/10 p-4 rounded-xl">
                <p className="text-xs text-yellow-500/80 leading-relaxed">
                  <strong>Note:</strong> Uploading a new CV will automatically replace the existing one and reflect across all public sections of your portfolio.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 opacity-10" />
              <p>No CV uploaded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCV;
