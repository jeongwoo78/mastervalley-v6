// CategorySelection.jsx - Main Screen (Dark Theme)
// Based on mockup: 02-main(썸네일).jpg
import React from 'react';
import { getUi } from '../i18n';

// Thumbnail imports
import movementsThumbnail from '../assets/thumbnails/categories/movements.webp';
import mastersThumbnail from '../assets/thumbnails/categories/masters.webp';
import orientalThumbnail from '../assets/thumbnails/categories/oriental.webp';

const CategorySelection = ({ onSelect, onGallery, onMenu, userCredits = 2.50, lang = 'en' }) => {

  const ui = getUi(lang);
  const t = ui.category;

  const categories = [
    {
      id: 'movements',
      name: t.westernArt,
      description: t.westernArtDesc,
      thumbnail: movementsThumbnail
    },
    {
      id: 'masters',
      name: t.masterCollection,
      description: t.masterCollectionDesc,
      thumbnail: mastersThumbnail
    },
    {
      id: 'oriental',
      name: t.eastAsianArt,
      description: t.eastAsianArtDesc,
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
          <span className="menu-icon">👤</span>
          <span className="menu-label">MY</span>
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
          max-width: 400px;
          margin: 0 auto;
        }

        /* Header - 목업: 투명 배경 스타일 */
        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
        }

        .menu-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 4px 8px;
        }

        .menu-icon {
          font-size: 28px;
          filter: grayscale(1) brightness(2);
        }

        .menu-label {
          font-size: 10px;
          color: rgba(255,255,255,0.7);
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .credits {
          background: transparent;
          padding: 8px 0;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
        }

        /* Branding */
        .branding {
          text-align: center;
          padding: 28px 20px 20px;
        }

        .brand-icon {
          font-size: 42px;
          margin-bottom: 10px;
        }

        .brand-title {
          font-size: 26px;
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

        /* Category Grid - 목업: 좌우 padding 20px */
        .category-grid {
          flex: 1;
          padding: 16px 20px 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
        }

        .category-card {
          background: transparent;
          border: none;
          border-radius: 12px;
          padding: 8px 0;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .category-card:hover {
          background: rgba(255,255,255,0.05);
        }

        .category-card:active {
          transform: scale(0.98);
        }

        /* 썸네일 - 88×88 정사각형 */
        .card-thumbnail {
          width: 88px;
          height: 88px;
          border-radius: 8px;
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
          text-align: left;
        }

        .card-name {
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          text-align: left;
        }

        .card-desc {
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          text-align: left;
        }

        .card-arrow {
          color: rgba(255,255,255,0.3);
          font-size: 20px;
          font-weight: 300;
          padding-right: 4px;
        }

        /* Mobile Responsive */
        @media (max-width: 480px) {
          .main-header {
            padding: 12px 16px;
          }

          .branding {
            padding: 20px 16px 16px;
          }

          .brand-title {
            font-size: 24px;
          }

          .category-grid {
            padding: 12px 16px 24px;
            gap: 10px;
          }

          .card-thumbnail {
            width: 88px;
            height: 88px;
          }
        }
      `}</style>
    </div>
  );
};

export default CategorySelection;
