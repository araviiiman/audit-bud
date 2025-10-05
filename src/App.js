import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import MainPanel from './components/MainPanel';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [metadataDocuments, setMetadataDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message) => {
    setIsLoading(true);
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { type: 'user', content: message }]);
    
    try {
      // Simple test response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { type: 'bot', content: 'Test response from Audit Bud!' }]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setChatMessages(prev => [...prev, { type: 'bot', content: 'Error occurred' }]);
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