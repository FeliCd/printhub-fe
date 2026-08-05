import { get, post } from './api';

export const financeService = {
  getWalletBalance: async () => {
    const response = await get('/finance/wallet');
    return response.data;
  },

  topupWallet: async (amount: number) => {
    const response = await post('/finance/topup', { amount });
    return response.data;
  },
};
