import React from 'react';
import { Link } from 'react-router-dom';
import TherapyCard from '../components/TherapyCard';
import { motion } from 'framer-motion';
import { Heart, Award, Shield, Users, ArrowRight, Video, Globe, BookOpen } from 'lucide-react';

const Home: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Your AI Companion for <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Mental Wellbeing</span>
              </h1>
              <p className="mt-4 text-xl text-gray-600">
                Personalized support through AI chat, video therapy, and multilingual audio sessions.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/chat"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg flex items-center"
                  >
                    Start Chatting <ArrowRight size={18} className="ml-2" />
                  </Link>
                </motion.div>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#features"
                  className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-md hover:shadow-lg border border-indigo-100"
                >
                  Learn More
                </motion.a>
              </div>
              <div className="mt-8 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-gradient-to-r ${
                      i === 0 ? 'from-indigo-400 to-indigo-500' :
                      i === 1 ? 'from-purple-400 to-purple-500' :
                      i === 2 ? 'from-pink-400 to-pink-500' :
                      'from-blue-400 to-blue-500'
                    }`}>
                      <span className="text-white text-xs font-bold">
                        {i === 0 ? 'JD' : i === 1 ? 'SK' : i === 2 ? 'AR' : 'MP'}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">10</span> people joined this week
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-3xl filter blur-3xl opacity-30 transform -rotate-6"></div>
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-50">
                <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <div className="flex items-center">
                    <Heart className="mr-2" size={20} />
                    <h3 className="font-bold">MindfulChat Assistant</h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <Heart size={16} className="text-indigo-600" />
                    </div>
                    <div className="bg-indigo-50 rounded-2xl rounded-tl-none p-3 text-sm text-gray-700">
                      Hello! I'm your mental health assistant. How are you feeling today?
                    </div>
                  </div>
                  <div className="flex items-start justify-end">
                    <div className="bg-purple-50 rounded-2xl rounded-tr-none p-3 text-sm text-gray-700">
                      I've been feeling anxious about my upcoming presentation.
                    </div>
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center ml-3 flex-shrink-0">
                      <Users size={16} className="text-purple-600" />
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <Heart size={16} className="text-indigo-600" />
                    </div>
                    <div className="bg-indigo-50 rounded-2xl rounded-tl-none p-3 text-sm text-gray-700">
                      That's completely understandable. Presentations can be stressful. Would you like to try a quick breathing exercise to help manage your anxiety?
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900"
            >
              Why Choose <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">MindEase</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Our platform combines cutting-edge AI with human expertise to provide comprehensive mental health support.
            </motion.p>
          </div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { 
                icon: <Shield className="h-6 w-6 text-indigo-600" />, 
                title: "Private & Secure", 
                description: "End-to-end encryption ensures your conversations remain completely confidential." 
              },
              { 
                icon: <Award className="h-6 w-6 text-purple-600" />, 
                title: "Professional Support", 
                description: "Connect with licensed therapists specializing in various mental health areas." 
              },
              { 
                icon: <Users className="h-6 w-6 text-pink-600" />, 
                title: "Multilingual", 
                description: "Support in English, Hindi, and Tamil to help you express yourself comfortably." 
              },
              { 
                icon: <Heart className="h-6 w-6 text-indigo-600" />, 
                title: "24/7 Availability", 
                description: "AI assistance available around the clock, whenever you need support." 
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                variants={item}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Therapy Options Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900"
            >
              Explore Our <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Therapy Options</span>
            </motion.h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TherapyCard
              title="Video Therapy"
              description="Connect with therapists through secure video sessions for personalized support"
              icon="video"
              to="/video-therapy"
              color="bg-gradient-to-r from-blue-500 to-blue-600"
            />
            <TherapyCard
              title="Regional Therapy"
              description="Find local therapists and counseling services in your area"
              icon="globe"
              to="/regional-therapy"
              color="bg-gradient-to-r from-purple-500 to-purple-600"
            />
            <TherapyCard
              title="Resources"
              description="Access mental health resources, guides, and educational materials"
              icon="book"
              to="/resources"
              color="bg-gradient-to-r from-indigo-500 to-indigo-600"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <Heart className="h-6 w-6 text-indigo-400" />
                <span className="ml-2 text-xl font-bold text-white">MindfulChat</span>
              </div>
              <p className="mt-2 text-gray-400">Your AI companion for mental wellbeing.</p>
              <div className="mt-4 flex space-x-4">
                {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                  <a key={social} href="#" className="text-gray-400 hover:text-indigo-400">
                    <span className="sr-only">{social}</span>
                    <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center">
                      <span className="text-xs">{social[0].toUpperCase()}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {['AI Chat Support', 'Video Therapy', 'Audio Therapy', 'Group Sessions'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-indigo-400">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {['About Us', 'Our Team', 'Careers', 'Contact Us'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-indigo-400">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'HIPAA Compliance'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-indigo-400">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 MindfulChat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;