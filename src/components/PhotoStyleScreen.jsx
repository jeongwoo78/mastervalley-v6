// PhotoStyleScreen.jsx - Style Selection Screen (Dark Theme)
// Based on mockup: 03-style-select.html
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { getUi } from '../i18n';

// Thumbnail imports - Movements
import grecoRoman from '../assets/thumbnails/movements/greco-roman.webp';
import medieval from '../assets/thumbnails/movements/medieval.webp';
import renaissance from '../assets/thumbnails/movements/renaissance.webp';
import baroque from '../assets/thumbnails/movements/baroque.webp';
import rococo from '../assets/thumbnails/movements/rococo.webp';
import neoclassicism from '../assets/thumbnails/movements/neoclassicism.webp';
import impressionism from '../assets/thumbnails/movements/impressionism.webp';
import postImpressionism from '../assets/thumbnails/movements/post-impressionism.webp';
import fauvism from '../assets/thumbnails/movements/fauvism.webp';
import expressionism from '../assets/thumbnails/movements/expressionism.webp';
import modernism from '../assets/thumbnails/movements/modernism.webp';

// Thumbnail imports - Masters
import vangogh from '../assets/thumbnails/masters/vangogh.webp';
import klimt from '../assets/thumbnails/masters/klimt.webp';
import munch from '../assets/thumbnails/masters/munch.webp';
import matisse from '../assets/thumbnails/masters/matisse.webp';
import chagall from '../assets/thumbnails/masters/chagall.webp';
import frida from '../assets/thumbnails/masters/frida.webp';
import lichtenstein from '../assets/thumbnails/masters/lichtenstein.webp';

// Thumbnail imports - Oriental
import korean from '../assets/thumbnails/oriental/korean.webp';
import chinese from '../assets/thumbnails/oriental/chinese.webp';
import japanese from '../assets/thumbnails/oriental/japanese.webp';

