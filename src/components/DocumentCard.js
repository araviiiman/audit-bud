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
    document_id: "Unknown",
    version: "N/A",
    status: "N/A",
    effective_date: "10/4/2025",
    author: "Unknown",
    chunk_count: "0",
    summary: "No summary available",
    ranks_sections_str: "N/A",
    keywords: "None"
  };

  const data = documentData || defaultData;

  // Format ranks and sections for better readability
  const formatRanksSections = (ranksStr) => {
    if (!ranksStr || ranksStr === "N/A") return <span className="text-dark-text">N/A</span>;
    
    try {
      // Split by comma and process each rank
      const ranks = ranksStr.split(', ').map(rank => {
        // Extract rank number, accuracy score, and section info
        const match = rank.match(/#?(\d+)\s*\(([0-9.]+)\)\s*-\s*(.+)/);
        if (match) {
          const [, rankNum, accuracy, section] = match;
          return {
            rank: parseInt(rankNum),
            accuracy: parseFloat(accuracy),
            section: section.trim()
          };
        }
        return null;
      }).filter(Boolean);

      return ranks.map(rank => (
        <div key={rank.rank} className="mb-2 last:mb-0">
          <div className="flex items-center space-x-2">
            <span className="bg-accent-blue text-white text-xs px-2 py-1 rounded-full font-medium flex items-center justify-center min-w-[24px] h-6">
              #{rank.rank}
            </span>
            <span className="text-xs text-white bg-gray-700 px-2 py-1 rounded">
              {(rank.accuracy * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-dark-text mt-1 ml-1">{rank.section}</p>
        </div>
      ));
    } catch (error) {
      console.error('Error formatting ranks:', error);
      return <span className="text-dark-text">{ranksStr}</span>;
    }
  };

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
      {data.document_type && (
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-xl font-semibold text-dark-text">{data.document_type}</h2>
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
              <p className="text-lg font-semibold text-dark-text">{data.document_id || data.id}</p>
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
              <p className="text-lg font-semibold text-dark-text">{data.effective_date || data.effectiveDate}</p>
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
              <p className="text-lg font-semibold text-dark-text">{data.chunk_count || data.chunks}</p>
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
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-dark-text-secondary mb-2">Ranks & Sections</p>
              <div className="space-y-1">
                {formatRanksSections(data.ranks_sections_str || data.ranksSections)}
              </div>
            </div>
            <BarChart3 className="w-5 h-5 text-dark-text-secondary mt-1" />
          </div>
        </motion.div>

        {/* Keywords */}
        <motion.div variants={itemVariants} className="bg-dark-card rounded-lg p-4 border border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-text-secondary mb-1">Keywords</p>
              <p className="text-lg font-semibold text-dark-text">{Array.isArray(data.keywords) ? data.keywords.join(', ') : (data.keywords || 'None')}</p>
            </div>
            <Tag className="w-5 h-5 text-dark-text-secondary" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentCard;
