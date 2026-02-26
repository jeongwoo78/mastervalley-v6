// LanguageScreen.jsx - Language Selection Screen (Dark Theme)
import React from 'react';
import { getUi } from '../i18n';

const LanguageScreen = ({ onBack, onSelect, currentLang = 'en' }) => {

  const languages = [
    { code: 'en', flag: '🇺🇸', name: 'English', nativeName: 'English' },
    { code: 'ko', flag: '🇰🇷', name: 'Korean', nativeName: '한국어' },
  ];

  const t = getUi(currentLang);

  const handleSelect = (langCode) => {
    if (onSelect) {
      onSelect(langCode);
    }
  };

  return (
    <div className="language-screen">
      {/* Header */}
      <header className="language-header">
        <button className="back-btn" onClick={onBack}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <span className="header-title">{t.language.title}</span>
        <span className="header-spacer"></span>
      </header>

      {/* Language List */}
      <div className="language-list">
        {languages.map(lang => (
          <div 
            key={lang.code}
            className={`language-item ${currentLang === lang.code ? 'active' : ''}`}
            onClick={() => handleSelect(lang.code)}
          >
            <span className="lang-flag">{lang.flag}</span>
            <div className="lang-info">
              <span className="lang-native">{lang.nativeName}</span>
              <span className="lang-name">{lang.name}</span>
            </div>
            {currentLang === lang.code && (
              <span className="lang-check">✓</span>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .language-screen {
          min-height: 100vh;
          background: #121212;
          display: flex;
          flex-direction: column;
          max-width: 400px;
          margin: 0 auto;
        }

        /* Header */
        .language-header {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #2a2a2a;
        }

        .back-btn {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 4px 8px;
          width: 40px;
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

        /* Language List */
        .language-list {
          padding: 16px 20px;
        }

        .language-item {
          display: flex;
          align-items: center;
          padding: 16px;
          background: #1a1a1a;
          border-radius: 12px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
        }

        .language-item:hover {
          background: #222;
        }

        .language-item:active {
          background: #2a2a2a;
        }

        .language-item.active {
          border-color: #7c3aed;
          background: rgba(139, 92, 246, 0.1);
        }

        .lang-flag {
          font-size: 28px;
          margin-right: 14px;
        }

        .lang-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .lang-native {
          color: #fff;
          font-size: 16px;
          font-weight: 600;
        }

        .lang-name {
          color: #888;
          font-size: 13px;
        }

        .lang-check {
          color: #7c3aed;
          font-size: 20px;
          font-weight: bold;
        }

        /* Mobile */
        @media (max-width: 400px) {
          .language-item {
            padding: 14px;
          }

          .lang-flag {
            font-size: 24px;
          }

          .lang-native {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default LanguageScreen;
