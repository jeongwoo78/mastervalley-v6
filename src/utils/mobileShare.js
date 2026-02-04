// Master Valley - 모바일 공유/저장 유틸리티
// Capacitor 네이티브 API + 웹 폴백 지원

import { Capacitor } from '@capacitor/core';

// 동적 import로 플러그인 로드 (설치 안됐을 때 에러 방지)
let Share = null;
let Filesystem = null;
let Directory = null;
let Media = null;

const loadPlugins = async () => {
  try {
    const shareModule = await import('@capacitor/share');
    Share = shareModule.Share;
  } catch (e) {
    console.log('Share plugin not available');
  }
  
  try {
    const fsModule = await import('@capacitor/filesystem');
    Filesystem = fsModule.Filesystem;
    Directory = fsModule.Directory;
  } catch (e) {
    console.log('Filesystem plugin not available');
  }
  
  try {
    const mediaModule = await import('@capacitor-community/media');
    Media = mediaModule.Media;
  } catch (e) {
    console.log('Media plugin not available');
  }
};

// 앱 시작 시 플러그인 로드 시도
loadPlugins();

/**
 * 플랫폼 감지
 */
export const isNativePlatform = () => {
  return Capacitor.isNativePlatform();
};

export const getPlatform = () => {
  return Capacitor.getPlatform(); // 'web', 'ios', 'android'
};

/**
 * 이미지 URL을 Base64로 변환
 */
const urlToBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // data:image/jpeg;base64,XXXXX 형태에서 base64 부분만 추출
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * 이미지에 워터마크 추가 (공유 전용)
 * @param {string} imageUrl - 원본 이미지 URL
 * @returns {Promise<string>} - 워터마크가 추가된 이미지의 data URL
 */
export const addWatermark = async (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Canvas 생성
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // 원본 이미지 그리기
      ctx.drawImage(img, 0, 0);
      
      // 워터마크 텍스트 설정 (심플)
      const text = 'Master Valley';
      const fontSize = Math.max(14, Math.floor(img.width / 30));
      const padding = Math.floor(fontSize * 0.8);
      
      ctx.font = `${fontSize}px Arial, sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      
      // 텍스트만 (배경 없이, 흰색 50% + 그림자)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillText(text, canvas.width - padding, canvas.height - padding);
      
      // data URL로 변환
      const watermarkedUrl = canvas.toDataURL('image/jpeg', 0.92);
      resolve(watermarkedUrl);
    };
    
    img.onerror = (err) => {
      console.error('워터마크 이미지 로드 실패:', err);
      // 실패 시 원본 반환
      resolve(imageUrl);
    };
    
    img.src = imageUrl;
  });
};

/**
 * 이미지 저장 (갤러리에 직접 저장)
 */
export const saveImage = async (imageUrl, fileName) => {
  const platform = getPlatform();
  
  try {
    if (platform === 'android' || platform === 'ios') {
      // 네이티브 앱: 갤러리에 저장
      if (!Media || !Filesystem) {
        await loadPlugins();
      }
      
      const base64Data = await urlToBase64(imageUrl);
      
      // Media 플러그인으로 갤러리에 직접 저장
      if (Media) {
        try {
          // 먼저 임시 파일로 저장
          const tempFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache
          });
          
          // 갤러리에 저장
          await Media.savePhoto({
            path: tempFile.uri,
            albumIdentifier: 'MasterValley'
          });
          
          // 임시 파일 삭제
          await Filesystem.deleteFile({
            path: fileName,
            directory: Directory.Cache
          });
          
          console.log('✅ 갤러리에 저장 완료');
          return { success: true, gallery: true };
        } catch (mediaError) {
          console.log('Media 플러그인 실패, Filesystem 폴백:', mediaError);
        }
      }
      
      // Media 없으면 Filesystem으로 폴백
      if (Filesystem) {
        const result = await Filesystem.writeFile({
          path: `MasterValley/${fileName}`,
          data: base64Data,
          directory: Directory.Documents,
          recursive: true
        });
        
        console.log('✅ Documents에 저장:', result.uri);
        return { success: true, path: result.uri };
      }
      
      // 둘 다 없으면 웹 방식
      return await saveImageWeb(imageUrl, fileName);
    } else {
      // 웹: 기존 방식
      return await saveImageWeb(imageUrl, fileName);
    }
  } catch (error) {
    console.error('이미지 저장 실패:', error);
    try {
      return await saveImageWeb(imageUrl, fileName);
    } catch (e) {
      return { success: false, error: error.message };
    }
  }
};

/**
 * 웹 브라우저 저장 (폴백)
 */
const saveImageWeb = async (imageUrl, fileName) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  
  // Blob URL 생성 후 다운로드 링크로 저장
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  
  // 정리
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);
  
  return { success: true, path: fileName };
};

/**
 * 이미지 공유
 */
export const shareImage = async (imageUrl, title, text) => {
  const platform = getPlatform();
  
  try {
    if (platform === 'android' || platform === 'ios') {
      // 네이티브 앱: Capacitor Share 사용
      if (!Share || !Filesystem) {
        await loadPlugins();
      }
      
      if (Share && Filesystem) {
        // 먼저 임시 파일로 저장
        const base64Data = await urlToBase64(imageUrl);
        const fileName = `mastervalley-share-${Date.now()}.jpg`;
        
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Cache // 임시 캐시에 저장
        });
        
        // 파일 URI로 공유
        await Share.share({
          title: title || 'Master Valley',
          text: text || '',
          url: savedFile.uri,
          dialogTitle: '작품 공유하기'
        });
        
        return { success: true };
      } else {
        // 플러그인 없으면 웹 방식 시도
        return await shareImageWeb(imageUrl, title, text);
      }
    } else {
      // 웹: Web Share API 사용
      return await shareImageWeb(imageUrl, title, text);
    }
  } catch (error) {
    // 사용자 취소는 에러로 처리하지 않음
    if (error.message?.includes('cancel') || error.message?.includes('abort')) {
      return { success: false, cancelled: true };
    }
    console.error('공유 실패:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 웹 브라우저 공유 (폴백)
 */
const shareImageWeb = async (imageUrl, title, text) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], `mastervalley-${Date.now()}.jpg`, { type: 'image/jpeg' });
    
    // 파일 공유 가능한지 확인
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: title || 'Master Valley',
        text: text || ''
      });
      return { success: true };
    } 
    // URL만 공유
    else if (navigator.share) {
      await navigator.share({
        title: title || 'Master Valley',
        text: text || '',
        url: window.location.href
      });
      return { success: true };
    } 
    // 클립보드 복사
    else {
      await navigator.clipboard.writeText(window.location.href);
      return { success: true, clipboard: true };
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      return { success: false, cancelled: true };
    }
    throw error;
  }
};

/**
 * 공유 가능 여부 확인
 */
export const canShare = async () => {
  const platform = getPlatform();
  
  if (platform === 'android' || platform === 'ios') {
    if (!Share) await loadPlugins();
    return !!Share;
  }
  
  return !!navigator.share || !!navigator.clipboard;
};

/**
 * 저장 가능 여부 확인
 */
export const canSave = async () => {
  const platform = getPlatform();
  
  if (platform === 'android' || platform === 'ios') {
    if (!Filesystem) await loadPlugins();
    return !!Filesystem;
  }
  
  return true; // 웹은 항상 가능
};
