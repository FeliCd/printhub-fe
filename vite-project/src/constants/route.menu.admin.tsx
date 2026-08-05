import { Gift, ShieldCheck, Printer } from 'lucide-react';
import type { RouteConfig } from './routes';

export const adminMenuRoutes: RouteConfig[] = [
  {
    path: '/admin/production',
    label: 'Xưởng In 3D & Giao Vận B2C',
    icon: <Printer size={18} />,
    allowedRoles: ['ADMIN']
  },
  {
    path: '/admin/dashboard',
    label: 'Thống Kê Doanh Thu & Đơn Hàng',
    icon: <Printer size={18} />,
    allowedRoles: ['ADMIN']
  },
  {
    path: '/admin/subscriptions',
    label: 'Gói Combo Học Kỳ B2C',
    icon: <Gift size={18} />,
    allowedRoles: ['ADMIN']
  },
  {
    path: '/admin/disputes',
    label: 'Cổng Bảo Hành CSKH 1-Đổi-1',
    icon: <ShieldCheck size={18} />,
    allowedRoles: ['ADMIN']
  }
];
