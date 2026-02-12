// PhotoStyleScreen.jsx - Style Selection Screen (Dark Theme)
// Based on mockup: 03-style-select.html
import React, { useRef, useState, useEffect } from 'react';

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

const PhotoStyleScreen = ({ mainCategory, onBack, onSelect }) => {
  const fileInputRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);

  // Category data with thumbnails
  const categoryData = {
    movements: {
      name: 'Western Art',
      price: '$0.20',
      fullTransform: {
        id: 'movements-all',
        title: 'Traveling 2500 years of art',
        desc: '11 art movements / $2.00',
        count: 11,
        isFullTransform: true,
        category: 'movements'
      },
      styles: [
        { id: 'ancient', name: 'Greco-Roman', period: 'BC 800 - AD 500', thumbnail: grecoRoman, category: 'movements' },
        { id: 'medieval', name: 'Medieval', period: '400 - 1400', thumbnail: medieval, category: 'movements' },
        { id: 'renaissance', name: 'Renaissance', period: '1400 - 1600', thumbnail: renaissance, category: 'movements' },
        { id: 'baroque', name: 'Baroque', period: '1600 - 1750', thumbnail: baroque, category: 'movements' },
        { id: 'rococo', name: 'Rococo', period: '1700 - 1800', thumbnail: rococo, category: 'movements' },
        { id: 'neoclassicism_vs_romanticism_vs_realism', name: 'Neo·Roman·Real', period: '1750 - 1880', thumbnail: neoclassicism, category: 'movements' },
        { id: 'impressionism', name: 'Impressionism', period: '1860 - 1890', thumbnail: impressionism, category: 'movements' },
        { id: 'postImpressionism', name: 'Post-Impres.', period: '1880 - 1910', thumbnail: postImpressionism, category: 'movements' },
        { id: 'fauvism', name: 'Fauvism', period: '1905 - 1910', thumbnail: fauvism, category: 'movements' },
        { id: 'expressionism', name: 'Expressionism', period: '1905 - 1930', thumbnail: expressionism, category: 'movements' },
        { id: 'modernism', name: 'Modernism', period: '1907 - 1970', thumbnail: modernism, category: 'movements' }
      ]
    },
    masters: {
      name: 'Master Collection',
      price: '$0.25',
      fullTransform: {
        id: 'masters-all',
        title: 'Into the world of 7 masters',
        desc: 'Connect with 7 masters / $1.50',
        count: 7,
        isFullTransform: true,
        category: 'masters'
      },
      styles: [
        { id: 'vangogh-master', name: 'Van Gogh', period: '1853 - 1890', thumbnail: vangogh, category: 'masters' },
        { id: 'klimt-master', name: 'Klimt', period: '1862 - 1918', thumbnail: klimt, category: 'masters' },
        { id: 'munch-master', name: 'Munch', period: '1863 - 1944', thumbnail: munch, category: 'masters' },
        { id: 'matisse-master', name: 'Matisse', period: '1869 - 1954', thumbnail: matisse, category: 'masters' },
        { id: 'chagall-master', name: 'Chagall', period: '1887 - 1985', thumbnail: chagall, category: 'masters' },
        { id: 'frida-master', name: 'Frida', period: '1907 - 1954', thumbnail: frida, category: 'masters' },
        { id: 'lichtenstein-master', name: 'Lichtenstein', period: '1923 - 1997', thumbnail: lichtenstein, category: 'masters' }
      ]
    },
    oriental: {
      name: 'East Asian Art',
      price: '$0.20',
      fullTransform: {
        id: 'oriental-all',
        title: 'Exploring East Asia',
        desc: 'Korea · China · Japan / $0.60',
        count: 3,
        isFullTransform: true,
        category: 'oriental'
      },
      styles: [
        { id: 'korean', name: 'Korean', period: 'Minhwa · Pungsokdo', thumbnail: korean, category: 'oriental' },
        { id: 'chinese', name: 'Chinese', period: 'Ink wash · Gongbi', thumbnail: chinese, category: 'oriental' },
        { id: 'japanese', name: 'Japanese', period: 'Ukiyo-e', thumbnail: japanese, category: 'oriental' }
      ]
    }
  };

  const currentCategory = categoryData[mainCategory];

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

  return (
    <div className="style-screen">
      {/* Header */}
      <header className="style-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <span className="header-title">{currentCategory.name}</span>
        <span className="header-price">{currentCategory.price}</span>
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
            <span className="photo-text">Tap to select photo</span>
          </div>
        )}
      </div>

      {/* Full Transform Button */}
      <button
        className={`full-transform-btn ${selectedStyle?.isFullTransform ? 'selected' : ''}`}
        onClick={handleFullTransform}
      >
        <div className="ft-title">{currentCategory.fullTransform.title}</div>
        <div className="ft-desc">{currentCategory.fullTransform.desc}</div>
      </button>

      {/* Style Grid */}
      <div className="style-grid">
        {currentCategory.styles.map(style => (
          <button
            key={style.id}
            className={`style-card ${selectedStyle?.id === style.id ? 'selected' : ''}`}
            onClick={() => handleStyleSelect(style)}
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

      <style>{`
        .style-screen {
          min-height: 100vh;
          background: #121212;
          display: flex;
          flex-direction: column;
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

        .header-price {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
        }

        /* Photo Section */
        .photo-section {
          margin: 0 20px 16px;
          background: #1a1a1a;
          border-radius: 12px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s;
        }

        /* 스타일 선택 후 사진 대기 상태 - 테두리 강조 + 펄스 */
        .photo-section.awaiting-photo {
          border: 2px solid #667eea;
          box-shadow: 0 0 12px rgba(102, 126, 234, 0.4);
          animation: photoPulse 2s ease-in-out infinite;
        }

        @keyframes photoPulse {
          0%, 100% { box-shadow: 0 0 8px rgba(102, 126, 234, 0.3); }
          50% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.6); }
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
        }

        /* Full Transform Button - 목업 준수: 더 눈에 띄는 디자인 */
        .full-transform-btn {
          margin: 0 20px 16px;
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(102,126,234,0.25), rgba(118,75,162,0.25));
          border: 2px solid rgba(102,126,234,0.5);
          border-radius: 14px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(102,126,234,0.2);
        }

        .full-transform-btn:hover {
          background: linear-gradient(135deg, rgba(102,126,234,0.35), rgba(118,75,162,0.35));
          border-color: rgba(102,126,234,0.7);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102,126,234,0.3);
        }

        .full-transform-btn.selected {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102,126,234,0.4), rgba(118,75,162,0.4));
          box-shadow: 0 4px 16px rgba(102,126,234,0.4);
        }

        .ft-title {
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .ft-desc {
          color: rgba(255,255,255,0.7);
          font-size: 13px;
        }

        /* Style Grid */
        .style-grid {
          flex: 1;
          padding: 0 20px 24px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          overflow-y: auto;
        }

        .style-card {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s;
        }

        .style-card.selected {
          outline: 3px solid #7c3aed;
          outline-offset: -3px;
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
          padding: 10px;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%);
        }

        .style-name {
          display: block;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.3;
        }

        .style-period {
          display: block;
          color: rgba(255,255,255,0.6);
          font-size: 11px;
          margin-top: 2px;
        }

        /* Mobile */
        @media (max-width: 400px) {
          .style-grid {
            gap: 10px;
            padding: 0 16px 20px;
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
