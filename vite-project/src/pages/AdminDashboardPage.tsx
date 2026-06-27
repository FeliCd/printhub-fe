import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { StatsGrid } from '@/components/admin/StatsGrid';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { TransactionsLedger } from '@/components/admin/TransactionsLedger';
import { DisputesLedger } from '@/components/admin/DisputesLedger';

export const AdminDashboardPage: React.FC = () => {
  const { orders, customOrders, disputes, products } = useApp();

  // Calculate completed standard orders
  const completedStandardOrders = orders.filter(o => o.status === 'COMPLETED');
  const totalStandardGross = completedStandardOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalStandardComm = completedStandardOrders.reduce((sum, o) => sum + o.commissionFee, 0);

  // Calculate completed custom orders (escrowed/paid and completed)
  const completedCustomOrders = customOrders.filter(co => co.status === 'COMPLETED');
  const totalCustomGross = completedCustomOrders.reduce((sum, co) => sum + (co.quotedPrice || 0), 0);
  const totalCustomComm = completedCustomOrders.reduce((sum, co) => sum + Math.round((co.quotedPrice || 0) * 0.05), 0);

  // Combined totals
  const totalGross = totalStandardGross + totalCustomGross;
  const totalCommission = totalStandardComm + totalCustomComm;
  const totalCompletedCount = completedStandardOrders.length + completedCustomOrders.length;

  // Monthly mock revenue data for CSS bar chart
  const MOCK_MONTHLY_REVENUE = [
    { month: 'Tháng 1', value: 850000, label: '42.500đ' },
    { month: 'Tháng 2', value: 1200000, label: '60.000đ' },
    { month: 'Tháng 3', value: 2450000, label: '122.500đ' },
    { month: 'Tháng 4', value: 1980000, label: '99.000đ' },
    { month: 'Tháng 5', value: 3100000, label: '155.000đ' },
    { month: 'Tháng 6', value: totalGross, label: `${totalCommission.toLocaleString()}đ` },
  ];

  const maxVal = Math.max(...MOCK_MONTHLY_REVENUE.map(m => m.value)) || 1;

  // Resolved disputes list for dispute history preview
  const resolvedDisputes = disputes.filter(d => d.status === 'RESOLVED');

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Báo cáo doanh thu & Quản trị sàn</h1>
        <p className="page-subtitle">Thống kê chi tiết doanh thu từ 5% hoa hồng trên mỗi đơn hàng thành công</p>
      </div>

      {/* Stats Dashboard Grid */}
      <StatsGrid
        totalCommission={totalCommission}
        totalGross={totalGross}
        totalCompletedCount={totalCompletedCount}
        completedStandardOrdersCount={completedStandardOrders.length}
        completedCustomOrdersCount={completedCustomOrders.length}
        productsCount={products.length}
      />

      {/* Main Charts & Table section */}
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Left Column: Neon CSS Bar Chart */}
        <RevenueChart
          monthlyRevenue={MOCK_MONTHLY_REVENUE}
          maxVal={maxVal}
        />

        {/* Right Column: Transactions Ledger */}
        <TransactionsLedger
          completedStandardOrders={completedStandardOrders}
          completedCustomOrders={completedCustomOrders}
          totalCompletedCount={totalCompletedCount}
        />
      </div>

      {/* Lower section: Dispute histories log */}
      <DisputesLedger
        resolvedDisputes={resolvedDisputes}
      />
    </div>
  );
};
