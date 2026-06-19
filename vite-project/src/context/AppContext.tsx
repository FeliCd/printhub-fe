/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  Product,
  CartItem,
  Address,
  Order,
  CustomOrder,
  WalletTransaction,
  Dispute,
  AppNotification
} from '../types';
import { route } from '../router/routes';

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Articulated Dragon Toy',
    type: 'DIGITAL',
    price: 99000,
    stock: 9999,
    image: 'https://images.unsplash.com/photo-1608181114410-db2bb03679bc?q=80&w=600&auto=format&fit=cover',
    makerName: 'DragonCreator3D',
    makerId: 101,
    category: 'Toys & Games',
    description: 'Fully flexible articulated dragon model. Prints in place without supports.',
    licenseType: 'PERSONAL',
    downloadCount: 1240,
    originalUrl: 'dragon_v2_final_hd.stl',
    watermarkedUrl: 'dragon_v2_watermarked_preview.stl'
  },
  {
    id: 2,
    name: 'Bambu Lab X1-Carbon Mini Replica',
    type: 'PHYSICAL',
    price: 450000,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1631553127989-13c5ee0fcc53?q=80&w=600&auto=format&fit=cover',
    makerName: 'PrintMaster_VN',
    makerId: 102,
    category: 'Miniatures',
    description: 'Highly detailed scale miniature of the famous Bambu Lab X1-Carbon 3D printer.',
  },
  {
    id: 3,
    name: 'Voron 2.4 R2 Stealthburner Faceplate',
    type: 'PHYSICAL',
    price: 280000,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1615840287214-7fe58a8b668f?q=80&w=600&auto=format&fit=cover',
    makerName: 'MakerLabb',
    makerId: 103,
    category: 'Printer Parts',
    description: 'Stealthburner front cover printed in high-temp ABS+ Red and Black.',
  },
  {
    id: 4,
    name: 'Futuristic Cyberpunk Helmet',
    type: 'DIGITAL',
    price: 490000,
    stock: 9999,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=cover',
    makerName: 'CyberDesigns',
    makerId: 104,
    category: 'Cosplay',
    description: 'Wearable Cyberpunk style helmet. Files split for standard 220x220 build plates.',
    licenseType: 'COMMERCIAL',
    downloadCount: 345,
    originalUrl: 'cyber_helmet_full_commercial.stl',
    watermarkedUrl: 'cyber_helmet_demo_watermarked.stl'
  },
  {
    id: 5,
    name: 'Ender 3 V2 Upgrade Kit',
    type: 'PHYSICAL',
    price: 320000,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=cover',
    makerName: 'PrintMaster_VN',
    makerId: 102,
    category: 'Printer Parts',
    description: 'Comprehensive upgrade kit including dual Z-axis, metal extruder, and yellow bed springs.'
  },
  {
    id: 6,
    name: 'Low-Poly Pikachu Statue',
    type: 'DIGITAL',
    price: 49000,
    stock: 9999,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=cover',
    makerName: 'DragonCreator3D',
    makerId: 101,
    category: 'Toys & Games',
    description: 'Minimalist low-poly Pikachu model. Prints beautifully without supports.',
    licenseType: 'PERSONAL',
    downloadCount: 890,
    originalUrl: 'pikachu_lowpoly.stl',
    watermarkedUrl: 'pikachu_lowpoly_demo.stl'
  },
  {
    id: 7,
    name: 'Bambu Lab AMS Hub Protector',
    type: 'PHYSICAL',
    price: 85000,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1615840287214-7fe58a8b668f?q=80&w=600&auto=format&fit=cover',
    makerName: 'MakerLabb',
    makerId: 103,
    category: 'Printer Parts',
    description: 'Sleek TPU strain relief protector for Bambu Lab AMS Hub cables.'
  },
  {
    id: 8,
    name: 'Mechanical Keyboard Case STL',
    type: 'DIGITAL',
    price: 180000,
    stock: 9999,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=cover',
    makerName: 'CyberDesigns',
    makerId: 104,
    category: 'Gadgets',
    description: 'Ergonomic 65% mechanical keyboard case design. Compatible with GH65 PCB.',
    licenseType: 'COMMERCIAL',
    downloadCount: 145,
    originalUrl: 'keyboard_case_65.stl',
    watermarkedUrl: 'keyboard_case_65_watermark.stl'
  },
  {
    id: 9,
    name: 'Cyberpunk Headphone Stand',
    type: 'PHYSICAL',
    price: 350000,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=cover',
    makerName: 'PrintMaster_VN',
    makerId: 102,
    category: 'Decor',
    description: 'Neon-infused cyberpunk headset holder. Heavy base printed in carbon fiber PLA.'
  },
  {
    id: 10,
    name: 'Geometric Flower Vase',
    type: 'PHYSICAL',
    price: 210000,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1581781870027-04212e231e96?q=80&w=600&auto=format&fit=cover',
    makerName: 'MakerLabb',
    makerId: 103,
    category: 'Decor',
    description: 'Vase mode optimized geometric planter. Waterproofed with inner food-grade resin coat.'
  },
  {
    id: 11,
    name: 'Star Wars Baby Yoda STL',
    type: 'DIGITAL',
    price: 120000,
    stock: 9999,
    image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?q=80&w=600&auto=format&fit=cover',
    makerName: 'DragonCreator3D',
    makerId: 101,
    category: 'Toys & Games',
    description: 'High-poly sculpture of Baby Yoda (Grogu) holding a soup bowl.',
    licenseType: 'PERSONAL',
    downloadCount: 2310,
    originalUrl: 'grogu_soup_bowl.stl',
    watermarkedUrl: 'grogu_soup_bowl_preview.stl'
  },
  {
    id: 12,
    name: 'Linear Rail Guide Block MGN12H',
    type: 'PHYSICAL',
    price: 290000,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?q=80&w=600&auto=format&fit=cover',
    makerName: 'MakerLabb',
    makerId: 103,
    category: 'Printer Parts',
    description: 'High precision MGN12H linear guide slider block with grease nipple, pre-lubricated.'
  },
  {
    id: 13,
    name: 'Modular Drawer Organizer',
    type: 'PHYSICAL',
    price: 140000,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=cover',
    makerName: 'PrintMaster_VN',
    makerId: 102,
    category: 'Home Improvement',
    description: 'Interlocking drawer bins, set of 6. Fits standard desk drawers for office supply storage.'
  },
  {
    id: 14,
    name: 'Custom Keycap Set (Retro Theme)',
    type: 'PHYSICAL',
    price: 420000,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=600&auto=format&fit=cover',
    makerName: 'PrintMaster_VN',
    makerId: 102,
    category: 'Gadgets',
    description: 'Retro beige colorway double-shot custom keycap set. Fits cherry MX stem profile keyboards.'
  },
  {
    id: 15,
    name: 'Dungeons & Dragons Miniatures',
    type: 'DIGITAL',
    price: 250000,
    stock: 9999,
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600&auto=format&fit=cover',
    makerName: 'DragonCreator3D',
    makerId: 101,
    category: 'Miniatures',
    description: 'Pack of 12 detailed heroic monster miniatures for tabletop roleplaying games.',
    licenseType: 'COMMERCIAL',
    downloadCount: 75,
    originalUrl: 'dnd_monster_pack_12.stl',
    watermarkedUrl: 'dnd_monster_pack_12_preview.stl'
  },
  {
    id: 16,
    name: 'NEMA 17 Stepper Motor Damper',
    type: 'PHYSICAL',
    price: 45000,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=cover',
    makerName: 'MakerLabb',
    makerId: 103,
    category: 'Printer Parts',
    description: 'Steel and rubber vibration isolation damper for reducing noise on Cartesian printers.'
  },
  {
    id: 17,
    name: 'Smart Watch Charging Stand',
    type: 'PHYSICAL',
    price: 165000,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600&auto=format&fit=cover',
    makerName: 'CyberDesigns',
    makerId: 104,
    category: 'Gadgets',
    description: 'Minimalist desktop charging dock compatible with Apple Watch and Samsung Galaxy Watch chargers.'
  },
  {
    id: 18,
    name: 'Steampunk Cog Clock STL',
    type: 'DIGITAL',
    price: 95000,
    stock: 9999,
    image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=600&auto=format&fit=cover',
    makerName: 'DragonCreator3D',
    makerId: 101,
    category: 'Decor',
    description: 'Working mechanical clock 3D print file. Uses a standard AA clock mechanism.',
    licenseType: 'PERSONAL',
    downloadCount: 420,
    originalUrl: 'steampunk_cog_clock.stl',
    watermarkedUrl: 'steampunk_cog_clock_preview.stl'
  },
  {
    id: 19,
    name: 'V2 Stealthburner LED Mount',
    type: 'PHYSICAL',
    price: 35000,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=cover',
    makerName: 'MakerLabb',
    makerId: 103,
    category: 'Printer Parts',
    description: 'RGB LED mount brackets printed in clear translucent PETG for custom hotend lighting.'
  }
];

