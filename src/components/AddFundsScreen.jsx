// AddFundsScreen.jsx - Add Funds Screen (v8 Final - 3 Packs)
import React, { useState } from 'react';
import { getUi } from '../i18n';

const AddFundsScreen = ({ onBack, userCredits = 2.50, onPurchase, lang = 'en' }) => {
  const [selectedPack, setSelectedPack] = useState(null);

  const t = getUi(lang).addFunds;

  const packs = [
    { id: 'starter', name: 'Starter', price: 0.99, value: 0.99, bonus: null, bonusAmount: null, tagline: t.tagStarter },
    { id: 'standard', name: 'Standard', price: 4.99, value: 5.49, bonus: '+10%', bonusAmount: 0.50, tagline: t.tagStandard },
    { id: 'plus', name: 'Plus', price: 49.99, value: 59.99, bonus: '+20%', bonusAmount: 10.00, tagline: t.tagPlus, featured: true }
  ];

  const handlePurchase = (pack) => {
    setSelectedPack(pack);
    if (onPurchase) {
      onPurchase(pack);
    }
  };

  return (
    <div className="funds-screen">
      {/* Header */}
      <header className="funds-header">
        <button className="back-btn" onClick={onBack}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
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
                  <span className="bonus">{pack.bonus}</span>
                )}
              </div>
              <div className="pack-desc">
                {t.get} <span className="get-amount">${pack.value.toFixed(2)}</span>
                {pack.bonusAmount && (
                  <span className="bonus-text"> (+${pack.bonusAmount.toFixed(2)} {t.bonusLabel})</span>
                )}
                <span className="tagline">{pack.tagline}</span>
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
        <p>{t.info1} · {t.info2}</p>
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
          cursor: pointer;
          padding: 4px 8px;
          display: flex;
          align-items: center;
        }

        .header-title {
          flex: 1;
          color: #fff;
          font-size: 17px;
          font-weight: 600;
          text-align: center;
        }

        .header-spacer {
          width: 40px;
        }

        /* Balance Section */
        .balance-section {
          text-align: center;
          padding: 68px 20px;
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
          padding: 14px 18px 18px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .pack-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 18px;
          background: #1a1a1a;
          border-radius: 14px;
        }

        .pack-item.featured {
          border: 1.5px solid #7c3aed;
          background: #1a1a1a;
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
          padding: 2px 8px;
          background: #22c55e;
          border-radius: 10px;
          font-size: 11px;
          color: #fff;
          font-weight: 600;
        }

        .pack-desc {
          font-size: 13px;
          color: #666;
          line-height: 1.5;
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

        .tagline {
          display: block;
          margin-top: 4px;
          font-size: 11px;
          color: rgba(255,255,255,0.85);
          font-style: italic;
        }

        .pack-price-btn {
          padding: 12px 18px;
          background: #7c3aed;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          min-width: 72px;
          text-align: center;
          margin-left: 16px;
          transition: all 0.2s;
        }

        .pack-price-btn:hover {
          background: #6d28d9;
          transform: scale(1.02);
        }

        /* Info Text */
        .info-text {
          padding: 20px 20px 32px;
          text-align: center;
        }

        .info-text p {
          color: rgba(255,255,255,0.35);
          font-size: 14px;
          margin: 0;
          line-height: 1.6;
        }

        /* Mobile */
        @media (max-width: 400px) {
          .balance-amount {
            font-size: 34px;
          }

          .pack-price-btn {
            padding: 10px 14px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default AddFundsScreen;
