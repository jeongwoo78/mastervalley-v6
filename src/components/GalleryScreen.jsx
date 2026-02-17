// GalleryScreen.jsx - 갤러리 컴포넌트 (IndexedDB 버전)
// 대용량 이미지 저장 + 그리드 UI + 저장/공유/삭제 기능
import React, { useState, useEffect } from 'react';
import { saveImage as saveToDevice, shareImage, addWatermark, isNativePlatform, WATERMARK_ON_SAVE } from '../utils/mobileShare';
import { getMovementDisplayInfo, getOrientalDisplayInfo, getMasterInfo } from '../utils/displayConfig';

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
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // i18n texts
  const texts = {
    ko: {
      title: '내 갤러리',
      deleteAll: '전체 삭제',
      saved: '저장됨',
      empty: '아직 저장된 이미지가 없습니다',
      emptySubtext: '사진을 변환하면 여기에 자동 저장됩니다',
      saveShare: '💾 저장/공유',
      save: '저장하기',
      share: '공유하기',
      close: '닫기',
      confirmDelete: '이 이미지를 삭제할까요?',
      confirmDeleteAll: '모든 이미지를 삭제할까요?\n이 작업은 취소할 수 없습니다.',
      savedToGallery: '✅ 갤러리에 저장되었습니다!',
      savedToFiles: '✅ 저장되었습니다!\n📁 파일 앱 → Documents → MasterValley',
      saveFailed: '저장에 실패했습니다',
      shareTitle: 'Master Valley 작품',
      shareText: 'Master Valley로 만든 AI 명화를 확인해보세요!',
      linkCopied: '링크가 클립보드에 복사되었습니다!',
      loading: '갤러리 로딩 중...',
      back: '뒤로',
      home: '홈',
      deviceNote: '💡 이미지는 기기에 저장됩니다.',
      countUnit: '개',
      delete: '삭제',
      select: '선택',
      selectAll: '전체 선택',
      deselectAll: '전체 해제',
      deleteSelected: '선택 삭제',
      cancel: '취소',
      confirmDeleteSelected: '선택한 {count}개 이미지를 삭제할까요?',
      selectedCount: '{count}개 선택'
    },
    en: {
      title: 'My Gallery',
      deleteAll: 'Delete All',
      saved: 'Saved',
      empty: 'No saved images yet',
      emptySubtext: 'Converted images will be saved here',
      saveShare: '💾 Save/Share',
      save: 'Save',
      share: 'Share',
      close: 'Close',
      confirmDelete: 'Delete this image?',
      confirmDeleteAll: 'Delete all images?\nThis cannot be undone.',
      savedToGallery: '✅ Saved to Gallery!',
      savedToFiles: '✅ Saved!\n📁 Files app → Documents → MasterValley',
      saveFailed: 'Save failed',
      shareTitle: 'Master Valley Art',
      shareText: 'Check out my AI masterpiece from Master Valley!',
      linkCopied: 'Link copied to clipboard!',
      loading: 'Loading gallery...',
      back: 'Back',
      home: 'Home',
      deviceNote: '💡 Images are saved on your device.',
      countUnit: '',
      delete: 'Delete',
      select: 'Select',
      selectAll: 'Select All',
      deselectAll: 'Deselect All',
      deleteSelected: 'Delete Selected',
      cancel: 'Cancel',
      confirmDeleteSelected: 'Delete {count} selected images?',
      selectedCount: '{count} selected'
    }
  };
  const t = texts[lang] || texts.en;

  // i18n 갤러리 표시 함수 (displayConfig 활용)
  const getGalleryDisplay = (item) => {
    // 신규 포맷: category + artistName 있으면 i18n 표시
    if (item.category && item.artistName) {
      if (item.category === 'movements') {
        const info = getMovementDisplayInfo(item.movementName || '', item.artistName, lang);
        return { 
          title: info.title, 
          subtitle: info.subtitle,
          badge: item.isRetransform ? 'Re.' : null
        };
      }
      if (item.category === 'masters') {
        const info = getMasterInfo(item.artistName, lang);
        return { 
          title: info.fullName, 
          subtitle: info.movement,
          badge: item.isRetransform ? 'Re.' : null
        };
      }
      if (item.category === 'oriental') {
        const info = getOrientalDisplayInfo(item.artistName, lang);
        return { 
          title: info.title, 
          subtitle: info.subtitle,
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
          <button className="select-header-cancel" onClick={exitSelectMode}>
            ←
          </button>
          <span className="select-header-count">
            {t.selectedCount.replace('{count}', selectedIds.size)}
          </span>
          <div className="select-header-actions">
            <button 
              className="select-header-all"
              onClick={selectedIds.size === galleryItems.length ? deselectAll : selectAll}
            >
              {selectedIds.size === galleryItems.length ? t.deselectAll : t.selectAll}
            </button>
            <button 
              className="select-header-delete"
              onClick={handleDeleteSelected}
              disabled={selectedIds.size === 0}
            >
              🗑 {t.delete}
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button style={styles.backButton} onClick={onBack}>
              ← {t.back}
            </button>
            <button style={styles.homeButton} onClick={onHome}>
              🏠 {t.home}
            </button>
          </div>
          <h2 style={styles.title}>{t.title}</h2>
          {galleryItems.length > 0 && (
            <button style={styles.selectButton} onClick={() => setSelectMode(true)}>
              {t.select}
            </button>
          )}
        </div>
      )}

      {/* 안내 메시지 */}
      <div style={styles.notice}>
        <p style={{ margin: 0 }}>{t.deviceNote}</p>
        <p style={styles.countText}>{t.saved}: {galleryItems.length}{t.countUnit}</p>
      </div>

      {/* 갤러리 그리드 */}
      {galleryItems.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>🎨</p>
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
              onClick={() => selectMode ? toggleSelect(item.id) : setSelectedItem(item)}
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
                <span style={styles.styleName}>{display.title}</span>
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

      {/* 상세 보기 모달 */}
      {selectedItem && (
        <div style={styles.modal} onClick={() => setSelectedItem(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              style={styles.closeButton}
              onClick={() => setSelectedItem(null)}
            >
              ✕
            </button>
            
            <img
              src={selectedItem.imageData}
              alt={selectedItem.styleName}
              style={styles.modalImage}
            />
            
            <div style={styles.modalInfo}>
              <h3 style={styles.modalTitle}>{getGalleryDisplay(selectedItem).title}</h3>
              {getGalleryDisplay(selectedItem).subtitle && (
                <p style={styles.modalCategory}>{getGalleryDisplay(selectedItem).subtitle}</p>
              )}
              <p style={styles.modalDate}>{formatDate(selectedItem.createdAt)}</p>
            </div>
            
            <div style={styles.modalActions}>
              <button
                style={styles.saveShareButton}
                onClick={() => setShowSaveShareMenu(true)}
              >
                {t.saveShare}
              </button>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(selectedItem.id)}
              >
                🗑️ {t.delete}
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
                    <span style={styles.menuIcon}>💾</span>
                    {t.save}
                  </button>
                  <button 
                    style={styles.menuItem}
                    onClick={() => handleShare(selectedItem)}
                  >
                    <span style={styles.menuIcon}>📤</span>
                    {t.share}
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
        </div>
      )}

      {/* CSS 애니메이션 */}
      <style>{animationStyle}</style>
    </div>
  );
};

// CSS 애니메이션 스타일
const animationStyle = `
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
    outline: 2px solid #667eea;
    outline-offset: -2px;
  }
  
  .select-checkbox {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 20px;
    height: 20px;
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
    background: #667eea;
    border-color: #667eea;
    color: white;
  }
  
  /* B안: 선택 모드 헤더 */
  .select-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(102, 126, 234, 0.2);
    background: rgba(102, 126, 234, 0.05);
    border-radius: 8px;
    padding: 10px 14px;
  }
  
  .select-header-cancel {
    background: none;
    border: none;
    color: rgba(255,255,255,0.6);
    font-size: 13px;
    cursor: pointer;
    padding: 4px 0;
  }
  
  .select-header-count {
    font-size: 14px;
    font-weight: 600;
    color: #667eea;
  }
  
  .select-header-actions {
    display: flex;
    gap: 6px;
  }
  
  .select-header-all {
    padding: 5px 10px;
    border-radius: 6px;
    border: 1px solid rgba(102, 126, 234, 0.3);
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    font-size: 11px;
    cursor: pointer;
  }
  
  .select-header-delete {
    padding: 5px 10px;
    border-radius: 6px;
    border: 1px solid rgba(255, 107, 107, 0.4);
    background: rgba(255, 107, 107, 0.1);
    color: #ff6b6b;
    font-size: 11px;
    cursor: pointer;
  }
  
  .select-header-delete:disabled {
    opacity: 0.3;
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
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  
  headerLeft: {
    display: 'flex',
    gap: '10px',
  },
  
  backButton: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  
  homeButton: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  
  title: {
    margin: 0,
    fontSize: '1.5rem',
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
    background: 'rgba(167, 139, 250, 0.2)',
    border: '1px solid rgba(167, 139, 250, 0.4)',
    color: '#a78bfa',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
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
  },
  
  emptyText: {
    fontSize: '1.2rem',
    margin: '20px 0 10px',
  },
  
  emptySubtext: {
    fontSize: '0.9rem',
    opacity: 0.7,
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
    color: '#667eea',
    padding: '14px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    textAlign: 'center',
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
    textAlign: 'center',
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
    zIndex: 2000,
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
    fontSize: '1.1rem',
  },
  
  menuCancel: {
    color: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    marginTop: '4px',
    paddingTop: '14px',
  },
};

export default GalleryScreen;
