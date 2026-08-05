import { get, post, put } from './api';

export const orderService = {

  createOrder: async (orderData: any) => {
    const response = await post('/orders', orderData);
    return response.data;
  },

  createCustomRulerOrder: async (customData: any) => {
    const response = await post('/orders/custom-ruler', customData);
    return response.data;
  },

  createBulkOrder: async (bulkData: any) => {
    const response = await post('/orders/bulk-excel', bulkData);
    return response.data;
  },

  getProductionQueue: async () => {
    const response = await get('/admin/production-queue');
    return response.data;
  },

  updateProductionStatus: async (id: string, status: string) => {
    const response = await put('/admin/production-status', { id, status });
    return response.data;
  },
};
