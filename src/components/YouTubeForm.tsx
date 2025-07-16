import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Send, Loader2, Sparkles, Link } from 'lucide-react';
import toast from 'react-hot-toast';

interface YouTubeFormProps {
  onSubmit: (url: string, question: string) => Promise<void>;
  isLoading: boolean;
}

const YouTubeForm: React.FC<YouTubeFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [question, setQuestion] = useState('Please provide a comprehensive summary of this video');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }
    
    if (!isValidYouTubeUrl(url.trim())) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }
    
    try {
      await onSubmit(url.trim(), question);
      setUrl('');
      setQuestion('Please provide a comprehensive summary of this video');
      toast.success('Video processed successfully!');
    } catch (error) {
      toast.error('Failed to process video');
    }
  };

  const isValidYouTubeUrl = (url: string) => {
    const patterns = [
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=.+$/,
      /^(https?:\/\/)?(www\.)?youtu\.be\/.+$/
    ];
    return patterns.some(pattern => pattern.test(url));
  };

  const quickQuestions = [
    "Summarize the main points",
    "What are the key takeaways?",
    "Explain the topic in simple terms",
    "List the important facts mentioned"
  ];

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg">
          <Youtube className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">YouTube Analyzer</h2>
          <p className="text-gray-600">Extract insights from any YouTube video</p>
        </div>
      </motion.div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Link className="w-4 h-4 inline mr-2" />
            YouTube URL
          </label>
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500"
              required
              disabled={isLoading}
            />
            {url && isValidYouTubeUrl(url) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </motion.div>
            )}
          </div>
          {url && !isValidYouTubeUrl(url) && (
            <motion.p 
              className="text-sm text-red-500 mt-2 flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Please enter a valid YouTube URL
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Sparkles className="w-4 h-4 inline mr-2" />
            What would you like to know?
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about the video content..."
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500 resize-none"
            rows={4}
            disabled={isLoading}
          />
          
          <div className="mt-3 flex flex-wrap gap-2">
            {quickQuestions.map((q, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => setQuestion(q)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full transition-colors duration-200 border border-gray-200 hover:border-red-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {q}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.button
          type="submit"
          disabled={isLoading || !url.trim() || !isValidYouTubeUrl(url)}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing Video...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Analyze Video</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default YouTubeForm;