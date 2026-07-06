import React, { useState } from 'react';
import type { CustomOrder, Order } from '@/types';
import { PickedOrdersList } from '@/components/maker/PickedOrdersList';
import { CatalogOrdersList } from '@/components/maker/CatalogOrdersList';

interface MakerOrdersStatusPageProps {
  customOrders: CustomOrder[];
  orders: Order[];
  onMakerQuote: (orderId: string, price: number) => void;
  onMakerSendMessage: (orderId: string, text: string) => void;
  onMakerUploadProof: (orderId: string, img: string, note: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status'], trackingNumber?: string) => void;
}

export const MakerOrdersStatusPage: React.FC<MakerOrdersStatusPageProps> = ({
  customOrders,
  orders,
  onMakerQuote,
  onMakerSendMessage,
  onMakerUploadProof,
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'CUSTOM' | 'CATALOG'>('CUSTOM');

  const myCustomOrders = customOrders.filter(o => o.makerId === 101 && o.status !== 'REQUESTED');
  const physicalCatalogOrders = orders.filter(o => o.items.some(item => item.product.type === 'PHYSICAL'));

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Tình trạng đơn hàng đang thực hiện</h1>
        <p className="page-subtitle">Theo dõi trạng thái giao hàng, in ấn và cập nhật tiến độ cho Buyer</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav" style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
        <button
          className={`tab-btn ${activeTab === 'CUSTOM' ? 'active' : ''}`}
          onClick={() => setActiveTab('CUSTOM')}
        >
          Đơn thiết kế yêu cầu ({myCustomOrders.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'CATALOG' ? 'active' : ''}`}
          onClick={() => setActiveTab('CATALOG')}
        >
          Đơn bán từ Catalog ({physicalCatalogOrders.length})
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'CUSTOM' && (
        <PickedOrdersList
          myOrders={myCustomOrders}
          onMakerQuote={onMakerQuote}
          onMakerUploadProof={onMakerUploadProof}
          onMakerSendMessage={onMakerSendMessage}
        />
      )}

      {activeTab === 'CATALOG' && (
        <CatalogOrdersList
          physicalCatalogOrders={physicalCatalogOrders}
          onUpdateOrderStatus={onUpdateOrderStatus}
        />
      )}
    </div>
  );
};
