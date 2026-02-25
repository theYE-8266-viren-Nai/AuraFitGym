import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  CreditCard,
  ArrowRight,
  Sparkles,
  Calendar,
  Mail
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { membersApi } from '../services/membersApi';
import { attendanceApi } from '../services/attendanceApi';
import { paymentsApi } from '../services/paymentsApi';
import { membershipsApi } from '../services/membershipsApi';
import { Member, Attendance, Payment, Membership } from '../types';
import { Navbar } from '../components/shared/Navbar';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [membersData, attendanceData, paymentsData, membershipsData] = await Promise.all([
        membersApi.getAll(),
        attendanceApi.getAll(),
        paymentsApi.getAll(),
        membershipsApi.getAll(),
      ]);

      setMembers(membersData);
      setAttendance(attendanceData);
      setPayments(paymentsData);
      setMemberships(membershipsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
          </motion.div>
        </div>
      </>
    );
  }

  const todayAttendance = attendance.filter(
    (a) => new Date(a.date).toDateString() === new Date().toDateString()
  );

  const thisMonthRevenue = payments
    .filter((p) => {
      const paymentDate = new Date(p.date);
      const now = new Date();
      return (
        paymentDate.getMonth() === now.getMonth() &&
        paymentDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const activeMemberships = memberships.filter(m => m.status === 'active').length;

  const stats = [
    {
      title: 'Total Members',
      value: members.length,
      icon: Users,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50',
      iconBg: 'bg-red-100',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: "Today's Attendance",
      value: todayAttendance.length,
      icon: TrendingUp,
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Monthly Revenue',
      value: `${thisMonthRevenue.toLocaleString()} Kyats`,
      icon: DollarSign,
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      change: '+23%',
      changeType: 'positive'
    },
    {
      title: 'Active Memberships',
      value: activeMemberships,
      icon: CreditCard,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      change: '+8%',
      changeType: 'positive'
    },
  ];

  const quickActions = [
    {
      title: 'Members Management',
      description: 'Add, edit, or remove gym members',
      icon: Users,
      color: 'from-red-500 to-orange-500',
      route: '/members',
      stats: `${members.length} members`,
    },
    {
      title: 'Memberships',
      description: 'Manage membership plans and subscriptions',
      icon: CreditCard,
      color: 'from-orange-500 to-yellow-500',
      route: '/memberships',
      stats: `${activeMemberships} active`,
    },
    {
      title: 'Payments',
      description: 'Track payments and generate receipts',
      icon: DollarSign,
      color: 'from-yellow-500 to-amber-500',
      route: '/payments',
      stats: `${thisMonthRevenue.toLocaleString()} Kyats this month`,
    },
    {
      title: 'Attendance',
      description: 'Monitor member check-ins and attendance',
      icon: Calendar,
      color: 'from-amber-500 to-orange-500',
      route: '/attendance',
      stats: `${todayAttendance.length} today`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Welcome back, {user?.username}!
            </motion.h1>
            <motion.span
              className="text-4xl"
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              👋
            </motion.span>
          </div>
          <motion.p
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Here's what's happening with your gym today 🎊
          </motion.p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              className={`${stat.bgColor} rounded-2xl shadow-lg p-6 border-2 border-white/50 backdrop-blur-sm hover:shadow-xl transition-all cursor-pointer`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                  <stat.icon className="w-6 h-6 text-red-600" />
                </div>
                <motion.div
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    stat.changeType === 'positive' 
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                </motion.div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions Grid */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.route}
                onClick={() => navigate(action.route)}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden text-left border-2 border-white/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className="p-6 relative z-10">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.color} mb-4 shadow-lg`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${action.color} text-white shadow-md`}>
                    {action.stats}
                  </div>
                </div>
                <motion.div
                  className="absolute bottom-4 right-4 text-gray-300 group-hover:text-orange-500 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Members */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-white/50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-bold text-gray-900">Recent Members</h2>
              </div>
              <motion.button
                onClick={() => navigate('/members')}
                className="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center gap-1"
                whileHover={{ x: 3 }}
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="space-y-3">
              {members.slice(0, 5).map((member, index) => (
                <motion.div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl hover:shadow-md transition-all cursor-pointer border border-red-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{member.name}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Mail className="w-3 h-3" />
                        {member.user?.email}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{member.phone}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Payments */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-white/50"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-bold text-gray-900">Recent Payments</h2>
              </div>
              <motion.button
                onClick={() => navigate('/payments')}
                className="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center gap-1"
                whileHover={{ x: 3 }}
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="space-y-3">
              {payments.slice(0, 5).map((payment, index) => (
                <motion.div
                  key={payment.id}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all cursor-pointer border border-green-100"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ x: -5, scale: 1.02 }}
                >
                  <div>
                    <p className="font-semibold text-gray-900">{payment.member?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(payment.date).toLocaleDateString()} • {payment.method}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 text-lg">
                      {Number(payment.amount).toLocaleString()} Kyats
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      payment.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};