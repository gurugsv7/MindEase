import React, { useState, useEffect } from 'react';
import { LineChart, Brain, ArrowLeft, BarChart2, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

type AnalysisData = {
  mood: string;
  problemSolved: boolean;
  insights: string[];
  recommendations: string[];
};

type StoredAnalysis = {
  analysis: AnalysisData;
  timestamp: string;
  messageCount: number;
};

const ConversationAnalysis: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<StoredAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAnalysis = localStorage.getItem('conversationAnalysis');
    
    if (storedAnalysis) {
      try {
        const data = JSON.parse(storedAnalysis) as StoredAnalysis;
        setAnalysisData(data);
      } catch (error) {
        console.error('Failed to parse stored analysis:', error);
      }
    }
    
    setIsLoading(false);
  }, []);

  const formattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleBack = () => {
    navigate('/chat');
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <Brain size={48} className="text-indigo-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Analysis Available</h2>
        <p className="text-gray-500 mb-6 text-center">
          You need to have a conversation with MindfulChat before we can generate an analysis.
        </p>
        <button
          onClick={handleBack}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" /> Return to Chat
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 h-full">
      <button
        onClick={handleBack}
        className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800"
      >
        <ArrowLeft size={18} className="mr-1" /> Back to Chat
      </button>
      
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center">
          <LineChart className="mr-2" size={24} />
          <h1 className="text-xl font-bold">Conversation Analysis</h1>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Your Mental Wellness Report</h2>
              <p className="text-gray-500">
                Based on {analysisData.messageCount} messages exchanged
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Generated: {formattedDate(analysisData.timestamp)}
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-indigo-50 p-5 rounded-xl">
              <h3 className="text-lg font-medium text-indigo-800 mb-3 flex items-center">
                <BarChart2 size={20} className="mr-2" /> Emotional Assessment
              </h3>
              <p className="text-gray-700 bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
                {analysisData.analysis.mood}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Problem Resolution Status</h3>
              <div className={`p-4 rounded-xl flex items-start gap-3 ${
                analysisData.analysis.problemSolved 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
              }`}>
                {analysisData.analysis.problemSolved ? (
                  <CheckCircle size={24} className="text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle size={24} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-medium mb-1">
                    {analysisData.analysis.problemSolved ? 'Issue Addressed' : 'Needs Further Attention'}
                  </h4>
                  <p className="text-sm">
                    {analysisData.analysis.problemSolved
                      ? 'Based on your conversation, it appears that your main concerns have been adequately addressed.'
                      : 'Your conversation suggests that some of your concerns may require additional attention or support.'}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Key Insights</h3>
              <div className="space-y-3">
                {analysisData.analysis.insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-800 text-sm font-medium">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{insight}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Personalized Recommendations</h3>
              <div className="space-y-3">
                {analysisData.analysis.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-indigo-50 p-4 rounded-lg shadow-sm border border-indigo-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 rounded-full p-2 flex-shrink-0">
                        <Brain size={16} className="text-indigo-700" />
                      </div>
                      <p className="text-gray-700">{rec}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ConversationAnalysis;
