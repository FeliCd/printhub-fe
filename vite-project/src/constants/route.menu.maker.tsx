import { ShoppingBag, Wallet, AlertOctagon, User, ClipboardList, Gift } from 'lucide-react';
import type { RouteConfig } from './routes';

export const makerMenuRoutes: RouteConfig[] = [
  {
    path: '/catalog',
    label: 'Mẫu in & Catalog',
    icon: <ShoppingBag size={18} />,
    allowedRoles: ['MAKER']
  },
  {
    path: '/print-requests',
    label: 'Bảng yêu cầu in ấn',
    icon: <ClipboardList size={18} />,
    allowedRoles: ['MAKER']
  },
  {
    path: '/subscriptions',
    label: 'Gói hội viên & Ưu đãi',
    icon: <Gift size={18} />,
    allowedRoles: ['MAKER']
  },
  {
    path: '/wallet',
    label: 'Ví điện tử & Nạp ví',
    icon: <Wallet size={18} />,
    allowedRoles: ['MAKER']
  },
  {
    path: '/disputes',
    label: 'Khiếu nại & Tranh chấp',
    icon: <AlertOctagon size={18} />,
    allowedRoles: ['MAKER']
  },
  {
    path: '/profile',
    label: 'Hồ sơ & Địa chỉ',
    icon: <User size={18} />,
    allowedRoles: ['MAKER']
  }
];
