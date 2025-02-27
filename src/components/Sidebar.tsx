import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  MessageCircle, 
  Video, 
  Headphones, 
  Compass, 
  Calendar,
  BookOpen,
  Settings,
  LineChart
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Home' },
    { to: '/chat', icon: <MessageCircle size={20} />, label: 'Chat Assistant' },
    { to: '/video-therapy', icon: <Video size={20} />, label: 'Video Therapy' },
    { to: '/audio-therapy', icon: <Headphones size={20} />, label: 'Audio Therapy' },
    { to: '/conversation-analysis', icon: <LineChart size={20} />, label: 'Conversation Analysis' },
    { to: '/explore', icon: <Compass size={20} />, label: 'Explore' },
    { to: '/schedule', icon: <Calendar size={20} />, label: 'Schedule' },
    { to: '/resources', icon: <BookOpen size={20} />, label: 'Resources' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' }
  ];
  
  return (
    <div className="bg-white h-full rounded-xl shadow-md p-4 flex flex-col border border-gray-100">
      <div className="flex items-center mb-6 px-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm mr-2">
          M
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
          MindEase
        </h2>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="bg-indigo-50 rounded-lg p-3 mt-4">
        <h3 className="text-sm font-medium text-indigo-700 mb-1">Need help?</h3>
        <p className="text-xs text-indigo-600">
          Contact our support team for assistance with your mental wellness journey.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
