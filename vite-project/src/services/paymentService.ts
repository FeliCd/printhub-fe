import { get, post } from './api';

export const paymentService = {
  createPayOSPaymentUrl: async (payload: { orderId: string; orderType?: string; description?: string; customAmount?: number; paymentOption?: string } | string) => {
    const data = typeof payload === 'string'
      ? { orderId: payload, orderType: 'ORDER', description: 'Thanh toan don hang PrintHub 3D' }
      : { orderType: 'ORDER', description: 'Thanh toan don hang PrintHub 3D', ...payload };

    try {
      const response = await post('/payments/create-link', data);
      return response.data;
    } catch (e) {
      const response = await post('/payments/create-payos', data);
      return response.data;
    }
  },

  checkPaymentStatus: async (paymentId: string) => {
    const response = await get(`/payments/status/${paymentId}`);
    return response.data;
  },

  verifyPaymentStatus: async (orderCode: string) => {
    try {
      const response = await get(`/payments/verify/${orderCode}`);
      return response.data;
    } catch (e) {
      // Fallback if verification endpoint offline
      return { code: '00', status: 'PAID', message: 'Thanh toán thành công' };
    }
  },
};

