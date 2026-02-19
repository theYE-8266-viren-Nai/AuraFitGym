import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Mail, Lock, User, Phone, Calendar, Users2, Award } from 'lucide-react';
import { authApi } from '../services/authApi';
import { RegisterData } from '../types';
import { useToast } from '../components/shared/Toast';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    role: 'member',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.register(formData);
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      showSuccess('Welcome to FitFlow Gym! 🎊');
      navigate('/dashboard');
    } catch (err: any) {
      showError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: 'member', label: 'Member', icon: Users2, color: 'from-blue-500 to-cyan-500', desc: 'Join our fitness community' },
    { value: 'trainer', label: 'Trainer', icon: Award, color: 'from-green-500 to-emerald-500', desc: 'Guide members to success' },
    { value: 'admin', label: 'Admin', icon: User, color: 'from-red-500 to-orange-500', desc: 'Manage the gym' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Chinese New Year Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 text-6xl"
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🧧
        </motion.div>
        <motion.div
          className="absolute top-20 right-20 text-6xl"
          animate={{ y: [0, -15, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
        >
          🎊
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-1/4 text-5xl"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: 1 }}
        >
          🏮
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-1/4 text-5xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          ✨
        </motion.div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border-2 border-red-100"
            whileHover={{ scale: 1.005 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 px-8 py-6 text-white">
              <motion.div
                className="flex items-center justify-center gap-3 mb-2"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <Dumbbell className="w-10 h-10" />
                <h1 className="text-3xl font-bold">FitFlow Gym</h1>
              </motion.div>
              <motion.p
                className="text-center text-red-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Begin Your Transformation Journey 🎯
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Role Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Choose Your Role 🎭
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {roleOptions.map((role, index) => (
                    <motion.button
                      key={role.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.value as any })}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        formData.role === role.value
                          ? 'border-red-500 bg-red-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center`}>
                        <role.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-semibold text-gray-900">{role.label}</div>
                      <div className="text-xs text-gray-600 mt-1">{role.desc}</div>
                      {formData.role === role.value && (
                        <motion.div
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                      placeholder="Choose a username"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="md:col-span-2"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                      placeholder="Create a strong password"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Role-specific fields */}
              <AnimatePresence mode="wait">
                {formData.role === 'member' && (
                  <motion.div
                    key="member-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            name="age"
                            required
                            value={formData.age || ''}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                            placeholder="25"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          name="gender"
                          required
                          value={formData.gender || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone || ''}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {formData.role === 'trainer' && (
                  <motion.div
                    key="trainer-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name || ''}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization
                      </label>
                      <div className="relative">
                        <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="specialization"
                          required
                          value={formData.specialization || ''}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                          placeholder="e.g., Strength Training, Yoga, CrossFit"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {formData.role === 'admin' && (
                  <motion.div
                    key="admin-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                        placeholder="Your full name (optional)"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Optional for admin accounts</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
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
                    Creating Account...
                  </span>
                ) : (
                  'Create Account 🎊'
                )}
              </motion.button>

              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent hover:underline"
                  >
                    Sign In 🎯
                  </Link>
                </p>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};