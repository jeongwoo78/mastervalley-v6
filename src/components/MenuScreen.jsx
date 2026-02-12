// MenuScreen.jsx - Menu Screen (Dark Theme)
// Based on mockup: 09-charge-menu.html
import React, { useState } from 'react';

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

  const [showLanguageScreen, setShowLanguageScreen] = useState(false);

  // i18n texts
  const texts = {
    ko: {
      menu: '메뉴',
      myGallery: '내 갤러리',
      language: '언어',
      addFunds: '크레딧 충전',
      support: '고객 지원',
      logOut: '로그아웃',
      deleteAccount: '계정 삭제',
      selectLanguage: '언어 선택'
    },
    en: {
      menu: 'Menu',
      myGallery: 'My Gallery',
      language: 'Language',
      addFunds: 'Add Funds',
      support: 'Support',
      logOut: 'Log Out',
      deleteAccount: 'Delete Account',
      selectLanguage: 'Select Language'
    }
  };
  const t = texts[lang] || texts.en;

  const menuItems = [
    { id: 'gallery', icon: '🖼️', label: t.myGallery, action: onGallery },
    { id: 'language', icon: '🌐', label: t.language, action: () => setShowLanguageScreen(true), value: lang === 'ko' ? '한국어' : 'English' },
    { id: 'funds', icon: '💳', label: t.addFunds, action: onAddFunds },
    { id: 'support', icon: '💬', label: t.support, action: onSupport },
  ];

  const dangerItems = [
    { id: 'logout', icon: '🚪', label: t.logOut, action: onLogout },
    { id: 'delete', icon: '⚠️', label: t.deleteAccount, action: onDeleteAccount, danger: true },
  ];

  const handleItemClick = (item) => {
    if (item.action) {
      item.action();
    }
  };

  const handleLanguageSelect = (newLang) => {
    setShowLanguageScreen(false);
    if (onLanguage) {
      onLanguage(newLang);
    }
  };

  // 언어 선택 하위 화면
  if (showLanguageScreen) {
    return (
      <div className="menu-screen">
        <header className="menu-header">
          <button className="back-btn" onClick={() => setShowLanguageScreen(false)}>←</button>
          <span className="header-title">{t.selectLanguage}</span>
          <span className="header-spacer"></span>
        </header>

        <div className="menu-section">
          <div 
            className={`menu-item ${lang === 'en' ? 'selected' : ''}`}
            onClick={() => handleLanguageSelect('en')}
          >
            <span className="menu-icon">🇺🇸</span>
            <span className="menu-label">English</span>
            {lang === 'en' && <span className="menu-check">✓</span>}
          </div>
          
          <div 
            className={`menu-item ${lang === 'ko' ? 'selected' : ''}`}
            onClick={() => handleLanguageSelect('ko')}
          >
            <span className="menu-icon">🇰🇷</span>
            <span className="menu-label">한국어</span>
            {lang === 'ko' && <span className="menu-check">✓</span>}
          </div>
        </div>

        <style>{menuStyles}</style>
      </div>
    );
  }

  return (
    <div className="menu-screen">
      {/* Header */}
      <header className="menu-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <span className="header-title">{t.menu}</span>
        <span className="header-spacer"></span>
      </header>

      {/* Menu Items */}
      <div className="menu-section">
        {menuItems.map(item => (
          <div 
            key={item.id}
            className="menu-item"
            onClick={() => handleItemClick(item)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
            {item.value && <span className="menu-value">{item.value}</span>}
            <span className="menu-arrow">›</span>
          </div>
        ))}

        <div className="menu-divider"></div>

        {dangerItems.map(item => (
          <div 
            key={item.id}
            className={`menu-item ${item.danger ? 'danger' : ''}`}
            onClick={() => handleItemClick(item)}
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

  /* Header */
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

  /* Menu Section */
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

  .menu-item.selected {
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid #8b5cf6;
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

  .menu-check {
    color: #8b5cf6;
    font-size: 18px;
    font-weight: bold;
  }

  .menu-divider {
    height: 1px;
    background: #2a2a2a;
    margin: 16px 0;
  }

  .menu-item.danger .menu-label {
    color: #ef4444;
  }

  /* Mobile */
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
