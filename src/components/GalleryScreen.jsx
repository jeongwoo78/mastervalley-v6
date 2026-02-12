// GalleryScreen.jsx - 갤러리 컴포넌트 (IndexedDB 버전)
// 대용량 이미지 저장 + 그리드 UI + 저장/공유/삭제 기능
import React, { useState, useEffect } from 'react';
import { saveImage as saveToDevice, shareImage, addWatermark, isNativePlatform } from '../utils/mobileShare';

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
export const saveToGallery = async (imageUrl, styleName, categoryName = '') => {
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
      // console.log('⏭️ 이미 갤러리에 있음, 스킵:', styleName);
      return true; // 이미 저장됨으로 처리
    }
    
    const imageData = {
      id: `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      imageData: base64Image,
      styleName,
      categoryName,
      createdAt: new Date().toISOString()
    };
    
    const saved = await saveImage(imageData);
    if (saved) {
      // console.log('✅ 갤러리에 저장됨 (IndexedDB):', styleName);
    }
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
      const result = await saveToDevice(item.imageData, fileName);
      
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

  // 날짜 포맷
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
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
      {/* 헤더 */}
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
        {galleryItems.length > 0 && !selectMode && (
          <button style={styles.selectButton} onClick={() => setSelectMode(true)}>
            {t.select}
          </button>
        )}
      </div>

      {/* 선택 모드 툴바 */}
      {selectMode && (
        <div className="select-toolbar">
          <div className="select-toolbar-left">
            <button className="select-action-btn" onClick={selectAll}>{t.selectAll}</button>
            <button className="select-action-btn" onClick={deselectAll}>{t.deselectAll}</button>
          </div>
          <span className="select-count">
            {t.selectedCount.replace('{count}', selectedIds.size)}
          </span>
          <div className="select-toolbar-right">
            <button 
              className="select-delete-btn" 
              onClick={handleDeleteSelected}
              disabled={selectedIds.size === 0}
            >
              🗑️ {t.deleteSelected}
            </button>
            <button className="select-cancel-btn" onClick={exitSelectMode}>
              {t.cancel}
            </button>
          </div>
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
          {galleryItems.map((item) => (
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
                <span style={styles.styleName}>{item.styleName}</span>
                <span style={styles.date}>{formatDate(item.createdAt)}</span>
              </div>
            </div>
          ))}
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
              <h3 style={styles.modalTitle}>{selectedItem.styleName}</h3>
              <p style={styles.modalDate}>{formatDate(selectedItem.createdAt)}</p>
              {selectedItem.categoryName && (
                <p style={styles.modalCategory}>{selectedItem.categoryName}</p>
              )}
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
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .gallery-item {
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .gallery-item:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 25px rgba(167, 139, 250, 0.3);
  }
  
  .gallery-item.selected {
    outline: 2px solid #a78bfa;
    outline-offset: -2px;
    opacity: 0.85;
  }
  
  .select-checkbox {
    position: absolute;
    top: 8px;
    left: 8px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.7);
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: bold;
    color: white;
    z-index: 1;
  }
  
  .select-checkbox.checked {
    background: #a78bfa;
    border-color: #a78bfa;
  }
  
  .select-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 16px;
    background: rgba(167, 139, 250, 0.1);
    border-radius: 10px;
    margin-bottom: 12px;
  }
  
  .select-toolbar-left, .select-toolbar-right {
    display: flex;
    gap: 6px;
  }
  
  .select-count {
    font-size: 13px;
    color: #a78bfa;
    font-weight: 600;
  }
  
  .select-action-btn {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.08);
    color: #ddd;
    font-size: 12px;
    cursor: pointer;
  }
  
  .select-action-btn:hover {
    background: rgba(255,255,255,0.15);
  }
  
  .select-delete-btn {
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    background: #dc3545;
    color: white;
    font-size: 12px;
    cursor: pointer;
  }
  
  .select-delete-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  
  .select-cancel-btn {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.2);
    background: transparent;
    color: #999;
    font-size: 12px;
    cursor: pointer;
  }
  
  @media (min-width: 768px) {
    .gallery-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  @media (min-width: 1200px) {
    .gallery-grid {
      grid-template-columns: repeat(6, 1fr);
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
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
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
    margin: '0 0 8px',
    fontSize: '1.3rem',
    color: '#a78bfa',
  },
  
  modalDate: {
    margin: 0,
    fontSize: '0.9rem',
    opacity: 0.7,
  },
  
  modalCategory: {
    margin: '8px 0 0',
    fontSize: '0.85rem',
    color: '#67e8f9',
  },
  
  modalActions: {
    display: 'flex',
    gap: '10px',
    padding: '0 20px 20px',
  },
  
  saveShareButton: {
    flex: 1,
    background: '#121212',
    border: 'none',
    color: 'white',
    padding: '14px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
  },
  
  deleteButton: {
    flex: 1,
    background: 'rgba(255,100,100,0.2)',
    border: '1px solid rgba(255,100,100,0.5)',
    color: '#ff6b6b',
    padding: '14px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
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
    background: '#1a1a1a',
    borderRadius: '16px',
    padding: '8px',
    minWidth: '200px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
  },
  
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '16px 20px',
    border: 'none',
    background: 'transparent',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background 0.2s',
  },
  
  menuIcon: {
    marginRight: '12px',
    fontSize: '1.2rem',
  },
  
  menuCancel: {
    color: '#999',
    justifyContent: 'center',
    borderTop: '1px solid #eee',
    marginTop: '8px',
    paddingTop: '16px',
  },
};

export default GalleryScreen;
