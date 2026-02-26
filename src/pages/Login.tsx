import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Mail, Lock, Sparkles, Zap, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/shared/Toast';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      showSuccess('Welcome back! 🎊');
      navigate('/dashboard');
    } catch (err: any) {
      showError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Users, title: 'Community', desc: 'Join thousands of members' },
    { icon: Zap, title: 'Expert Training', desc: 'Professional trainers' },
    { icon: Sparkles, title: 'Modern Facility', desc: 'State-of-the-art equipment' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Chinese New Year Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Lanterns */}
        <motion.div
          className="absolute top-10 left-10 text-6xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🏮
        </motion.div>
        <motion.div
          className="absolute top-20 right-20 text-6xl"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        >
          🏮
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-1/4 text-5xl"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: 1 }}
        >
          🏮
        </motion.div>

        {/* Fireworks */}
        <motion.div
          className="absolute top-1/4 right-1/4 text-4xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎆
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 left-1/3 text-4xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
        >
          🎇
        </motion.div>

        {/* Fortune symbols */}
        <motion.div
          className="absolute top-1/2 left-10 text-7xl opacity-10"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          福
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-7xl opacity-10"
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          春
        </motion.div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:block space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-2xl shadow-lg">
                  <Dumbbell className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    AuraFIT
                  </h1>
                  <p className="text-sm text-gray-600">Transform Your Life This Year 🧧</p>
                </div>
              </motion.div>

              <motion.h2
                className="text-3xl font-bold text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Start Your Fitness Journey with Good Fortune! 🎊
              </motion.h2>

              <motion.p
                className="text-lg text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Join our community and achieve your fitness goals with expert guidance and modern facilities.
              </motion.p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-md hover:shadow-lg transition-all"
                >
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-xl">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-4"
            >
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <motion.div
              className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-red-100"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Mobile Logo */}
              <div className="md:hidden mb-6 text-center">
                <motion.div
                  className="inline-flex items-center gap-2 mb-2"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-xl">
                    <Dumbbell className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    AuraFIT
                  </span>
                </motion.div>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <motion.h2
                    className="text-3xl font-bold text-gray-900 mb-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Welcome Back! 🎊
                  </motion.h2>
                  <motion.p
                    className="text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Sign in to continue your fitness journey
                  </motion.p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Signing in...
                      </span>
                    ) : (
                      'Sign In 🎯'
                    )}
                  </motion.button>
                </form>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      className="font-semibold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent hover:underline"
                    >
                      Register Now 🧧
                    </Link>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};