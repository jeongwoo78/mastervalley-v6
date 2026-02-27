// PhotoStyleScreen.jsx - Style Selection Screen (Dark Theme) + Category Swipe
// Based on 0224 + 3-page drag swipe
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
  const trackRef = useRef(null);
  const touchRef = useRef({ startX: 0, startY: 0, lastX: 0, lastTime: 0, isDragging: false, direction: null });
  const PAGE_W_REF = useRef(375);

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

  // Auto-start when both photo and style selected
  useEffect(() => {
    if (photo && selectedStyle) {
      const cat = selectedStyle.category || activeCategory;
      const catData = categoryData[cat];
      if (selectedStyle.isFullTransform) {
        onSelect(photo, { ...selectedStyle, styles: catData.styles });
      } else {
        onSelect(photo, selectedStyle);
      }
    }
  }, [photo, selectedStyle]);

  // 뷰포트 너비 측정
  useEffect(() => {
    const measure = () => {
      if (trackRef.current?.parentElement) {
        PAGE_W_REF.current = trackRef.current.parentElement.offsetWidth;
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // activeCategory 변경 시 트랙 위치 동기화
  useEffect(() => {
    const idx = categoryOrder.indexOf(activeCategory);
    if (trackRef.current?.parentElement) {
      PAGE_W_REF.current = trackRef.current.parentElement.offsetWidth;
    }
    setTrackTransform(-idx * PAGE_W_REF.current, true);
  }, [activeCategory]);

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

  const handleFullTransform = (catKey) => {
    setSelectedStyle(categoryData[catKey].fullTransform);
  };

  // ─── 스와이프 핸들러 ───
  const setTrackTransform = useCallback((x, animated) => {
    if (!trackRef.current) return;
    trackRef.current.style.transition = animated
      ? 'transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1)'
      : 'none';
    trackRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
  }, []);

  const snapToPage = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(2, idx));
    if (categoryOrder[clamped] !== activeCategory) {
      setSelectedStyle(null); // 카테고리 전환 시 선택 해제
    }
    setActiveCategory(categoryOrder[clamped]);
    setTrackTransform(-clamped * PAGE_W_REF.current, true);
  }, [activeCategory, setTrackTransform]);

  const handleTouchStart = useCallback((e) => {
    const t = e.touches[0];
    touchRef.current = {
      startX: t.clientX,
      startY: t.clientY,
      lastX: t.clientX,
      lastTime: Date.now(),
      isDragging: true,
      direction: null
    };
    if (trackRef.current) {
      const matrix = new DOMMatrix(getComputedStyle(trackRef.current).transform);
      setTrackTransform(matrix.m41, false);
    }
  }, [setTrackTransform]);

  const handleTouchMove = useCallback((e) => {
    const tr = touchRef.current;
    if (!tr.isDragging) return;

    const t = e.touches[0];
    const dx = t.clientX - tr.startX;
    const dy = t.clientY - tr.startY;

    if (tr.direction === null && (Math.abs(dx) >= 10 || Math.abs(dy) >= 10)) {
      tr.direction = Math.abs(dx) >= Math.abs(dy) ? 'h' : 'v';
    }
    if (tr.direction !== 'h') return;

    e.preventDefault();
    tr.lastX = t.clientX;
    tr.lastTime = Date.now();

    const idx = categoryOrder.indexOf(activeCategory);
    const pw = PAGE_W_REF.current;
    let targetX = -idx * pw + dx;

    if (targetX > 0) {
      targetX *= 0.25;
    } else if (targetX < -2 * pw) {
      targetX = -2 * pw + (targetX + 2 * pw) * 0.25;
    }

    setTrackTransform(targetX, false);
  }, [activeCategory, setTrackTransform]);

  const handleTouchEnd = useCallback((e) => {
    const tr = touchRef.current;
    tr.isDragging = false;
    if (tr.direction !== 'h') {
      snapToPage(categoryOrder.indexOf(activeCategory));
      return;
    }

    const t = e.changedTouches[0];
    const dx = t.clientX - tr.startX;
    const recentDt = Date.now() - tr.lastTime;
    const velocity = recentDt > 0 ? (t.clientX - tr.lastX) / recentDt : 0;

    const idx = categoryOrder.indexOf(activeCategory);
    const pw = PAGE_W_REF.current;
    let target = idx;

    if (Math.abs(velocity) > 0.3) {
      target = velocity < 0 ? idx + 1 : idx - 1;
    } else if (Math.abs(dx) > pw * 0.2) {
      target = dx < 0 ? idx + 1 : idx - 1;
    }

    snapToPage(target);
  }, [activeCategory, snapToPage]);

  // ─── 카테고리별 페이지 렌더 ───
  const renderCategoryPage = (catKey) => {
    const cat = categoryData[catKey];
    return (
      <div className="swipe-page" key={catKey}>
        <button
          className={`full-transform-btn ${selectedStyle?.isFullTransform && selectedStyle?.category === catKey ? 'selected' : ''}`}
          onClick={() => handleFullTransform(catKey)}
          style={{
            background: cat.gradient,
            boxShadow: selectedStyle?.isFullTransform && selectedStyle?.category === catKey
              ? `0 0 0 2px ${cat.accent}, 0 0 12px ${cat.accent}66`
              : cat.boxShadow,
            color: cat.color
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
              <span className="ft-price">{cat.fullPrice}</span>
            </div>
            <div className="ft-row-2">
              <span className="ft-desc">{cat.fullTransform.title}</span>
              <span className="ft-emojis">{cat.emojis}</span>
            </div>
          </div>
        </button>

        <div className="select-price-row">
          <span className="select-label">{cat.selectLabel}</span>
          <span className="per-transform-price">{cat.priceLabel}</span>
        </div>

        <div className="style-grid">
          {cat.styles.map(style => (
            <button
              key={style.id}
              className={`style-card ${selectedStyle?.id === style.id ? 'selected' : ''}`}
              onClick={() => handleStyleSelect(style)}
              style={selectedStyle?.id === style.id ? {
                borderColor: cat.accent,
                boxShadow: `0 0 12px ${cat.accent}66`
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
    );
  };

  return (
    <div className="style-screen">
      {/* Header */}
      <header className="style-header">
        <button className="back-btn" onClick={onBack}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <span className="header-title">{categoryData[activeCategory].name}</span>
      </header>

      {/* Photo Section (고정, 스와이프 밖) */}
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
            <span className="photo-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="13" r="3"/></svg></span>
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
            onClick={() => snapToPage(i)}
          />
        ))}
      </div>

      {/* 스와이프 영역 */}
      <div
        className="swipe-viewport"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div ref={trackRef} className="swipe-track">
          {categoryOrder.map(catKey => renderCategoryPage(catKey))}
        </div>
      </div>

      {/* Subscription Info */}
      <div className="subscription-info">
        <p>{ui.subscriptionInfo.line1}</p>
        <p>{ui.subscriptionInfo.line2}</p>
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
        }

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
          flex-shrink: 0;
        }

        .photo-section:not(.awaiting-photo) {
          height: auto;
          aspect-ratio: 4 / 3;
          background: transparent;
        }

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
          flex-shrink: 0;
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

        /* 스와이프 레이아웃 */
        .swipe-viewport {
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        .swipe-track {
          display: flex;
          width: 300%;
          height: 100%;
          will-change: transform;
          transition: transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1);
        }

        .swipe-page {
          width: calc(100% / 3);
          flex-shrink: 0;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          display: flex;
          flex-direction: column;
          scrollbar-width: none;
        }
        .swipe-page::-webkit-scrollbar {
          display: none;
        }

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

        /* Subscription Info */
        .subscription-info {
          text-align: center;
          padding: 16px 24px 20px;
        }

        .subscription-info p {
          color: rgba(255,255,255,0.35);
          font-size: 14px;
          margin: 2px 0;
          line-height: 1.6;
        }

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
