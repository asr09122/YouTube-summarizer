import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Loader2, AlertCircle, CheckCircle, Video } from 'lucide-react';
import toast from 'react-hot-toast';

interface VideoUploaderProps {
  onSubmit: (file: File, question: string) => Promise<void>;
  isLoading: boolean;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onSubmit, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('Please provide a comprehensive summary of this video');
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Check file size (limit to 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast.error('File size must be less than 100MB');
        return;
      }
      setSelectedFile(file);
      toast.success('File selected successfully!');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv']
    },
    multiple: false,
    disabled: isLoading
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a video file');
      return;
    }
    
    try {
      setUploadProgress(0);
      await onSubmit(selectedFile, question);
      setSelectedFile(null);
      setQuestion('Please provide a comprehensive summary of this video');
      toast.success('Video processed successfully!');
    } catch (error) {
      toast.error('Failed to process video');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg">
          <Upload className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Video Upload</h2>
          <p className="text-gray-600">Upload and analyze your video files</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Video className="w-4 h-4 inline mr-2" />
            Video File
          </label>
          
          {!selectedFile ? (
            <motion.div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input {...getInputProps()} />
              <motion.div
                animate={{ y: isDragActive ? -5 : 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${
                  isDragActive ? 'text-purple-500' : 'text-gray-400'
                }`} />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {isDragActive ? 'Drop your video here!' : 'Drag & drop your video file'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse files
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
                  <span className="px-2 py-1 bg-gray-100 rounded">MP4</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">AVI</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">MOV</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">WMV</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">WebM</span>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border-2 border-green-200 bg-green-50 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="p-2 bg-green-500 rounded-lg"
                  >
                    <File className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <p className="font-medium text-gray-800">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <motion.button
                  type="button"
                  onClick={removeFile}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={isLoading}
                >
                  <X className="w-5 h-5 text-red-500" />
                </motion.button>
              </div>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-green-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Question Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            What would you like to know?
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about the video content..."
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500 resize-none"
            rows={4}
            disabled={isLoading}
          />
          
          <div className="mt-3 flex flex-wrap gap-2">
            {quickQuestions.map((q, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => setQuestion(q)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-600 rounded-full transition-colors duration-200 border border-gray-200 hover:border-purple-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {q}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading || !selectedFile}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
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
              <CheckCircle className="w-5 h-5" />
              <span>Analyze Video</span>
            </>
          )}
        </motion.button>

        {/* File Requirements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3"
        >
          <p className="font-medium mb-1">File Requirements:</p>
          <ul className="space-y-1">
            <li>• Maximum file size: 100MB</li>
            <li>• Supported formats: MP4, AVI, MOV, WMV, WebM, MKV</li>
            <li>• Processing time varies based on video length</li>
          </ul>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default VideoUploader;