import React, { useState } from 'react';
import type { Address } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { ProfileInfoCard } from '@/components/profile/ProfileInfoCard';
import { AddressBook } from '@/components/profile/AddressBook';
import { OrderHistory } from '@/components/profile/OrderHistory';

interface ProfilePageProps {
  makerProfile: {
    status: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    equipmentInfo: string;
    bio: string;
    portfolioUrl: string;
    trustScore: number;
  };
  addresses: Address[];
  onAddAddress: (addressData: { name: string; phone: string; addressLine: string; province: string }) => void;
  onSetDefaultAddress: (id: number) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  makerProfile,
  addresses,
  onAddAddress,
  onSetDefaultAddress,
}) => {
  const { currentUser, orders, setIsDisputeModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'ORDERS'>('PROFILE');

  const handleTriggerDispute = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    alert(`Đã sao chép mã đơn hàng: ${orderId}. Vui lòng dán mã này vào biểu mẫu khiếu nại!`);
    setIsDisputeModalOpen(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">Quản lý Tài khoản & Đơn hàng</h1>
          <p className="page-subtitle">Xem thông tin định danh hồ sơ thành viên, địa chỉ nhận hàng và lịch sử mua sắm</p>
        </div>
      </div>

      {/* Tab Navigation for Buyer */}
      {currentUser?.role === 'BUYER' && (
        <div className="tab-nav" style={{ marginBottom: '24px' }}>
          <button
            className={`tab-btn ${activeTab === 'PROFILE' ? 'active' : ''}`}
            onClick={() => setActiveTab('PROFILE')}
          >
            Hồ sơ & Địa chỉ
          </button>
          <button
            className={`tab-btn ${activeTab === 'ORDERS' ? 'active' : ''}`}
            onClick={() => setActiveTab('ORDERS')}
          >
            Lịch sử mua hàng ({orders.length})
          </button>
        </div>
      )}

      {/* Render TAB: PROFILE */}
      {activeTab === 'PROFILE' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Left column: Profile & Security */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <ProfileInfoCard
              currentUser={currentUser}
              makerProfile={makerProfile}
              orders={orders}
            />


          </div>

          {/* Address Book */}
          <AddressBook
            addresses={addresses}
            onAddAddress={onAddAddress}
            onSetDefaultAddress={onSetDefaultAddress}
          />
        </div>
      )}

      {/* Render TAB: ORDERS */}
      {activeTab === 'ORDERS' && (
        <OrderHistory
          orders={orders}
          handleTriggerDispute={handleTriggerDispute}
        />
      )}
    </div>
  );
};
