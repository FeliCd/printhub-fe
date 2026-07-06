import React from 'react';
import type { CustomOrder, Order } from '@/types';
import { MakerUnifiedOrdersList } from '@/components/maker/MakerUnifiedOrdersList';

interface MakerOrdersStatusPageProps {
  customOrders: CustomOrder[];
  orders: Order[];
  onMakerQuote: (orderId: string, price: number, depositPercentage: number) => void;
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
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Tình trạng đơn hàng đang thực hiện</h1>
        <p className="page-subtitle">Theo dõi trạng thái giao hàng, in ấn và cập nhật tiến độ cho Buyer</p>
      </div>

      <MakerUnifiedOrdersList
        orders={orders}
        customOrders={customOrders}
        onMakerQuote={onMakerQuote}
        onMakerUploadProof={onMakerUploadProof}
        onMakerSendMessage={onMakerSendMessage}
        onUpdateOrderStatus={onUpdateOrderStatus}
      />
    </div>
  );
};
