import { get, post } from './api';

export const subscriptionService = {
  getPlans: async () => {
    const response = await get('/subscription-plans');
    return response.data;
  },

  getUserSubscriptions: async () => {
    const response = await get('/user-subscriptions');
    return response.data;
  },

  subscribePlan: async (planId: string) => {
    const response = await post('/user-subscriptions/subscribe', { planId });
    return response.data;
  },
};