const INITIAL_ADDRESSES: Address[] = [
  {
    id: 1,
    name: 'Nguyễn Văn Anh',
    phone: '0987654321',
    addressLine: '123 Đường Lê Lợi, Phường Bến Thành, Quận 1',
    province: 'Hồ Chí Minh',
    isDefault: true
  },
  {
    id: 2,
    name: 'Nguyễn Văn Anh',
    phone: '0987654321',
    addressLine: '456 Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy',
    province: 'Hà Nội',
    isDefault: false
  }
];

const INITIAL_CUSTOM_ORDERS: CustomOrder[] = [
  {
    id: 'CUST-8392',
    buyerName: 'Nguyễn Văn Anh',
    buyerId: 201,
    makerId: 101,
    makerName: 'DragonCreator3D',
    requirements: 'Cần thiết kế và in 3D 10 chiếc bánh răng nhựa chịu lực Nylon-CF cho máy CNC mini. Đường kính 5cm, dày 1.2cm, 24 răng.',
    attachmentUrl: 'gear_dimensions_blueprint.pdf',
    category: 'Cơ khí',
    material: 'Nylon-CF',
    quantity: 10,
    quotedPrice: 1200000,
    status: 'ACCEPTED',
    date: '2026-06-17',
    messages: [
      { sender: 'Nguyễn Văn Anh', text: 'Chào bạn, tôi cần in 10 bánh răng Nylon-CF, file bản vẽ đính kèm.', date: '2026-06-17' },
      { sender: 'DragonCreator3D', text: 'Tôi đã xem bản vẽ. Báo giá 1.200.000đ cho 10 chiếc, in Nylon-CF chịu lực.', date: '2026-06-17' },
      { sender: 'Nguyễn Văn Anh', text: 'Đồng ý, tôi chấp nhận báo giá và thanh toán.', date: '2026-06-17' },
    ]
  },
  {
    id: 'CUST-7201',
    buyerName: 'Trần Minh Tuấn',
    buyerId: 202,
    makerId: null,
    makerName: null,
    requirements: 'In mô hình Iron Man Mark 50 tỉ lệ 1:4, có thể tách rời các bộ phận để sơn riêng. Chiều cao khoảng 45cm.',
    attachmentUrl: 'ironman_ref_images.zip',
    category: 'Cosplay',
    material: 'PLA',
    quantity: 1,
    status: 'REQUESTED',
    date: '2026-06-18',
    messages: []
  },
  {
    id: 'CUST-6855',
    buyerName: 'Lê Thị Hương',
    buyerId: 203,
    makerId: null,
    makerName: null,
    requirements: 'Cần in 50 chiếc móc khóa hình logo công ty (file SVG đính kèm) bằng nhựa PETG màu xanh dương. Kích thước 4x3cm.',
    attachmentUrl: 'company_logo.svg',
    category: 'Trang trí',
    material: 'PETG',
    quantity: 50,
    status: 'REQUESTED',
    date: '2026-06-18',
    messages: []
  },
  {
    id: 'CUST-5430',
    buyerName: 'Phạm Đức Long',
    buyerId: 204,
    makerId: null,
    makerName: null,
    requirements: 'In 3D vỏ bọc bảo vệ cho Raspberry Pi 4B có khe quạt tản nhiệt và slot GPIO. Vật liệu ABS chịu nhiệt.',
    category: 'Gadget',
    material: 'ABS',
    quantity: 2,
    status: 'REQUESTED',
    date: '2026-06-19',
    messages: []
  },
  {
    id: 'CUST-4102',
    buyerName: 'Nguyễn Văn Anh',
    buyerId: 201,
    makerId: 101,
    makerName: 'DragonCreator3D',
    requirements: 'In mô hình kiến trúc nhà 2 tầng theo bản vẽ AutoCAD, tỉ lệ 1:100. Dùng để trưng bày cho khách hàng xem trước.',
    attachmentUrl: 'house_design_v3.dwg',
    category: 'Trang trí',
    material: 'PLA',
    quantity: 1,
    status: 'PICKED',
    date: '2026-06-19',
    messages: [
      { sender: 'DragonCreator3D', text: 'Tôi đã nhận đơn và đang xem bản vẽ. Sẽ gửi báo giá trong 24h.', date: '2026-06-19' }
    ]
  }
];

