// CategorySelection.jsx - Main Screen (Dark Theme)
// Based on mockup: 02-main(썸네일).jpg
import React from 'react';
import { getUi } from '../i18n';

// Thumbnail imports
import movementsThumbnail from '../assets/thumbnails/categories/movements.webp';
import mastersThumbnail from '../assets/thumbnails/categories/masters.webp';
import orientalThumbnail from '../assets/thumbnails/categories/oriental.webp';

const CategorySelection = ({ onSelect, onGallery, onMenu, onAddFunds, userCredits = 2.50, lang = 'en' }) => {

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
          <svg className="menu-icon-svg" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
            <circle cx="12" cy="8" r="4"/>
            <path d="M20 21a8 8 0 1 0-16 0"/>
          </svg>
          <span className="menu-label">MY</span>
        </button>
        <button className="credits-btn" onClick={() => onAddFunds?.()}>${userCredits.toFixed(2)}</button>
      </header>

      {/* Branding - ①번: 팔레트 왼쪽, 텍스트 정중앙 */}
      <div className="branding">
        <div className="brand-icon-left">
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
            <circle cx="16" cy="18" r="3" fill="#e8d5b7"/>
            <circle cx="28" cy="14" r="2.5" fill="#a78bfa"/>
            <circle cx="32" cy="22" r="2" fill="#6ee7b7"/>
            <circle cx="28" cy="30" r="2.5" fill="#fbbf24"/>
            <path d="M14 32 C14 32 18 20 24 18 C30 16 34 28 34 28" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        <h1 className="brand-title">Master Valley</h1>
        <p className="brand-tagline">{t.tagline}</p>
        <p className="brand-sub-tagline">{t.subTagline}</p>
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
          padding: 16px 20px 16px;
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

        .menu-icon-svg {
          display: block;
        }

        .menu-label {
          font-size: 10px;
          color: #fff;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .credits-btn {
          background: transparent;
          border: none;
          padding: 8px 0;
          color: #fff;
          font-size: 17px;
          font-weight: 600;
          cursor: pointer;
        }

        .credits-btn:active {
          opacity: 0.7;
        }

        /* Branding */
        .branding {
          text-align: center;
          padding: 52px 20px 8px;
        }

        .brand-icon-left {
          text-align: left;
          padding-left: 12px;
          margin-bottom: 12px;
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

        .brand-sub-tagline {
          color: rgba(255,255,255,0.35);
          font-size: 13px;
          margin: 6px 0 0;
        }

        /* Category Grid - 목업: 좌우 padding 20px */
        .category-grid {
          flex: 1;
          padding: 76px 20px 32px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
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
          font-size: 17px;
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
            padding: 16px 16px 12px;
          }

          .branding {
            padding: 40px 16px 6px;
          }

          .brand-title {
            font-size: 24px;
          }

          .category-grid {
            padding: 48px 16px 24px;
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
