import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api, { BASE_URL } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { AlertTriangle, Lock, EyeOff } from 'lucide-react';

const CVViewer = () => {
  const { data, isLoading } = useQuery(['cv'], async () => {
    const { data } = await api.get('/cv');
    return data;
  });

  useEffect(() => {
    // Disable right click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable print shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) {
        e.preventDefault();
        alert('Downloading or printing this CV is disabled for security reasons.');
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (isLoading) return <LoadingSpinner />;

  const dummyCV = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  const displayUrl = data?.fileUrl ? `${BASE_URL}${data.fileUrl}` : dummyCV;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h1 className="section-title">Curriculum <span className="text-primary">Vitae</span></h1>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-full text-sm font-medium border border-yellow-500/20">
          <Lock size={14} /> View-only mode enabled
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative glass rounded-3xl overflow-hidden shadow-2xl pdf-viewer-container"
        style={{ height: '80vh' }}
      >
        {/* Overlay to prevent some interactions */}
        <div className="absolute inset-0 z-10 pointer-events-none border-[20px] border-black/5"></div>
        
        <iframe
          src={`${displayUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          className="w-full h-full border-none bg-white"
          title="CV Viewer"
        />

        {/* Custom floating warning */}
        <div className="absolute bottom-6 right-6 z-20 glass px-4 py-2 rounded-full flex items-center gap-2 text-xs text-gray-400">
          <EyeOff size={14} className="text-primary" />
          Protected Document - Esron Portfolio
        </div>
      </motion.div>

      <div className="mt-8 flex flex-col items-center gap-4 text-gray-500 text-center">
        <p className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-primary" />
          Printing and downloading are restricted by the owner.
        </p>
        <p className="text-sm">
          If you need a copy for recruitment purposes, please contact me directly via the 
          <a href="/contact" className="text-primary hover:underline ml-1">Contact page</a>.
        </p>
      </div>
    </div>
  );
};

export default CVViewer;
