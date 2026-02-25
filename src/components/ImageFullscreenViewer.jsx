// ImageFullscreenViewer.jsx - 공통 풀스크린 이미지 뷰어
// ResultScreen + GalleryScreen 공유 컴포넌트
// react-zoom-pan-pinch: 핀치줌 + 더블탭 확대/복원
// 탭 토글: 이미지 탭 → 상/하단 바 숨김/표시 (Google Photos 패턴)

import React, { useState, useCallback, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

/**
 * @param {string} imageUrl - 표시할 이미지 URL
 * @param {function} onClose - 닫기 콜백
 * @param {Array} actions - [{ icon: <SVG>, label: string, onClick: function, style?: object }]
 * 
 * 사용 예:
 *   <ImageFullscreenViewer
 *     imageUrl={resultImage}
 *     onClose={() => setFullscreenImage(null)}
 *     actions={[
 *       { icon: <SaveSVG/>, label: 'Save/Share', onClick: () => setShowSaveShareMenu(true) },
 *       { icon: <GallerySVG/>, label: 'Gallery', onClick: onGallery },
 *     ]}
 *   />
 */
const ImageFullscreenViewer = ({ imageUrl, onClose, actions = [] }) => {
  const [showBar, setShowBar] = useState(true);
  const lastTapRef = useRef(0);
  const tapTimerRef = useRef(null);

  // 싱글탭 → 바 토글 (더블탭과 구분)
  const handleSingleTap = useCallback(() => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    lastTapRef.current = now;

    // 더블탭 간격(300ms) 이내면 무시 (줌 동작)
    if (timeSinceLastTap < 300) {
      clearTimeout(tapTimerRef.current);
      return;
    }

    // 300ms 후에 싱글탭으로 확정
    tapTimerRef.current = setTimeout(() => {
      setShowBar(prev => !prev);
    }, 300);
  }, []);

  return (
    <div style={styles.overlay}>
      {/* 상단 바 - ✕ 닫기 */}
      <div style={{
        ...styles.topBar,
        opacity: showBar ? 1 : 0,
        pointerEvents: showBar ? 'auto' : 'none',
      }}>
        <button style={styles.closeBtn} onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* 이미지 영역 - 핀치줌 */}
      <div style={styles.imageArea} onClick={handleSingleTap}>
        <TransformWrapper
          initialScale={1}
          minScale={1}
          maxScale={4}
          doubleClick={{ mode: "toggle", step: 2 }}
          panning={{ disabled: false }}
          wheel={{ disabled: true }}
        >
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ 
              width: '100%', height: '100%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}
          >
            <img 
              src={imageUrl} 
              alt="Fullscreen" 
              style={styles.fullImage}
              draggable={false}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>

      {/* 하단 액션 바 */}
      <div style={{
        ...styles.bottomBar,
        opacity: showBar ? 1 : 0,
        pointerEvents: showBar ? 'auto' : 'none',
      }}>
        <div style={styles.actionRow}>
          {actions.map((action, idx) => (
            <button 
              key={idx} 
              style={{ ...styles.actionBtn, ...(action.style || {}) }}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
            >
              {action.icon}
              <span style={styles.actionLabel}>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: '#000',
    zIndex: 9998,
    display: 'flex',
    flexDirection: 'column',
  },
  topBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'flex-end',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
    zIndex: 10,
    transition: 'opacity 0.25s ease',
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.12)',
    border: 'none',
    borderRadius: '50%',
    width: 40, height: 40,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  },
  imageArea: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fullImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    userSelect: 'none',
    WebkitUserSelect: 'none',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: '20px 24px',
    paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
    zIndex: 10,
    transition: 'opacity 0.25s ease',
  },
  actionRow: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
  },
  actionBtn: {
    flex: 1,
    maxWidth: 160,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '13px 16px',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    color: '#fff',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    transition: 'background 0.2s',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: 500,
  },
};

export default ImageFullscreenViewer;
