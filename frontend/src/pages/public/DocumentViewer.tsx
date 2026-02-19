import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api, { BASE_URL } from '../../services/api';
import { Lock, Expand, Download, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useFullscreen, useToggle } from 'react-use';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import LoadingSpinner from '../../components/common/LoadingSpinner';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DocumentViewer = () => {
  const { id } = useParams();
  const fullscreenRef = useRef(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [show, toggle] = useToggle(false);
  const isFullscreen = useFullscreen(fullscreenRef, show, {onClose: () => toggle(false)});

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [pdfError, setPdfError] = useState<string | null>(null);


  const { data: document, isLoading, error } = useQuery(['document', id], async () => {
    const { data } = await api.get(`/documents/${id}`);
    return data;
  });

  useEffect(() => {
    const container = pdfContainerRef.current;
    if (!container || isLoading) return;
    
    const updateWidth = () => {
      setContainerWidth(container.clientWidth);
    };

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(container);
    
    updateWidth();

    return () => resizeObserver.disconnect();
  }, [isLoading]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setPdfError(null);
  }

  function onDocumentLoadError(error: Error) {
    setPdfError(`Failed to load PDF. ${error.message}. Please try downloading.`);
  }
  
  const goToPrevPage = () => setPageNumber(p => Math.max(p - 1, 1));
  const goToNextPage = () => setPageNumber(p => Math.min(p + 1, numPages || 1));


  if (isLoading) return <div className="dark h-screen flex items-center justify-center bg-dark-bg"><LoadingSpinner /></div>;
  if (error) return <div className="dark h-screen flex items-center justify-center text-red-500 bg-dark-bg">Error loading document. It may be protected or does not exist.</div>;

  return (
    <div ref={fullscreenRef} className="dark bg-dark-bg min-h-screen text-white selection:bg-primary/20">
      <header className="p-4 flex justify-between items-center bg-dark-surface/50 backdrop-blur-sm sticky top-0 z-20 border-b border-white/10">
        <div className="flex flex-col">
          <h1 className="font-bold text-lg">{document?.title}</h1>
          <p className="text-xs text-primary font-bold uppercase tracking-widest flex items-center gap-2">
            <Lock size={12} /><span>{document?.type} &bull; Secured Access</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toggle()} className="p-2 rounded-full hover:bg-white/10 hidden md:block"><Expand size={18} /></button>
          <a href={`${BASE_URL}${document.fileUrl}`} download={document.title.replace(/ /g, '_') + '.pdf'} target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-white/10">
            <Download size={18} />
          </a>
        </div>
      </header>

      <main className="p-0 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-surface rounded-lg shadow-lg overflow-hidden">
            <div ref={pdfContainerRef} className="p-0 md:p-4 bg-dark-bg relative">
              <Document
                file={{
                  url: `${BASE_URL}${document.fileUrl}`,
                }}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={<div className="text-center h-96 flex items-center justify-center"><LoadingSpinner /></div>}
                error={<div className="text-center p-8 text-red-400">{pdfError}</div>}
                className="flex justify-center"
              >
                 { !pdfError && <Page pageNumber={pageNumber} width={containerWidth > 0 ? containerWidth : undefined} renderTextLayer={false} /> }
              </Document>
            </div>

            {numPages && numPages > 1 && (
               <div className="p-3 flex items-center justify-center gap-4 bg-dark-surface/80 border-t border-white/10">
                 <button onClick={goToPrevPage} disabled={pageNumber <= 1} className="p-2 rounded-full hover:bg-white/10 disabled:opacity-50"><ChevronsLeft size={18} /></button>
                 <span className="text-sm font-bold">Page {pageNumber} of {numPages}</span>
                 <button onClick={goToNextPage} disabled={pageNumber >= numPages} className="p-2 rounded-full hover:bg-white/10 disabled:opacity-50"><ChevronsRight size={18} /></button>
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentViewer;
