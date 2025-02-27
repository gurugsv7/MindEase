import React from 'react';
import ChatContainer from '../components/ChatContainer';
import TherapyCard from '../components/TherapyCard';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Chat: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8 text-center"
        >
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            MindfulChat
          </span>{" "}
          Assistant
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="h-[600px]">
              <ChatContainer />
            </div>
          </div>
          
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Therapy Options</h2>
              <div className="space-y-4">
                <TherapyCard
                  title="Video Therapy"
                  description="Connect with a therapist through secure video calls for face-to-face sessions."
                  icon="video"
                  to="/video-therapy"
                  color="bg-gradient-to-r from-blue-500 to-indigo-600"
                />
                
                <TherapyCard
                  title="Regional Audio Therapy"
                  description="Audio sessions in Hindi & Tamil with speech-to-text support."
                  icon="audio"
                  to="/audio-therapy"
                  color="bg-gradient-to-r from-purple-500 to-pink-500"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
