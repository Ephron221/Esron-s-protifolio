import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api, { BASE_URL } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  ShieldAlert,
  Lock,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  RefreshCcw,
  AlertTriangle
} from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DocumentViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const [numPages, setNumPages] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    const container = pdfContainerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver(() => {
      setContainerWidth(container.clientWidth);
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const { data: document, isLoading, isError, error } = useQuery(['document', id], async () => {
    if (!id) throw new Error("No document ID provided.");
    // This is inefficient but matches the previous logic. A dedicated /api/documents/:id endpoint would be better.
    const { data } = await api.get(`/documents`);
    const doc = data.find((d: any) => d._id === id);
    if (!doc) {
      throw new Error(`Document with ID ${id} not found.`);
    }
    return doc;
  }, {
    retry: false,
  });

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['p', 's', 'u', 'c'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        alert('Security Alert: This action is disabled.');
      }
    };
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPdfError(null);
  }

  function onDocumentLoadError(error: Error): void {
    setPdfError(`Failed to load PDF. Message: ${error.message}`);
  }

  const fileUrl = document?.fileUrl ? `${BASE_URL}${document.fileUrl}` : '';

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (isError) {
      return <div className="w-full h-full flex flex-col items-center justify-center text-red-500 p-4 text-center"><ShieldAlert size={48} className="mb-4" /><h2 className="text-xl font-bold">Error Loading Document</h2><p>{error instanceof Error ? error.message : 'An unknown error occurred'}</p></div>;
    }
    if (pdfError) {
      return <div className="w-full h-full flex items-center justify-center text-red-500 p-4"><p>{pdfError}</p></div>;
    }
    if (fileUrl && containerWidth > 0) {
      return (
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<LoadingSpinner />}
          className="flex flex-col items-center py-4"
          onContextMenu={(e) => e.preventDefault()}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={containerWidth}
              scale={zoom}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="mb-4 shadow-lg"
              onContextMenu={(e) => e.preventDefault()}
            />
          ))}
        </Document>
      );
    }
    return <div className="w-full h-full flex items-center justify-center text-gray-500"><p>Document not found or URL is invalid.</p></div>;
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="space-y-2">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold text-sm mb-4">
              <ChevronLeft size={18} /> Back
            </button>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
              {document?.title || 'Document'}
            </h1>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                {document ? `Protected ${document.type}` : 'Protected Document'}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase"><ShieldCheck size={12} className="text-green-500" /> Encrypted Access</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 p-2 rounded-2xl border border-gray-200 dark:border-white/10 self-start lg:self-center shadow-xl">
            <button onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))} className="p-3 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all text-gray-600 dark:text-gray-300" title="Zoom Out"><ZoomOut size={20} /></button>
            <span className="px-4 text-sm font-black text-gray-900 dark:text-white min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(prev => Math.min(2.5, prev + 0.1))} className="p-3 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all text-gray-600 dark:text-gray-300" title="Zoom In"><ZoomIn size={20} /></button>
          </div>
        </div>

        <div className="mb-8 p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-4">
          <Lock className="text-primary shrink-0 mt-1" size={20} />
          <div>
            <p className="text-sm font-bold text-primary uppercase tracking-wider mb-1">Secure Viewing Mode</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">This document is digitally protected. Mobile capture and background downloading are restricted.</p>
          </div>
        </div>

        <div className="relative group">
          <motion.div
            layout
            ref={pdfContainerRef}
            className="relative bg-zinc-200 dark:bg-zinc-900 rounded-[40px] overflow-auto shadow-[0_0_100px_rgba(0,0,0,0.3)] border-4 border-gray-100 dark:border-white/5 transition-all duration-500 ease-in-out h-[85vh] custom-scrollbar"
          >
            <div className="absolute inset-0 z-30 pointer-events-none" onContextMenu={(e) => e.preventDefault()} />
            <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] dark:opacity-[0.05] flex flex-wrap gap-24 p-24 overflow-hidden rotate-[-20deg] select-none">
              {[...Array(30)].map((_, i) => (<span key={i} className="text-5xl font-black whitespace-nowrap text-black dark:text-white uppercase tracking-widest">ESRON PROTECTED</span>))}
            </div>
            {renderContent()}
            <div className="absolute bottom-8 right-8 z-40 px-6 py-3 glass dark:glass-dark rounded-full border border-primary/20 flex items-center gap-3 backdrop-blur-2xl">
              <RefreshCcw size={14} className="text-primary animate-spin-slow" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">Live Secure Mode</span>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-gray-500 text-center">
          <p className="flex items-center gap-2 text-sm font-medium"><AlertTriangle size={18} className="text-primary" /> Unauthorized distribution is prohibited.</p>
          <p className="text-xs max-w-lg leading-relaxed">Request an official copy via the <a href="/contact" className="text-primary font-bold hover:underline ml-1">Contact Page</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
