import React from 'react';
import { Message } from '../types';
import { motion } from 'framer-motion';
import { Bot, User, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex items-center justify-center h-10 w-10 rounded-full ${isBot ? 'bg-gradient-to-r from-indigo-500 to-purple-500 mr-3' : 'bg-gradient-to-r from-green-400 to-emerald-500 ml-3'}`}>
          {isBot ? <Bot size={20} className="text-white" /> : <User size={20} className="text-white" />}
        </div>
        <div>
          <div className={`py-3 px-4 rounded-2xl ${
            isBot 
              ? 'bg-white border border-indigo-100 shadow-sm text-gray-800' 
              : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
          }`}>
            <p className="text-sm">{message.content}</p>
          </div>
          <div className="flex items-center mt-1">
            <p className="text-xs text-gray-500">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            {isBot && (
              <div className="flex ml-2 space-x-1">
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <ThumbsUp size={12} className="text-gray-400 hover:text-indigo-500" />
                </button>
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <ThumbsDown size={12} className="text-gray-400 hover:text-indigo-500" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;