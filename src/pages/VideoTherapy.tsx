import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, MicOff, Video, VideoOff, Phone, 
  MessageCircle, X, Maximize, Minimize, 
  Settings, Volume2, VolumeX, ArrowLeft 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getGeminiResponse, Message } from '../services/geminiService';

const VideoTherapy: React.FC = () => {
  // Video call states
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [isMicOn, setIsMicOn] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  
  // Chat states
  const [chatMessages, setChatMessages] = useState<Array<{
    content: string;
    sender: 'user' | 'therapist';
    timestamp: Date;
  }>>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChatExpanded, setIsChatExpanded] = useState<boolean>(true);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Function to toggle camera
  const toggleCamera = async () => {
    if (isCameraOn) {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      setIsCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access camera. Please check your permissions.");
      }
    }
  };

  // Function to toggle microphone
  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  // Function to toggle audio mute
  const toggleAudio = () => {
    setIsAudioMuted(!isAudioMuted);
  };

  // Function to toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Function to start call
  const startCall = () => {
    setIsConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsCallActive(true);
      
      // Add initial therapist message
      setChatMessages([{
        content: "Hello! I'm Dr. Sarah, your therapist for today's session. How are you feeling?",
        sender: 'therapist',
        timestamp: new Date()
      }]);
      
      // Auto-start camera
      toggleCamera();
    }, 2000);
  };

  // Function to end call
  const endCall = () => {
    if (isCameraOn && videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraOn(false);
    setIsCallActive(false);
    setIsMicOn(false);
  };

  // Function to send a message
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessage = {
      content: inputMessage.trim(),
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // Scroll chat to bottom
    setTimeout(() => {
      scrollToBottom();
    }, 100);

    try {
      // Format messages for the API
      const messagesForApi: Message[] = chatMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        content: msg.content
      }));
      
      messagesForApi.push({
        role: 'user',
        content: userMessage.content
      });

      // Get response from Gemini
      const response = await getGeminiResponse(messagesForApi);
      
      // Add therapist response
      setChatMessages(prev => [...prev, {
        content: response,
        sender: 'therapist',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Error getting response:", error);
      
      // Add error message
      setChatMessages(prev => [...prev, {
        content: "I'm sorry, I'm having trouble connecting. Can you try again?",
        sender: 'therapist',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      
      // Scroll chat to bottom again after response
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  };

  // Function to scroll chat to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Handle Enter key press in input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-purple-50 pt-16 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Home</span>
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Video Therapy Session
          </h1>
          <p className="text-gray-600 mt-2">
            Connect with your therapist through secure video and chat
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-200px)] min-h-[500px]">
          {/* Video Call Section - Left Side */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 lg:w-3/5"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center">
              <h2 className="font-semibold">Video Session</h2>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleFullScreen} 
                  className="p-1.5 rounded-full hover:bg-white/20"
                >
                  {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
                <button 
                  onClick={toggleAudio} 
                  className="p-1.5 rounded-full hover:bg-white/20"
                >
                  {isAudioMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button 
                  className="p-1.5 rounded-full hover:bg-white/20"
                >
                  <Settings size={18} />
                </button>
              </div>
            </div>
            
            <div className="relative h-full bg-gray-900 flex items-center justify-center" style={{ height: 'calc(100% - 66px)' }}>
              {!isCallActive ? (
                <div className="text-center p-8">
                  {isConnecting ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                      <p className="text-white mt-4">Connecting to your therapist...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-indigo-100 mb-4 flex items-center justify-center">
                        <Video size={40} className="text-indigo-600" />
                      </div>
                      <h3 className="text-white text-lg font-medium mb-2">Ready to start your session?</h3>
                      <p className="text-gray-300 mb-6">Your therapist is ready to meet with you</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startCall}
                        className="px-6 py-3 bg-green-500 text-white rounded-full font-medium flex items-center justify-center"
                      >
                        <Video className="mr-2" size={18} />
                        Start Video Session
                      </motion.button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    className="w-full h-full object-cover" 
                    style={{ filter: !isCameraOn ? 'blur(10px) brightness(0.7)' : 'none' }}
                  />
                  
                  {!isCameraOn && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                        <VideoOff size={40} className="text-gray-400" />
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                        <span className="text-white font-medium">DR</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleMic}
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${isMicOn ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'}`}
                    >
                      {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleCamera}
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${isCameraOn ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'}`}
                    >
                      {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={endCall}
                      className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white"
                    >
                      <Phone size={24} className="transform rotate-135" />
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Chat Section - Right Side */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 lg:w-2/5 flex flex-col ${isChatExpanded ? '' : 'h-14'}`}
          >
            <div 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex justify-between items-center cursor-pointer"
              onClick={() => setIsChatExpanded(!isChatExpanded)}
            >
              <div className="flex items-center">
                <MessageCircle className="mr-2" size={20} />
                <h2 className="font-semibold">Session Chat</h2>
              </div>
              <button className="p-1.5 rounded-full hover:bg-white/20">
                {isChatExpanded ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
            
            {isChatExpanded && (
              <>
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                  style={{ height: 'calc(100% - 118px)' }}
                >
                  {chatMessages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'user' 
                            ? 'bg-indigo-100 text-gray-800' 
                            : 'bg-purple-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-purple-100 rounded-lg p-3 text-gray-800">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={!isCallActive || isLoading}
                    />
                    <button 
                      onClick={() => isMicOn ? toggleMic() : toggleMic()}
                      disabled={!isCallActive}
                      className={`p-2 rounded-lg ${isMicOn ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'} disabled:opacity-50`}
                    >
                      {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                    </button>
                    <button 
                      onClick={sendMessage}
                      disabled={!isCallActive || !inputMessage.trim() || isLoading}
                      className="p-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Information Section */}
        {!isCallActive && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-white p-6 rounded-xl shadow-md border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Session Information</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-medium text-indigo-800 mb-2">Your Therapist</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center mr-3">
                    <span className="text-indigo-600 font-medium">DR</span>
                  </div>
                  <div>
                    <p className="font-medium">Dr. Sarah Johnson</p>
                    <p className="text-sm text-gray-600">Clinical Psychologist</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-800 mb-2">Session Details</h3>
                <p className="text-sm mb-1"><strong>Duration:</strong> 45 minutes</p>
                <p className="text-sm mb-1"><strong>Focus:</strong> Anxiety Management</p>
                <p className="text-sm"><strong>Session #:</strong> 3 of 8</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Next Steps</h3>
                <p className="text-sm text-gray-700">
                  After this session, you'll receive a summary and recommended exercises via email.
                </p>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                  View previous session notes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VideoTherapy;