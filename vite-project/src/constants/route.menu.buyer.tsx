import { ShoppingBag, Sparkles, Wallet, AlertOctagon, User, Gift } from 'lucide-react';
import type { RouteConfig } from './routes';

export const buyerMenuRoutes: RouteConfig[] = [
  {
    path: '/catalog',
    label: 'Sản phẩm & File 3D',
    icon: <ShoppingBag size={18} />,
    allowedRoles: ['BUYER']
  },
  {
    path: '/custom',
    label: 'Đặt in theo yêu cầu',
    icon: <Sparkles size={18} />,
    allowedRoles: ['BUYER']
  },
  {
    path: '/subscriptions',
    label: 'Gói hội viên & Ưu đãi',
    icon: <Gift size={18} />,
    allowedRoles: ['BUYER']
  },
  {
    path: '/wallet',
    label: 'Ví điện tử & Nạp ví',
    icon: <Wallet size={18} />,
    allowedRoles: ['BUYER']
  },
  {
    path: '/disputes',
    label: 'Khiếu nại & Tranh chấp',
    icon: <AlertOctagon size={18} />,
    allowedRoles: ['BUYER']
  },
  {
    path: '/profile',
    label: 'Hồ sơ & Địa chỉ',
    icon: <User size={18} />,
    allowedRoles: ['BUYER']
  }
];
