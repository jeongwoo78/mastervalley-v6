// AddFundsScreen.jsx - Add Funds Screen (v7 Compact Dark Theme)
import React, { useState } from 'react';
import { getUi } from '../i18n';

const AddFundsScreen = ({ onBack, userCredits = 2.50, onPurchase, lang = 'en' }) => {
  const [selectedPack, setSelectedPack] = useState(null);

  const t = getUi(lang).addFunds;

  const packs = [
    { id: 'mini', name: 'Mini', price: 0.99, value: 0.99, bonus: null, bonusAmount: null, hint: null },
    { id: 'basic', name: 'Basic', price: 4.99, value: 5.24, bonus: '+5%', bonusAmount: 0.25, hint: null },
    { id: 'standard', name: 'Standard', price: 9.99, value: 10.99, bonus: '+10%', bonusAmount: 1.00, hint: null },
    { id: 'plus', name: 'Plus', price: 49.99, value: 59.99, bonus: '+20%', bonusAmount: 10.00, hint: t.hintCreators, featured: true },
    { id: 'pro', name: 'Pro', price: 99.99, value: 129.99, bonus: '+30%', bonusAmount: 30.00, hint: t.hintMaxValue, featured: true }
  ];

  const handlePurchase = (pack) => {
    setSelectedPack(pack);
    if (onPurchase) {
      onPurchase(pack);
    }
  };

  // SVG Icons
  const InfoIcon = () => (
    <svg className="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4"/>
      <circle cx="12" cy="8" r="0.5" fill="rgba(255,255,255,0.4)"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg className="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );

  return (
    <div className="funds-screen">
      {/* Header */}
      <header className="funds-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <span className="header-title">{t.title}</span>
        <span className="header-spacer"></span>
      </header>

      {/* Balance Section */}
      <div className="balance-section">
        <div className="balance-label">{t.balance}</div>
        <div className="balance-amount">${userCredits.toFixed(2)}</div>
      </div>

      {/* Packs Section */}
      <div className="packs-section">
        {packs.map(pack => (
          <div
            key={pack.id}
            className={`pack-item ${pack.featured ? 'featured' : ''}`}
          >
            <div className="pack-info">
              <div className="pack-header">
                <span className="pack-name">{pack.name}</span>
                {pack.bonus && (
                  <span className={`bonus ${pack.featured ? 'high' : ''}`}>
                    {pack.bonus}
                  </span>
                )}
              </div>
              <div className="pack-desc">
                {t.get} <span className="get-amount">${pack.value.toFixed(2)}</span>
                {pack.bonusAmount && (
                  <span className="bonus-text"> (+${pack.bonusAmount.toFixed(2)} {t.bonusLabel})</span>
                )}
                {pack.hint && (
                  <span className="usage-hint">{pack.hint}</span>
                )}
              </div>
            </div>
            <button
              className="pack-price-btn"
              onClick={() => handlePurchase(pack)}
            >
              ${pack.price.toFixed(2)}
            </button>
          </div>
        ))}
      </div>

      {/* Info Text */}
      <div className="info-text">
        <p><InfoIcon />{t.info1}</p>
        <p><CheckIcon />{t.info2}</p>
      </div>

      <style>{`
        .funds-screen {
          min-height: 100vh;
          background: #121212;
          display: flex;
          flex-direction: column;
          max-width: 400px;
          margin: 0 auto;
        }

        /* Header */
        .funds-header {
          display: flex;
          align-items: center;
          padding: 14px 20px;
          border-bottom: 1px solid #2a2a2a;
        }

        .back-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 18px;
          cursor: pointer;
          width: 36px;
        }

        .header-title {
          flex: 1;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          text-align: center;
        }

        .header-spacer {
          width: 36px;
        }

        /* Balance Section - no bottom border */
        .balance-section {
          text-align: center;
          padding: 36px 20px;
        }

        .balance-label {
          color: #888;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .balance-amount {
          font-size: 40px;
          font-weight: 700;
          color: #fff;
        }

        /* Packs Section */
        .packs-section {
          flex: 1;
          padding: 10px 18px 18px;
          overflow-y: auto;
        }

        .pack-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #1a1a1a;
          border-radius: 12px;
          margin-bottom: 14px;
        }

        .pack-item:last-child {
          margin-bottom: 0;
        }

        .pack-item.featured {
          border: 1.5px solid #7c3aed;
          background: rgba(124, 58, 237, 0.06);
        }

        .pack-info {
          flex: 1;
        }

        .pack-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .pack-name {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }

        .bonus {
          padding: 2px 7px;
          background: #444;
          border-radius: 10px;
          font-size: 11px;
          color: #fff;
          font-weight: 600;
        }

        .bonus.high {
          background: #22c55e;
        }

        .pack-desc {
          font-size: 12px;
          color: #666;
          line-height: 1.4;
        }

        .get-amount {
          color: #fff;
          font-weight: 700;
          font-size: 13px;
        }

        .bonus-text {
          color: #fff;
          font-weight: 500;
        }

        .usage-hint {
          display: block;
          margin-top: 2px;
          font-size: 11px;
          color: rgba(255,255,255,0.4);
        }

        .pack-price-btn {
          padding: 10px 16px;
          background: #7c3aed;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          min-width: 68px;
          text-align: center;
          margin-left: 14px;
          transition: all 0.2s;
        }

        .pack-price-btn:hover {
          background: #6d28d9;
          transform: scale(1.02);
        }

        /* Info Text */
        .info-text {
          padding: 16px 20px 28px;
          text-align: center;
        }

        .info-text p {
          color: rgba(255,255,255,0.4);
          font-size: 12px;
          margin: 4px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .info-icon {
          flex-shrink: 0;
        }

        /* Mobile */
        @media (max-width: 400px) {
          .balance-amount {
            font-size: 34px;
          }

          .pack-price-btn {
            padding: 10px 14px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default AddFundsScreen;
