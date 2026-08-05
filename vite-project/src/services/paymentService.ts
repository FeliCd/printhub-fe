import { get, post } from './api';

export const paymentService = {
  createPayOSPaymentUrl: async (orderId: string) => {
    const response = await post('/payments/create-payos', { orderId });
    return response.data;
  },

  checkPaymentStatus: async (paymentId: string) => {
    const response = await get(`/payments/status/${paymentId}`);
    return response.data;
  },
};