const PhotoStyleScreen = ({ mainCategory, onBack, onSelect, userCredits = 0, lang = 'en' }) => {
  const fileInputRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);

  // 카테고리 스와이프
  const categoryOrder = ['movements', 'masters', 'oriental'];
  const [activeCategory, setActiveCategory] = useState(mainCategory || 'movements');
  const [transition, setTransition] = useState('');
  const isTransitioning = useRef(false);
  const touchStartRef = useRef({ x: 0, y: 0 });

  const ui = getUi(lang);
  const ps = ui.photoStyle;

  // Category data with thumbnails (i18n via ui.js)
  const categoryData = {
    movements: {
      name: ps.movementsName,
      price: '$0.20',
      fullPrice: '$2.00',
      emojis: '🏎️⚡🕰️',
      selectLabel: ps.selectMovement,
      priceLabel: '$0.20/transform',
      gradient: 'linear-gradient(135deg, #e9d5ff 0%, #a855f7 100%)',
      boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)',
      color: '#2e1065',
      accent: '#a855f7',
      fullTransform: {
        id: 'movements-all',
        title: ps.movementsFullTitle,
        desc: ps.movementsFullDesc,
        count: 11,
        isFullTransform: true,
        category: 'movements'
      },
      styles: [
        { id: 'ancient', name: ps.grecoRoman, period: 'BC 800 - AD 500', thumbnail: grecoRoman, category: 'movements' },
        { id: 'medieval', name: ps.medieval, period: '400 - 1400', thumbnail: medieval, category: 'movements' },
        { id: 'renaissance', name: ps.renaissance, period: '1400 - 1600', thumbnail: renaissance, category: 'movements' },
        { id: 'baroque', name: ps.baroque, period: '1600 - 1750', thumbnail: baroque, category: 'movements' },
        { id: 'rococo', name: ps.rococo, period: '1700 - 1800', thumbnail: rococo, category: 'movements' },
        { id: 'neoclassicism_vs_romanticism_vs_realism', name: ps.neoRomanReal, period: '1750 - 1880', thumbnail: neoclassicism, category: 'movements' },
        { id: 'impressionism', name: ps.impressionism, period: '1860 - 1890', thumbnail: impressionism, category: 'movements' },
        { id: 'postImpressionism', name: ps.postImpressionism, period: '1880 - 1910', thumbnail: postImpressionism, category: 'movements' },
        { id: 'fauvism', name: ps.fauvism, period: '1905 - 1910', thumbnail: fauvism, category: 'movements' },
        { id: 'expressionism', name: ps.expressionism, period: '1905 - 1930', thumbnail: expressionism, category: 'movements' },
        { id: 'modernism', name: ps.modernism, period: '1907 - 1970', thumbnail: modernism, category: 'movements' }
      ]
    },
    masters: {
      name: ps.mastersName,
      price: '$0.25',
      fullPrice: '$1.50',
      emojis: '🔥🎨💥',
      selectLabel: ps.selectMaster,
      priceLabel: '$0.25/transform',
      gradient: 'linear-gradient(135deg, #f5deb3 0%, #daa520 100%)',
      boxShadow: '0 4px 15px rgba(218, 165, 32, 0.3)',
      color: '#3a2a10',
      accent: '#daa520',
      fullTransform: {
        id: 'masters-all',
        title: ps.mastersFullTitle,
        desc: ps.mastersFullDesc,
        count: 7,
        isFullTransform: true,
        category: 'masters'
      },
      styles: [
        { id: 'vangogh-master', name: ps.vanGogh, period: '1853 - 1890', thumbnail: vangogh, category: 'masters' },
        { id: 'klimt-master', name: ps.klimt, period: '1862 - 1918', thumbnail: klimt, category: 'masters' },
        { id: 'munch-master', name: ps.munch, period: '1863 - 1944', thumbnail: munch, category: 'masters' },
        { id: 'matisse-master', name: ps.matisse, period: '1869 - 1954', thumbnail: matisse, category: 'masters' },
        { id: 'chagall-master', name: ps.chagall, period: '1887 - 1985', thumbnail: chagall, category: 'masters' },
        { id: 'frida-master', name: ps.frida, period: '1907 - 1954', thumbnail: frida, category: 'masters' },
        { id: 'lichtenstein-master', name: ps.lichtenstein, period: '1923 - 1997', thumbnail: lichtenstein, category: 'masters' }
      ]
    },
    oriental: {
      name: ps.orientalName,
      price: '$0.20',
      fullPrice: '$0.60',
      emojis: '🐼🌸🐅',
      selectLabel: ps.selectStyle,
      priceLabel: '$0.20/transform',
      gradient: 'linear-gradient(135deg, #ffe4e6 0%, #f472b6 100%)',
      boxShadow: '0 4px 15px rgba(244, 114, 182, 0.3)',
      color: '#1e293b',
      accent: '#f472b6',
      fullTransform: {
        id: 'oriental-all',
        title: ps.orientalFullTitle,
        desc: ps.orientalFullDesc,
        count: 3,
        isFullTransform: true,
        category: 'oriental'
      },
      styles: [
        { id: 'chinese', name: ps.chinese, period: ps.chineseSub, thumbnail: chinese, category: 'oriental' },
        { id: 'japanese', name: ps.japanese, period: ps.japaneseSub, thumbnail: japanese, category: 'oriental' },
        { id: 'korean', name: ps.korean, period: ps.koreanSub, thumbnail: korean, category: 'oriental' }
      ]
    }
  };

  const currentCategory = categoryData[activeCategory];

  // Auto-start when both photo and style selected
  useEffect(() => {
    if (photo && selectedStyle) {
      // Pass styles array for full transform
      if (selectedStyle.isFullTransform) {
        const fullStyle = {
          ...selectedStyle,
          styles: currentCategory.styles
        };
        onSelect(photo, fullStyle);
      } else {
        onSelect(photo, selectedStyle);
      }
    }
  }, [photo, selectedStyle]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
  };

  const handleFullTransform = () => {
    setSelectedStyle(currentCategory.fullTransform);
  };

  // ─── 카테고리 전환 ───
  const changeCategory = useCallback((newIdx, direction) => {
    if (isTransitioning.current) return;
    const clamped = Math.max(0, Math.min(2, newIdx));
    if (clamped === categoryOrder.indexOf(activeCategory)) return;
    isTransitioning.current = true;

    // 나가는 애니메이션
    setTransition(direction === 'left' ? 'slide-out-left' : 'slide-out-right');

    setTimeout(() => {
      setActiveCategory(categoryOrder[clamped]);
      setSelectedStyle(null); // 카테고리 전환 시 선택 해제

      // 들어오는 위치에서 시작
      setTransition(direction === 'left' ? 'slide-in-right' : 'slide-in-left');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransition('');
          isTransitioning.current = false;
        });
      });
    }, 200);
  }, [activeCategory]);

  // ─── 터치 스와이프 ───
  const handleTouchStart = useCallback((e) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;

    // 수평이고 충분한 거리
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      const idx = categoryOrder.indexOf(activeCategory);
      if (dx < 0 && idx < 2) changeCategory(idx + 1, 'left');
      else if (dx > 0 && idx > 0) changeCategory(idx - 1, 'right');
    }
  }, [activeCategory, changeCategory]);

  return (
    <div className="style-screen" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Header */}
      <header className="style-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <span className="header-title">{currentCategory.name}</span>
      </header>

      {/* Photo Section */}
      <div 
        className={`photo-section ${!photo ? 'awaiting-photo' : ''}`} 
        onClick={handlePhotoClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        {photoPreview ? (
          <img src={photoPreview} alt="Selected" className="photo-preview" />
        ) : (
          <div className="photo-placeholder">
            <span className="photo-icon">📷</span>
            <span className="photo-text">{ps.tapToSelectPhoto}</span>
          </div>
        )}
      </div>

      {/* 도트 인디케이터 */}
      <div className="swipe-dots">
        {categoryOrder.map((cat, i) => (
          <span
            key={cat}
            className={`swipe-dot ${activeCategory === cat ? 'active' : ''}`}
            data-cat={cat}
            onClick={() => {
              const idx = categoryOrder.indexOf(activeCategory);
              if (i !== idx) changeCategory(i, i > idx ? 'left' : 'right');
            }}
          />
        ))}
      </div>

      {/* 카테고리 콘텐츠 (데이터 전환) */}
      <div className={`category-content ${transition}`}>
        {/* Full Transform Button */}
        <button
          className={`full-transform-btn ${selectedStyle?.isFullTransform ? 'selected' : ''}`}
          onClick={handleFullTransform}
          style={{
            background: currentCategory.gradient,
            boxShadow: selectedStyle?.isFullTransform 
              ? `0 0 0 2px ${currentCategory.accent}, 0 0 12px ${currentCategory.accent}66`
              : currentCategory.boxShadow,
            color: currentCategory.color
          }}
        >
          <span className="ft-sparkles">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
            </svg>
          </span>
          <div className="ft-content">
            <div className="ft-row-1">
              <span className="ft-label">{ps.fullTransform}</span>
              <span className="ft-price">{currentCategory.fullPrice}</span>
            </div>
            <div className="ft-row-2">
              <span className="ft-desc">{currentCategory.fullTransform.title}</span>
              <span className="ft-emojis">{currentCategory.emojis}</span>
            </div>
          </div>
        </button>

        {/* Select label + per-transform price */}
        <div className="select-price-row">
          <span className="select-label">{currentCategory.selectLabel}</span>
          <span className="per-transform-price">{currentCategory.priceLabel}</span>
        </div>

        {/* Style Grid */}
        <div className="style-grid">
          {currentCategory.styles.map(style => (
            <button
              key={style.id}
              className={`style-card ${selectedStyle?.id === style.id ? 'selected' : ''}`}
              onClick={() => handleStyleSelect(style)}
              style={selectedStyle?.id === style.id ? {
                borderColor: currentCategory.accent,
                boxShadow: `0 0 12px ${currentCategory.accent}66`
              } : {}}
            >
              <div className="style-thumb">
                <img src={style.thumbnail} alt={style.name} />
                <div className="style-overlay">
                  <span className="style-name">{style.name}</span>
                  <span className="style-period">{style.period}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .style-screen {
          min-height: 100vh;
          background: #121212;
          display: flex;
          flex-direction: column;
          max-width: 400px;
          margin: 0 auto;
        }

        /* Header */
        .style-header {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          gap: 12px;
        }

        .back-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          padding: 4px 8px;
        }

        .header-title {
          flex: 1;
          color: #fff;
          font-size: 17px;
          font-weight: 600;
        }

        /* Photo Section */
        .photo-section {
          margin: 0 28px 8px;
          background: #1a1a1a;
          border-radius: 12px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
          border: none;
          box-shadow: none;
        }

        /* 사진 선택 후 - 4:3 비율 */
        .photo-section:not(.awaiting-photo) {
          height: auto;
          aspect-ratio: 4 / 3;
          background: transparent;
        }

        /* 사진 미선택 시 */
        .photo-section.awaiting-photo {
          border: 2px solid #4b5563;
        }

        .photo-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .photo-icon {
          font-size: 32px;
          opacity: 0.4;
        }

        .photo-text {
          color: rgba(255,255,255,0.4);
          font-size: 13px;
        }

        .photo-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
        }

        /* 도트 인디케이터 */
        .swipe-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          padding: 10px 0 0;
        }

        .swipe-dot {
          height: 6px;
          border-radius: 3px;
          background: rgba(255,255,255,0.2);
          transition: all 0.25s ease;
          cursor: pointer;
          border: none;
        }

        .swipe-dot.active { width: 18px; }
        .swipe-dot:not(.active) { width: 6px; }
        .swipe-dot[data-cat="movements"].active { background: #a855f7; }
        .swipe-dot[data-cat="masters"].active { background: #daa520; }
        .swipe-dot[data-cat="oriental"].active { background: #f472b6; }

        /* 카테고리 콘텐츠 전환 */
        .category-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .category-content.slide-out-left {
          opacity: 0;
          transform: translateX(-30px);
        }

        .category-content.slide-out-right {
          opacity: 0;
          transform: translateX(30px);
        }

        .category-content.slide-in-right {
          opacity: 0;
          transform: translateX(30px);
          transition: none;
        }

        .category-content.slide-in-left {
          opacity: 0;
          transform: translateX(-30px);
          transition: none;
        }

        /* Full Transform Button */
        .full-transform-btn {
          margin: 14px 28px 6px;
          padding: 14px 18px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
        }

        .full-transform-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }

        .full-transform-btn.selected {
          /* handled by inline boxShadow */
        }

        .full-transform-btn:focus {
          outline: none;
        }

        .ft-sparkles {
          display: flex;
          flex-shrink: 0;
        }

        .ft-content {
          flex: 1;
        }

        .ft-row-1 {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ft-label {
          font-size: 14px;
          font-weight: 700;
        }

        .ft-price {
          font-size: 14px;
          font-weight: 700;
        }

        .ft-row-2 {
          display: flex;
          align-items: center;
          margin-top: 3px;
        }

        .ft-desc {
          font-size: 12px;
          opacity: 0.7;
        }

        .ft-emojis {
          font-size: 18px;
          margin-left: 8px;
        }

        /* Select + Price Row */
        .select-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 28px 14px;
        }

        .select-label {
          color: #888;
          font-size: 13px;
        }

        .per-transform-price {
          color: #555;
          font-size: 13px;
        }

        /* Style Grid */
        .style-grid {
          padding: 4px 28px 24px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          overflow-y: auto;
        }

        .style-card {
          background: none;
          border: 3px solid transparent;
          padding: 0;
          cursor: pointer;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s;
        }

        .style-card.selected {
          /* handled by inline style */
        }

        .style-card:focus {
          outline: none;
        }

        .style-thumb {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          background: #1a1a1a;
        }

        .style-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .style-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 8px 10px;
          background: none;
          text-align: left;
        }

        .style-name {
          display: block;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.3;
          text-shadow: 0 1px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5);
        }

        .style-period {
          display: block;
          color: rgba(255,255,255,0.8);
          font-size: 11px;
          margin-top: 2px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5);
        }

        /* Mobile */
        @media (max-width: 400px) {
          .style-grid {
            gap: 14px;
            padding: 0 24px 20px;
          }

          .style-name {
            font-size: 12px;
          }

          .style-period {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default PhotoStyleScreen;
