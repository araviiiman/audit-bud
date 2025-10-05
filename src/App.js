import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import MainPanel from './components/MainPanel';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [metadataDocuments, setMetadataDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Parse metadata string from webhook response
  const parseMetadataString = (metadataString) => {
    if (!metadataString) return [];
    
    const documents = [];
    const sections = metadataString.split('---').filter(section => section.trim());
    
    sections.forEach(section => {
      const lines = section.trim().split('\n').filter(line => line.trim());
      if (lines.length === 0) return;
      
      const document = {
        id: '',
        version: '',
        status: '',
        effectiveDate: '',
        author: '',
        chunks: '',
        summary: '',
        ranksSections: '',
        keywords: ''
      };
      
      // Extract title (first line)
      const titleMatch = lines[0].match(/^([A-Z0-9-]+)\s+(v\d+)\s*—\s*(.+)$/);
      if (titleMatch) {
        document.title = titleMatch[3];
        document.id = titleMatch[1];
        document.version = titleMatch[2];
      }
      
      // Parse other fields
      lines.forEach(line => {
        if (line.includes('Status:')) {
          document.status = line.split('Status:')[1]?.trim() || 'N/A';
        } else if (line.includes('Effective Date:')) {
          document.effectiveDate = line.split('Effective Date:')[1]?.trim() || 'N/A';
        } else if (line.includes('Author:')) {
          document.author = line.split('Author:')[1]?.trim() || 'Unknown';
        } else if (line.includes('Chunks:')) {
          document.chunks = line.split('Chunks:')[1]?.trim() || '0';
        } else if (line.includes('Ranks & Sections:')) {
          document.ranksSections = line.split('Ranks & Sections:')[1]?.trim() || 'N/A';
        } else if (line.includes('Keywords:')) {
          document.keywords = line.split('Keywords:')[1]?.trim() || 'None';
        }
      });
      
      documents.push(document);
    });
    
    return documents;
  };

  const handleSendMessage = async (message) => {
    setIsLoading(true);
    
    try {
      console.log('Sending message to webhook:', message);
      console.log('Webhook URL:', 'https://n8n.srv1033356.hstgr.cloud/webhook-test/dc46cc6c-b02c-4dff-85c0-41f69e34ad86');
      
      const response = await fetch('https://n8n.srv1033356.hstgr.cloud/webhook-test/dc46cc6c-b02c-4dff-85c0-41f69e34ad86', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      // Add chat message
      setChatMessages(prev => [...prev, data.text || 'No response received']);
      
      // Parse and update metadata
      if (data.sourceMetadataString) {
        const parsedDocs = parseMetadataString(data.sourceMetadataString);
        setMetadataDocuments(parsedDocs);
      }
      
    } catch (error) {
      console.error('Detailed error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Provide more specific error messages
      let errorMessage = 'Sorry, there was an error processing your request.';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Unable to connect to the webhook. Please check your internet connection.';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'CORS error: The webhook server is blocking requests from this domain.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = `Server error: ${error.message}`;
      } else if (error.message.includes('404')) {
        errorMessage = 'Webhook not found: The endpoint URL may be incorrect.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error: The webhook server encountered an internal error.';
      }
      
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '45%', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <Sidebar onSendMessage={handleSendMessage} isLoading={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <MainPanel 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        metadataDocuments={metadataDocuments}
        chatMessages={chatMessages}
      />
    </div>
  );
}

export default App;
