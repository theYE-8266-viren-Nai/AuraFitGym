import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Banknote, CheckCircle, AlertCircle, Receipt, Calendar, Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApi, useMutation } from '../hooks/useApi';
import { paymentsApi, CreatePaymentData } from '../services/paymentsApi';
import { membershipsApi } from '../services/membershipsApi';
import { Payment, MembershipStatusResponse } from '../types';
import { Modal } from '../components/shared/Modal';
import { useToast } from '../components/shared/Toast';
import { clearCache } from '../lib/axios';

export const MemberPayment: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const { data: membershipStatus, refetch: refetchStatus } = useApi<MembershipStatusResponse>(
    () => membershipsApi.getStatus()
  );
  
  const { data: payments, isLoading, refetch: refetchPayments } = useApi<Payment[]>(
    () => paymentsApi.myPayments()
  );
  
  const { mutate: makePayment, isLoading: isProcessing } = useMutation(paymentsApi.create);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [formData, setFormData] = useState<Omit<CreatePaymentData, 'member_id'>>({
    amount: 0,
    method: 'Credit Card',
  });

  // Format number with commas for Kyats
  const formatKyats = (amount: number) => {
    return amount.toLocaleString('en-US');
  };

  const membershipPlans = [
    { name: 'Monthly', duration: 30, price: 50000, icon: '🧧' },
    { name: 'Quarterly', duration: 90, price: 135000, icon: '🏮' },
    { name: 'Semi-Annual', duration: 180, price: 255000, icon: '🎆' },
    { name: 'Annual', duration: 365, price: 480000, icon: '🐉' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.member?.id) {
      showError('Member information not found');
      return;
    }

    try {
      await makePayment({
        member_id: user.member.id,
        ...formData,
      });
      showSuccess('Payment successful! 🏮');
      setShowPaymentModal(false);
      setFormData({ amount: 0, method: 'Credit Card' });
      clearCache('/payments');
      refetchPayments();
      refetchStatus();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Payment failed');
    }
  };

  const handleViewReceipt = async (paymentId: number) => {
    try {
      const receipt = await paymentsApi.generateReceipt(paymentId);
      setSelectedReceipt(receipt);
      setShowReceiptModal(true);
      showSuccess(`Receipt generated! 🧾`);
    } catch (error) {
      showError('Failed to generate receipt');
    }
  };

  const selectPlan = (plan: typeof membershipPlans[0]) => {
    setFormData({ ...formData, amount: plan.price });
  };

  const totalPaid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const thisMonthPayments = payments?.filter(p => {
    const date = new Date(p.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fffcf0]">
        <motion.div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-red-600 border-t-amber-400 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-red-800 font-bold tracking-widest">LOADING...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#fffcf0] min-h-screen">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-8 border-b-2 border-amber-200 pb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-b from-red-600 to-red-800 rounded-full shadow-lg shadow-red-200 border-2 border-amber-400">
            <Wallet className="w-6 h-6 text-amber-200" />
          </div>
          <h1 className="text-3xl font-black text-red-800 tracking-tighter uppercase">
            Payment & Subscriptions
          </h1>
        </div>
        <motion.button
          onClick={() => setShowPaymentModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-amber-100 rounded-lg hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all font-bold border-b-4 border-red-800 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <CreditCard className="w-5 h-5 text-amber-300" />
          Make Payment
        </motion.button>
      </motion.div>

      {/* Status Banner */}
      <motion.div
        className={`rounded-2xl p-6 mb-8 border-2 shadow-xl ${
          membershipStatus?.has_active_membership
            ? 'bg-gradient-to-r from-red-700 to-red-900 border-amber-500'
            : 'bg-white border-red-200'
        }`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
                membershipStatus?.has_active_membership ? 'bg-amber-400 border-amber-200 text-red-700' : 'bg-red-50 border-red-100 text-red-400'
            }`}>
              {membershipStatus?.has_active_membership ? <CheckCircle className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
            </div>
            <div>
              <h2 className={`text-2xl font-black ${membershipStatus?.has_active_membership ? 'text-amber-300' : 'text-red-800'}`}>
                {membershipStatus?.has_active_membership ? 'ACTIVE MEMBERSHIP ✅' : 'MEMBERSHIP EXPIRED 🏮'}
              </h2>
              <p className={membershipStatus?.has_active_membership ? 'text-amber-100/80' : 'text-red-600/70'}>
                {membershipStatus?.has_active_membership 
                  ? `Your ${membershipStatus.active_membership?.type} plan is valid until ${new Date(membershipStatus.active_membership?.end_date || '').toLocaleDateString()}`
                  : 'Renew your subscription to access the gym.'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Paid', value: `${formatKyats(totalPaid)} Ks`, icon: Banknote },
          { label: 'This Month', value: thisMonthPayments.length, icon: Calendar },
          { label: 'All Payments', value: payments?.length || 0, icon: Receipt },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-600 hover:shadow-lg transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <p className="text-xs font-black text-red-800/50 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-red-700">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* History */}
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-black text-red-800 mb-6 flex items-center gap-2 uppercase tracking-tighter">
          <Receipt className="w-6 h-6" /> Payment History
        </h2>
        {payments && payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
              <motion.div
                key={payment.id}
                className="group border border-red-50 rounded-xl p-4 bg-[#fffcf0] hover:bg-red-50 transition-all flex justify-between items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-amber-200 font-bold shadow-md">
                    <span className="text-lg font-black">Ks</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-red-800">{formatKyats(Number(payment.amount))} Kyats</span>
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-black uppercase">{payment.status}</span>
                    </div>
                    <p className="text-xs font-bold text-red-800/40 uppercase tracking-tighter">
                      {new Date(payment.date).toLocaleDateString()} • {payment.method}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => handleViewReceipt(payment.id)}
                  className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all border border-red-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="View Receipt"
                >
                  <Receipt className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 opacity-30 italic text-red-900">No payment records found...</div>
        )}
      </motion.div>

      {/* Payment Modal */}
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="🧧 New Payment" size="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {membershipPlans.map((plan) => (
              <button
                key={plan.name}
                type="button"
                onClick={() => selectPlan(plan)}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  formData.amount === plan.price ? 'border-red-600 bg-red-50 shadow-inner' : 'border-amber-100 bg-white'
                }`}
              >
                <div className="text-2xl mb-1">{plan.icon}</div>
                <div className="font-black text-red-800 text-sm uppercase">{plan.name}</div>
                <div className="text-lg font-black text-red-600">{formatKyats(plan.price)} Ks</div>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-red-800 uppercase">Amount (Kyats)</label>
            <div className="relative">
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                className="w-full p-4 bg-red-50 border-2 border-amber-100 rounded-xl focus:border-red-600 outline-none font-black text-red-800 text-xl"
                placeholder="50000"
                min="0"
                step="1"
              />
              <span className="absolute right-4 top-4 text-red-300 font-bold">Ks</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="flex-1 py-4 font-black text-red-800 uppercase tracking-widest text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || formData.amount <= 0}
              className="flex-[2] py-4 bg-red-600 text-amber-100 font-black rounded-xl shadow-lg shadow-red-200 border-b-4 border-red-800 uppercase tracking-widest disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : `Confirm ${formatKyats(formData.amount)} Ks`}
            </button>
          </div>
        </form>
      </Modal>

      {/* Receipt Modal */}
      <Modal isOpen={showReceiptModal} onClose={() => setShowReceiptModal(false)} title="🧾 Payment Receipt">
        {selectedReceipt && (
          <div className="bg-[#fffcf0] p-6 rounded-xl border-2 border-amber-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black text-red-800 uppercase">Official Receipt</h3>
              <p className="text-sm text-red-600 font-bold">#{selectedReceipt.receipt_number}</p>
            </div>

            <div className="space-y-3 border-t-2 border-b-2 border-dashed border-amber-300 py-4">
              <div className="flex justify-between">
                <span className="text-red-800/60 font-bold text-sm uppercase">Member:</span>
                <span className="text-red-800 font-black">{selectedReceipt.member_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800/60 font-bold text-sm uppercase">Date:</span>
                <span className="text-red-800 font-black">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800/60 font-bold text-sm uppercase">Amount:</span>
                <span className="text-2xl font-black text-red-600">{formatKyats(Number(selectedReceipt.amount))} Kyats</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800/60 font-bold text-sm uppercase">Method:</span>
                <span className="text-red-800 font-black">{selectedReceipt.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800/60 font-bold text-sm uppercase">Status:</span>
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded font-black text-xs uppercase">
                  {selectedReceipt.status}
                </span>
              </div>
              {selectedReceipt.membership_type !== 'N/A' && (
                <div className="flex justify-between">
                  <span className="text-red-800/60 font-bold text-sm uppercase">Plan:</span>
                  <span className="text-red-800 font-black">{selectedReceipt.membership_type}</span>
                </div>
              )}
            </div>

            <div className="text-center mt-6 text-xs text-red-600/50 italic">
              Thank you for your payment! 🙏
            </div>

            <motion.button
              onClick={() => window.print()}
              className="w-full mt-4 py-3 bg-red-600 text-amber-100 rounded-lg font-black uppercase"
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