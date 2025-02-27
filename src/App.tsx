import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Chat from './pages/Chat';
import VideoTherapy from './pages/VideoTherapy';
import AudioTherapy from './pages/AudioTherapy';
import ConversationAnalysis from './components/ConversationAnalysis';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chat" element={<Chat />} />
          <Route path="video-therapy" element={<VideoTherapy />} />
          <Route path="audio-therapy" element={<AudioTherapy />} />
          <Route path="conversation-analysis" element={<ConversationAnalysis />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;