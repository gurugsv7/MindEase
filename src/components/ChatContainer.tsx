import React, { useState, useRef, useEffect } from 'react';
import { Heart, Send, User } from 'lucide-react';
import { getGeminiResponse, Message } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';

const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Hello! I'm MindfulChat, your mental wellness assistant. How are you feeling today?"
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Add input reference
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Add effect to focus input after response is received
  useEffect(() => {
    if (!isLoading && messages.length > 1) {
      inputRef.current?.focus();
    }
  }, [isLoading, messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (input.trim() === '') return;
    
    const userMessage: Message = {
      role: 'user',
      content: input.trim()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get response from Gemini API
      const allMessages = [...messages, userMessage];
      const response = await getGeminiResponse(allMessages);
      
      setMessages(prev => [
        ...prev, 
        { role: 'model', content: response }
      ]);
      
      // Check if conversation has enough depth for analysis (at least 6 messages)
      if (allMessages.length >= 5) {
        await generateAnalysis([...allMessages, { role: 'model', content: response }]);
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'model', 
          content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateAnalysis = async (conversationMessages: Message[]) => {
    try {
      // Create a special prompt for analysis
      const analysisPrompt: Message = {
        role: 'user',
        content: `Based on our conversation so far, please provide a brief analysis of:
        1. My current mood and emotional state
        2. Whether my main concern or problem seems to be addressed
        3. Three key insights from our conversation
        4. Two personalized recommendations to help me further
        Format as JSON: {"mood": "...", "problemSolved": true/false, "insights": ["...", "...", "..."], "recommendations": ["...", "..."]}
        Only respond with the JSON, nothing else.`
      };
      
      // Get analysis from Gemini
      const analysisResponse = await getGeminiResponse([...conversationMessages, analysisPrompt]);
      
      try {
        // Parse the response as JSON
        const jsonStart = analysisResponse.indexOf('{');
        const jsonEnd = analysisResponse.lastIndexOf('}') + 1;
        const jsonString = analysisResponse.substring(jsonStart, jsonEnd);
        const analysisData = JSON.parse(jsonString);
        
        // Store analysis in localStorage
        localStorage.setItem('conversationAnalysis', JSON.stringify({
          analysis: analysisData,
          timestamp: new Date().toISOString(),
          messageCount: conversationMessages.length
        }));
      } catch (jsonError) {
        console.error('Failed to parse analysis JSON:', jsonError);
      }
    } catch (error) {
      console.error('Failed to generate analysis:', error);
    }
  };
  
  const handleViewAnalysis = () => {
    navigate('/conversation-analysis');
  };
  
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
        <div className="flex items-center">
          <Heart className="mr-2" size={20} />
          <h3 className="font-bold">MindEase Assistant</h3>
        </div>
        {messages.length >= 6 && (
          <button 
            onClick={handleViewAnalysis} 
            className="flex items-center text-xs bg-white bg-opacity-20 px-2 py-1 rounded-md hover:bg-opacity-30"
          >
            View Analysis
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`flex items-start ${message.role === 'user' ? 'justify-end' : ''}`}
          >
            {message.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                <Heart size={16} className="text-indigo-600" />
              </div>
            )}
            
            <div 
              className={`rounded-2xl p-3 text-sm ${
                message.role === 'user'
                  ? 'bg-purple-50 text-gray-700 rounded-tr-none'
                  : 'bg-indigo-50 text-gray-700 rounded-tl-none'
              } max-w-[80%]`}
            >
              {message.content}
            </div>
            
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center ml-3 flex-shrink-0">
                <User size={16} className="text-purple-600" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
              <Heart size={16} className="text-indigo-600" />
            </div>
            <div className="bg-indigo-50 rounded-2xl rounded-tl-none p-3 text-sm text-gray-700">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <input
            ref={inputRef} // Connect the ref to the input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || input.trim() === ''}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg px-4 py-2 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatContainer;