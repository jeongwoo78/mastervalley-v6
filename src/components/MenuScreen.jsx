// MenuScreen.jsx - Menu Screen (Dark Theme)
// Based on mockup: 09-charge-menu.html
import React, { useState } from 'react';
import { getUi } from '../i18n';

const MenuScreen = ({ 
  onBack, 
  onGallery, 
  onAddFunds, 
  onLanguage, 
  onSupport, 
  onLogout, 
  onDeleteAccount,
  lang = 'en'
}) => {

  const [langOpen, setLangOpen] = useState(false);

  const t = getUi(lang).menu;

  const languages = [
    { code: 'en', flag: '🇺🇸', name: 'English' },
    { code: 'ko', flag: '🇰🇷', name: '한국어' },
  ];

  const currentLangName = languages.find(l => l.code === lang)?.name || 'English';

  const handleLanguageSelect = (newLang) => {
    if (onLanguage) {
      onLanguage(newLang);
    }
    setLangOpen(false);
  };

  const menuItems = [
    { id: 'gallery', icon: '🖼️', label: t.myGallery, action: onGallery },
    { id: 'funds', icon: '💳', label: t.addFunds, action: onAddFunds },
    { id: 'support', icon: '💬', label: t.support, action: onSupport },
  ];

  const dangerItems = [
    { id: 'logout', icon: '🚪', label: t.logOut, action: onLogout },
    { id: 'delete', icon: '⚠️', label: t.deleteAccount, action: onDeleteAccount, danger: true },
  ];

  return (
    <div className="menu-screen">
      {/* Header */}
      <header className="menu-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <span className="header-title">{t.title}</span>
        <span className="header-spacer"></span>
      </header>

      {/* Menu Items */}
      <div className="menu-section">
        {/* Gallery */}
        <div className="menu-item" onClick={menuItems[0].action}>
          <span className="menu-icon">{menuItems[0].icon}</span>
          <span className="menu-label">{menuItems[0].label}</span>
          <span className="menu-arrow">›</span>
        </div>

        {/* Language - Accordion */}
        <div 
          className={`menu-item ${langOpen ? 'accordion-open' : ''}`}
          onClick={() => setLangOpen(!langOpen)}
        >
          <span className="menu-icon">🌐</span>
          <span className="menu-label">{t.language}</span>
          <span className="menu-value">{currentLangName}</span>
          <span className={`menu-chevron ${langOpen ? 'open' : ''}`}>›</span>
        </div>

        {langOpen && (
          <div className="lang-accordion">
            {languages.map(l => (
              <div 
                key={l.code}
                className={`lang-option ${lang === l.code ? 'active' : ''}`}
                onClick={() => handleLanguageSelect(l.code)}
              >
                <span className="lang-flag">{l.flag}</span>
                <span className="lang-name">{l.name}</span>
                {lang === l.code && <span className="lang-check">✓</span>}
              </div>
            ))}
          </div>
        )}

        {/* Funds & Support */}
        {menuItems.slice(1).map(item => (
          <div 
            key={item.id}
            className="menu-item"
            onClick={item.action}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
            <span className="menu-arrow">›</span>
          </div>
        ))}

        <div className="menu-divider"></div>

        {dangerItems.map(item => (
          <div 
            key={item.id}
            className={`menu-item ${item.danger ? 'danger' : ''}`}
            onClick={item.action}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
            <span className="menu-arrow">›</span>
          </div>
        ))}
      </div>

      <style>{menuStyles}</style>
    </div>
  );
};

const menuStyles = `
  .menu-screen {
    min-height: 100vh;
    background: #121212;
    display: flex;
    flex-direction: column;
    max-width: 400px;
    margin: 0 auto;
  }

  .menu-header {
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

  .menu-section {
    padding: 16px 20px;
  }

  .menu-item {
    display: flex;
    align-items: center;
    padding: 14px 16px;
    background: #1a1a1a;
    border-radius: 12px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .menu-item:hover {
    background: #222;
  }

  .menu-item:active {
    background: #2a2a2a;
  }

  .menu-item.accordion-open {
    margin-bottom: 0;
    border-radius: 12px 12px 0 0;
    background: #1e1e1e;
  }

  .menu-icon {
    font-size: 20px;
    width: 32px;
  }

  .menu-label {
    flex: 1;
    color: #fff;
    font-size: 15px;
  }

  .menu-value {
    color: #888;
    font-size: 14px;
    margin-right: 8px;
  }

  .menu-arrow {
    color: #666;
    font-size: 18px;
  }

  .menu-chevron {
    color: #666;
    font-size: 18px;
    transition: transform 0.2s;
    display: inline-block;
  }

  .menu-chevron.open {
    transform: rotate(90deg);
  }

  .menu-divider {
    height: 1px;
    background: #2a2a2a;
    margin: 16px 0;
  }

  .menu-item.danger .menu-label {
    color: #ef4444;
  }

  /* Language Accordion */
  .lang-accordion {
    background: #161616;
    border-radius: 0 0 12px 12px;
    margin-bottom: 10px;
    overflow: hidden;
    border-top: 1px solid #2a2a2a;
  }

  .lang-option {
    display: flex;
    align-items: center;
    padding: 12px 16px 12px 48px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .lang-option:hover {
    background: rgba(255,255,255,0.05);
  }

  .lang-option.active {
    background: rgba(139, 92, 246, 0.1);
  }

  .lang-flag {
    font-size: 18px;
    margin-right: 12px;
  }

  .lang-name {
    flex: 1;
    color: rgba(255,255,255,0.85);
    font-size: 14px;
  }

  .lang-check {
    color: #8b5cf6;
    font-size: 16px;
    font-weight: bold;
  }

  @media (max-width: 400px) {
    .menu-item {
      padding: 12px 14px;
    }
    .menu-label {
      font-size: 14px;
    }
  }
`;

export default MenuScreen;
