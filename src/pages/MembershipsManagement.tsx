import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useApi, useMutation } from '../hooks/useApi';
import { membershipsApi, CreateMembershipData, UpdateMembershipFormData } from '../services/membershipsApi';
import { membersApi } from '../services/membersApi';
import { Membership, Member } from '../types';
import { Modal } from '../components/shared/Modal';
import { ConfirmModal } from '../components/shared/ConfirmModal';
import { useToast } from '../components/shared/Toast';

export const MembershipsManagement: React.FC = () => {
  const { showSuccess, showError } = useToast();

  const { data: memberships, isLoading, error, refetch } = useApi<Membership[]>(
    () => membershipsApi.getAll()
  );

  const { data: members } = useApi<Member[]>(() => membersApi.getAll());

  const { mutate: createMembership, isLoading: isCreating } = useMutation(membershipsApi.create);
  const { mutate: updateMembership, isLoading: isUpdating } = useMutation(membershipsApi.update);
  const { mutate: deleteMembership, isLoading: isDeleting } = useMutation(membershipsApi.delete);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [createFormData, setCreateFormData] = useState<CreateMembershipData>({
    member_id: 0,
    type: '',
    duration: 30,
    fee: 0,
  });

  const [editFormData, setEditFormData] = useState<UpdateMembershipFormData>({
    status: 'active',
  });
  const membershipTypes = [
    { label: 'Monthly', duration: 30, fee: 50000, icon: '📅' },
    { label: 'Quarterly (3 months)', duration: 90, fee: 140000, icon: '📊' },
    { label: 'Semi-Annual (6 months)', duration: 180, fee: 275000, icon: '⭐' },
    { label: 'Annual', duration: 365, fee: 550000, icon: '🏆' },
  ];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMembership(createFormData);
      showSuccess('Membership created successfully! 🎊');
      setShowCreateModal(false);
      setCreateFormData({
        member_id: 0,
        type: '',
        duration: 30,
        fee: 0,
      });
      refetch();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to create membership');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMembership) return;

    try {
      await updateMembership({
        id: selectedMembership.id,
        ...editFormData
      });
      showSuccess('Membership updated successfully! ✅');
      setShowEditModal(false);
      setSelectedMembership(null);
      refetch();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to update membership');
    }
  };

  const handleDelete = async () => {
    if (!selectedMembership) return;

    try {
      await deleteMembership(selectedMembership.id);
      showSuccess('Membership deleted successfully');
      setShowDeleteModal(false);
      setSelectedMembership(null);
      refetch();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to delete membership');
    }
  };

  const openEditModal = (membership: Membership) => {
    setSelectedMembership(membership);
    setEditFormData({
      status: membership.status,
      end_date: membership.end_date,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (membership: Membership) => {
    setSelectedMembership(membership);
    setShowDeleteModal(true);
  };

  const selectMembershipType = (type: typeof membershipTypes[0]) => {
    setCreateFormData({
      ...createFormData,
      type: type.label,
      duration: type.duration,
      fee: type.fee,
    });
  };

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
          <p className="text-gray-600 font-medium">Loading memberships...</p>
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

  const getStatusBadge = (status: string) => {
    const styles = {
      active: { bg: 'from-green-100 to-emerald-100', text: 'text-green-700', icon: CheckCircle },
      expired: { bg: 'from-red-100 to-orange-100', text: 'text-red-700', icon: XCircle },
      cancelled: { bg: 'from-gray-100 to-gray-200', text: 'text-gray-700', icon: XCircle },
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  const activeCount = memberships?.filter(m => m.status === 'active').length || 0;
  const expiredCount = memberships?.filter(m => m.status === 'expired').length || 0;
  const totalRevenue = memberships?.reduce((sum, m) => sum + Number(m.fee), 0) || 0;

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
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Memberships Management
          </h1>
        </div>
        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:shadow-xl transition-all font-semibold flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          Create Membership
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Active Memberships', value: activeCount, color: 'from-green-500 to-emerald-500', icon: CheckCircle },
          { label: 'Expired', value: expiredCount, color: 'from-red-500 to-orange-500', icon: XCircle },
          { label: 'Total Revenue', value: `${totalRevenue.toFixed(0)} Kyats`, color: 'from-yellow-500 to-amber-500', icon: CreditCard },
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
            <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Memberships List */}
      <div className="space-y-4">
        <AnimatePresence>
          {memberships && memberships.length > 0 ? (
            memberships.map((membership, index) => {
              const statusConfig = getStatusBadge(membership.status);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={membership.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-white/50 hover:shadow-xl transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.01 }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {membership.member?.name?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">{membership.member?.name || 'Unknown'}</h3>
                        <p className="text-sm text-gray-600">{membership.type}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Duration</p>
                        <p className="font-semibold text-gray-900">{membership.duration} days</p>
                      </div>

                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Fee</p>
                        <p className="font-bold text-green-600 text-lg">{membership.fee} Kyats
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Start Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(membership.start_date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">End Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(membership.end_date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${statusConfig.bg} flex items-center gap-1`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className={`text-xs font-bold ${statusConfig.text}`}>
                          {membership.status}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => openEditModal(membership)}
                          className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          onClick={() => openDeleteModal(membership)}
                          className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
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
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No memberships found</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Membership Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Membership"
        size="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Member
            </label>
            <select
              required
              value={createFormData.member_id}
              onChange={(e) => setCreateFormData({ ...createFormData, member_id: parseInt(e.target.value) })}
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
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Membership Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {membershipTypes.map((type) => (
                <motion.button
                  key={type.label}
                  type="button"
                  onClick={() => selectMembershipType(type)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${createFormData.type === type.label
                    ? 'border-red-500 bg-gradient-to-r from-red-50 to-orange-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{type.icon}</span>
                    <span className="font-semibold text-gray-900">{type.label}</span>
                  </div>
                  <div className="text-sm text-gray-600">{type.duration} days</div>
                  <div className="text-xl font-bold text-red-600 mt-1">{type.fee} Kyats
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type Name
              </label>
              <input
                type="text"
                required
                value={createFormData.type}
                onChange={(e) => setCreateFormData({ ...createFormData, type: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                placeholder="e.g., Monthly"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (days)
              </label>
              <input
                type="number"
                required
                min="1"
                value={createFormData.duration}
                onChange={(e) => setCreateFormData({ ...createFormData, duration: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fee (Kyats)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={createFormData.fee}
                onChange={(e) => setCreateFormData({ ...createFormData, fee: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
              />
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
              disabled={isCreating}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl disabled:opacity-50 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCreating ? 'Creating...' : 'Create Membership'}
            </motion.button>
          </div>
        </form>
      </Modal>

      {/* Edit Membership Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Membership"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              required
              value={editFormData.status}
              onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={editFormData.end_date || ''}
              onChange={(e) => setEditFormData({ ...editFormData, end_date: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <motion.button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl disabled:opacity-50 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isUpdating ? 'Updating...' : 'Update Membership'}
            </motion.button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Membership"
        message={`Are you sure you want to delete this membership for ${selectedMembership?.member?.name}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};