import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, CheckCircle, FileText, Clock, User, Sparkles, Eye, Download } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import toast from 'react-hot-toast';

interface SummaryDisplayProps {
  summary: string;
  videoId?: string;
  question: string;
  transcriptLength?: number;
  isLoading?: boolean;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ 
  summary, 
  videoId, 
  question, 
  transcriptLength,
  isLoading = false 
}) => {
  const [copied, setCopied] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy text');
    }
  };

  const downloadSummary = () => {
    const content = `Question: ${question}\n\nSummary:\n${summary}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video-summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Summary downloaded!');
  };

  if (isLoading) {
    return (
      <motion.div 
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Processing Video...</h3>
            <p className="text-gray-600">AI is analyzing the content</p>
          </div>
        </div>

        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              style={{ backgroundSize: '200% 100%' }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  const truncatedSummary = summary.length > 500 ? summary.substring(0, 500) + '...' : summary;
  const shouldTruncate = summary.length > 500;

  return (
    <div className="space-y-6">
      {videoId && (
        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-600" />
            Video Preview
          </h3>
          <VideoPlayer videoId={videoId} />
        </motion.div>
      )}

      <motion.div 
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg"
            >
              <FileText className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">AI Summary</h3>
              <p className="text-gray-600">Generated insights and analysis</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 text-gray-700 hover:text-gray-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </motion.button>
            
            <motion.button
              onClick={downloadSummary}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 rounded-xl transition-colors duration-200 text-indigo-700 hover:text-indigo-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Download</span>
            </motion.button>
          </div>
        </div>

        <motion.div 
          className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Your Question:
          </p>
          <p className="text-blue-700 font-medium">{question}</p>
        </motion.div>

        <motion.div 
          className="prose max-w-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-gray-700 leading-relaxed text-lg">
            <AnimatePresence mode="wait">
              {showFullSummary || !shouldTruncate ? (
                <motion.div
                  key="full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-pre-wrap"
                >
                  {summary}
                </motion.div>
              ) : (
                <motion.div
                  key="truncated"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-pre-wrap"
                >
                  {truncatedSummary}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {shouldTruncate && (
            <motion.button
              onClick={() => setShowFullSummary(!showFullSummary)}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {showFullSummary ? 'Show Less' : 'Read More'}
            </motion.button>
          )}
        </motion.div>

        {transcriptLength && (
          <motion.div 
            className="mt-6 pt-6 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Processed {transcriptLength.toLocaleString()} characters from transcript
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SummaryDisplay;