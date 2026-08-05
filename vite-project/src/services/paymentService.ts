import { get, post } from './api';

export const paymentService = {
  createPayOSPaymentUrl: async (payload: { orderId: string; orderType?: string; description?: string } | string) => {
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
};
