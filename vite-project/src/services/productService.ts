import { get, post, remove } from './api';

export const productService = {
  getProducts: async (params?: any) => {
    try {
      const response = await get('/marketplace/product', params);
      return response.data;
    } catch (e) {
      const response = await get('/products', params);
      return response.data;
    }
  },

  getProductById: async (id: string | number) => {
    const response = await get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData: any) => {
    const response = await post('/products', productData);
    return response.data;
  },

  deleteProduct: async (id: string | number) => {
    const response = await remove(`/products/${id}`);
    return response.data;
  },
};
