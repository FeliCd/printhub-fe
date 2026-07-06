export interface Product {
  id: number;
  name: string;
  type: 'PHYSICAL' | 'DIGITAL';
  price: number;
  stock: number;
  image: string;
  makerName: string;
  makerId: number;
  description: string;
  category: string;
  licenseType?: 'PERSONAL' | 'COMMERCIAL';
  downloadCount?: number;
  originalUrl?: string;
  watermarkedUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedMaterial?: string;
}

export interface Address {
  id: number;
  name: string;
  phone: string;
  addressLine: string;
  province: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  commissionFee: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  trackingNumber?: string;
  shippingAddress: Address;
  date: string;
  paymentMethod: string;
  isReviewed?: boolean;
}

export interface CustomOrderMessage {
  sender: string;
  text: string;
  date: string;
}

export interface CustomOrder {
  id: string;
  buyerName: string;
  buyerId?: number;
  makerId?: number | null;
  makerName?: string | null;
  requirements: string;
  attachmentUrl?: string;
  category?: string;
  material?: string;
  quantity?: number;
  quotedPrice?: number;
  status: 'REQUESTED' | 'PICKED' | 'QUOTED' | 'ACCEPTED' | 'PRINTING' | 'COMPLETED' | 'CANCELLED';
  printProofImage?: string;
  printProofNote?: string;
  messages?: CustomOrderMessage[];
  date: string;
  infill?: string;
  resolution?: string;
  color?: string;
  finish?: string;
  priority?: string;
  sizeScale?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  date: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  reason: string;
  evidenceUrl: string;
  makerEvidenceUrl?: string;
  status: 'OPEN' | 'RESOLVED';
  refundAmount?: number;
  refundType?: 'FULL' | 'PARTIAL' | 'NONE';
  date: string;
  messages: { sender: string; text: string; date: string }[];
}

export interface AppNotification {
  id: string;
  type: 'ORDER' | 'DISPUTE' | 'PAYMENT' | 'SYSTEM';
  title: string;
  description: string;
  isRead: boolean;
  date: string;
}

export type SubscriptionType = 'CUSTOMER' | 'MAKER';

export interface SubscriptionPlan {
  id: string; // UUID
  type: SubscriptionType;
  name: string;
  price: number; // BigDecimal
  benefits: string;
  requiredPoints?: number; // integer (Maker plan can be blank/null)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscription {
  subscriptionId: string; // UUID
  userId: string; // UUID
  username: string;
  planId: string; // UUID
  planName: string;
  planType: SubscriptionType;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface MockUser {
  id: string; // UUID
  name: string;
  role: 'BUYER' | 'MAKER';
}

export interface GiftSubscriptionRequest {
  userId: string; // UUID
  planId: string; // UUID
  reason: string;
}

export interface SubscriptionPlanRequest {
  name: string;
  price: number;
  benefits: string;
  requiredPoints?: number;
}

