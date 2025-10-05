import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, Loader2, Camera } from 'lucide-react';

const Sidebar = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    if (message.trim() && !isLoading) {
      await onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  const handleScreenshot = async () => {
    try {
      // Use html2canvas to capture the entire page
      const html2canvas = (await import('html2canvas')).default;
      
      // Capture the main content area
      const element = document.querySelector('.min-h-screen');
      const canvas = await html2canvas(element, {
        backgroundColor: '#0d0f12',
        scale: 1,
        useCORS: true,
        allowTaint: true
      });
      
      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `audit-bud-screenshot-${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
      
    } catch (error) {
      console.error('Screenshot failed:', error);
      // Fallback: try to use the browser's built-in screenshot API
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        try {
          const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: 'screen' }
          });
          const video = document.createElement('video');
          video.srcObject = stream;
          video.play();
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          video.addEventListener('loadedmetadata', () => {
            ctx.drawImage(video, 0, 0);
            stream.getTracks().forEach(track => track.stop());
            
            canvas.toBlob((blob) => {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `audit-bud-screenshot-${new Date().toISOString().split('T')[0]}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }, 'image/png');
          });
        } catch (fallbackError) {
          console.error('Fallback screenshot failed:', fallbackError);
          alert('Screenshot functionality is not available in this browser.');
        }
      } else {
        alert('Screenshot functionality is not available in this browser.');
      }
    }
  };

  return (
    <div className="w-full bg-dark-sidebar border-r border-gray-700 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-dark-text mb-2">Audit Bud</h1>
        <p className="text-sm text-dark-text-secondary">
          Your Automated Audit Readiness Assistant
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Chat Message */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-dark-card rounded-lg p-4 mb-6 flex-1"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <FileText className="w-5 h-5 text-accent-blue mt-0.5" />
            </div>
            <p className="text-dark-text-secondary text-sm">
              I'm ready to answer questions about <span className="text-accent-blue font-medium">audit document</span>. What would you like to know?
            </p>
          </div>
        </motion.div>

        {/* Input Area */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about the document..."
            disabled={isLoading}
            className="flex-1 bg-dark-card border border-gray-600 rounded-lg px-4 py-3 text-dark-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleScreenshot}
            className="bg-accent-grey hover:bg-gray-600 text-white p-3 rounded-lg transition-colors duration-200"
            title="Take Screenshot"
          >
            <Camera className="w-5 h-5" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
            className="bg-accent-blue hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors duration-200"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
