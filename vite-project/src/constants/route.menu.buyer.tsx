import { ShoppingBag, Users, User, Gift, Wallet, ShieldCheck } from 'lucide-react';
import type { RouteConfig } from './routes';

export const buyerMenuRoutes: RouteConfig[] = [
  {
    path: '/catalog',
    label: 'Bộ Thước Kẻ In 3D',
    icon: <ShoppingBag size={18} />,
    allowedRoles: ['BUYER']
  },
  {
    path: '/custom',
    label: 'Đặt Sỉ Cho Lớp / CLB',
    icon: <Users size={18} />,
    allowedRoles: ['BUYER']
  },
  {
    path: '/orders',
    label: 'Đơn hàng của tôi',
    icon: <ShoppingBag size={18} />,
    allowedRoles: ['BUYER']
  },
  {
    path: '/wallet',
    label: 'Ví điện tử',
    icon: <Wallet size={18} />,
    allowedRoles: ['BUYER']
  },
  {
    path: '/subscriptions',
    label: 'Gói hội viên & Ưu đãi',
    icon: <Gift size={18} />,
    allowedRoles: ['BUYER']
  },
  {
    path: '/disputes',
    label: 'Đổi trả & Bảo hành số',
    icon: <ShieldCheck size={18} />,
    allowedRoles: ['BUYER']
  },
  {
    path: '/profile',
    label: 'Hồ sơ & Địa chỉ',
    icon: <User size={18} />,
    allowedRoles: ['BUYER']
  }
];
