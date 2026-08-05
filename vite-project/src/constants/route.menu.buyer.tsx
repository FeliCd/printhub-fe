import { ShoppingBag, Users, User, Gift, Wallet, ShieldCheck, Sparkles } from 'lucide-react';
import type { RouteConfig } from './routes';

export const buyerMenuRoutes: RouteConfig[] = [
  {
    path: '/catalog',
    label: 'Sản phẩm',
    icon: <ShoppingBag size={18} />,
    allowedRoles: ['BUYER']
  },
  {
    path: '/ruler-3d',
    label: 'Ruler 3D (Tùy chỉnh 3D)',
    icon: <Sparkles size={18} />,
    allowedRoles: ['BUYER']
  },
  {
    path: '/bulk-order',
    label: 'Đặt Sỉ Lớp (Excel Import)',
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
    path: '/warranty',
    label: 'Bảo hành 1 đổi 1 trong 1 học kỳ',
    icon: <ShieldCheck size={18} />,
    allowedRoles: ['BUYER']
  },
  {
    path: '/wallet',
    label: 'Ví điện tử & Tích điểm',
    icon: <Wallet size={18} />,
    allowedRoles: ['BUYER']
  },
  {
    path: '/subscriptions',
    label: 'Gói Combo Học Kỳ & Ưu đãi',
    icon: <Gift size={18} />,
    allowedRoles: ['BUYER']
  },
  {
    path: '/profile',
    label: 'Hồ sơ & Địa chỉ',
    icon: <User size={18} />,
    allowedRoles: ['BUYER']
  }
];
