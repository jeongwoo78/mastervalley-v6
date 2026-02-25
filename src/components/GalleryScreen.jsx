// GalleryScreen.jsx - 갤러리 컴포넌트 (IndexedDB 버전)
// 대용량 이미지 저장 + 그리드 UI + 저장/공유/삭제 기능
import React, { useState, useEffect } from 'react';
import { saveImage as saveToDevice, shareImage, addWatermark, isNativePlatform, WATERMARK_ON_SAVE } from '../utils/mobileShare';
import { getMovementDisplayInfo, getOrientalDisplayInfo, getMasterInfo } from '../utils/displayConfig';
import { getUi } from '../i18n';
// v80: 풀스크린 이미지 뷰어 (핀치줌)
// ImageFullscreenViewer removed - using simple fullimage overlay

// ========== IndexedDB 설정 ==========
const DB_NAME = 'PicoArtGallery';
const DB_VERSION = 1;
const STORE_NAME = 'images';

// IndexedDB 열기
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
};

// 모든 이미지 가져오기
const getAllImages = async () => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        // 최신순 정렬
        const items = request.result.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        resolve(items);
      };
    });
  } catch (error) {
    console.error('IndexedDB 읽기 실패:', error);
    return [];
  }
};

// 이미지 저장
const saveImage = async (imageData) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(imageData);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(true);
    });
  } catch (error) {
    console.error('IndexedDB 저장 실패:', error);
    return false;
  }
};

// 이미지 삭제
const deleteImage = async (id) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(true);
    });
  } catch (error) {
    console.error('IndexedDB 삭제 실패:', error);
    return false;
  }
};

// Delete All
const clearAllImages = async () => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(true);
    });
  } catch (error) {
    console.error('IndexedDB Delete All 실패:', error);
    return false;
  }
};

// URL을 Base64로 변환 (이미지 영구 저장용)
const urlToBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('이미지 변환 실패:', error);
    return null;
  }
};


