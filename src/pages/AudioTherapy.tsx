import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Headphones, Languages, Volume2, Send, Mic, AlertCircle, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Language type
export type Language = 'english' | 'hindi' | 'tamil';

const AudioTherapy: React.FC = () => {
  // Basic states
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english');
  const [inputMessage, setInputMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'ai' }>>([]);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const shouldRestartRecognitionRef = useRef(true);

  // Language content configuration
  const languageContent = {
    english: {
      placeholder: "Type your message here...",
      welcomeMessage: "Hello! How are you feeling today?",
      sendButton: "Send",
      loadingText: "Thinking...",
      listeningText: "Listening...",
      microphoneTooltip: "Speak in English"
    },
    hindi: {
      placeholder: "अपना संदेश यहां टाइप करें...",
      welcomeMessage: "नमस्ते! आज आप कैसा महसूस कर रहे हैं?",
      sendButton: "भेजें",
      loadingText: "सोच रहा हूँ...",
      listeningText: "सुन रहा हूँ...",
      microphoneTooltip: "हिंदी में बोलें"
    },
    tamil: {
      placeholder: "உங்கள் செய்தியை இங்கே தட்டச்சு செய்யவும்...",
      welcomeMessage: "வணக்கம்! இன்று நீங்கள் எப்படி உணருகிறீர்கள்?",
      sendButton: "அனுப்பு",
      loadingText: "யோசிக்கிறேன்...",
      listeningText: "கேட்கிறேன்...",
      microphoneTooltip: "தமிழில் பேசவும்"
    }
  };

  const languageCodes = {
    english: 'en-US',
    hindi: 'hi-IN',
    tamil: 'ta-IN'
  };

  // Simplified function to get response in selected language
  const getResponseInLanguage = async (userMessage: string, language: Language): Promise<string> => {
    const API_KEY = "AIzaSyDW3yJZn-XldiU3iYL-beZQsmOC10dTr8Q";
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    
    try {
      let systemPrompt = "";
      
      switch (language) {
        case 'hindi':
          systemPrompt = "आप मानसिक स्वास्थ्य सहायक हैं। कृपया हिंदी में संक्षिप्त उत्तर दें (1-3 वाक्य)। सहानुभूतिपूर्ण रहें और अक्सर प्रश्न पूछें। उपयोगकर्ता को आगे बात करने के लिए प्रोत्साहित करें।";
          break;
        case 'tamil':
          systemPrompt = "நீங்கள் மன நல உதவியாளர். தயவுசெய்து தமிழில் சுருக்கமான பதில்களை வழங்கவும் (1-3 வாக்கியங்கள்). அனுதாபத்துடன் இருங்கள் மற்றும் அடிக்கடி கேள்விகளைக் கேட்கவும். பயனரை மேலும் பேச ஊக்குவிக்கவும்.";
          break;
        default:
          systemPrompt = "You are a mental health assistant. Provide very short, clear responses (1-3 sentences) in English. Be empathetic and ask follow-up questions frequently. Encourage the user to elaborate.";
      }
      
      const response = await axios.post(
        `${API_URL}?key=${API_KEY}`,
        {
          contents: [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "user", parts: [{ text: userMessage }] }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100,
          }
        }
      );
      
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Error getting response from Gemini:", error);
      
      const fallbackResponses = {
        english: "I'm having trouble connecting. Can you try again?",
        hindi: "मुझे कनेक्ट करने में परेशानी हो रही है। क्या आप फिर से कोशिश कर सकते हैं?",
        tamil: "இணைப்பதில் எனக்கு சிரமம் உள்ளது. மீண்டும் முயற்சிக்க முடியுமா?"
      };
      
      return fallbackResponses[language];
    }
  };

  // Add helper function for toggling listening state
  const toggleListeningState = () => {
    if (isListening) {
      shouldRestartRecognitionRef.current = false;
      recognitionRef.current?.stop();
    } else {
      shouldRestartRecognitionRef.current = true;
      if (hasMicPermission === false) {
        requestMicrophonePermission();
      } else if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error("Failed to start recognition:", e);
        }
      }
    }
  };

  // Modified setupSpeechRecognition function - moved outside component
  const createSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error("Speech recognition not supported");
      return null;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    
    return recognition;
  };

  // Create a stable reference to the recognition instance
  const recognitionRef = useRef<any>(null);

  // Modified speech recognition setup and event handlers
  const setupSpeechRecognition = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = createSpeechRecognition();
    }

    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.lang = languageCodes[selectedLanguage];
    
    recognition.onstart = () => {
      console.log("Speech recognition started");
      setIsListening(true);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      
      if (event.results[0].isFinal) {
        shouldRestartRecognitionRef.current = true;
        handleSendMessage(transcript);
        recognition.stop();
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
      shouldRestartRecognitionRef.current = false;
      if (event.error === 'not-allowed') setHasMicPermission(false);
    };
    
    recognition.onend = () => {
      console.log("Speech recognition ended");
      setIsListening(false);

      if (shouldRestartRecognitionRef.current && !isLoading && hasMicPermission) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.error("Failed to restart recognition:", e);
          }
        }, 1000);
      }
    };
  };

  // Set up initial welcome message when language changes
  useEffect(() => {
    const initialMessage = { text: languageContent[selectedLanguage].welcomeMessage, sender: 'ai' as const };
    setMessages([initialMessage]);
    
    if (autoSpeak) {
      setTimeout(() => playAudio(initialMessage.text), 500);
    }
  }, [selectedLanguage]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Modified useEffect for speech recognition
  useEffect(() => {
    // Properly stop any existing recognition instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
    }
    
    // Create a new instance with the current language
    recognitionRef.current = createSpeechRecognition();
    setupSpeechRecognition();
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error("Error stopping recognition:", e);
        }
      }
    };
  }, [selectedLanguage]);

  // Ensure voices are loaded for speech synthesis
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    
    loadVoices();
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Request microphone permission
  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicPermission(true);
      setIsListening(true);
    } catch (error) {
      console.error("Error requesting microphone permission:", error);
      setHasMicPermission(false);
      alert("Please grant microphone permissions to use speech recognition");
    }
  };

  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as Language;
    setIsListening(false);
    setSelectedLanguage(newLanguage);
  };

  // Modified handleSendMessage function
  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim() || isLoading) return;
    
    if (isListening) {
      recognitionRef.current?.stop();
    }

    const userMessageText = message.trim();
    setMessages(prev => [...prev, { text: userMessageText, sender: 'user' }]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const response = await getResponseInLanguage(userMessageText, selectedLanguage);
      setMessages(prev => [...prev, { text: response, sender: 'ai' }]);
      
      if (autoSpeak) {
        setTimeout(() => playAudio(response), 300);
      }
    } catch (error) {
      console.error("Error in conversation:", error);
      const errorMessages = {
        english: "Sorry, I couldn't process your request. Please try again.",
        hindi: "क्षमा करें, मैं आपके अनुरोध को संसाधित नहीं कर सका। कृपया पुन: प्रयास करें।",
        tamil: "மன்னிக்கவும், உங்கள் கோரிக்கையை செயலாக்க முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்."
      };
      
      setMessages(prev => [...prev, { text: errorMessages[selectedLanguage], sender: 'ai' }]);
    } finally {
      setIsLoading(false);
     }
  };

  // Text-to-speech function
  const playAudio = (messageText: string) => {
    if (!messageText) return;
    
    setIsPlaying(true);
    window.speechSynthesis.cancel(); // Stop any current speech
    
    const utterance = new SpeechSynthesisUtterance(messageText);
    utterance.lang = languageCodes[selectedLanguage];
    
    // Try to find a voice for the language
    const voices = window.speechSynthesis.getVoices();
    const languageCode = languageCodes[selectedLanguage].slice(0, 2);
    const voicesForLanguage = voices.filter(voice => voice.lang.startsWith(languageCode));
    
    if (voicesForLanguage.length > 0) {
      const femaleVoice = voicesForLanguage.find(voice => voice.name.includes('Female'));
      utterance.voice = femaleVoice || voicesForLanguage[0];
    }
    
    // Adjust speaking speed based on language
    if (selectedLanguage === 'hindi' || selectedLanguage === 'tamil') {
      utterance.rate = 1.0; // Slightly faster for Hindi and Tamil
    } else {
      utterance.rate = 1.0; // Normal speed for English
    }
    
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // Toggle auto-speak
  const toggleAutoSpeak = () => {
    if (autoSpeak && isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
    setAutoSpeak(!autoSpeak);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6">
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Home</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
          style={{ height: "70vh" }}
        >
          <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Headphones size={28} className="mr-3" />
                <h1 className="text-2xl font-bold">Regional Audio Therapy</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleAutoSpeak}
                  className={`flex items-center rounded-full p-2 ${autoSpeak ? 'bg-green-400' : 'bg-gray-400'}`}
                  title={autoSpeak ? "Auto-speak is on" : "Auto-speak is off"}
                >
                  {autoSpeak ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                
                <div className="relative">
                  <select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    className="bg-white bg-opacity-20 text-white rounded-md py-1 px-3 appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-white"
                    style={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    <option value="english" style={{ color: 'black' }}>English</option>
                    <option value="hindi" style={{ color: 'black' }}>हिंदी (Hindi)</option>
                    <option value="tamil" style={{ color: 'black' }}>தமிழ் (Tamil)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 p-6 overflow-y-auto"
          >
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{message.text}</p>
                  {message.sender === 'ai' && !autoSpeak && (
                    <button 
                      onClick={() => playAudio(message.text)}
                      disabled={isPlaying}
                      className={`mt-2 flex items-center text-xs ${
                        isPlaying ? 'text-purple-300' : 'text-purple-600 hover:text-purple-800'
                      }`}
                      title={isPlaying ? 'Speaking...' : `Listen in ${selectedLanguage}`}
                    >
                      <Volume2 size={14} className="mr-1" />
                      <span>{isPlaying ? 'Speaking...' : 'Listen'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 rounded-lg p-3 flex items-center">
                  <div className="flex space-x-1 mr-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                        className="w-2 h-2 bg-purple-500 rounded-full"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">{languageContent[selectedLanguage].loadingText}</p>
                </div>
              </div>
            )}

            {/* Listening indicator */}
            {isListening && !isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-blue-100 rounded-lg p-3 flex items-center">
                  <div className="flex space-x-1 mr-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-blue-600">{languageContent[selectedLanguage].listeningText}</p>
                </div>
              </div>
            )}
          </div>

          {/* Message input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              {hasMicPermission === false ? (
                <button
                  onClick={requestMicrophonePermission}
                  className="flex items-center p-2 bg-red-100 hover:bg-red-200 rounded-full mr-2 transition-colors"
                  title="Click to enable microphone"
                >
                  <AlertCircle size={20} className="text-red-600" />
                </button>
              ) : (
                <button
                  onClick={toggleListeningState}
                  className={`flex items-center p-2 ${isListening ? 'bg-blue-100' : 'bg-gray-100'} rounded-full mr-2`}
                  title={languageContent[selectedLanguage].microphoneTooltip}
                >
                  <div className="relative flex items-center justify-center">
                    <Mic size={20} className={`z-10 ${isListening ? 'text-blue-600' : 'text-gray-400'}`} />
                    {isListening && (
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.2, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full bg-blue-300"
                      />
                    )}
                  </div>
                </button>
              )}
              
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`${languageContent[selectedLanguage].placeholder} (or just speak)`}
                className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                className={`px-4 py-2 rounded-r-lg flex items-center ${
                  isLoading || !inputMessage.trim() ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
                } text-white`}
                disabled={isLoading || !inputMessage.trim()}
              >
                <Send size={18} className="mr-1" />
                <span>{languageContent[selectedLanguage].sendButton}</span>
              </button>
            </div>
            
            {!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window) && (
              <div className="mt-2 flex items-center text-sm text-red-500">
                <AlertCircle size={16} className="mr-1" />
                <span>Voice recognition not supported in this browser</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Benefits section remains unchanged */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Benefits of Audio Therapy</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <Languages size={24} className="text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Language Comfort</h3>
              <p className="text-sm text-gray-600">Express yourself in your native language for more effective therapy</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                <Headphones size={24} className="text-pink-600" />
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Privacy</h3>
              <p className="text-sm text-gray-600">Audio-only sessions provide an additional layer of privacy and comfort</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                <Volume2 size={24} className="text-indigo-600" />
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Accessibility</h3>
              <p className="text-sm text-gray-600">Text-to-speech features make therapy accessible to everyone</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioTherapy;