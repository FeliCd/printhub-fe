import React from 'react';
import { buyerMenuRoutes } from './route.menu.buyer';
import { makerMenuRoutes } from './route.menu.maker';
import { adminMenuRoutes } from './route.menu.admin';

export interface RouteConfig {
  path: string;
  label: string;
  icon: React.ReactNode;
  allowedRoles: ('BUYER' | 'MAKER' | 'ADMIN')[];
}

// Re-export individual route menus for backward compatibility
export { buyerMenuRoutes } from './route.menu.buyer';
export { makerMenuRoutes } from './route.menu.maker';
export { adminMenuRoutes } from './route.menu.admin';

export const routes = {
  menu: {
    buyer: buyerMenuRoutes,
    maker: makerMenuRoutes,
    admin: adminMenuRoutes
  }
};

export const route = routes;