interface MakerProfile {
  status: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  equipmentInfo: string;
  bio: string;
  portfolioUrl: string;
  trustScore: number;
}

interface AppContextType {
  isAuthenticated: boolean;
  currentUser: { name: string; role: 'BUYER' | 'MAKER' | 'ADMIN' } | null;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  customOrders: CustomOrder[];
  setCustomOrders: React.Dispatch<React.SetStateAction<CustomOrder[]>>;
  disputes: Dispute[];
  setDisputes: React.Dispatch<React.SetStateAction<Dispute[]>>;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  walletTransactions: WalletTransaction[];
  setWalletTransactions: React.Dispatch<React.SetStateAction<WalletTransaction[]>>;
  walletPasscode: string;
  setWalletPasscode: (passcode: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isPasscodeModalOpen: boolean;
  setIsPasscodeModalOpen: (open: boolean) => void;
  openPasscodeModal: (onSuccess: () => void) => void;
  closePasscodeModal: () => void;
  passcodeCallback: (() => void) | null;
  makerProfile: MakerProfile;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isNewProductModalOpen: boolean;
  setIsNewProductModalOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  isCustomOrderModalOpen: boolean;
  setIsCustomOrderModalOpen: (open: boolean) => void;
  isDisputeModalOpen: boolean;
  setIsDisputeModalOpen: (open: boolean) => void;
  topupAmount: number;
  setTopupAmount: (amount: number) => void;
  addNotification: (type: 'ORDER' | 'DISPUTE' | 'PAYMENT' | 'SYSTEM', title: string, description: string) => void;
  handleAddToCart: (product: Product, options?: { color?: string; material?: string }) => void;
  handleRemoveFromCart: (productId: number) => void;
  handleUpdateCartQuantity: (productId: number, qty: number) => void;
  handleCheckout: (paymentMethod: string) => void;
  handleRequestCustomQuote: (data: {
    requirements: string;
    attachmentUrl: string;
    category: string;
    material: string;
    quantity: number;
    infill?: string;
    resolution?: string;
    color?: string;
    finish?: string;
    priority?: string;
    sizeScale?: string;
  }) => void;
  handleAddProduct: (productData: {
    name: string;
    type: 'PHYSICAL' | 'DIGITAL';
    price: number;
    stock: number;
    image: string;
    description: string;
    licenseType?: 'PERSONAL' | 'COMMERCIAL';
  }) => void;
  handleAddAddress: (addressData: { name: string; phone: string; addressLine: string; province: string }) => void;
  handleSetDefaultAddress: (id: number) => void;
  handleTopup: () => void;
  handleOpenDispute: (data: { orderId: string; reason: string; evidenceUrl: string }) => void;
  handleMakerPickRequest: (orderId: string) => void;
  handleMakerQuote: (orderId: string, price: number) => void;
  handleMakerSendMessage: (orderId: string, text: string) => void;
  handleBuyerSendMessage: (orderId: string, text: string) => void;
  handleBuyerAcceptQuote: (orderId: string) => void;
  handleMakerUploadProof: (orderId: string, img: string, note: string) => void;
  handleBuyerCompleteCustom: (orderId: string) => void;
  handleResolveDispute: (id: string, refundAmount: number, refundType: 'FULL' | 'PARTIAL') => void;
  handleUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  handleDeleteProduct: (productId: number) => void;
  handleLogin: (name: string, role: 'BUYER' | 'MAKER' | 'ADMIN') => void;
  handleLogout: () => void;
  isAllowed: (path: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; role: 'BUYER' | 'MAKER' | 'ADMIN' } | null>(null);

  // Data States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORDER-5203',
      items: [
        {
          product: INITIAL_PRODUCTS[0], // Articulated Dragon Toy (DIGITAL - 99k)
          quantity: 1,
          selectedColor: 'Đỏ',
          selectedMaterial: 'PLA'
        }
      ],
      totalAmount: 99000,
      commissionFee: 4950,
      status: 'COMPLETED',
      shippingAddress: INITIAL_ADDRESSES[0],
      date: '2026-06-16',
      paymentMethod: 'WALLET',
      trackingNumber: 'TRACK-8392102'
    },
    {
      id: 'ORDER-6192',
      items: [
        {
          product: INITIAL_PRODUCTS[6], // AMS Hub Protector (PHYSICAL - 85k)
          quantity: 1,
          selectedColor: 'Đen',
          selectedMaterial: 'TPU'
        },
        {
          product: INITIAL_PRODUCTS[18], // LED Mount (PHYSICAL - 35k)
          quantity: 2,
          selectedColor: 'Trong suốt',
          selectedMaterial: 'PETG'
        }
      ],
      totalAmount: 155000,
      commissionFee: 7750,
      status: 'COMPLETED',
      shippingAddress: INITIAL_ADDRESSES[0],
      date: '2026-06-17',
      paymentMethod: 'WALLET',
      trackingNumber: 'TRACK-4920194'
    },
    {
      id: 'ORDER-7489',
      items: [
        {
          product: INITIAL_PRODUCTS[8], // Cyberpunk Stand (PHYSICAL - 350k)
          quantity: 1,
          selectedColor: 'Xanh Lá',
          selectedMaterial: 'PLA'
        }
      ],
      totalAmount: 350000,
      commissionFee: 17500,
      status: 'PENDING',
      shippingAddress: INITIAL_ADDRESSES[1],
      date: '2026-06-19',
      paymentMethod: 'WALLET',
      trackingNumber: 'TRACK-2910405'
    }
  ]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>(INITIAL_CUSTOM_ORDERS);
  const [disputes, setDisputes] = useState<Dispute[]>([
    {
      id: 'DISP-4392',
      orderId: 'ORDER-9923',
      reason: 'Bản in bị cong vênh chân góc và rạn nứt bề mặt lớp, không thể lắp khớp cơ khí.',
      evidenceUrl: 'https://images.unsplash.com/photo-1615840287214-7fe58a8b668f?q=80&w=600&auto=format&fit=cover',
      status: 'OPEN',
      date: '2026-06-18',
      messages: [
        { sender: 'BUYER', text: 'Bản in bị lỗi cong vênh nghiêm trọng.', date: '2026-06-18' }
      ]
    },
    {
      id: 'DISP-3102',
      orderId: 'ORDER-5203',
      reason: 'File STL bị lỗi rỗng trục xoay cơ cấu khớp.',
      evidenceUrl: 'https://images.unsplash.com/photo-1608181114410-db2bb03679bc?q=80&w=600&auto=format&fit=cover',
      status: 'RESOLVED',
      date: '2026-06-16',
      refundAmount: 99000,
      refundType: 'FULL',
      messages: [
        { sender: 'BUYER', text: 'File bị lỗi xoay không khớp trục.', date: '2026-06-16' },
        { sender: 'ADMIN', text: 'Admin đã phê duyệt phán quyết xử lý tranh chấp: Hoàn trả 100% số tiền (99.000đ) cho Người mua.', date: '2026-06-16' }
      ]
    }
  ]);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'NOTIF-1',
      type: 'SYSTEM',
      title: 'Chào mừng đến với PrintHub 3D',
      description: 'Hệ thống đã kích hoạt thành công. Ví điện tử của bạn đã được nhận VND 5,000,000 tiền mặt thử nghiệm!',
      isRead: false,
      date: 'Vừa xong'
    }
  ]);
  const [walletBalance, setWalletBalance] = useState<number>(5000000);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([
    {
      id: 'TX-1001',
      type: 'CREDIT',
      amount: 5000000,
      description: 'Nạp tiền thử nghiệm hệ thống',
      date: '2026-06-18'
    }
  ]);

  // Maker profile registration state
  const [makerProfile] = useState<MakerProfile>({
    status: 'APPROVED', // Pre-approved for maker demo mode
    equipmentInfo: 'Bambu Lab X1-Carbon, Creality Ender 3 S1 Pro',
    bio: 'Chuyên gia thiết kế mô hình cơ khí và in chất lượng cao PLA/PETG/Nylon-CF.',
    portfolioUrl: 'https://github.com/my-3d-portfolio',
    trustScore: 98
  });

  // Modal / Form States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCustomOrderModalOpen, setIsCustomOrderModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  // Wallet simulation
  const [topupAmount, setTopupAmount] = useState<number>(500000);

  // Search query state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Passcode States
  const [walletPasscode, setWalletPasscode] = useState<string>(() => {
    return localStorage.getItem('walletPasscode') || '123456';
  });
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [passcodeCallback, setPasscodeCallback] = useState<(() => void) | null>(null);

  const openPasscodeModal = (onSuccess: () => void) => {
    setPasscodeCallback(() => onSuccess);
    setIsPasscodeModalOpen(true);
  };

  const closePasscodeModal = () => {
    setIsPasscodeModalOpen(false);
    setPasscodeCallback(null);
  };

  const handleSetWalletPasscode = (newPasscode: string) => {
    setWalletPasscode(newPasscode);
    localStorage.setItem('walletPasscode', newPasscode);
  };

  // Helper Functions
  const addNotification = (type: 'ORDER' | 'DISPUTE' | 'PAYMENT' | 'SYSTEM', title: string, description: string) => {
    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      type,
      title,
      description,
      isRead: false,
      date: 'Mới nhận'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleAddToCart = (product: Product, options?: { color?: string; material?: string }) => {
    const existing = cart.find(item => 
      item.product.id === product.id && 
      (!options || (item.selectedColor === options.color && item.selectedMaterial === options.material))
    );
    if (existing) {
      setCart(cart.map(item => 
        (item.product.id === product.id && (!options || (item.selectedColor === options.color && item.selectedMaterial === options.material))) 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { 
        product, 
        quantity: 1, 
        selectedColor: options?.color, 
        selectedMaterial: options?.material 
      }]);
    }
    addNotification('ORDER', 'Giỏ hàng đã cập nhật', `Đã thêm sản phẩm "${product.name}" vào giỏ hàng.`);
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const handleUpdateCartQuantity = (productId: number, qty: number) => {
    if (qty <= 0) return;
    setCart(cart.map(item => item.product.id === productId ? { ...item, quantity: qty } : item));
  };

  const handleCheckout = (paymentMethod: string) => {
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    if (total === 0) return;

    if (paymentMethod === 'WALLET' && walletBalance < total) {
      alert('Số dư ví điện tử không đủ! Vui lòng nạp thêm tiền.');
      return;
    }

    const commission = Math.round(total * 0.05);
    const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
    const isAllDigital = cart.every(item => item.product.type === 'DIGITAL');

    const newOrder: Order = {
      id: `ORDER-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...cart],
      totalAmount: total,
      commissionFee: commission,
      status: isAllDigital ? 'COMPLETED' : 'PENDING',
      shippingAddress: defaultAddress,
      date: new Date().toISOString().split('T')[0],
      paymentMethod,
      trackingNumber: `TRACK-${Math.floor(1000000 + Math.random() * 9000000)}`
    };

    const proceedCheckout = () => {
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setIsCartOpen(false);

      if (paymentMethod === 'WALLET') {
        setWalletBalance(prev => prev - total);
        setWalletTransactions(prev => [
          {
            id: `TX-${Date.now()}`,
            type: 'DEBIT',
            amount: total,
            description: `Thanh toán đơn hàng ${newOrder.id}`,
            date: new Date().toISOString().split('T')[0]
          },
          ...prev
        ]);
      }

      // If digital, pay maker instantly
      if (newOrder.status === 'COMPLETED') {
        newOrder.items.forEach(item => {
          const makerGross = item.product.price * item.quantity;
          const makerNet = Math.round(makerGross * 0.95);
          
          setWalletTransactions(prevTx => [
            {
              id: `TX-PAYOUT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              type: 'CREDIT',
              amount: makerNet,
              description: `Nhận tiền bán thiết kế "${item.product.name}" (Đơn ${newOrder.id})`,
              date: new Date().toISOString().split('T')[0]
            },
            ...prevTx
          ]);
          setWalletBalance(b => b + makerNet);
        });
        addNotification('ORDER', 'Tải xuống tệp 3D', `Đơn hàng số ${newOrder.id} đã hoàn tất. Bạn có thể tải xuống file thiết kế.`);
      } else {
        addNotification('ORDER', 'Đơn hàng mới tạo', `Đơn hàng ${newOrder.id} của bạn đã được tiếp nhận.`);
      }

      alert(`Đặt hàng thành công! Mã đơn: ${newOrder.id}.${isAllDigital ? ' Bản in kỹ thuật số đã có sẵn để tải xuống.' : ''}`);
    };

    if (paymentMethod === 'WALLET') {
      openPasscodeModal(proceedCheckout);
    } else {
      proceedCheckout();
    }
  };

  const handleRequestCustomQuote = (data: {
    requirements: string;
    attachmentUrl: string;
    category: string;
    material: string;
    quantity: number;
    infill?: string;
    resolution?: string;
    color?: string;
    finish?: string;
    priority?: string;
    sizeScale?: string;
  }) => {
    const newReq: CustomOrder = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      buyerName: currentUser?.name || 'Nguyễn Văn Anh',
      buyerId: 201,
      makerId: null,
      makerName: null,
      requirements: data.requirements,
      attachmentUrl: data.attachmentUrl || undefined,
      category: data.category,
      material: data.material,
      quantity: data.quantity,
      status: 'REQUESTED',
      date: new Date().toISOString().split('T')[0],
      messages: [],
      infill: data.infill,
      resolution: data.resolution,
      color: data.color,
      finish: data.finish,
      priority: data.priority,
      sizeScale: data.sizeScale
    };

    setCustomOrders(prev => [newReq, ...prev]);
    setIsCustomOrderModalOpen(false);
    addNotification('ORDER', 'Yêu cầu in 3D đã đăng', `Yêu cầu mã ${newReq.id} đã được đăng lên bảng tin. Các nhà in sẽ sớm liên hệ!`);
  };

  const handleMakerPickRequest = (orderId: string) => {
    setCustomOrders(prev => prev.map(o =>
      o.id === orderId
        ? {
          ...o,
          makerId: 101,
          makerName: 'DragonCreator3D',
          status: 'PICKED' as const,
          messages: [
            ...(o.messages || []),
            { sender: 'DragonCreator3D', text: 'Xin chào! Tôi đã nhận đơn yêu cầu in của bạn và đang xem xét chi tiết. Sẽ gửi báo giá sớm nhất có thể.', date: new Date().toISOString().split('T')[0] }
          ]
        }
        : o
    ));
    addNotification('ORDER', 'Maker đã nhận yêu cầu in', `Nhà in DragonCreator3D đã nhận yêu cầu in mã ${orderId}.`);
  };

  const handleMakerSendMessage = (orderId: string, text: string) => {
    setCustomOrders(prev => prev.map(o =>
      o.id === orderId
        ? {
          ...o,
          messages: [
            ...(o.messages || []),
            { sender: 'DragonCreator3D', text, date: new Date().toISOString().split('T')[0] }
          ]
        }
        : o
    ));
  };

  const handleBuyerSendMessage = (orderId: string, text: string) => {
    setCustomOrders(prev => prev.map(o =>
      o.id === orderId
        ? {
          ...o,
          messages: [
            ...(o.messages || []),
            { sender: currentUser?.name || 'Nguyễn Văn Anh', text, date: new Date().toISOString().split('T')[0] }
          ]
        }
        : o
    ));
  };

  const handleAddProduct = (productData: {
    name: string;
    type: 'PHYSICAL' | 'DIGITAL';
    price: number;
    stock: number;
    image: string;
    description: string;
    licenseType?: 'PERSONAL' | 'COMMERCIAL';
  }) => {
    const newProd: Product = {
      id: products.length + 1,
      name: productData.name,
      type: productData.type,
      price: productData.price,
      stock: productData.stock,
      image: productData.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=cover',
      makerName: 'DragonCreator3D',
      makerId: 101,
      description: productData.description,
      category: 'Toys & Games',
      licenseType: productData.licenseType,
      downloadCount: productData.type === 'DIGITAL' ? 0 : undefined,
      originalUrl: productData.type === 'DIGITAL' ? 'model_design_original.stl' : undefined,
      watermarkedUrl: productData.type === 'DIGITAL' ? 'model_design_watermarked.stl' : undefined
    };

    setProducts([...products, newProd]);
    setIsNewProductModalOpen(false);
    addNotification('SYSTEM', 'Sản phẩm mới đã đăng', `Mẫu sản phẩm "${newProd.name}" đã được hiển thị trên catalog.`);
  };

  const handleAddAddress = (addressData: { name: string; phone: string; addressLine: string; province: string }) => {
    const newAddress: Address = {
      id: addresses.length + 1,
      name: addressData.name,
      phone: addressData.phone,
      addressLine: addressData.addressLine,
      province: addressData.province,
      isDefault: addresses.length === 0
    };

    setAddresses([...addresses, newAddress]);
  };

  const handleSetDefaultAddress = (id: number) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const handleTopup = () => {
    if (topupAmount <= 0) return;
    setWalletBalance(prev => prev + topupAmount);
    setWalletTransactions([
      {
        id: `TX-${Date.now()}`,
        type: 'CREDIT',
        amount: topupAmount,
        description: 'Nạp tiền vào ví qua Cổng VNPay',
        date: new Date().toISOString().split('T')[0]
      },
      ...walletTransactions
    ]);
    addNotification('PAYMENT', 'Nạp tiền ví thành công', `Ví của bạn đã được cộng thêm +VND ${topupAmount.toLocaleString()}.`);
    alert(`Nạp tiền thành công! Số dư hiện tại: VND ${(walletBalance + topupAmount).toLocaleString()}`);
  };

  const handleOpenDispute = (data: { orderId: string; reason: string; evidenceUrl: string }) => {
    const newDispute: Dispute = {
      id: `DISP-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: data.orderId,
      reason: data.reason,
      evidenceUrl: data.evidenceUrl || 'https://via.placeholder.com/150',
      status: 'OPEN',
      date: new Date().toISOString().split('T')[0],
      messages: [
        { sender: 'BUYER', text: data.reason, date: 'Vừa xong' }
      ]
    };

    setDisputes([newDispute, ...disputes]);
    setIsDisputeModalOpen(false);
    addNotification('DISPUTE', 'Khiếu nại được tạo', `Đơn khiếu nại ${newDispute.id} cho đơn hàng ${newDispute.orderId} đã được mở.`);
  };

  const handleMakerQuote = (orderId: string, price: number) => {
    setCustomOrders(prev => prev.map(o =>
      o.id === orderId
        ? {
          ...o,
          quotedPrice: price,
          status: 'QUOTED' as const,
          messages: [
            ...(o.messages || []),
            { sender: 'DragonCreator3D', text: `Tôi đã gửi báo giá ${price.toLocaleString()}đ cho yêu cầu này. Vui lòng xem xét và xác nhận.`, date: new Date().toISOString().split('T')[0] }
          ]
        }
        : o
    ));
    addNotification('ORDER', 'Nhận báo giá in 3D', `Nhà in đã gửi báo giá ${price.toLocaleString()}đ cho yêu cầu ${orderId}.`);
  };

  const handleBuyerAcceptQuote = (orderId: string) => {
    const order = customOrders.find(o => o.id === orderId);
    if (!order) return;
    const price = order.quotedPrice || 0;

    if (walletBalance < price) {
      alert('Số dư ví điện tử không đủ! Vui lòng nạp thêm tiền.');
      return;
    }

    openPasscodeModal(() => {
      setCustomOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'ACCEPTED' as const } : o));
      setWalletBalance(prev => prev - price);
      setWalletTransactions(prev => [
        {
          id: `TX-${Date.now()}`,
          type: 'DEBIT',
          amount: price,
          description: `Thanh toán thiết kế in mã ${orderId}`,
          date: new Date().toISOString().split('T')[0]
        },
        ...prev
      ]);
      addNotification('ORDER', 'Chấp nhận báo giá & Thanh toán', `Bạn đã đồng ý thiết kế in mã ${orderId} và thanh toán ${price.toLocaleString()}đ.`);
      alert(`Chấp nhận báo giá và thanh toán thành công cho đơn ${orderId}!`);
    });
  };

  const handleMakerUploadProof = (orderId: string, img: string, note: string) => {
    setCustomOrders(prev => prev.map(o => o.id === orderId ? { ...o, printProofImage: img, printProofNote: note, status: 'PRINTING' as const } : o));
    addNotification('ORDER', 'Bằng chứng in (Print Proof) được tải lên', `Nhà in đã cập nhật tiến độ in thực tế cho đơn ${orderId}.`);
  };

  const handleBuyerCompleteCustom = (orderId: string) => {
    const order = customOrders.find(o => o.id === orderId);
    if (!order) return;
    const price = order.quotedPrice || 0;
    const net = Math.round(price * 0.95);

    setCustomOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'COMPLETED' as const } : o));

    // Credit the maker
    setWalletTransactions(prev => [
      {
        id: `TX-CUST-${Date.now()}`,
        type: 'CREDIT',
        amount: net,
        description: `Nhận tiền thiết kế in ấn riêng ${orderId} (Đã nghiệm thu)`,
        date: new Date().toISOString().split('T')[0]
      },
      ...prev
    ]);
    setWalletBalance(b => b + net);

    addNotification('ORDER', 'Nghiệm thu hoàn tất đơn in 3D', `Đơn in 3D mã ${orderId} đã hoàn tất và giao thành công.`);
  };

  const handleResolveDispute = (id: string, refundAmount: number, refundType: 'FULL' | 'PARTIAL') => {
    setDisputes(prevDisputes => prevDisputes.map(d => d.id === id ? { 
      ...d, 
      status: 'RESOLVED', 
      refundAmount, 
      refundType,
      messages: [
        ...d.messages,
        { sender: 'ADMIN', text: `Admin đã phê duyệt phán quyết xử lý tranh chấp: Hoàn trả ${refundType === 'FULL' ? '100%' : '50%'} số tiền (${refundAmount.toLocaleString()}đ) cho Người mua.`, date: new Date().toISOString().split('T')[0] }
      ]
    } : d));
    
    setWalletBalance(prev => prev + refundAmount);
    setWalletTransactions(prevTx => [
      {
        id: `TX-${Date.now()}`,
        type: 'CREDIT',
        amount: refundAmount,
        description: `Hoàn tiền tranh chấp ${id}`,
        date: new Date().toISOString().split('T')[0]
      },
      ...prevTx
    ]);
    addNotification('PAYMENT', 'Hoàn tiền khiếu nại', `Bạn nhận được hoàn tiền +VND ${refundAmount.toLocaleString()} từ tranh chấp ${id}.`);
    alert(`Tranh chấp đã được xử lý! Số tiền hoàn: VND ${refundAmount.toLocaleString()}`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prevOrders => prevOrders.map(order => {
      if (order.id === orderId) {
        // If transitioning to COMPLETED, credit the maker
        if (status === 'COMPLETED' && order.status !== 'COMPLETED') {
          order.items.forEach(item => {
            const makerGross = item.product.price * item.quantity;
            const makerNet = Math.round(makerGross * 0.95);
            
            setWalletTransactions(prevTx => [
              {
                id: `TX-PAYOUT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                type: 'CREDIT',
                amount: makerNet,
                description: `Nhận tiền bán mô hình "${item.product.name}" (Đơn ${orderId})`,
                date: new Date().toISOString().split('T')[0]
              },
              ...prevTx
            ]);
            setWalletBalance(b => b + makerNet);
          });
          addNotification('ORDER', 'Đơn hàng hoàn tất', `Đơn hàng ${orderId} đã giao thành công và hoàn tất.`);
        } else if (status === 'SHIPPED') {
          addNotification('ORDER', 'Đơn hàng đã giao', `Đơn hàng ${orderId} đã được bàn giao cho đơn vị vận chuyển.`);
        } else if (status === 'PROCESSING') {
          addNotification('ORDER', 'Đơn hàng đang xử lý', `Đơn hàng ${orderId} đang được Maker chuẩn bị.`);
        }
        return { ...order, status };
      }
      return order;
    }));
  };

  const handleLogin = (name: string, role: 'BUYER' | 'MAKER' | 'ADMIN') => {
    setCurrentUser({ name, role });
    setIsAuthenticated(true);
    addNotification('SYSTEM', 'Đăng nhập thành công', `Chào mừng ${name} quay trở lại PrintHub.`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCart([]);
  };

  const handleDeleteProduct = (productId: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    setProducts(prev => prev.filter(p => p.id !== productId));
    addNotification('SYSTEM', 'Sản phẩm đã gỡ bỏ', `Sản phẩm "${prod.name}" đã bị Quản trị viên gỡ bỏ khỏi sàn.`);
    alert(`Đã gỡ bỏ thành công sản phẩm "${prod.name}" khỏi sàn.`);
  };

  const isAllowed = (path: string) => {
    if (!currentUser) return false;
    const activeRoutes = 
      currentUser.role === 'ADMIN' 
        ? route.menu.admin 
        : currentUser.role === 'MAKER' 
          ? route.menu.maker 
          : route.menu.buyer;
    const matchedRoute = activeRoutes.find(r => r.path === path);
    return matchedRoute ? matchedRoute.allowedRoles.includes(currentUser.role) : false;
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        products,
        setProducts,
        cart,
        setCart,
        addresses,
        setAddresses,
        orders,
        setOrders,
        customOrders,
        setCustomOrders,
        disputes,
        setDisputes,
        notifications,
        setNotifications,
        walletBalance,
        setWalletBalance,
        walletTransactions,
        setWalletTransactions,
        searchQuery,
        setSearchQuery,
        walletPasscode,
        setWalletPasscode: handleSetWalletPasscode,
        isPasscodeModalOpen,
        setIsPasscodeModalOpen,
        openPasscodeModal,
        closePasscodeModal,
        passcodeCallback,
        makerProfile,
        selectedProduct,
        setSelectedProduct,
        isNewProductModalOpen,
        setIsNewProductModalOpen,
        isCartOpen,
        setIsCartOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        isCustomOrderModalOpen,
        setIsCustomOrderModalOpen,
        isDisputeModalOpen,
        setIsDisputeModalOpen,
        topupAmount,
        setTopupAmount,
        addNotification,
        handleAddToCart,
        handleRemoveFromCart,
        handleUpdateCartQuantity,
        handleCheckout,
        handleRequestCustomQuote,
        handleAddProduct,
        handleAddAddress,
        handleSetDefaultAddress,
        handleTopup,
        handleOpenDispute,
        handleMakerPickRequest,
        handleMakerQuote,
        handleMakerSendMessage,
        handleBuyerSendMessage,
        handleBuyerAcceptQuote,
        handleMakerUploadProof,
        handleBuyerCompleteCustom,
        handleResolveDispute,
        handleUpdateOrderStatus,
        handleDeleteProduct,
        handleLogin,
        handleLogout,
        isAllowed
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
