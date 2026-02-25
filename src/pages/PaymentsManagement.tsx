import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banknote, CreditCard, Receipt, Calendar, Filter, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useApi, useMutation } from '../hooks/useApi';
import { paymentsApi, CreatePaymentData } from '../services/paymentsApi';
import { membersApi } from '../services/membersApi';
import { Payment, Member } from '../types';
import { Modal } from '../components/shared/Modal';
import { useToast } from '../components/shared/Toast';

export const PaymentsManagement: React.FC = () => {
  const { showSuccess, showError } = useToast();
  
  const { data: payments, isLoading, error, refetch } = useApi<Payment[]>(
    () => paymentsApi.getAll()
  );
  
  const { data: members } = useApi<Member[]>(() => membersApi.getAll());
  
  const { mutate: createPayment, isLoading: isCreating } = useMutation(paymentsApi.create);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [formData, setFormData] = useState<CreatePaymentData>({
    member_id: 0,
    amount: 0,
    method: 'Credit Card',
  });

  const paymentMethods = [
    { value: 'Credit Card', icon: '💳' },
    { value: 'Debit Card', icon: '💳' },
    { value: 'Bank Transfer', icon: '🏦' },
    { value: 'KBZ Pay', icon: '📱' },
    { value: 'Wave Money', icon: '💰' },
    { value: 'Cash', icon: '💵' },
  ];

  // Format number with commas for Kyats
  const formatKyats = (amount: number) => {
    return amount.toLocaleString('en-US');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPayment(formData);
      showSuccess('Payment recorded successfully! 🎊');
      setShowCreateModal(false);
      setFormData({
        member_id: 0,
        amount: 0,
        method: 'Credit Card',
      });
      refetch();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to record payment');
    }
  };

  const handleGenerateReceipt = async (paymentId: number) => {
    try {
      const receipt = await paymentsApi.generateReceipt(paymentId);
      setSelectedReceipt(receipt);
      setShowReceiptModal(true);
      showSuccess('Receipt generated successfully! 🧾');
    } catch (error) {
      showError('Failed to generate receipt');
    }
  };

  const getFilteredPayments = () => {
    if (!payments) return [];
    if (statusFilter === 'all') return payments;
    return payments.filter(p => p.status === statusFilter);
  };

  const filteredPayments = getFilteredPayments();

  const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const completedCount = payments?.filter(p => p.status === 'completed').length || 0;
  const pendingCount = payments?.filter(p => p.status === 'pending').length || 0;

  if (isLoading) {
    return (
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
          <p className="text-gray-600 font-medium">Loading payments...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <motion.div
          className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-red-800 font-medium">{error}</p>
        </motion.div>
      </div>
    );
  }

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      completed: { bg: 'from-green-100 to-emerald-100', text: 'text-green-700', icon: CheckCircle },
      pending: { bg: 'from-yellow-100 to-amber-100', text: 'text-yellow-700', icon: Clock },
      failed: { bg: 'from-red-100 to-orange-100', text: 'text-red-700', icon: XCircle },
    };
    return configs[status as keyof typeof configs] || configs.completed;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-lg">
            <Banknote className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Payments Management
          </h1>
        </div>
        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:shadow-xl transition-all font-semibold flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <CreditCard className="w-5 h-5" />
          Record Payment
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Revenue', value: `${formatKyats(totalRevenue)} Ks`, color: 'from-green-500 to-emerald-500', icon: Banknote },
          { label: 'Completed', value: completedCount, color: 'from-red-500 to-orange-500', icon: CheckCircle },
          { label: 'Pending', value: pendingCount, color: 'from-yellow-500 to-amber-500', icon: Clock },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-white/50 hover:shadow-xl transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                <stat.icon className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-6 border-2 border-white/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">Filter by status:</label>
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map((filter) => (
              <motion.button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  statusFilter === filter.value
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Payments List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment, index) => {
              const statusConfig = getStatusConfig(payment.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <motion.div
                  key={payment.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-white/50 hover:shadow-xl transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.01 }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        Ks
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">{formatKyats(Number(payment.amount))} Kyats</h3>
                        <p className="text-sm text-gray-600">{payment.member?.name || 'Unknown Member'}</p>
                        <p className="text-xs text-gray-500">{payment.member?.user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Date</p>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <p className="font-semibold text-gray-900">
                            {new Date(payment.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Method</p>
                        <div className="px-3 py-1 bg-gray-100 rounded-lg">
                          <p className="font-semibold text-gray-900 text-sm">{payment.method}</p>
                        </div>
                      </div>

                      {payment.membership && (
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Membership</p>
                          <p className="font-semibold text-gray-900">{payment.membership.type}</p>
                        </div>
                      )}

                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${statusConfig.bg} flex items-center gap-1`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className={`text-xs font-bold ${statusConfig.text}`}>
                          {payment.status}
                        </span>
                      </div>

                      <motion.button
                        onClick={() => handleGenerateReceipt(payment.id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Receipt className="w-4 h-4" />
                        Receipt
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Banknote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No payments found</p>
              <p className="text-sm text-gray-400 mt-2">for the selected filter</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Payment Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Record Payment"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Member
            </label>
            <select
              required
              value={formData.member_id}
              onChange={(e) => setFormData({ ...formData, member_id: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
            >
              <option value={0}>Select a member...</option>
              {members?.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.user?.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (Kyats)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Banknote className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                placeholder="0"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">Ks</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <motion.button
                  key={method.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, method: method.value })}
                  className={`p-4 border-2 rounded-xl text-left transition-all flex items-center gap-3 ${
                    formData.method === method.value
                      ? 'border-red-500 bg-gradient-to-r from-red-50 to-orange-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="text-sm font-semibold text-gray-900">{method.value}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border-2 border-red-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Total Amount:</span>
              <span className="text-2xl font-bold text-red-600">{formatKyats(formData.amount)} Kyats</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Payment Method:</span>
              <span className="font-semibold text-gray-900">{formData.method}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <motion.button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isCreating || formData.amount <= 0}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl disabled:opacity-50 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCreating ? 'Processing...' : `Record Payment`}
            </motion.button>
          </div>
        </form>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        title="🧾 Payment Receipt"
      >
        {selectedReceipt && (
          <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6 rounded-xl border-2 border-red-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-red-800 uppercase">Official Receipt</h3>
              <p className="text-sm text-red-600 font-semibold">#{selectedReceipt.receipt_number}</p>
            </div>

            <div className="space-y-3 border-t-2 border-b-2 border-dashed border-red-300 py-4">
              <div className="flex justify-between">
                <span className="text-red-800/60 font-semibold text-sm uppercase">Member:</span>
                <span className="text-red-800 font-bold">{selectedReceipt.member_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800/60 font-semibold text-sm uppercase">Date:</span>
                <span className="text-red-800 font-bold">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800/60 font-semibold text-sm uppercase">Amount:</span>
                <span className="text-2xl font-bold text-green-600">{formatKyats(Number(selectedReceipt.amount))} Kyats</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800/60 font-semibold text-sm uppercase">Method:</span>
                <span className="text-red-800 font-bold">{selectedReceipt.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800/60 font-semibold text-sm uppercase">Status:</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold text-xs uppercase">
                  {selectedReceipt.status}
                </span>
              </div>
              {selectedReceipt.membership_type && selectedReceipt.membership_type !== 'N/A' && (
                <div className="flex justify-between">
                  <span className="text-red-800/60 font-semibold text-sm uppercase">Membership:</span>
                  <span className="text-red-800 font-bold">{selectedReceipt.membership_type}</span>
                </div>
              )}
            </div>

            <div className="text-center mt-6 text-xs text-red-600/60 italic">
              Thank you for your payment! 🙏
            </div>

            <motion.button
              onClick={() => window.print()}
              className="w-full mt-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold uppercase shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Print Receipt
            </motion.button>
          </div>
        )}
      </Modal>
    </div>
  );
};