// ========== 갤러리에 이미지 저장 (외부에서 사용) ==========
export const saveToGallery = async (imageUrl, metadataOrStyleName, categoryNameLegacy = '') => {
  try {
    // URL을 Base64로 변환
    const base64Image = await urlToBase64(imageUrl);
    if (!base64Image) {
      console.error('이미지 변환 실패');
      return false;
    }
    
    // ========== 중복 체크 ==========
    const existingItems = await getAllImages();
    const alreadyExists = existingItems.some(item => item.imageData === base64Image);
    if (alreadyExists) {
      return true; // 이미 저장됨으로 처리
    }
    
    // 메타데이터 객체 또는 레거시 문자열 호환
    const isMetadata = typeof metadataOrStyleName === 'object';
    
    const imageData = {
      id: `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      imageData: base64Image,
      // 신규 필드: i18n 갤러리 표시용
      category: isMetadata ? metadataOrStyleName.category : '',
      artistName: isMetadata ? metadataOrStyleName.artistName : '',
      movementName: isMetadata ? (metadataOrStyleName.movementName || '') : '',
      workName: isMetadata ? (metadataOrStyleName.workName || null) : null,
      styleId: isMetadata ? (metadataOrStyleName.styleId || '') : '',
      isRetransform: isMetadata ? (metadataOrStyleName.isRetransform || false) : false,
      // 레거시 호환 필드
      styleName: isMetadata ? (metadataOrStyleName.artistName || 'Converted Image') : metadataOrStyleName,
      categoryName: isMetadata ? (metadataOrStyleName.category || '') : categoryNameLegacy,
      createdAt: new Date().toISOString()
    };
    
    const saved = await saveImage(imageData);
    return saved;
  } catch (error) {
    console.error('갤러리 저장 실패:', error);
    return false;
  }
};


// ========== 갤러리 컴포넌트 ==========
const GalleryScreen = ({ onBack, onHome, lang = 'en' }) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSaveShareMenu, setShowSaveShareMenu] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isBatchSaving, setIsBatchSaving] = useState(false);

  // i18n texts from ui.js
  const t = getUi(lang).gallery;

  // i18n 갤러리 표시 함수 (displayConfig 활용)
  // 갤러리 카드용: 괄호 내용 제거 (간결한 표시)
  const stripParens = (text) => text ? text.replace(/\s*\(.*?\)/g, '').trim() : '';

  const getGalleryDisplay = (item) => {
    // 신규 포맷: category + artistName 있으면 i18n 표시
    if (item.category && item.artistName) {
      if (item.category === 'movements') {
        // styleId 우선 → movementName 폴백 (기존 한국어 데이터 호환)
        const movementKey = item.styleId || item.movementName || '';
        const info = getMovementDisplayInfo(movementKey, item.artistName, lang);
        return { 
          title: stripParens(info.title), 
          subtitle: stripParens(info.subtitle),
          badge: item.isRetransform ? 'Re.' : null
        };
      }
      if (item.category === 'masters') {
        const info = getMasterInfo(item.artistName, lang);
        return { 
          title: stripParens(info.fullName), 
          subtitle: stripParens(info.movement),
          badge: item.isRetransform ? 'Re.' : null
        };
      }
      if (item.category === 'oriental') {
        const info = getOrientalDisplayInfo(item.artistName, lang);
        return { 
          title: stripParens(info.title), 
          subtitle: stripParens(info.subtitle),
          badge: item.isRetransform ? 'Re.' : null
        };
      }
    }
    // 레거시 포맷: styleName 그대로 표시
    return { 
      title: item.styleName || 'Converted Image', 
      subtitle: item.categoryName || '',
      badge: null
    };
  };

  // 갤러리 로드
  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    setIsLoading(true);
    const items = await getAllImages();
    setGalleryItems(items);
    setIsLoading(false);
  };

  // 이미지 삭제
  const handleDelete = async (id) => {
    if (window.confirm(t.confirmDelete)) {
      const success = await deleteImage(id);
      if (success) {
        setGalleryItems(prev => prev.filter(item => item.id !== id));
        setSelectedItem(null);
      }
    }
  };

  // 다중 선택 토글
  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(galleryItems.map(item => item.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    const msg = t.confirmDeleteSelected.replace('{count}', selectedIds.size);
    if (window.confirm(msg)) {
      for (const id of selectedIds) {
        await deleteImage(id);
      }
      setGalleryItems(prev => prev.filter(item => !selectedIds.has(item.id)));
      setSelectedIds(new Set());
      setSelectMode(false);
    }
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
  };

  // 선택 이미지 일괄 저장
  const handleSaveSelected = async () => {
    if (selectedIds.size === 0) return;
    setIsBatchSaving(true);
    let successCount = 0;
    let failCount = 0;
    
    try {
      const selectedItems = galleryItems.filter(item => selectedIds.has(item.id));
      
      for (const item of selectedItems) {
        try {
          const fileName = `mastervalley_${item.styleName.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
          const finalImage = WATERMARK_ON_SAVE ? await addWatermark(item.imageData) : item.imageData;
          const result = await saveToDevice(finalImage, fileName);
          if (result.success) {
            successCount++;
          } else {
            failCount++;
          }
          // 연속 저장 간 짧은 딜레이 (OS 부담 방지)
          await new Promise(r => setTimeout(r, 300));
        } catch {
          failCount++;
        }
      }
      
      if (failCount === 0) {
        alert(t.batchSaveComplete.replace('{count}', successCount));
      } else {
        alert(t.batchSavePartial.replace('{success}', successCount).replace('{fail}', failCount));
      }
    } catch (error) {
      console.error('일괄 저장 실패:', error);
      alert(t.saveFailed);
    } finally {
      setIsBatchSaving(false);
    }
  };

  // 이미지 저장 (mobileShare 사용)
  const handleDownload = async (item) => {
    try {
      const fileName = `mastervalley_${item.styleName.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
      
      // 워터마크 적용 (WATERMARK_ON_SAVE 플래그로 제어)
      const finalImage = WATERMARK_ON_SAVE ? await addWatermark(item.imageData) : item.imageData;
      const result = await saveToDevice(finalImage, fileName);
      
      if (result.success) {
        if (result.gallery) {
          alert(t.savedToGallery);
        } else if (isNativePlatform()) {
          alert(t.savedToFiles);
        }
      } else if (result.error) {
        alert(`${t.saveFailed}: ${result.error}`);
      }
      setShowSaveShareMenu(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('저장 실패:', error);
      alert(t.saveFailed);
    }
  };

  // 이미지 공유 (워터마크 포함)
  const handleShare = async (item) => {
    try {
      // 워터마크 추가
      const watermarkedImage = await addWatermark(item.imageData);
      
      const shareTitle = t.shareTitle;
      const shareText = t.shareText;
      
      const result = await shareImage(watermarkedImage, shareTitle, shareText);
      
      if (result.clipboard) {
        alert(t.linkCopied);
      }
      setShowSaveShareMenu(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('공유 실패:', error);
    }
  };

  // Delete All
  const handleClearAll = async () => {
    if (window.confirm(t.confirmDeleteAll)) {
      const success = await clearAllImages();
      if (success) {
        setGalleryItems([]);
      }
    }
  };

  // 날짜 포맷 (언어별)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const locale = lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : lang === 'zh' ? 'zh-CN' : 'en-US';
    return date.toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>{t.loading}</p>
        </div>
        <style>{animationStyle}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* 헤더: 일반 모드 / 선택 모드 전환 */}
      {selectMode ? (
        <div className="select-header">
          <div className="select-header-row1">
            <button className="select-header-back" onClick={exitSelectMode}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div className="select-header-actions">
              <button 
                className="select-header-all"
                onClick={selectedIds.size === galleryItems.length ? deselectAll : selectAll}
              >
                {selectedIds.size === galleryItems.length ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                )}
                {t.selectAll}
              </button>
              <button 
                className="select-header-save"
                onClick={handleSaveSelected}
                disabled={selectedIds.size === 0 || isBatchSaving}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                {isBatchSaving ? t.saving : t.save}
              </button>
              <button 
                className="select-header-delete"
                onClick={handleDeleteSelected}
                disabled={selectedIds.size === 0}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                {t.delete}
              </button>
            </div>
          </div>
          <div className="select-header-row2">
            <span className="select-header-count">
              {t.selectedCount.replace('{count}', selectedIds.size)}
            </span>
          </div>
        </div>
      ) : (
        <div style={styles.header}>
          <button style={styles.backButton} onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h2 style={styles.titleCenter}>{t.title}</h2>
          <button style={styles.homeButtonClean} onClick={onHome}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </button>
        </div>
      )}

      {/* 카운트 + Select 버튼 */}
      {galleryItems.length > 0 && !selectMode && (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0 12px'}}>
          <button style={styles.selectButton} onClick={() => setSelectMode(true)}>
            {t.select}
          </button>
          <span style={{fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)'}}>Total {galleryItems.length}</span>
        </div>
      )}

      {/* 갤러리 그리드 */}
      {galleryItems.length === 0 ? (
        <div style={styles.empty}>
          <div className="gallery-empty-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <p style={styles.emptyText}>{t.empty}</p>
          <p style={styles.emptySubtext}>{t.emptySubtext}</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {galleryItems.map((item) => {
            const display = getGalleryDisplay(item);
            return (
            <div
              key={item.id}
              className={`gallery-item ${selectMode && selectedIds.has(item.id) ? 'selected' : ''}`}
              onClick={() => selectMode ? toggleSelect(item.id) : (() => { setSelectedItem(item); setFullscreenImage(item.imageData); })()}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={item.imageData}
                  alt={item.styleName}
                  style={styles.thumbnail}
                  loading="lazy"
                />
                {selectMode && (
                  <div className={`select-checkbox ${selectedIds.has(item.id) ? 'checked' : ''}`}>
                    {selectedIds.has(item.id) && '✓'}
                  </div>
                )}
              </div>
              <div style={styles.itemLabel}>
                <span style={styles.styleName}>
                  {display.badge && <span style={styles.reText}>{display.badge} </span>}
                  {display.title}
                </span>
                {display.subtitle && (
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{display.subtitle}</span>
                )}
                <span style={styles.date}>{formatDate(item.createdAt)}</span>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* 풀이미지 보기 */}
      {fullscreenImage && (
        <div style={fullimageStyles.overlay} onClick={() => { setFullscreenImage(null); setSelectedItem(null); }}>
          <div style={fullimageStyles.contentWrap} onClick={(e) => e.stopPropagation()}>
            <button style={fullimageStyles.closeBtn} onClick={() => { setFullscreenImage(null); setSelectedItem(null); }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <img 
              src={fullscreenImage} 
              alt="Full view" 
              style={fullimageStyles.img}
            />
          </div>
          {selectedItem && (
            <p style={fullimageStyles.meta}>
              {getGalleryDisplay(selectedItem).title} · {formatDate(selectedItem.createdAt)}
            </p>
          )}
          <div style={fullimageStyles.actions} onClick={(e) => e.stopPropagation()}>
            <button style={fullimageStyles.btn} onClick={() => setShowSaveShareMenu(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {t.saveShare || `${t.save}/${t.share}`}
            </button>
            <button style={{...fullimageStyles.btn, color: '#ff6b6b'}} onClick={() => { setFullscreenImage(null); if(selectedItem) handleDelete(selectedItem.id); setSelectedItem(null); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              {t.delete}
            </button>
          </div>

          {/* 저장/공유 팝업 메뉴 */}
          {showSaveShareMenu && (
            <div style={styles.saveShareOverlay} onClick={() => setShowSaveShareMenu(false)}>
              <div style={styles.saveShareMenu} onClick={(e) => e.stopPropagation()}>
                <button 
                  style={styles.menuItem}
                  onClick={() => handleDownload(selectedItem)}
                >
                  <span style={styles.menuIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></span>
                  {t.saveToDevice}
                </button>
                <button 
                  style={styles.menuItem}
                  onClick={() => handleShare(selectedItem)}
                >
                  <span style={styles.menuIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></span>
                  {t.shareArt}
                </button>
                <button 
                  style={{...styles.menuItem, ...styles.menuCancel}}
                  onClick={() => setShowSaveShareMenu(false)}
                >
                  {t.close}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CSS 애니메이션 */}
      <style>{animationStyle}</style>
    </div>
  );
};

// CSS 애니메이션 스타일
const animationStyle = `
  .gallery-empty-icon {
    width: 48px;
    height: 48px;
    border: 2px solid rgba(255,255,255,0.15);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .gallery-item {
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .gallery-item:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 25px rgba(167, 139, 250, 0.3);
  }
  
  .gallery-item.selected {
    outline: 2px solid #7c3aed;
    outline-offset: -2px;
  }
  
  .select-checkbox {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.5);
    background: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: bold;
    color: transparent;
    z-index: 1;
  }
  
  .select-checkbox.checked {
    background: #7c3aed;
    border-color: #7c3aed;
    color: white;
  }
  
  /* v79: 선택 모드 헤더 — 2줄 레이아웃 */
  .select-header {
    padding: 0 0 0;
    margin-bottom: 12px;
  }
  
  .select-header-row1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0 0;
  }
  
  .select-header-back {
    background: none;
    border: none;
    color: rgba(255,255,255,0.6);
    font-size: 13px;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .select-header-actions {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  
  .select-header-row2 {
    padding: 8px 0 0;
    text-align: right;
  }
  
  .select-header-count {
    font-size: 12px;
    color: rgba(255,255,255,0.4);
  }
  
  .select-header-all {
    padding: 0;
    border: none;
    background: none;
    color: #6b8afd;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 3px;
  }
  
  .select-header-save {
    padding: 0;
    border: none;
    background: none;
    color: rgba(255,255,255,0.5);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 3px;
  }
  
  .select-header-save:disabled {
    color: rgba(255,255,255,0.2);
    cursor: not-allowed;
  }
  
  .select-header-delete {
    padding: 0;
    border: none;
    background: none;
    color: rgba(255,255,255,0.3);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 3px;
  }
  
  .select-header-delete:disabled {
    color: rgba(255,255,255,0.2);
    cursor: not-allowed;
  }
  
  @media (min-width: 768px) {
    .gallery-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;

// 스타일 정의
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white',
    padding: '20px',
    maxWidth: '400px',
    margin: '0 auto',
  },
  
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    gap: '10px',
    position: 'relative',
  },
  
  backButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    padding: '4px 8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    zIndex: 1,
  },
  
  homeButtonClean: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.7)',
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  
  titleCenter: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    margin: 0,
    fontSize: '17px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  
  clearButton: {
    background: 'rgba(255,100,100,0.3)',
    border: 'none',
    color: '#ff6b6b',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  
  selectButton: {
    background: 'none',
    border: 'none',
    color: '#7c3aed',
    padding: '4px 0',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
  },
  
  notice: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '20px',
    fontSize: '0.85rem',
    opacity: 0.9,
  },
  
  countText: {
    margin: '8px 0 0',
    color: '#a78bfa',
    fontWeight: '600',
  },
  
  loading: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    fontSize: '1.1rem',
    gap: '15px',
  },
  
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255,255,255,0.2)',
    borderTop: '3px solid #a78bfa',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
    textAlign: 'center',
  },
  
  emptyIcon: {
    fontSize: '4rem',
    margin: 0,
    opacity: 0.2,
  },
  
  emptyText: {
    fontSize: '15px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.6)',
    margin: '0 0 6px',
  },
  
  emptySubtext: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.3)',
    margin: 0,
  },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
  },
  
  gridItem: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  
  thumbnail: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    objectPosition: 'top',
    display: 'block',
  },
  
  itemLabel: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  
  styleName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#a78bfa',
  },
  
  date: {
    fontSize: '0.75rem',
    opacity: 0.6,
  },

  reText: {
    color: '#a78bfa',
    fontSize: '0.75rem',
    fontWeight: '600',
    opacity: 0.7,
  },
  
  // 모달 스타일
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  
  modalContent: {
    background: '#1a1a2e',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
  },
  
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'rgba(0,0,0,0.5)',
    border: 'none',
    color: 'rgba(255,255,255,0.7)',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.2rem',
    zIndex: 10,
  },
  
  modalImage: {
    width: '100%',
    display: 'block',
    borderRadius: '16px 16px 0 0',
  },
  
  modalInfo: {
    padding: '20px',
    textAlign: 'center',
  },
  
  modalTitle: {
    margin: '0 0 4px',
    fontSize: '1.2rem',
    color: '#fff',
  },
  
  modalDate: {
    margin: 0,
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.3)',
  },
  
  modalCategory: {
    margin: '4px 0 0',
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.4)',
  },
  
  modalActions: {
    display: 'flex',
    gap: '10px',
    padding: '0 20px 20px',
  },
  
  saveShareButton: {
    flex: 1,
    background: 'rgba(102,126,234,0.15)',
    border: '1px solid rgba(102,126,234,0.3)',
    color: '#7c3aed',
    padding: '14px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  
  deleteButton: {
    flex: 1,
    background: 'rgba(255,107,107,0.1)',
    border: '1px solid rgba(255,107,107,0.3)',
    color: '#ff6b6b',
    padding: '14px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  
  // 저장/공유 팝업 스타일
  saveShareOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10001,
  },
  
  saveShareMenu: {
    background: '#1e1e2e',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '14px',
    padding: '6px',
    minWidth: '200px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
  },
  
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '14px 16px',
    border: 'none',
    background: 'transparent',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '0.9rem',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background 0.2s',
  },
  
  menuIcon: {
    marginRight: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  
  menuCancel: {
    color: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    marginTop: '4px',
    paddingTop: '14px',
  },
};

const fullimageStyles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.95)',
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  contentWrap: {
    position: 'relative',
    maxWidth: '92%',
    maxHeight: '70vh',
  },
  closeBtn: {
    position: 'absolute',
    top: -12,
    right: -12,
    background: 'rgba(0, 0, 0, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '50%',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 2,
  },
  img: {
    maxWidth: '100%',
    maxHeight: '70vh',
    objectFit: 'contain',
    borderRadius: '8px',
    display: 'block',
  },
  meta: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '13px',
    marginTop: '12px',
    textAlign: 'center',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
    padding: '0 20px',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 24px',
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '14px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
};

export default GalleryScreen;
