import React from 'react';
import { motion } from 'framer-motion';
import { Video, Headphones, ArrowRight, Globe, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TherapyCardProps {
  title: string;
  description: string;
  icon: 'video' | 'audio' | 'globe' | 'book';
  to: string;
  color: string;
}

const TherapyCard: React.FC<TherapyCardProps> = ({ title, description, icon, to, color }) => {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
        whileTap={{ scale: 0.98 }}
        className={`p-6 rounded-xl shadow-md ${color} text-white cursor-pointer overflow-hidden relative`}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mt-10 -mr-10" />
        
        <div className="flex items-center mb-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-full mr-4">
            {icon === 'video' && <Video size={24} />}
            {icon === 'audio' && <Headphones size={24} />}
            {icon === 'globe' && <Globe size={24} />}
            {icon === 'book' && <BookOpen size={24} />}
          </div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-sm opacity-90 mb-4">{description}</p>
        <div className="flex justify-end">
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center text-sm font-medium"
          >
            <span className="mr-1">Get Started</span>
            <ArrowRight size={16} />
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
};

export default TherapyCard;