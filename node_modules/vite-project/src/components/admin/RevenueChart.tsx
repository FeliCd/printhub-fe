import React from 'react';

interface RevenueChartProps {
  monthlyRevenue: { month: string; value: number; label: string }[];
  maxVal: number;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ monthlyRevenue, maxVal }) => {
  return (
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
        {monthlyRevenue.map((item, idx) => {
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
  );
};
