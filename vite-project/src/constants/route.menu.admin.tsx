import { Gift, ShieldCheck, Printer } from 'lucide-react';
import type { RouteConfig } from './routes';

export const adminMenuRoutes: RouteConfig[] = [
  {
    path: '/admin/dashboard',
    label: 'Quản lý Xưởng & Tiến độ In',
    icon: <Printer size={18} />,
    allowedRoles: ['ADMIN']
  },
  {
    path: '/admin/subscriptions',
    label: 'Quản lý Subscription',
    icon: <Gift size={18} />,
    allowedRoles: ['ADMIN']
  },
  {
    path: '/admin/disputes',
    label: 'Bảo hành & Đổi trả CSKH',
    icon: <ShieldCheck size={18} />,
    allowedRoles: ['ADMIN']
  }
];
