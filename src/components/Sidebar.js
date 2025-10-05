import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, Loader2, Camera, User, Bot } from 'lucide-react';

const Sidebar = ({ onSendMessage, isLoading, chatMessages }) => {
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

  // Simple markdown formatter for bot responses
  const formatBotResponse = (text) => {
    if (!text) return '';
    
    // Convert **text** to <strong>text</strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *text* to <em>text</em>
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert line breaks to <br>
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Convert bullet points
    formatted = formatted.replace(/^\* (.*$)/gm, '• $1');
    
    return formatted;
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
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark-text tracking-tight">Audit Bud</h1>
            <div className="w-12 h-0.5 bg-gradient-to-r from-accent-blue to-transparent mt-1"></div>
          </div>
        </div>
        <p className="text-sm text-dark-text-secondary font-medium">
          Your Automated Audit Readiness Assistant
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {/* Welcome Message */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-start space-x-3"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-700 rounded-lg p-4 max-w-[85%]">
              <p className="text-white text-sm">
                I'm ready to answer questions about <span className="text-accent-blue font-medium">audit document</span>. What would you like to know?
              </p>
            </div>
          </motion.div>

          {/* Chat Messages */}
          {(chatMessages || []).map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start space-x-3 ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.type === 'user' 
                  ? 'bg-accent-grey' 
                  : 'bg-accent-blue'
              }`}>
                {msg.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`rounded-lg p-4 max-w-[85%] ${
                msg.type === 'user' 
                  ? 'bg-accent-blue text-white' 
                  : 'bg-gray-700 text-white'
              }`}>
                {msg.type === 'user' ? (
                  <p className="text-sm text-white">
                    {msg.content || 'No content'}
                  </p>
                ) : (
                  <div 
                    className="text-sm text-gray-800 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: formatBotResponse(msg.content || 'No content') 
                    }}
                  />
                )}
              </div>
            </motion.div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-dark-card rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-accent-blue" />
                  <p className="text-dark-text-secondary text-sm">Thinking...</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

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
