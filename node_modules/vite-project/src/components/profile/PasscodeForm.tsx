import React, { useState } from 'react';
import { Shield } from 'lucide-react';

interface PasscodeFormProps {
  walletPasscode: string;
  setWalletPasscode: (passcode: string) => void;
}

export const PasscodeForm: React.FC<PasscodeFormProps> = ({ walletPasscode, setWalletPasscode }) => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);
    setSecuritySuccess(null);

    if (currentPass !== walletPasscode) {
      setSecurityError('Mật mã passcode hiện tại không đúng.');
      return;
    }

    if (newPass.length !== 6 || confirmPass.length !== 6) {
      setSecurityError('Passcode mới phải gồm đầy đủ 6 chữ số.');
      return;
    }

    if (newPass !== confirmPass) {
      setSecurityError('Xác nhận passcode mới không khớp.');
      return;
    }

    if (newPass === walletPasscode) {
      setSecurityError('Passcode mới không được trùng với passcode cũ.');
      return;
    }

    setWalletPasscode(newPass);
    setSecuritySuccess('Cập nhật mật mã passcode bảo mật ví thành công!');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Shield size={18} className="text-muted" />
        <h2 style={{ margin: 0 }}>Bảo mật Ví (Passcode)</h2>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '20px' }}>
        Mật mã passcode gồm 6 số bảo vệ số dư tài khoản của bạn khi giao dịch thanh toán nội bộ.
      </p>
      <form onSubmit={handleSecuritySubmit}>
        <div className="form-group">
          <label>Passcode hiện tại</label>
          <input
            type="password"
            className="form-control"
            placeholder="Nhập passcode hiện tại"
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
          />
        </div>
        <div className="form-control-row">
          <div className="form-group">
            <label>Passcode mới</label>
            <input
              type="password"
              className="form-control"
              placeholder="Mã mới (6 số)"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
            />
          </div>
          <div className="form-group">
            <label>Xác nhận mã mới</label>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập lại mã mới"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
            />
          </div>
        </div>
        
        {securityError && (
          <p style={{ color: '#ff3b30', fontSize: '12px', marginBottom: '16px', fontWeight: '500' }}>
            {securityError}
          </p>
        )}
        {securitySuccess && (
          <p style={{ color: 'var(--primary)', fontSize: '12px', marginBottom: '16px', fontWeight: '500' }}>
            {securitySuccess}
          </p>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Cập nhật Passcode ví
        </button>
      </form>
    </div>
  );
};
