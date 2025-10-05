import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import DocumentCard from './DocumentCard';

const MainPanel = ({ sidebarOpen, setSidebarOpen, metadataDocuments }) => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-accent-blue" />
          <div>
            <h1 className="text-xl font-semibold text-dark-text">Audit Document Analysis</h1>
            <p className="text-sm text-dark-text-secondary">Key information extracted by Audit Bud.</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-dark-text-secondary hover:text-dark-text transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
             <div className="p-8">
               <div className="max-w-6xl mx-auto">
                 {/* Document Cards - Scrollable Container */}
                 <div className="space-y-8">
                   {metadataDocuments.length > 0 ? (
                     metadataDocuments.map((doc, index) => (
                       <DocumentCard key={doc.document_id || doc.id || index} documentData={doc} />
                     ))
                   ) : (
                     <DocumentCard />
                   )}
                 </div>
               </div>
             </div>
      </div>
    </div>
  );
};

export default MainPanel;
