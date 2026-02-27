// InsufficientBalancePopup.jsx - Insufficient Balance Popup (Dark Theme)
// Based on mockup: 09-charge-menu.html
import React from 'react';
import { getUi } from '../i18n';

const InsufficientBalancePopup = ({ 
  requiredAmount = 0.25, 
  currentBalance = 0.10, 
  onAddFunds, 
  onClose,
  lang = 'en'
}) => {

  const ui = getUi(lang);
  const t = ui.insufficientBalance;
  const tFunds = ui.addFunds;

  // 추천 팩 계산 (AddFundsScreen 팩 기준: Starter/Standard/Plus)
  const getRecommendedPack = () => {
    const needed = requiredAmount - currentBalance;
    if (needed <= 0.99) return { name: 'Starter', price: 0.99 };
    if (needed <= 4.99) return { name: 'Standard', price: 4.99 };
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
        
        {/* Subscription Info */}
        <div className="popup-sub-info">
          <p>{tFunds.info1}</p>
          <p>{tFunds.info2}</p>
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
          font-size: 14px;
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
          font-size: 11px;
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
          font-size: 14px;
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

        .popup-sub-info {
          text-align: center;
          padding-top: 16px;
        }

        .popup-sub-info p {
          color: rgba(255,255,255,0.35);
          font-size: 14px;
          margin: 0;
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
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default InsufficientBalancePopup;
