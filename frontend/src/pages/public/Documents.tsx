import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDocuments } from '../../hooks/usePortfolio';
import { BASE_URL } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  ShieldCheck, 
  Award, 
  FileText, 
  Lock, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RefreshCcw,
  ChevronRight,
  Search
} from 'lucide-react';

const Documents = () => {
  const { data: documents, isLoading } = useDocuments();
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [zoom, setZoom] = useState(100);
  const [isFullHeight, setIsFullHeight] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (documents && documents.length > 0 && !selectedDoc) {
      setSelectedDoc(documents[0]);
    }
  }, [documents, selectedDoc]);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['p', 's', 'u', 'c'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        alert('This document is protected. Downloading and printing are disabled.');
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

  const filteredDocs = documents?.filter((doc: any) => 
    doc.title.toLowerCase().includes(search.toLowerCase()) || 
    doc.type.toLowerCase().includes(search.toLowerCase())
  );

  const getFileUrl = (url: string) => url.startsWith('http') ? url : `${BASE_URL}${url}`;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT SIDE: DOCUMENT LIST */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">
                Credentials
              </h1>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Verified Achievements</p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search certificates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-primary/50 text-sm"
              />
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              {filteredDocs?.map((doc: any) => (
                <button
                  key={doc._id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 group ${
                    selectedDoc?._id === doc._id 
                      ? 'bg-primary/10 border-primary/30 text-primary' 
                      : 'bg-transparent border-gray-100 dark:border-white/5 hover:border-primary/20 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${selectedDoc?._id === doc._id ? 'bg-primary text-black' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}>
                    {doc.type === 'Certificate' ? <Award size={18} /> : <FileText size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate uppercase tracking-tight">{doc.title}</p>
                    <p className="text-[10px] font-black opacity-60 uppercase">{doc.type}</p>
                  </div>
                  <ChevronRight size={14} className={`transition-transform ${selectedDoc?._id === doc._id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                </button>
              ))}
            </div>
          </aside>

          {/* RIGHT SIDE: SECURE VIEWER */}
          <main className="flex-1 min-w-0">
            {selectedDoc ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-3xl border border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block p-3 bg-primary/10 rounded-2xl text-primary">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase truncate max-w-[300px] md:max-w-md">{selectedDoc.title}</h2>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{selectedDoc.type} • Secured Access</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => setZoom(prev => Math.max(50, prev - 10))} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all text-gray-500"><ZoomOut size={20} /></button>
                    <span className="text-xs font-black text-gray-900 dark:text-white w-10 text-center">{zoom}%</span>
                    <button onClick={() => setZoom(prev => Math.min(200, prev + 10))} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all text-gray-500"><ZoomIn size={20} /></button>
                    <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1" />
                    <button onClick={() => setIsFullHeight(!isFullHeight)} className={`p-2 rounded-xl transition-all ${isFullHeight ? 'bg-primary text-black' : 'hover:bg-white dark:hover:bg-white/10 text-gray-500'}`}><Maximize2 size={20} /></button>
                  </div>
                </div>

                <motion.div 
                  key={selectedDoc._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative bg-gray-100 dark:bg-zinc-900 rounded-[40px] overflow-hidden shadow-2xl border-4 border-gray-100 dark:border-white/5 transition-all duration-500 ${isFullHeight ? 'h-[150vh]' : 'h-[75vh]'}`}
                >
                  <div className="absolute inset-0 z-30 pointer-events-none select-none touch-pan-y" onContextMenu={(e) => e.preventDefault()} />
                  
                  <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] flex flex-wrap gap-20 p-20 overflow-hidden rotate-[-15deg]">
                    {[...Array(20)].map((_, i) => (
                      <span key={i} className="text-4xl font-black whitespace-nowrap text-black dark:text-white uppercase">ESRON PROTECTED ACHIEVEMENT</span>
                    ))}
                  </div>

                  <div className="w-full h-full overflow-auto custom-scrollbar p-2 md:p-6 lg:p-10 bg-gray-200 dark:bg-zinc-800">
                    <iframe
                      src={`${getFileUrl(selectedDoc.fileUrl)}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-full h-full border-none shadow-2xl origin-top"
                      style={{ transform: `scale(${zoom / 100})`, minHeight: '100%' }}
                      title="Document View"
                    />
                  </div>

                  <div className="absolute bottom-8 right-8 z-40 px-6 py-3 glass dark:glass-dark rounded-full border border-primary/20 flex items-center gap-3 backdrop-blur-2xl">
                    <RefreshCcw size={14} className="text-primary animate-spin-slow" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">Live Secure Mode</span>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="h-[70vh] flex flex-col items-center justify-center text-center glass rounded-[40px] border-dashed border-2 border-gray-200 dark:border-white/10">
                <Award size={64} className="text-gray-300 dark:text-gray-700 mb-4" />
                <h3 className="text-xl font-bold text-gray-400">Select a document to view securely</h3>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Documents;
