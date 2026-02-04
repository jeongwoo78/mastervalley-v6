// InsufficientBalancePopup.jsx - Insufficient Balance Popup (Dark Theme)
// Based on mockup: 09-charge-menu.html
import React from 'react';

const InsufficientBalancePopup = ({ 
  requiredAmount = 0.25, 
  currentBalance = 0.10, 
  onAddFunds, 
  onClose,
  lang = 'en'
}) => {

  // i18n texts
  const texts = {
    ko: {
      title: '잔액 부족',
      requires: '이 변환에 필요한 금액:',
      yourBalance: '현재 잔액:',
      recommended: '💡 추천',
      addFundsNow: '지금 충전하기',
      maybeLater: '나중에'
    },
    en: {
      title: 'Insufficient Balance',
      requires: 'This conversion requires',
      yourBalance: 'Your balance:',
      recommended: '💡 Recommended',
      addFundsNow: 'Add Funds Now',
      maybeLater: 'Maybe Later'
    }
  };
  const t = texts[lang] || texts.en;

  // 추천 팩 계산 (최소 금액 충족하는 가장 저렴한 팩)
  const getRecommendedPack = () => {
    const needed = requiredAmount - currentBalance;
    if (needed <= 0.99) return { name: 'Mini', price: 0.99 };
    if (needed <= 5.24) return { name: 'Basic', price: 4.99 };
    if (needed <= 10.99) return { name: 'Standard', price: 9.99 };
    return { name: 'Plus', price: 49.99 };
  };

  const recommendedPack = getRecommendedPack();

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <div className="popup-emoji">😢</div>
        <div className="popup-title">{t.title}</div>
        <div className="popup-info">
          {t.requires} <span className="need">${requiredAmount.toFixed(2)}</span>
          <br />
          {t.yourBalance} <span className="current">${currentBalance.toFixed(2)}</span>
        </div>
        
        <div className="popup-recommend">
          <div className="rec-label">{t.recommended}</div>
          <div className="rec-value">{recommendedPack.name} - ${recommendedPack.price.toFixed(2)}</div>
        </div>
        
        <div className="popup-buttons">
          <button className="popup-btn primary" onClick={onAddFunds}>
            {t.addFundsNow}
          </button>
          <button className="popup-btn secondary" onClick={onClose}>
            {t.maybeLater}
          </button>
        </div>
      </div>

      <style>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 1000;
        }

        .popup-card {
          background: #1e1e1e;
          border-radius: 24px;
          padding: 32px 24px;
          width: 100%;
          max-width: 320px;
          text-align: center;
        }

        .popup-emoji {
          font-size: 56px;
          margin-bottom: 16px;
        }

        .popup-title {
          color: #fff;
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .popup-info {
          color: #888;
          font-size: 15px;
          margin-bottom: 24px;
          line-height: 1.7;
        }

        .popup-info .need {
          color: #fff;
          font-weight: 600;
        }

        .popup-info .current {
          color: #ef4444;
          font-weight: 600;
        }

        .popup-recommend {
          padding: 16px;
          background: #2a2a2a;
          border-radius: 14px;
          margin-bottom: 24px;
          border: 1px solid #7c3aed;
          cursor: pointer;
          transition: background 0.2s;
        }

        .popup-recommend:hover {
          background: #333;
        }

        .rec-label {
          font-size: 12px;
          color: #888;
          margin-bottom: 6px;
        }

        .rec-value {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
        }

        .popup-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .popup-btn {
          padding: 16px;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .popup-btn.primary {
          background: #7c3aed;
          color: #fff;
        }

        .popup-btn.primary:hover {
          background: #6d28d9;
        }

        .popup-btn.secondary {
          background: transparent;
          border: 1px solid #444;
          color: #888;
        }

        .popup-btn.secondary:hover {
          border-color: #666;
          color: #aaa;
        }

        /* Mobile */
        @media (max-width: 360px) {
          .popup-card {
            padding: 24px 20px;
          }

          .popup-emoji {
            font-size: 48px;
          }

          .popup-title {
            font-size: 20px;
          }

          .popup-btn {
            padding: 14px;
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default InsufficientBalancePopup;
