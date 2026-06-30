import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import type { SubscriptionPlan, SubscriptionType } from '@/types';
import { Plus, Edit2, Trash2, Gift, ClipboardList, Users } from 'lucide-react';

export const AdminSubscriptionsPage: React.FC = () => {
  const {
    subscriptionPlans,
    userSubscriptions,
    mockUsers,
    handleAddPlan,
    handleUpdatePlan,
    handleDeletePlan,
    handleGiftSubscription
  } = useApp();

  // Tabs for plan type
  const [activeTab, setActiveTab] = useState<SubscriptionType>('CUSTOMER');

  // Modals visibility states
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  // Form states for creating/editing plans
  const [planForm, setPlanForm] = useState({
    name: '',
    price: 0,
    benefits: '',
    requiredPoints: 0
  });

  // Gifting form states
  const [giftForm, setGiftForm] = useState({
    userId: '',
    planId: '',
    reason: ''
  });

  // Handle plan modal opening for creating
  const handleOpenCreateModal = () => {
    setEditingPlan(null);
    setPlanForm({
      name: '',
      price: 0,
      benefits: '',
      requiredPoints: 0
    });
    setIsPlanModalOpen(true);
  };

  // Handle plan modal opening for editing
  const handleOpenEditModal = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      price: plan.price,
      benefits: plan.benefits,
      requiredPoints: plan.requiredPoints || 0
    });
    setIsPlanModalOpen(true);
  };

  // Handle saving plan (create or update)
  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.name.trim() || !planForm.benefits.trim()) {
      alert('Vui lòng điền đầy đủ tên gói và đặc quyền!');
      return;
    }

    if (editingPlan) {
      handleUpdatePlan(editingPlan.id, {
        name: planForm.name,
        price: planForm.price,
        benefits: planForm.benefits,
        requiredPoints: activeTab === 'CUSTOMER' ? planForm.requiredPoints : undefined
      });
      alert(`Đã cập nhật thành công gói "${planForm.name}"!`);
    } else {
      handleAddPlan({
        name: planForm.name,
        price: planForm.price,
        benefits: planForm.benefits,
        requiredPoints: activeTab === 'CUSTOMER' ? planForm.requiredPoints : undefined
      }, activeTab);
      alert(`Đã thêm thành công gói "${planForm.name}"!`);
    }
    setIsPlanModalOpen(false);
  };

  // Handle gifting subscription
  const handleGiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftForm.userId || !giftForm.planId || !giftForm.reason.trim()) {
      alert('Vui lòng điền đầy đủ thông tin để tặng gói!');
      return;
    }

    handleGiftSubscription({
      userId: giftForm.userId,
      planId: giftForm.planId,
      reason: giftForm.reason
    });

    setGiftForm({
      userId: '',
      planId: '',
      reason: ''
    });
  };

  // Filter plans based on active type tab
  const displayedPlans = subscriptionPlans.filter(p => p.type === activeTab);

  return (
    <div>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Quản lý Gói dịch vụ & Subscription</h1>
          <p className="page-subtitle">Thiết lập cấu hình các gói ưu đãi thành viên và cấp phát gói tri ân cho người dùng</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <Plus size={16} /> Tạo gói mới ({activeTab === 'CUSTOMER' ? 'Khách' : 'Nhà in'})
        </button>
      </div>

      {/* Tabs */}
      <div className="tab-nav" style={{ marginBottom: '24px' }}>
        <button
          className={`tab-btn ${activeTab === 'CUSTOMER' ? 'active' : ''}`}
          onClick={() => setActiveTab('CUSTOMER')}
        >
          Gói Khách hàng (Customer Plans)
        </button>
        <button
          className={`tab-btn ${activeTab === 'MAKER' ? 'active' : ''}`}
          onClick={() => setActiveTab('MAKER')}
        >
          Gói Nhà in (Maker Plans)
        </button>
      </div>

      {/* Main Grid: Plans table and Gift Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '24px',
        alignItems: 'start',
        marginBottom: '32px'
      }}>
        
        {/* Left Side: Plans Ledger */}
        <div className="glass-card" style={{ marginBottom: 0 }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0' }}>
            <ClipboardList size={18} style={{ color: 'var(--primary)' }} />
            Danh sách gói dịch vụ ({displayedPlans.length})
          </h2>
          
          <div className="app-table-container">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Tên gói</th>
                  <th>Giá gói (đ)</th>
                  <th>Đặc quyền ưu đãi (benefits)</th>
                  {activeTab === 'CUSTOMER' && <th>Điểm quy đổi</th>}
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {displayedPlans.length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === 'CUSTOMER' ? 5 : 4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                      Không có gói nào. Bấm "Tạo gói mới" để thiết lập.
                    </td>
                  </tr>
                ) : (
                  displayedPlans.map((plan) => (
                    <tr key={plan.id}>
                      <td style={{ fontWeight: 'bold' }}>{plan.name}</td>
                      <td style={{ fontFamily: 'var(--mono)' }}>{plan.price.toLocaleString()}đ</td>
                      <td style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '280px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        {plan.benefits}
                      </td>
                      {activeTab === 'CUSTOMER' && (
                        <td style={{ fontFamily: 'var(--mono)', color: '#af52de', fontWeight: '500' }}>
                          {plan.requiredPoints ? `${plan.requiredPoints} điểm` : 'Không hỗ trợ'}
                        </td>
                      )}
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEditModal(plan)}
                            className="btn btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            title="Sửa"
                          >
                            <Edit2 size={12} /> Sửa
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Bạn có chắc chắn muốn xóa gói "${plan.name}" khỏi sàn không?`)) {
                                handleDeletePlan(plan.id);
                                alert(`Đã xóa gói "${plan.name}"!`);
                              }
                            }}
                            className="btn btn-danger"
                            style={{ padding: '6px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            title="Xóa"
                          >
                            <Trash2 size={12} /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Gift Subscription Panel */}
        <div className="glass-card" style={{ marginBottom: 0, border: '1px solid rgba(175, 82, 222, 0.3)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0', color: '#af52de' }}>
            <Gift size={18} />
            Phát tặng gói hội viên
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>
            Tặng gói dịch vụ VIP tri ân cho Khách hàng hoặc gói đẩy tin marketing miễn phí cho Nhà in.
          </p>

          <form onSubmit={handleGiftSubmit}>
            {/* Target User select */}
            <div className="form-group">
              <label>Người dùng nhận gói</label>
              <select
                className="form-control"
                value={giftForm.userId}
                onChange={(e) => setGiftForm(prev => ({ ...prev, userId: e.target.value }))}
                style={{ cursor: 'pointer' }}
                required
              >
                <option value="">-- Chọn thành viên nhận gói --</option>
                {mockUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role === 'BUYER' ? 'Buyer' : 'Maker'})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Plan select */}
            <div className="form-group">
              <label>Gói dịch vụ tặng</label>
              <select
                className="form-control"
                value={giftForm.planId}
                onChange={(e) => setGiftForm(prev => ({ ...prev, planId: e.target.value }))}
                style={{ cursor: 'pointer' }}
                required
              >
                <option value="">-- Chọn gói quà tặng --</option>
                {subscriptionPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    [{plan.type}] {plan.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Gift Reason */}
            <div className="form-group">
              <label>Lý do tặng gói</label>
              <textarea
                className="form-control"
                placeholder="Nhập lý do tặng quà... (ví dụ: Tặng tri ân khách hàng thân thiết)"
                value={giftForm.reason}
                onChange={(e) => setGiftForm(prev => ({ ...prev, reason: e.target.value }))}
                style={{ height: '70px', resize: 'none' }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', backgroundColor: '#af52de', border: 'none' }}>
              <Gift size={14} /> Xác nhận tặng gói
            </button>
          </form>
        </div>
      </div>

      {/* User Subscription Ledger (Bottom) */}
      <div className="glass-card">
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0' }}>
          <Users size={18} style={{ color: 'var(--primary)' }} />
          Nhật ký sở hữu & Đăng ký gói của thành viên ({userSubscriptions.length})
        </h2>

        <div className="app-table-container">
          <table className="app-table">
            <thead>
              <tr>
                <th>Mã đăng ký</th>
                <th>Thành viên</th>
                <th>Tên gói</th>
                <th>Phân loại</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày hết hạn</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {userSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                    Chưa có nhật ký sở hữu nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                userSubscriptions.map((us) => (
                  <tr key={us.subscriptionId}>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>{us.subscriptionId}</td>
                    <td style={{ fontWeight: '600' }}>{us.username}</td>
                    <td style={{ fontWeight: '500' }}>{us.planName}</td>
                    <td>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 'bold',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: us.planType === 'CUSTOMER' ? 'rgba(0, 122, 255, 0.1)' : 'rgba(175, 82, 222, 0.1)',
                        color: us.planType === 'CUSTOMER' ? '#007aff' : '#af52de'
                      }}>
                        {us.planType}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '12px' }}>{us.startDate}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 'bold' }}>{us.endDate}</td>
                    <td>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: us.isActive ? 'var(--primary)' : 'var(--text-muted)'
                      }}>
                        {us.isActive ? '● ĐANG HOẠT ĐỘNG' : '○ HẾT HẠN'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PLAN CREATE / EDIT MODAL */}
      {isPlanModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              {editingPlan ? `Chỉnh sửa gói: ${editingPlan.name}` : `Tạo gói subscription mới (${activeTab})`}
            </h2>

            <form onSubmit={handleSavePlan}>
              {/* Plan Name */}
              <div className="form-group">
                <label>Tên gói dịch vụ</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ví dụ: Customer VIP Silver"
                  value={planForm.name}
                  onChange={(e) => setPlanForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              {/* Plan Price */}
              <div className="form-group">
                <label>Giá mua gói (VND)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="ví dụ: 99000"
                  value={planForm.price}
                  onChange={(e) => setPlanForm(prev => ({ ...prev, price: Number(e.target.value) || 0 }))}
                  min="0"
                  required
                />
              </div>

              {/* Benefits description */}
              <div className="form-group">
                <label>Mô tả đặc quyền (benefits)</label>
                <textarea
                  className="form-control"
                  placeholder="ví dụ: Giảm 10% đơn hàng, miễn phí ship 2 đơn/tháng"
                  value={planForm.benefits}
                  onChange={(e) => setPlanForm(prev => ({ ...prev, benefits: e.target.value }))}
                  style={{ height: '90px', resize: 'none' }}
                  required
                />
              </div>

              {/* Required Points (Only for CUSTOMER type) */}
              {activeTab === 'CUSTOMER' && (
                <div className="form-group">
                  <label>Số điểm tích lũy quy đổi tối thiểu</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="ví dụ: 500"
                    value={planForm.requiredPoints}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, requiredPoints: Number(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsPlanModalOpen(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn btn-primary">
                  Lưu thiết lập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
