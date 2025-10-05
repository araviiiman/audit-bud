import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import MainPanel from './components/MainPanel';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', content: "I'm ready to answer questions about audit document. What would you like to know?" }
  ]);
  const [metadataDocuments, setMetadataDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to parse the sourceMetadata string into an array of document objects
  const parseMetadataString = (metadataString) => {
    try {
      // n8n might return an array of objects directly or a JSON string of an array
      const parsed = typeof metadataString === 'string' ? JSON.parse(metadataString) : metadataString;
      if (Array.isArray(parsed)) {
        return parsed;
      }
      console.warn('Metadata string did not parse into an array:', metadataString);
      return [];
    } catch (error) {
      console.error('Error parsing metadata string:', error);
      return [];
    }
  };

  const handleSendMessage = async (message) => {
    setIsLoading(true);

    // Add user message to chat
    setChatMessages(prev => [...prev, { type: 'user', content: message }]);
    
    // Clear previous metadata documents when starting a new query
    setMetadataDocuments([]);

    try {
      // Try the webhook with different configurations
      const webhookConfigs = [
        {
          url: 'https://n8n.srv1033356.hstgr.cloud/webhook/dc46cc6c-b02c-4dff-85c0-41f69e34ad86',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        },
        {
          url: 'https://n8n.srv1033356.hstgr.cloud/webhook/dc46cc6c-b02c-4dff-85c0-41f69e34ad86',
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
            break; // Success, exit loop
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
      console.log('Raw response data:', data);
      console.log('Data type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      console.log('Data length:', data?.length);
      
      // Handle the response format - n8n returns an array with a single object
      let responseData = data;
      if (Array.isArray(data) && data.length > 0) {
        responseData = data[0]; // Get the first (and only) object from the array
        console.log('Extracted responseData:', responseData);
      }
      
      console.log('Final responseData:', responseData);
      console.log('responseData.text:', responseData.text);
      console.log('responseData.sourceMetadata:', responseData.sourceMetadata);
      
      // Handle the correct response format from n8n
      if (responseData && responseData.text) {
        console.log('Setting chat message:', responseData.text);
        setChatMessages(prev => [...prev, { type: 'bot', content: responseData.text }]);
      } else if (data && data[0] && data[0].text) {
        console.log('Fallback: Using data[0].text directly:', data[0].text);
        setChatMessages(prev => [...prev, { type: 'bot', content: data[0].text }]);
      } else {
        console.log('No text found, setting default message');
        console.log('responseData exists:', !!responseData);
        console.log('responseData.text exists:', !!(responseData && responseData.text));
        console.log('data[0] exists:', !!(data && data[0]));
        console.log('data[0].text exists:', !!(data && data[0] && data[0].text));
        setChatMessages(prev => [...prev, { type: 'bot', content: 'No response received' }]);
      }
      
      // Parse and update metadata - handle both formats
      if (responseData && responseData.sourceMetadata) {
        try {
          // Check if sourceMetadata is a JSON string that needs parsing
          if (typeof responseData.sourceMetadata === 'string') {
            const parsedMetadata = JSON.parse(responseData.sourceMetadata);
            setMetadataDocuments(parsedMetadata);
          } else if (Array.isArray(responseData.sourceMetadata)) {
            // If it's already an array, use it directly
            setMetadataDocuments(responseData.sourceMetadata);
          } else {
            console.warn('sourceMetadata is not a string or array:', responseData.sourceMetadata);
            setMetadataDocuments([]);
          }
        } catch (parseError) {
          console.error('Error parsing sourceMetadata:', parseError);
          setMetadataDocuments([]);
        }
      } else {
        setMetadataDocuments([]);
      }

    } catch (error) {
      console.error('Detailed error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

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
      setChatMessages(prev => [...prev, { type: 'bot', content: errorMessage }]);
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
            <Sidebar onSendMessage={handleSendMessage} isLoading={isLoading} chatMessages={chatMessages} />
          </motion.div>
        )}
      </AnimatePresence>
      <MainPanel
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        metadataDocuments={metadataDocuments}
      />
    </div>
  );
}

export default App;