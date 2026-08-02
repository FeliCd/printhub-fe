import React from 'react';
import { buyerMenuRoutes } from './route.menu.buyer';
import { adminMenuRoutes } from './route.menu.admin';

export interface RouteConfig {
  path: string;
  label: string;
  icon: React.ReactNode;
  allowedRoles: ('BUYER' | 'ADMIN')[];
}

export { buyerMenuRoutes } from './route.menu.buyer';
export { adminMenuRoutes } from './route.menu.admin';

export const routes = {
  menu: {
    buyer: buyerMenuRoutes,
    admin: adminMenuRoutes
  }
};

export const route = routes;
