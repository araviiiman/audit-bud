import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Hash, 
  GitBranch, 
  Clock, 
  Calendar, 
  User, 
  Layers,
  FileSearch,
  BarChart3,
  Tag
} from 'lucide-react';

const DocumentCard = ({ documentData }) => {
  // Default mock data if no documentData provided
  const defaultData = {
    id: "Unknown",
    version: "N/A",
    status: "N/A",
    effectiveDate: "10/4/2025",
    author: "Unknown",
    chunks: "0",
    summary: "No summary available",
    ranksSections: "N/A",
    keywords: "None"
  };

  const data = documentData || defaultData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Document Title */}
      {data.title && (
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-xl font-semibold text-dark-text">{data.title}</h2>
        </motion.div>
      )}

      {/* Metadata Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Document ID */}
        <motion.div variants={itemVariants} className="bg-dark-card rounded-lg p-4 border border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Document ID</p>
              <p className="text-lg font-semibold text-dark-text">{data.id}</p>
            </div>
            <FileText className="w-5 h-5 text-dark-text-secondary" />
          </div>
        </motion.div>

        {/* Version */}
        <motion.div variants={itemVariants} className="bg-dark-card rounded-lg p-4 border border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Version</p>
              <p className="text-lg font-semibold text-dark-text">{data.version}</p>
            </div>
            <GitBranch className="w-5 h-5 text-dark-text-secondary" />
          </div>
        </motion.div>

        {/* Status */}
        <motion.div variants={itemVariants} className="bg-dark-card rounded-lg p-4 border border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Status</p>
              <p className="text-lg font-semibold text-dark-text">{data.status}</p>
            </div>
            <Clock className="w-5 h-5 text-dark-text-secondary" />
          </div>
        </motion.div>

        {/* Effective Date */}
        <motion.div variants={itemVariants} className="bg-dark-card rounded-lg p-4 border border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Effective Date</p>
              <p className="text-lg font-semibold text-dark-text">{data.effectiveDate}</p>
            </div>
            <Calendar className="w-5 h-5 text-dark-text-secondary" />
          </div>
        </motion.div>

        {/* Author */}
        <motion.div variants={itemVariants} className="bg-dark-card rounded-lg p-4 border border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Author</p>
              <p className="text-lg font-semibold text-dark-text">{data.author}</p>
            </div>
            <User className="w-5 h-5 text-dark-text-secondary" />
          </div>
        </motion.div>

        {/* Chunks */}
        <motion.div variants={itemVariants} className="bg-dark-card rounded-lg p-4 border border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Chunks</p>
              <p className="text-lg font-semibold text-dark-text">{data.chunks}</p>
            </div>
            <Layers className="w-5 h-5 text-dark-text-secondary" />
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div variants={itemVariants} className="bg-dark-card rounded-lg p-4 border border-gray-700 shadow-sm md:col-span-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-dark-text-secondary mb-1">Summary</p>
              <p className="text-sm text-dark-text">{data.summary}</p>
            </div>
            <FileSearch className="w-5 h-5 text-dark-text-secondary mt-1" />
          </div>
        </motion.div>

        {/* Ranks & Sections */}
        <motion.div variants={itemVariants} className="bg-dark-card rounded-lg p-4 border border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Ranks & Sections</p>
              <p className="text-lg font-semibold text-dark-text">{data.ranksSections}</p>
            </div>
            <BarChart3 className="w-5 h-5 text-dark-text-secondary" />
          </div>
        </motion.div>

        {/* Keywords */}
        <motion.div variants={itemVariants} className="bg-dark-card rounded-lg p-4 border border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Keywords</p>
              <p className="text-lg font-semibold text-dark-text">{data.keywords}</p>
            </div>
            <Tag className="w-5 h-5 text-dark-text-secondary" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentCard;
