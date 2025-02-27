import React, { useState } from 'react';
import { Send, Mic, MicOff, Smile, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isListening?: boolean;
  toggleListening?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isListening = false, 
  toggleListening 
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white rounded-b-xl">
      <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100 flex items-center">
        <span className="flex-1">Type a message or use voice input</span>
        <span className="text-indigo-500">Shift+Enter for new line</span>
      </div>
      <form onSubmit={handleSubmit} className="flex items-center p-3">
        <div className="flex space-x-2 mr-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
          >
            <Paperclip size={20} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
          >
            <Smile size={20} />
          </motion.button>
        </div>
        
        <div className={`flex-grow relative rounded-full border ${isFocused ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-300'}`}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type your message here..."
            className="w-full py-2 px-4 rounded-full resize-none focus:outline-none bg-transparent max-h-20"
            rows={1}
          />
        </div>
        
        <div className="flex space-x-2 ml-2">
          {toggleListening && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-full ${isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={`p-2 rounded-full ${
              message.trim() 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                : 'bg-gray-100 text-gray-400'
            }`}
            disabled={!message.trim()}
          >
            <Send size={20} />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;