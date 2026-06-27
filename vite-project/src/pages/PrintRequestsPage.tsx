import React, { useState } from 'react';
import type { CustomOrder, Order } from '@/types';
import { OpenRequestsList } from '@/components/maker/OpenRequestsList';
import { PickedOrdersList } from '@/components/maker/PickedOrdersList';
import { CatalogOrdersList } from '@/components/maker/CatalogOrdersList';
import { EarningsDashboard } from '@/components/maker/EarningsDashboard';

interface PrintRequestsPageProps {
  customOrders: CustomOrder[];
  orders: Order[];
  onMakerPickRequest: (orderId: string) => void;
  onMakerQuote: (orderId: string, price: number) => void;
  onMakerSendMessage: (orderId: string, text: string) => void;
  onMakerUploadProof: (orderId: string, img: string, note: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const PrintRequestsPage: React.FC<PrintRequestsPageProps> = ({
  customOrders,
  orders,
  onMakerPickRequest,
  onMakerQuote,
  onMakerSendMessage,
  onMakerUploadProof,
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'OPEN' | 'MINE' | 'CATALOG' | 'EARNINGS'>('OPEN');

  const openRequests = customOrders.filter(o => o.status === 'REQUESTED');
  const myOrders = customOrders.filter(o => o.makerId === 101 && o.status !== 'REQUESTED');
  
  // Physical catalog orders
  const physicalCatalogOrders = orders.filter(o => o.items.some(item => item.product.type === 'PHYSICAL'));

  // Maker Earnings calculations (Gross, Fee, Net)
  const completedCustoms = customOrders.filter(o => o.makerId === 101 && o.status === 'COMPLETED');
  const customGross = completedCustoms.reduce((sum, o) => sum + (o.quotedPrice || 0), 0);
  
  // Completed catalog sales
  const completedCatalogSales = orders.filter(o => o.status === 'COMPLETED' && o.items.some(item => item.product.type === 'PHYSICAL'));
  const catalogGross = completedCatalogSales.reduce((sum, o) => sum + o.totalAmount, 0);

  const grossEarnings = customGross + catalogGross;
  const platformFee = Math.round(grossEarnings * 0.05);
  const netEarnings = grossEarnings - platformFee;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Bảng điều khiển Nhà in (Maker Dashboard)</h1>
        <p className="page-subtitle">Nhận đơn hàng in riêng, xử lý đơn đặt mua từ Catalog, và thống kê thu nhập</p>
      </div>

      {/* Maker Info Banner */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(57, 255, 20, 0.08) 0%, rgba(10, 10, 10, 0) 100%)',
        borderLeft: '4px solid var(--primary)',
        padding: '16px 20px',
        borderRadius: '0 8px 8px 0',
        marginBottom: '24px',
        fontSize: '13px',
        lineHeight: '1.5'
      }}>
        {activeTab === 'OPEN' && (
          <div>
            Các yêu cầu thiết kế riêng từ Buyer chưa có Maker nhận. Nhấn <strong>"Nhận đơn này"</strong> để bắt đầu thảo luận.
          </div>
        )}
        {activeTab === 'MINE' && (
          <div>
            Quản lý các yêu cầu đặt in bạn đã nhận. Tiến hành thảo luận {"→"} báo giá {"→"} thực hiện in ấn {"→"} tải ảnh nghiệm thu.
          </div>
        )}
        {activeTab === 'CATALOG' && (
          <div>
            Đơn hàng đặt mua mô hình vật lý in sẵn từ Catalog của bạn. Hãy in, đóng gói và cập nhật tiến trình giao nhận hàng.
          </div>
        )}
        {activeTab === 'EARNINGS' && (
          <div>
            Thống kê tài chính. Thu nhập thực tế nhận về ví sau khi sàn tự động khấu trừ 5% phí hoa hồng trọng tài.
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
        <button
          className={`tab-btn ${activeTab === 'OPEN' ? 'active' : ''}`}
          onClick={() => setActiveTab('OPEN')}
        >
          Yêu cầu chờ nhận ({openRequests.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'MINE' ? 'active' : ''}`}
          onClick={() => setActiveTab('MINE')}
        >
          Đơn thiết kế đã nhận ({myOrders.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'CATALOG' ? 'active' : ''}`}
          onClick={() => setActiveTab('CATALOG')}
        >
          Đơn bán từ Catalog ({physicalCatalogOrders.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'EARNINGS' ? 'active' : ''}`}
          onClick={() => setActiveTab('EARNINGS')}
        >
          Thống kê thu nhập
        </button>
      </div>

      {/* TAB 1: Open Requests */}
      {activeTab === 'OPEN' && (
        <OpenRequestsList
          openRequests={openRequests}
          onMakerPickRequest={onMakerPickRequest}
        />
      )}

      {/* TAB 2: My Picked Custom Orders */}
      {activeTab === 'MINE' && (
        <PickedOrdersList
          myOrders={myOrders}
          onMakerQuote={onMakerQuote}
          onMakerUploadProof={onMakerUploadProof}
          onMakerSendMessage={onMakerSendMessage}
        />
      )}

      {/* TAB 3: Catalog Sales Order Management */}
      {activeTab === 'CATALOG' && (
        <CatalogOrdersList
          physicalCatalogOrders={physicalCatalogOrders}
          onUpdateOrderStatus={onUpdateOrderStatus}
        />
      )}

      {/* TAB 4: Earnings Dashboard */}
      {activeTab === 'EARNINGS' && (
        <EarningsDashboard
          grossEarnings={grossEarnings}
          platformFee={platformFee}
          netEarnings={netEarnings}
          completedCustoms={completedCustoms}
          completedCatalogSales={completedCatalogSales}
        />
      )}
    </div>
  );
};
