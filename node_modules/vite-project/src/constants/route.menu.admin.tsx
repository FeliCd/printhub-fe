import { Gift, AlertOctagon, BarChart3 } from 'lucide-react';
import type { RouteConfig } from './routes';

export const adminMenuRoutes: RouteConfig[] = [
  {
    path: '/admin/dashboard',
    label: 'Báo cáo doanh thu',
    icon: <BarChart3 size={18} />,
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
    label: 'Quản lý tranh chấp',
    icon: <AlertOctagon size={18} />,
    allowedRoles: ['ADMIN']
  }
];
