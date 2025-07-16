import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import AuthButton from './components/AuthButton';
import YouTubeForm from './components/YouTubeForm';
import VideoUploader from './components/VideoUploader';
import SummaryDisplay from './components/SummaryDisplay';
import HistoryPanel from './components/HistoryPanel';
import { Brain, Youtube, Sparkles, Zap } from 'lucide-react';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

function Dashboard({ user, setUser, ...props }: any) {
=======

const API_BASE_URL = 'http://localhost:5000/api';

export default function App() {
  const [user, setUser] = useState<any>(null);
>>>>>>> 61c0689124276422fb62bfd1b67cfe2b1f4045ab
  const [activeTab, setActiveTab] = useState<'youtube' | 'upload'>('youtube');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);
<<<<<<< HEAD

  const navigate = useNavigate();
=======
>>>>>>> 61c0689124276422fb62bfd1b67cfe2b1f4045ab

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleYouTubeSubmit = async (url: string, question: string) => {
    setIsLoading(true);
    setSummary('');
    setSelectedHistoryItem(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/summarize-youtube`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
<<<<<<< HEAD
        body: JSON.stringify({ video_url: url, question, user_id: user?.id }), // add user_id
=======
        body: JSON.stringify({ video_url: url, question }),
>>>>>>> 61c0689124276422fb62bfd1b67cfe2b1f4045ab
      });
      const data = await response.json();
      
      // Extract video ID from URL
      const videoIdMatch = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
      const videoId = videoIdMatch ? videoIdMatch[1] : '';
      
      setSummary(data.summary);
      setCurrentVideoId(videoId);
      setCurrentQuestion(question);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoUpload = async (file: File, question: string) => {
    setIsLoading(true);
    setSummary('');
    setSelectedHistoryItem(null);
    
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('question', question);
      if (user?.id) {
        formData.append('user_id', user.id);
      }

      const response = await fetch(`${API_BASE_URL}/summarize-upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      setSummary(data.summary);
      setCurrentVideoId('');
      setCurrentQuestion(question);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (item: any) => {
<<<<<<< HEAD
    navigate(`/history/${item.id}`, { state: { item } });
=======
    setSelectedHistoryItem(item);
    setSummary(item.answer);
    setCurrentQuestion(item.question);
    setCurrentVideoId(item.video_id || '');
>>>>>>> 61c0689124276422fb62bfd1b67cfe2b1f4045ab
  };

  // Animated login screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          className="relative bg-white/10 backdrop-blur-xl p-12 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 space-y-8"
        >
          <motion.div 
            className="flex flex-col items-center space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative"
            >
              <Brain className="w-16 h-16 text-white drop-shadow-lg" />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl font-bold text-white text-center bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              YouTubeBuddy
            </motion.h1>
            
            <motion.p 
              className="text-white/80 text-center text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              AI-powered video intelligence at your fingertips
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="space-y-4"
          >
            <AuthButton onAuth={setUser} />
            
            <div className="flex items-center justify-center space-x-6 text-white/60 text-sm">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Instant Summaries</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>AI-Powered</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }
          }}
        />
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <motion.div 
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <Brain className="w-10 h-10 text-indigo-600" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </motion.div>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                YouTubeBuddy
              </h1>
              <p className="text-xs text-gray-500">AI Video Intelligence</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AuthButton onAuth={setUser} />
          </motion.div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden"
            >
              <div className="flex">
                <motion.button
                  onClick={() => setActiveTab('youtube')}
                  className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 ${
                    activeTab === 'youtube'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Youtube className="w-5 h-5" />
                    YouTube URL
                  </div>
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 ${
                    activeTab === 'upload'
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Upload Video
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'youtube' ? (
                <motion.div
                  key="youtube"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <YouTubeForm onSubmit={handleYouTubeSubmit} isLoading={isLoading} />
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <VideoUploader onSubmit={handleVideoUpload} isLoading={isLoading} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Summary Display */}
            <AnimatePresence>
              {(summary || isLoading) && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, type: 'spring' }}
                >
                  <SummaryDisplay 
                    summary={summary} 
                    videoId={currentVideoId}
                    question={currentQuestion}
                    isLoading={isLoading} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* History Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <HistoryPanel userId={user?.id} onSelectItem={handleHistorySelect} />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer 
        className="bg-white/50 backdrop-blur-xl border-t border-white/20 mt-16 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            © 2024 YouTubeBuddy. Powered by AI • Built with ❤️ using React, Flask, and Supabase
          </p>
        </div>
      </motion.footer>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }
        }}
      />
    </div>
  );
}

function SummaryPage() {
  const { state } = useLocation();
  const { item } = state || {};
  if (!item) return <div>No summary found.</div>;
  return (
    <div className="max-w-2xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-4">Summary Details</h2>
      {item.video_id && (
        <div className="mb-6">
          <iframe
            src={`https://www.youtube.com/embed/${item.video_id}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full aspect-video rounded-lg shadow-lg"
          />
        </div>
      )}
      <div className="bg-white/80 rounded-xl shadow-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold mb-2">Question</h3>
        <p className="mb-4 text-blue-700 font-medium">{item.question}</p>
        <h3 className="text-lg font-semibold mb-2">Summary</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{item.answer}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard user={user} setUser={setUser} />} />
        <Route path="/history/:id" element={<SummaryPage />} />
      </Routes>
    </Router>
  );
}