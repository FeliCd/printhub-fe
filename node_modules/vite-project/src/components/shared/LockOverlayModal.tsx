import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

interface LockOverlayModalProps {
  walletBalance: number;
  onPayFine: () => void;
}

export const LockOverlayModal: React.FC<LockOverlayModalProps> = ({
  walletBalance,
  onPayFine,
}) => {
  const fineAmount = Math.abs(walletBalance);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 10, 10, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'overlay-fade-in 0.3s ease-out',
      }}
    >
      <style>{`
        @keyframes overlay-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes box-slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 59, 48, 0.4); }
          50% { box-shadow: 0 0 30px rgba(255, 59, 48, 0.8); }
        }
        .lock-container {
          animation: box-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1), pulse-glow 3s infinite;
        }
      `}</style>

      <div
        className="lock-container"
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'linear-gradient(135deg, #1e0d0d 0%, #120505 100%)',
          border: '2px solid #ff3b30',
          borderRadius: '24px',
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Header Warning Icon */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 59, 48, 0.15)',
            border: '2px solid #ff3b30',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
          }}
        >
          <ShieldAlert size={40} color="#ff3b30" />
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#ff3b30',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Tài khoản đang bị khóa do số dư âm
        </h2>

        {/* Subtitle / Violation Reason */}
        <p
          style={{
            fontSize: '14px',
            color: '#ffb3b0',
            lineHeight: '1.6',
            marginBottom: '28px',
          }}
        >
          Bạn đã vi phạm nghiêm trọng quy chế hoạt động của sàn (bùng đơn hàng, hủy đơn vô căn cứ). Toàn bộ quyền hoạt động đã tạm thời bị đình chỉ.
        </p>

        {/* Status / Fine box */}
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '16px',
            padding: '16px 20px',
            border: '1px solid rgba(255, 59, 48, 0.2)',
            marginBottom: '28px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#ffb3b0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
            Tổng số dư âm cần thanh toán phạt
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff3b30', fontFamily: 'monospace' }}>
            -{fineAmount.toLocaleString()} VND
          </div>
        </div>

        {/* QR Code Pay-to-Unlock Container */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '13px', color: '#ffb3b0', marginBottom: '12px', fontWeight: '500' }}>
            Quét mã QR dưới đây để nộp phạt hành chính (Pay-to-Unlock)
          </div>
          <div
            style={{
              background: '#ffffff',
              padding: '20px',
              borderRadius: '20px',
              display: 'inline-block',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              border: '4px solid #ff3b30',
            }}
          >
            {/* SVG Custom QR Code design to look authentic */}
            <svg
              width="180"
              height="180"
              viewBox="0 0 29 29"
              shapeRendering="crispEdges"
              style={{ display: 'block' }}
            >
              {/* White Background */}
              <rect width="29" height="29" fill="#ffffff" />
              {/* QR Pattern */}
              <path
                fill="#000000"
                d="M0 0h7v7H0zm22 0h7v7h-7zM0 22h7v7H0zm2 2h3v3H2zM22 22h7v7h-7zm2 2h3v3h-3zm-22-22h3v3H2zm20 0h3v3h-3zM9 0h2v2H9zm4 0h2v1h-2zm3 0h3v1h-3zm4 0h1v2h-1zm-11 3h2v1H9zm3 0h3v2h-3zm4 0h2v3h-2zm3 1h1v1h-1zm2 1h1v1h-1zm-9 2h2v1H9zm11 1h2v2h-2zM0 9h1v3H0zm2 0h2v1H2zm3 0h3v2H5zm4 0h2v2H9zm3 0h2v1h-2zm4 0h2v1h-2zm3 0h1v2h-1zm3 0h2v2h-2zm-12 2h1v1h-1zm5 0h2v1h-2zm6 0h1v2h-1zm-20 2h3v1H0zm5 0h1v3H5zm2 0h3v1H7zm5 0h3v1h-3zm4 0h2v2h-2zm3 0h2v2h-2zm2 1h1v2h-1zm-14 2h2v1h-2zm3 0h2v2h-3zm6 0h2v1h-2zm3 0h1v1h-1zm-19 2h1v2H0zm3 0h2v1H3zm6 0h2v2H9zm4 0h2v1h-2zm4 0h2v1h-2zm3 0h2v2h-2zm3 0h1v1h-1zm2 0h1v2h-1zm-19 2h1v1H3zm2 0h2v2H5zm7 0h3v1h-3zm7 0h1v1h-1zm3 0h1v2h-1zm-16 1h2v1h-2zm6 0h3v1h-3zm7 0h1v1h-1z"
              />
              <path
                fill="#ff3b30"
                d="M12 12h5v5h-5z"
              />
            </svg>
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#8b8b8b',
              marginTop: '8px',
              fontFamily: 'monospace',
            }}
          >
            PAY-TO-UNLOCK // SYSTEM_VIOLATION_PENALTY
          </div>
        </div>

        {/* Action Button to unlock */}
        <button
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '14px 20px',
            borderRadius: '14px',
            fontWeight: '700',
            fontSize: '15px',
            backgroundColor: '#ff3b30',
            borderColor: '#ff3b30',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onClick={onPayFine}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#ff453a';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#ff3b30';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <CheckCircle2 size={18} />
          Đã nộp phạt qua QR (Pay-to-Unlock)
        </button>
      </div>
    </div>
  );
};
