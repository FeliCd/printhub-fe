import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import type { SubscriptionPlan } from '@/types';
import { Plus, Edit2, Trash2, Gift } from 'lucide-react';

export const AdminSubscriptionsPage: React.FC = () => {
  const {
    subscriptionPlans,
    mockUsers,
    handleAddPlan,
    handleUpdatePlan,
    handleDeletePlan,
    handleGiftSubscription
  } = useApp();

  const customerPlans = subscriptionPlans.filter((p) => p.type === 'CUSTOMER' && p.isActive);

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  const [planForm, setPlanForm] = useState({
    name: '',
    price: 0,
    benefits: '',
    requiredPoints: 0
  });

  const [giftForm, setGiftForm] = useState({
    userId: '',
    planId: '',
    reason: ''
  });

  const handleOpenCreateModal = () => {
    setEditingPlan(null);
    setPlanForm({ name: '', price: 0, benefits: '', requiredPoints: 0 });
    setIsPlanModalOpen(true);
  };

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
        requiredPoints: planForm.requiredPoints
      });
    } else {
      handleAddPlan({
        name: planForm.name,
        price: planForm.price,
        benefits: planForm.benefits,
        requiredPoints: planForm.requiredPoints
      }, 'CUSTOMER');
    }
    setIsPlanModalOpen(false);
  };

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
    alert('Đã tặng gói VIP cho người dùng thành công!');
    setGiftForm({ userId: '', planId: '', reason: '' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Quản Lý Gói Hội Viên & Mã Giảm Giá B2C</h1>
          <p className="page-subtitle">Quản lý cấu hình gói Loyalty và tặng gói ưu đãi mua bộ thước kẻ cho Khách hàng</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal} style={{ gap: '8px' }}>
          <Plus size={16} /> Tạo Gói Ưu Đãi Mới
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Plans Table */}
        <div className="glass-card">
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Danh Sách Gói Hội Viên Customer ({customerPlans.length})</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Tên Gói</th>
                <th style={{ padding: '12px' }}>Giá / Điểm</th>
                <th style={{ padding: '12px' }}>Quyền Lợi</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {customerPlans.map((plan) => (
                <tr key={plan.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{plan.name}</td>
                  <td style={{ padding: '12px', color: 'var(--primary)', fontFamily: 'var(--mono)' }}>
                    {plan.price === 0 ? `${plan.requiredPoints} Điểm` : `${plan.price.toLocaleString()}đ`}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{plan.benefits}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', marginRight: '6px' }} onClick={() => handleOpenEditModal(plan)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="btn btn-danger" style={{ padding: '4px 8px' }} onClick={() => handleDeletePlan(plan.id)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gifting Box */}
        <div className="glass-card">
          <h2 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gift className="logo-accent" size={18} /> Tặng Gói VIP Cho Khách
          </h2>
          <form onSubmit={handleGiftSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Chọn Khách Hàng:</label>
              <select className="input" value={giftForm.userId} onChange={(e) => setGiftForm({ ...giftForm, userId: e.target.value })} style={{ width: '100%' }}>
                <option value="">-- Chọn khách hàng --</option>
                {mockUsers.filter(u => u.role === 'BUYER').map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Chọn Gói Tặng:</label>
              <select className="input" value={giftForm.planId} onChange={(e) => setGiftForm({ ...giftForm, planId: e.target.value })} style={{ width: '100%' }}>
                <option value="">-- Chọn gói --</option>
                {customerPlans.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Lý do tặng:</label>
              <textarea className="input" value={giftForm.reason} onChange={(e) => setGiftForm({ ...giftForm, reason: e.target.value })} placeholder="Ví dụ: Tặng quà tri ân đơn sỉ lớp..." style={{ width: '100%', height: '50px' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px' }}>
              Xác Nhận Tặng Gói
            </button>
          </form>
        </div>
      </div>

      {/* Plan Modal */}
      {isPlanModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px', padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>{editingPlan ? 'Cập Nhật Gói' : 'Tạo Gói Ưu Đãi Mới'}</h3>
            <form onSubmit={handleSavePlan} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Tên gói:</label>
                <input type="text" className="input" value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} style={{ width: '100%' }} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Giá tiền (VNĐ):</label>
                  <input type="number" className="input" value={planForm.price} onChange={(e) => setPlanForm({ ...planForm, price: Number(e.target.value) })} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Điểm quy đổi:</label>
                  <input type="number" className="input" value={planForm.requiredPoints} onChange={(e) => setPlanForm({ ...planForm, requiredPoints: Number(e.target.value) })} style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Đặc quyền gói:</label>
                <textarea className="input" value={planForm.benefits} onChange={(e) => setPlanForm({ ...planForm, benefits: e.target.value })} style={{ width: '100%', height: '70px' }} required />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsPlanModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Gói</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
