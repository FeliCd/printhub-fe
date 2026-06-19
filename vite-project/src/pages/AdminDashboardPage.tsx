import React from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, ShoppingBag, AlertCircle, Users, ClipboardCheck } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { orders, customOrders, disputes, products } = useApp();

  // Calculate completed standard orders
  const completedStandardOrders = orders.filter(o => o.status === 'COMPLETED');
  const totalStandardGross = completedStandardOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalStandardComm = completedStandardOrders.reduce((sum, o) => sum + o.commissionFee, 0);

  // Calculate completed custom orders (escorwed/paid and completed)
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Metric 1 */}
        <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: 0 }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(57, 255, 20, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Doanh thu Sàn (5%)</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'var(--mono)', color: 'var(--primary)' }}>
              {totalCommission.toLocaleString()}đ
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Từ {totalCompletedCount} đơn thành công
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: 0 }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 122, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#007aff'
          }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Tổng giao dịch (Gross)</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'var(--mono)' }}>
              {totalGross.toLocaleString()}đ
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Giá trị thanh toán lưu chuyển
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: 0 }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(175, 82, 222, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#af52de'
          }}>
            <ClipboardCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Đơn hàng thành công</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'var(--mono)' }}>
              {totalCompletedCount} <span style={{ fontSize: '13px', fontWeight: 'normal', color: 'var(--text-secondary)' }}>đơn</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {completedStandardOrders.length} Catalog | {completedCustomOrders.length} Thiết kế
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: 0 }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 159, 10, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ff9f0a'
          }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Thành viên & Mẫu in</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'var(--mono)' }}>
              {products.length} <span style={{ fontSize: '13px', fontWeight: 'normal', color: 'var(--text-secondary)' }}>mẫu</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              12 Người mua | 8 Nhà in
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Table section */}
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Left Column: Neon CSS Bar Chart */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '15px', marginBottom: '4px' }}>Xu hướng Doanh thu Sàn</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Biểu đồ phí sàn thu được qua các tháng</p>
          
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            height: '180px',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '12px',
            position: 'relative',
            marginTop: 'auto'
          }}>
            {MOCK_MONTHLY_REVENUE.map((item, idx) => {
              const percentage = (item.value / maxVal) * 100;
              return (
                <div 
                  key={idx} 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                    gap: '8px'
                  }}
                >
                  <div style={{ position: 'relative', width: '24px', height: '140px', display: 'flex', alignItems: 'flex-end' }}>
                    {/* Tooltip on hover */}
                    <div className="chart-tooltip-simple" style={{
                      position: 'absolute',
                      bottom: `${percentage + 5}%`,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'rgba(10, 10, 10, 0.95)',
                      border: '1px solid var(--primary)',
                      color: 'var(--primary)',
                      fontSize: '9px',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      fontWeight: 'bold',
                      fontFamily: 'var(--mono)'
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      width: '100%',
                      height: `${percentage}%`,
                      background: 'linear-gradient(to top, rgba(57, 255, 20, 0.2) 0%, var(--primary) 100%)',
                      borderRadius: '4px 4px 0 0',
                      boxShadow: '0 0 10px rgba(57, 255, 20, 0.3)',
                      transition: 'height 0.3s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Transactions Ledger */}
        <div className="glass-card" style={{ marginBottom: 0 }}>
          <h2 style={{ fontSize: '15px', marginBottom: '4px' }}>Sổ cái Giao dịch Thành công (Success Ledger)</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Các đơn hàng catalog và in theo thiết kế đã thanh toán & nghiệm thu</p>
          
          <div className="app-table-container">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Phân loại</th>
                  <th>Ngày hoàn tất</th>
                  <th>Tổng tiền hàng</th>
                  <th>Phí sàn (5%)</th>
                </tr>
              </thead>
              <tbody>
                {/* Standard Completed Orders */}
                {completedStandardOrders.map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'var(--mono)', fontWeight: 'bold' }}>{o.id}</td>
                    <td><span className="info-tag tag-approved" style={{ fontSize: '10px' }}>📦 Đơn Catalog</span></td>
                    <td>{o.date}</td>
                    <td style={{ fontFamily: 'var(--mono)' }}>{o.totalAmount.toLocaleString()}đ</td>
                    <td style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: 'var(--primary)' }}>
                      +{o.commissionFee.toLocaleString()}đ
                    </td>
                  </tr>
                ))}
                
                {/* Custom Completed Orders */}
                {completedCustomOrders.map((co) => {
                  const gross = co.quotedPrice || 0;
                  const comm = Math.round(gross * 0.05);
                  return (
                    <tr key={co.id}>
                      <td style={{ fontFamily: 'var(--mono)', fontWeight: 'bold' }}>{co.id}</td>
                      <td><span className="info-tag tag-pending" style={{ fontSize: '10px', backgroundColor: 'rgba(175, 82, 222, 0.1)', color: '#af52de' }}>🎨 Thiết kế riêng</span></td>
                      <td>{co.date}</td>
                      <td style={{ fontFamily: 'var(--mono)' }}>{gross.toLocaleString()}đ</td>
                      <td style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: 'var(--primary)' }}>
                        +{comm.toLocaleString()}đ
                      </td>
                    </tr>
                  );
                })}

                {totalCompletedCount === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      Chưa có đơn hàng thành công nào để hiển thị.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lower section: Dispute histories log */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <AlertCircle size={16} className="text-muted" />
          <h2 style={{ fontSize: '15px', margin: 0 }}>Lịch sử Tranh chấp & Giải quyết khiếu nại (Admin arbitration)</h2>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', paddingLeft: '24px' }}>
          Phán quyết hoàn tiền đã thực hiện bởi Admin đối với các khiếu nại sản phẩm lỗi
        </p>

        <div className="app-table-container" style={{ paddingLeft: '24px' }}>
          <table className="app-table">
            <thead>
              <tr>
                <th>Mã tranh chấp</th>
                <th>Mã đơn hàng</th>
                <th>Ngày xử lý</th>
                <th>Lý do khiếu nại</th>
                <th>Phán quyết Admin</th>
                <th>Số tiền hoàn trả</th>
              </tr>
            </thead>
            <tbody>
              {resolvedDisputes.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: '#ff3b30' }}>{d.id}</td>
                  <td style={{ fontFamily: 'var(--mono)' }}>{d.orderId}</td>
                  <td>{d.date}</td>
                  <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.reason}
                  </td>
                  <td>
                    <span className="info-tag tag-approved" style={{ fontSize: '10px' }}>
                      {d.refundType === 'FULL' ? 'Hoàn 100%' : 'Hoàn 50%'}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontWeight: 'bold', color: '#ff3b30' }}>
                    {d.refundAmount?.toLocaleString()}đ
                  </td>
                </tr>
              ))}

              {resolvedDisputes.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    Không có lịch sử tranh chấp nào đã giải quyết.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
