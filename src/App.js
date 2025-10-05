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
      // Try the webhook with different configurations
      const webhookConfigs = [
        {
          url: 'https://n8n.srv1033356.hstgr.cloud/webhook-test/dc46cc6c-b02c-4dff-85c0-41f69e34ad86',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        },
        {
          url: 'https://n8n.srv1033356.hstgr.cloud/webhook-test/dc46cc6c-b02c-4dff-85c0-41f69e34ad86',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ];

      let response = null;
      let lastError = null;

      // Try each configuration
      for (const config of webhookConfigs) {
        try {
          response = await fetch(config.url, {
            method: 'POST',
            headers: config.headers,
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify({
              query: message
            })
          });
          
          if (response.ok) {
            break;
          } else {
            const errorText = await response.text();
            lastError = new Error(`HTTP error! status: ${response.status} - ${errorText}`);
          }
        } catch (error) {
          lastError = error;
          continue;
        }
      }

      if (!response || !response.ok) {
        throw lastError || new Error('All webhook attempts failed');
      }

      const data = await response.json();
      
      // Add chat message
      setChatMessages(prev => [...prev, data.text || 'No response received']);
      
      // Parse and update metadata
      if (data.sourceMetadataString) {
        const parsedDocs = parseMetadataString(data.sourceMetadataString);
        setMetadataDocuments(parsedDocs);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Sorry, there was an error processing your request.';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Unable to connect to the webhook. This might be a CORS issue or the webhook server is not accessible.';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'CORS error: The webhook server is blocking requests from this domain. Please configure CORS headers on your n8n webhook.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = `Server error: ${error.message}`;
      } else if (error.message.includes('404')) {
        errorMessage = 'Webhook not found: The endpoint URL may be incorrect.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error: The webhook server encountered an internal error.';
      } else if (error.message.includes('All webhook attempts failed')) {
        errorMessage = 'Connection failed: Unable to reach the webhook server. Please check your n8n workflow configuration.';
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
