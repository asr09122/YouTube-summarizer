import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Clock, Youtube, Trash2, Eye, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface HistoryItem {
  id: string;
  video_url: string;
  video_id: string | null;
  question: string;
  answer: string;
  source_type: 'youtube' | 'upload';
  created_at: string;
}

interface HistoryPanelProps {
  userId: string | null;
  onSelectItem: (item: HistoryItem) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ userId, onSelectItem }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [filterType, setFilterType] = useState('all'); // Added to fix ReferenceError



  const fetchHistory = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('video_summaries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const { error } = await supabase
        .from('video_summaries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setHistory(prev => prev.filter(item => item.id !== id));
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (!userId) {
    return (
      <motion.div 
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          History
        </h3>
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <History className="w-8 h-8 text-gray-400" />
          </motion.div>
          <p className="text-gray-500">Please sign in to view your history</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg"
        >
          <History className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">History</h3>
          <p className="text-sm text-gray-600">Your recent summaries</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search summaries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </motion.div>
          ))}
        </div>
      ) : filteredHistory.length === 0 ? (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <History className="w-8 h-8 text-gray-400" />
          </motion.div>
          <p className="text-gray-500">
            {searchTerm || filterType !== 'all' 
              ? 'No matching summaries found' 
              : 'No history found. Start by summarizing a YouTube video!'
            }
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectItem(item)}
                className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer group hover:shadow-md"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="p-1 rounded bg-red-100 text-red-600"
                      >
                        <Youtube className="w-3 h-3" />
                      </motion.div>
                      <span className="text-xs font-medium text-gray-600">
                        YouTube
                      </span>
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2 font-medium">
                      {truncateText(item.question, 80)}
                    </p>
                    
                    <p className="text-xs text-gray-600">
                      {truncateText(item.answer, 100)}
                    </p>
                  </div>

                  <div className="flex gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem(item);
                      }}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="View full summary"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye className="w-4 h-4 text-blue-500" />
                    </motion.button>
                    <motion.button
                      onClick={(e) => deleteItem(item.id, e)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default HistoryPanel;
