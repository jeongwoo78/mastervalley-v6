// AddFundsScreen.jsx - Add Funds Screen (Dark Theme)
// Based on mockup: 09-charge-menu.html
import React, { useState } from 'react';

const AddFundsScreen = ({ onBack, userCredits = 2.50, onPurchase, lang = 'en' }) => {
  const [selectedPack, setSelectedPack] = useState(null);

  // i18n texts
  const texts = {
    ko: {
      title: '크레딧 충전',
      balance: '잔액',
      bonus: '보너스',
      info1: '💡 크레딧은 만료되지 않습니다',
      info2: '구독 필요 없음'
    },
    en: {
      title: 'Add Funds',
      balance: 'Balance',
      bonus: 'Bonus',
      info1: '💡 Credits never expire',
      info2: 'No subscription required'
    }
  };
  const t = texts[lang] || texts.en;

  const packs = [
    { id: 'mini', name: 'Mini', price: 0.99, value: 0.99, bonus: null },
    { id: 'basic', name: 'Basic', price: 4.99, value: 5.24, bonus: '+5%' },
    { id: 'standard', name: 'Standard', price: 9.99, value: 10.99, bonus: '+10%' },
    { id: 'plus', name: 'Plus', price: 49.99, value: 59.99, bonus: '+20%', featured: true },
    { id: 'pro', name: 'Pro', price: 99.99, value: 129.99, bonus: '+30%', featured: true }
  ];

  const handlePurchase = (pack) => {
    setSelectedPack(pack);
    // TODO: 실제 결제 연동
    if (onPurchase) {
      onPurchase(pack);
    }
  };

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
              <div className="pack-value">${pack.value.toFixed(2)}</div>
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
        <p>{t.info1}</p>
        <p>{t.info2}</p>
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
          padding: 16px 20px;
          border-bottom: 1px solid #2a2a2a;
        }

        .back-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          padding: 4px 8px;
          width: 40px;
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
          padding: 32px 20px;
          border-bottom: 1px solid #2a2a2a;
        }

        .balance-label {
          color: #888;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .balance-amount {
          font-size: 42px;
          font-weight: 700;
          color: #fff;
        }

        /* Packs Section */
        .packs-section {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        .pack-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px;
          background: #1a1a1a;
          border-radius: 14px;
          margin-bottom: 12px;
        }

        .pack-item.featured {
          border: 2px solid #7c3aed;
          background: rgba(124, 58, 237, 0.08);
        }

        .pack-info {
          flex: 1;
        }

        .pack-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .pack-name {
          font-size: 15px;
          font-weight: 600;
          color: #888;
        }

        .bonus {
          padding: 4px 10px;
          background: #444;
          border-radius: 12px;
          font-size: 12px;
          color: #fff;
          font-weight: 600;
        }

        .bonus.high {
          background: #22c55e;
        }

        .pack-value {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
        }

        .pack-price-btn {
          padding: 12px 20px;
          background: #7c3aed;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pack-price-btn:hover {
          background: #6d28d9;
          transform: scale(1.02);
        }

        /* Info Text */
        .info-text {
          padding: 16px 20px 32px;
          text-align: center;
        }

        .info-text p {
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          margin: 4px 0;
        }

        /* Mobile */
        @media (max-width: 400px) {
          .balance-amount {
            font-size: 36px;
          }

          .pack-value {
            font-size: 20px;
          }

          .pack-price-btn {
            padding: 10px 16px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default AddFundsScreen;
