import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { LogIn, LogOut, User, Mail, Lock, UserPlus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthButtonProps {
  onAuth: (user: any) => void;
}

export default function AuthButton({ onAuth }: AuthButtonProps) {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: any }) => {
      if (data.user) {
        setUser(data.user);
        onAuth(data.user);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        setUser(session.user);
        onAuth(session.user);
      } else {
        setUser(null);
        onAuth(null);
      }
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, [onAuth]);

  const handleAuth = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setError(error.message);
          toast.error(error.message);
        } else if (data.user) {
          setUser(data.user);
          toast.success('Welcome back!');
        }
      } else {
        const { error, data } = await supabase.auth.signUp({ email, password });
        if (error) {
          setError(error.message);
          toast.error(error.message);
        } else if (data.user) {
          setUser(data.user);
          toast.success('Account created successfully!');
        }
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      onAuth(null);
      setShowDropdown(false);
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Error logging out');
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <div className="relative">
        <motion.button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <span className="font-medium truncate max-w-32">
            {user.email?.split('@')[0] || 'User'}
          </span>
        </motion.button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50"
            >
              <div className="p-4 border-b border-gray-200/50">
                <p className="text-sm font-medium text-gray-800">Signed in as</p>
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
              </div>
              <div className="p-2">
                <motion.button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  <span>Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
              disabled={isLoading}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
              disabled={isLoading}
              onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-300 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-2"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleAuth}
          disabled={isLoading || !email || !password}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : mode === 'login' ? (
            <>
              <LogIn className="w-5 h-5" />
              Sign In
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Create Account
            </>
          )}
        </motion.button>

        <motion.button
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="w-full text-white/80 hover:text-white text-sm transition-colors duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </motion.button>
      </div>
    </div>
  );
}