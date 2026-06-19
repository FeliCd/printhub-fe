import React, { useState, useRef, useEffect } from 'react';
import { X, Lock, Delete } from 'lucide-react';

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  correctPasscode: string;
  onSuccess: () => void;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  isOpen,
  onClose,
  correctPasscode,
  onSuccess,
}) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [isShaking, setIsShaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Reset states on open/close
  useEffect(() => {
    if (isOpen) {
      setCode(Array(6).fill(''));
      setErrorMsg(null);
      setIsShaking(false);
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (index: number, val: string) => {
    // Only allow numbers
    if (val !== '' && !/^[0-9]$/.test(val)) return;

    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);

    if (val !== '' && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-submit when all 6 numbers are entered
    if (newCode.every(num => num !== '')) {
      const enteredCode = newCode.join('');
      validatePasscode(enteredCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (code[index] === '' && index > 0) {
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs[index - 1].current?.focus();
      } else {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  const validatePasscode = (enteredCode: string) => {
    if (enteredCode === correctPasscode) {
      onSuccess();
      onClose();
    } else {
      setIsShaking(true);
      setErrorMsg('Mật mã ví (passcode) không đúng! Vui lòng thử lại.');
      setCode(Array(6).fill(''));
      inputRefs[0].current?.focus();
      
      // Stop shaking animation after 400ms
      setTimeout(() => {
        setIsShaking(false);
      }, 400);
    }
  };

  const handleKeypadPress = (num: string) => {
    // Find the first empty index
    const emptyIndex = code.findIndex(val => val === '');
    if (emptyIndex === -1) return; // All filled

    const newCode = [...code];
    newCode[emptyIndex] = num;
    setCode(newCode);

    if (emptyIndex < 5) {
      inputRefs[emptyIndex + 1].current?.focus();
    }

    if (newCode.every(n => n !== '')) {
      const enteredCode = newCode.join('');
      validatePasscode(enteredCode);
    }
  };

  const handleBackspace = () => {
    // Find the last non-empty index
    const reversedIndex = [...code].reverse().findIndex(val => val !== '');
    if (reversedIndex === -1) return; // All empty

    const lastFilledIndex = 5 - reversedIndex;
    const newCode = [...code];
    newCode[lastFilledIndex] = '';
    setCode(newCode);
    inputRefs[lastFilledIndex].current?.focus();
  };

  return (
    <div className="modal-overlay">
      <div className={`modal-content passcode-modal ${isShaking ? 'shake-anim' : ''}`}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(57, 255, 20, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
            }}
          >
            <Lock size={22} />
          </div>
        </div>

        <h3 className="passcode-title">Xác nhận mật mã ví</h3>
        <p className="passcode-subtitle">
          Vui lòng nhập passcode gồm 6 số để xác minh quyền sở hữu và bảo mật số dư ví của bạn.
        </p>

        {/* Inputs */}
        <div className="passcode-inputs-wrapper">
          {code.map((val, idx) => (
            <input
              key={idx}
              ref={inputRefs[idx]}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={val}
              onChange={(e) => handleInputChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="passcode-field"
              autoComplete="off"
            />
          ))}
        </div>

        {errorMsg && (
          <p style={{ color: '#ff3b30', fontSize: '13px', margin: '-8px 0 16px 0', fontWeight: '500' }}>
            {errorMsg}
          </p>
        )}

        {/* Keypad */}
        <div className="passcode-keypad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              className="keypad-btn"
              onClick={() => handleKeypadPress(num)}
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            className="keypad-btn keypad-btn-action"
            onClick={onClose}
            style={{ fontSize: '13px', fontWeight: '600' }}
          >
            Hủy
          </button>
          <button
            type="button"
            className="keypad-btn"
            onClick={() => handleKeypadPress('0')}
          >
            0
          </button>
          <button
            type="button"
            className="keypad-btn keypad-btn-action"
            onClick={handleBackspace}
            title="Xóa"
          >
            <Delete size={20} />
          </button>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Mật mã ví mặc định ban đầu là <strong>123456</strong>. Bạn có thể thay đổi passcode này trong trang Hồ sơ cá nhân.
        </div>
      </div>
    </div>
  );
};
