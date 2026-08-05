export interface Product {
  id: number;
  name: string;
  type: 'PHYSICAL' | 'DIGITAL';
  price: number;
  stock: number;
  image: string;
  makerName?: string;
  makerId?: number;
  description: string;
  category: string;
  isCustomizable?: boolean;
  availableColors?: string[];
  subjectFormula?: string;
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
  engravingText?: string;
  subjectFormula?: string;
  isBulkOrder?: boolean;
  bulkStudentList?: { name: string; color: string; classId?: string }[];
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
  status: 'PENDING' | 'PENDING_DEPOSIT' | 'PROCESSING' | 'PRINTING' | 'SHIPPED' | 'COMPLETED' | 'WARRANTY_CLAIM' | 'CANCELLED';
  trackingNumber?: string;
  shippingAddress: Address;
  date: string;
  paymentMethod: string;
  isReviewed?: boolean;
  shippingFee?: number;
  depositAmount?: number;
  isCustomized?: boolean;
  warrantyToken?: string;
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
  status: 'REQUESTED' | 'PICKED' | 'QUOTED' | 'ACCEPTED' | 'PENDING_DEPOSIT' | 'DEPOSITED' | 'PRINTING' | 'PACKAGED' | 'SHIPPED' | 'COMPLETED' | 'WARRANTY_REQUEST' | 'CANCELLED';
  printProofImage?: string;
  printProofNote?: string;
  messages?: CustomOrderMessage[];
  date: string;
  color?: string;
  engravingText?: string;
  subjectFormula?: string;
  depositPercentage?: number;
  depositAmount?: number;
  paymentType?: 'DEPOSIT' | 'FULL';
  isBulkOrder?: boolean;
  bulkStudentList?: { name: string; color: string; classId?: string }[];
  infill?: string;
  resolution?: string;
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
  status: 'OPEN' | 'RESOLVED';
  refundAmount?: number;
  refundType?: 'FULL' | 'PARTIAL' | 'NONE';
  date: string;
  messages: { sender: string; text: string; date: string }[];
  replacementOrderCreated?: boolean;
}

export interface WarrantyClaim {
  id: string;
  orderId: string;
  userId: string;
  imageProofUrl: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REPLACED';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  type: 'ORDER' | 'DISPUTE' | 'PAYMENT' | 'SYSTEM';
  title: string;
  description: string;
  isRead: boolean;
  date: string;
}

export type SubscriptionType = 'CUSTOMER';

export interface SubscriptionPlan {
  id: string;
  type: SubscriptionType;
  name: string;
  price: number;
  benefits: string;
  requiredPoints?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscription {
  subscriptionId: string;
  userId: string;
  username: string;
  planId: string;
  planName: string;
  planType: SubscriptionType;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface MockUser {
  id: string;
  name: string;
  role: 'BUYER' | 'ADMIN';
}

export interface GiftSubscriptionRequest {
  userId: string;
  planId: string;
  reason: string;
}

export interface SubscriptionPlanRequest {
  name: string;
  price: number;
  benefits: string;
  requiredPoints?: number;
}
