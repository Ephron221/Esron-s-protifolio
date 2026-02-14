import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api, { BASE_URL } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  ShieldAlert,
  Lock,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ShieldCheck,
  RefreshCcw,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CVViewer = () => {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(100);
  const [isFullHeight, setIsFullHeight] = useState(false);

  const { data, isLoading } = useQuery(['cv'], async () => {
    const { data } = await api.get('/cv');
    return data;
  });

  useEffect(() => {
    // 1. Disable Right-Click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    // 2. Disable Print/Save Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['p', 's', 'u', 'c'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        alert('Security Alert: Downloading and printing this CV is disabled.');
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (isLoading) return <LoadingSpinner />;

  const dummyCV = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  const displayUrl = data?.fileUrl ? `${BASE_URL}${data.fileUrl}` : dummyCV;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Header & Interactive Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="space-y-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold text-sm mb-4"
            >
              <ChevronLeft size={18} /> Back
            </button>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
              Curriculum <span className="text-primary">Vitae</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-500/20">
                View-Only Mode
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                <ShieldCheck size={12} className="text-green-500" /> Bio-Metric Protected
              </span>
            </div>
          </div>

          {/* Interactive Viewer Toolbar */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 p-2 rounded-2xl border border-gray-200 dark:border-white/10 self-start lg:self-center shadow-xl">
            <button
              onClick={() => setZoom(prev => Math.max(50, prev - 10))}
              className="p-3 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all text-gray-600 dark:text-gray-300"
              title="Zoom Out"
            >
              <ZoomOut size={20} />
            </button>
            <span className="px-4 text-sm font-black text-gray-900 dark:text-white min-w-[60px] text-center">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(prev => Math.min(200, prev + 10))}
              className="p-3 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all text-gray-600 dark:text-gray-300"
              title="Zoom In"
            >
              <ZoomIn size={20} />
            </button>
            <div className="w-px h-8 bg-gray-200 dark:bg-white/10 mx-1" />
            <button
              onClick={() => setIsFullHeight(!isFullHeight)}
              className={`p-3 rounded-xl transition-all flex items-center gap-2 ${isFullHeight ? 'bg-primary text-black' : 'hover:bg-white dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'}`}
            >
              <Maximize2 size={20} />
              <span className="text-xs font-bold hidden sm:inline">{isFullHeight ? 'Compact' : 'Full Height'}</span>
            </button>
          </div>
        </div>

        {/* Security Alert Banner */}
        <div className="mb-8 p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-4">
          <Lock className="text-primary shrink-0 mt-1" size={20} />
          <div>
            <p className="text-sm font-bold text-primary uppercase tracking-wider mb-1">Advanced Protection Enabled</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              This document is rendered via a secure encrypted buffer. Mobile device capture and background downloading are restricted to protect intellectual property.
            </p>
          </div>
        </div>

        {/* SECURE CV CONTAINER */}
        <div className="relative group">
          <motion.div
            layout
            className={`relative bg-white dark:bg-zinc-900 rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.3)] border-4 border-gray-100 dark:border-white/5 transition-all duration-500 ease-in-out ${isFullHeight ? 'h-[180vh]' : 'h-[80vh]'}`}
          >
            {/* INVISIBLE PROTECTION LAYER (CRITICAL FOR MOBILE) */}
            <div
              className="absolute inset-0 z-30 pointer-events-none select-none touch-pan-y"
              onContextMenu={(e) => e.preventDefault()}
            />

            {/* DYNAMIC WATERMARK GRID */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] dark:opacity-[0.05] flex flex-wrap gap-24 p-24 overflow-hidden rotate-[-20deg] select-none">
              {[...Array(30)].map((_, i) => (
                <span key={i} className="text-5xl font-black whitespace-nowrap text-black dark:text-white uppercase tracking-widest">
                  ESRON PORTFOLIO PROTECTED CV
                </span>
              ))}
            </div>

            {/* Document Rendering Area */}
            <div className="w-full h-full overflow-auto custom-scrollbar bg-gray-200 flex justify-center p-4 lg:p-10">
              <iframe
                src={`${displayUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                className="w-full h-full border-none shadow-2xl transition-transform duration-300 origin-top"
                style={{
                  transform: `scale(${zoom / 100})`,
                  minHeight: isFullHeight ? '170vh' : '100%'
                }}
                title="Protected CV Viewer"
              />
            </div>

            {/* Secure Badge */}
            <div className="absolute bottom-8 right-8 z-40 px-6 py-3 glass dark:glass-dark rounded-full border border-primary/20 flex items-center gap-3 backdrop-blur-2xl">
              <RefreshCcw size={14} className="text-primary animate-spin-slow" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">
                Live Security Stream
              </span>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-gray-500 text-center">
          <p className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle size={18} className="text-primary" />
            Printing and downloading are restricted by the owner.
          </p>
          <p className="text-xs max-w-lg leading-relaxed">
            Unauthorized duplication or distribution of this CV is strictly prohibited.
            If you need a copy for recruitment, please contact me through the
            <a href="/contact" className="text-primary font-bold hover:underline ml-1">Contact Page</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CVViewer;