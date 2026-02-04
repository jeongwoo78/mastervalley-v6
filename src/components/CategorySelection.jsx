// CategorySelection.jsx - Main Screen (Dark Theme)
// Based on mockup: 02-main.html
import React from 'react';

// Thumbnail imports
import movementsThumbnail from '../assets/thumbnails/categories/movements.webp';
import mastersThumbnail from '../assets/thumbnails/categories/masters.webp';
import orientalThumbnail from '../assets/thumbnails/categories/oriental.webp';

const CategorySelection = ({ onSelect, onGallery, onMenu, userCredits = 2.50, lang = 'en' }) => {

  // i18n texts
  const texts = {
    ko: {
      tagline: '당신의 사진이 명작이 됩니다',
      movements: { name: '서양 미술사', desc: '2500년 서양 미술의 여정' },
      masters: { name: '거장 컬렉션', desc: '시대를 초월한 7인의 거장' },
      oriental: { name: '동양화', desc: '천 년 동양 미술의 향기' }
    },
    en: {
      tagline: 'Your photo becomes a masterpiece',
      movements: { name: 'Western Art', desc: '2500 Years of Western Art' },
      masters: { name: 'Master Collection', desc: '7 Masters Beyond Time' },
      oriental: { name: 'East Asian Art', desc: '1000 Years of Eastern Beauty' }
    }
  };
  const t = texts[lang] || texts.en;

  const categories = [
    {
      id: 'movements',
      name: t.movements.name,
      description: t.movements.desc,
      thumbnail: movementsThumbnail
    },
    {
      id: 'masters',
      name: t.masters.name,
      description: t.masters.desc,
      thumbnail: mastersThumbnail
    },
    {
      id: 'oriental',
      name: t.oriental.name,
      description: t.oriental.desc,
      thumbnail: orientalThumbnail
    }
  ];

  const handleMenuClick = () => {
    onMenu?.();
  };

  return (
    <div className="main-screen">
      {/* Header */}
      <header className="main-header">
        <button className="menu-btn" onClick={handleMenuClick}>
          👤
        </button>
        <span className="credits">${userCredits.toFixed(2)}</span>
      </header>

      {/* Branding */}
      <div className="branding">
        <div className="brand-icon">🎨</div>
        <h1 className="brand-title">Master Valley</h1>
        <p className="brand-tagline">{t.tagline}</p>
      </div>

      {/* Category Grid */}
      <div className="category-grid">
        {categories.map(cat => (
          <button
            key={cat.id}
            className="category-card"
            onClick={() => onSelect(cat.id)}
          >
            <div className="card-thumbnail">
              <img src={cat.thumbnail} alt={cat.name} />
            </div>
            <div className="card-info">
              <span className="card-name">{cat.name}</span>
              <span className="card-desc">{cat.description}</span>
            </div>
            <span className="card-arrow">›</span>
          </button>
        ))}
      </div>

      <style>{`
        .main-screen {
          min-height: 100vh;
          background: #121212;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
        }

        .menu-btn {
          background: #1a1a1a;
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .credits {
          background: #1a1a1a;
          padding: 10px 18px;
          border-radius: 22px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
        }

        /* Menu Dropdown */
        .menu-dropdown {
          position: absolute;
          top: 70px;
          left: 16px;
          background: #1a1a1a;
          border-radius: 16px;
          padding: 8px;
          min-width: 200px;
          z-index: 100;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }

        .menu-item {
          display: flex;
          align-items: center;
          padding: 12px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .menu-item:hover {
          background: #2a2a2a;
        }

        .menu-icon {
          font-size: 18px;
          width: 28px;
        }

        .menu-label {
          flex: 1;
          color: #fff;
          font-size: 14px;
        }

        .menu-arrow {
          color: #666;
          font-size: 16px;
        }

        .menu-divider {
          height: 1px;
          background: #2a2a2a;
          margin: 8px 0;
        }

        .menu-item.danger .menu-label {
          color: #ef4444;
        }

        .menu-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 99;
        }

        /* Branding */
        .branding {
          text-align: center;
          padding: 32px 20px 24px;
        }

        .brand-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .brand-title {
          font-size: 28px;
          color: #fff;
          font-weight: 700;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
        }

        .brand-tagline {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          margin: 0;
        }

        /* Category Grid */
        .category-grid {
          flex: 1;
          padding: 8px 20px 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 25px;
        }

        .category-card {
          background: #1a1a1a;
          border: none;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .category-card:hover {
          background: #222;
          transform: translateX(4px);
        }

        .card-thumbnail {
          width: 72px;
          height: 72px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .card-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .card-name {
          color: #fff;
          font-size: 17px;
          font-weight: 600;
        }

        .card-desc {
          color: rgba(255,255,255,0.5);
          font-size: 13px;
        }

        .card-arrow {
          color: rgba(255,255,255,0.25);
          font-size: 24px;
          font-weight: 300;
        }

        /* Mobile Responsive */
        @media (max-width: 480px) {
          .main-header {
            padding: 12px 16px;
          }

          .branding {
            padding: 24px 16px 20px;
          }

          .brand-title {
            font-size: 24px;
          }

          .category-grid {
            padding: 8px 16px 24px;
            gap: 20px;
          }

          .category-card {
            padding: 14px;
          }

          .card-thumbnail {
            width: 64px;
            height: 64px;
          }
        }
      `}</style>
    </div>
  );
};

export default CategorySelection;
