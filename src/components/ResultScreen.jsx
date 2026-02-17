// PicoArt v75 - ResultScreen (모바일 공유/저장 지원)
// v75: Original 이미지 깜빡임 버그 수정 (originalPhotoUrl state 캐싱)
// v74: Capacitor Share/Filesystem 네이티브 API 지원
// v72: Original+1차교육 ↔ 결과+2차교육 스와이프
// v71: displayConfig.js 컨트롤 타워 사용
// v73: 통합 스타일 표시 함수 사용

import React, { useState, useEffect, useRef } from 'react';
import BeforeAfter from './BeforeAfter';
import MasterChat from './MasterChat';
// v77: i18n 구조에서 교육 데이터 가져오기
import { 
  getMovementsBasicInfo, 
  getMovementsLoadingEducation, 
  getMovementsResultEducation,
  getMastersBasicInfo,
  getMastersLoadingEducation,
  getMastersResultEducation,
  getOrientalBasicInfo,
  getOrientalLoadingEducation,
  getOrientalResultEducation,
  getOneclickMovementsPrimary,
  getOneclickMovementsSecondary,
  getOneclickMastersPrimary,
  getOneclickMastersSecondary,
  getOneclickOrientalPrimary,
  getOneclickOrientalSecondary
} from '../i18n';
// 단독변환용 교육자료
import { educationContent } from '../data/educationContent';
import { saveToGallery } from './GalleryScreen';
import { processStyleTransfer } from '../utils/styleTransferAPI';
// v73: displayConfig 통합 함수
import { normalizeKey, getDisplayInfo, getArtistName, getMovementDisplayInfo, getOrientalDisplayInfo, getMasterInfo, getStyleIcon, getStyleTitle, getStyleSubtitle, getStyleSubtitles } from '../utils/displayConfig';
import { getEducationKey, getEducationContent, getMasterEducationKey } from '../utils/educationMatcher';
// v74: 모바일 공유/저장 유틸리티
import { saveImage, shareImage, isNativePlatform, addWatermark } from '../utils/mobileShare';


const ResultScreen = ({ 
  originalPhoto, 
  resultImage, 
  selectedStyle, 
  aiSelectedArtist,
  aiSelectedWork,
  fullTransformResults,
  onReset,
  onGallery,
  onRetrySuccess,
  masterChatData: appMasterChatData,
  onMasterChatDataChange,
  currentMasterIndex: appCurrentIndex,
  onMasterIndexChange,
  masterResultImages: appMasterResultImages,
  onMasterResultImagesChange,
  retransformingMasters: appRetransformingMasters,
  onRetransformingMastersChange,
  lang = 'en'
}) => {

  // i18n texts
  const texts = {
    ko: {
      save: '저장',
      share: '공유',
      gallery: '갤러리',
      newPhoto: '새 사진',
      modify: '수정',
      retry: '다시 시도',
      retryAll: '전체 다시 시도',
      retrying: '다시 시도 중...',
      conversionFailed: '변환에 실패하였습니다.',
      aiRetrying: '🎨 AI가 다시 변환 중입니다...',
      noImageToSave: '저장할 이미지가 없습니다.',
      savedToGallery: '✅ 갤러리에 저장되었습니다!',
      saved: '✅ 저장되었습니다!',
      filesLocation: '📁 파일 앱 → Documents → MasterValley',
      saveFailed: '저장에 실패했습니다',
      saveFailedRetry: '저장에 실패했습니다. 다시 시도해주세요.',
      noImageToShare: '공유할 이미지가 없습니다.',
      linkCopied: '링크가 클립보드에 복사되었습니다!',
      retrySuccess: '다시 시도 성공!',
      cancel: '취소',
      retryFailed: '다시 시도에 실패했습니다',
      saveToDevice: '저장하기',
      shareArt: '공유하기',
      original: '원본',
      tapToSwipe: '← 스와이프하여 결과 보기 →'
    },
    en: {
      save: 'Save',
      share: 'Share',
      gallery: 'Gallery',
      newPhoto: 'New',
      modify: 'Modify',
      retry: 'Retry',
      retryAll: 'Retry All',
      retrying: 'Retrying...',
      conversionFailed: 'Conversion failed.',
      aiRetrying: '🎨 AI is retrying...',
      noImageToSave: 'No image to save.',
      savedToGallery: '✅ Saved to Gallery!',
      saved: '✅ Saved!',
      filesLocation: '📁 Files app → Documents → MasterValley',
      saveFailed: 'Save failed',
      saveFailedRetry: 'Save failed. Please try again.',
      noImageToShare: 'No image to share.',
      linkCopied: 'Link copied to clipboard!',
      retrySuccess: 'Retry successful!',
      cancel: 'Cancel',
      retryFailed: 'Retry failed',
      saveToDevice: 'Save',
      shareArt: 'Share',
      original: 'Original',
      tapToSwipe: '← Swipe to view results →'
    }
  };
  const t = texts[lang] || texts.en;
  
  // v77: i18n 교육 데이터 (lang에 따라 동적 로드)
  const movementsBasicInfo = getMovementsBasicInfo(lang);
  const movementsOverview = getMovementsLoadingEducation(lang);  // 로딩 교육 = Overview
  const movementsEducation = getMovementsResultEducation(lang);  // 결과 교육
  const mastersBasicInfo = getMastersBasicInfo(lang);
  const mastersLoadingEducation = getMastersLoadingEducation(lang);
  const mastersResultEducation = getMastersResultEducation(lang);
  const mastersEducation = getMastersResultEducation(lang);  // 기존 코드 호환용 alias
  const orientalBasicInfo = getOrientalBasicInfo(lang);
  const orientalOverview = getOrientalLoadingEducation(lang);  // 로딩 교육 = Overview
  const orientalEducation = getOrientalResultEducation(lang);  // 결과 교육
  
  // v77: 원클릭 교육 데이터 (i18n)
  const oneclickMovementsPrimary = getOneclickMovementsPrimary(lang);
  const oneclickMovementsSecondary = getOneclickMovementsSecondary(lang);
  const oneclickMastersPrimary = getOneclickMastersPrimary(lang);
  const oneclickMastersSecondary = getOneclickMastersSecondary(lang);
  const oneclickOrientalPrimary = getOneclickOrientalPrimary(lang);
  const oneclickOrientalSecondary = getOneclickOrientalSecondary(lang);
  
  // ========== 원클릭 결과 처리 ==========
  const isFullTransform = fullTransformResults && fullTransformResults.length > 0;
  
  // currentIndex를 App.jsx에서 관리 (갤러리 이동해도 유지)
  const currentIndex = appCurrentIndex || 0;
  const setCurrentIndex = (val) => {
    if (onMasterIndexChange) {
      onMasterIndexChange(typeof val === 'function' ? val(currentIndex) : val);
    }
  };
  
  // ========== 스와이프 ==========
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  
  // ========== Save/Share 메뉴 ==========
  const [showSaveShareMenu, setShowSaveShareMenu] = useState(false);
  
  // v75: Original 이미지 URL 캐싱 (깜빡임 방지)
  const [originalPhotoUrl, setOriginalPhotoUrl] = useState(null);
  
  useEffect(() => {
    if (originalPhoto) {
      const url = URL.createObjectURL(originalPhoto);
      setOriginalPhotoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [originalPhoto]);
  
  // v72: viewIndex - Original/결과 스와이프용 (-1: Original, 0~n: 결과)
  // 단독 변환: 항상 0 (결과만 표시, 목업 준수)
  // 원클릭: currentIndex와 동기화
  const [viewIndex, setViewIndex] = useState(isFullTransform ? (appCurrentIndex || 0) : 0);
  
  // viewIndex가 결과 범위를 벗어나지 않도록 보정 (-1은 Original이므로 허용)
  const maxViewIndex = isFullTransform 
    ? fullTransformResults.length - 1 
    : 0;
  const safeViewIndex = viewIndex === -1 
    ? -1 
    : Math.max(0, Math.min(viewIndex, maxViewIndex));
  
  // safeViewIndex와 viewIndex가 다르면 동기화
  React.useEffect(() => {
    if (viewIndex !== safeViewIndex) {
      setViewIndex(safeViewIndex);
    }
  }, [viewIndex, safeViewIndex]);
  
  // v72: 1차 교육자료 (Original 화면용)
  const getPrimaryEducation = () => {
    const category = selectedStyle?.category;
    
    // 원클릭: 카테고리 전체 소개
    if (isFullTransform) {
      if (category === 'movements') {
        return { ...oneclickMovementsPrimary, title: '2,500년 서양미술사 관통' };
      } else if (category === 'masters') {
        return oneclickMastersPrimary;
      } else if (category === 'oriental') {
        return oneclickOrientalPrimary;
      }
    }
    
    // 단독변환: 해당 스타일의 1차 교육자료
    if (!isFullTransform && selectedStyle?.id) {
      const styleId = selectedStyle.id;
      if (category === 'movements' && educationContent.movements[styleId]) {
        return educationContent.movements[styleId];
      } else if (category === 'masters' && educationContent.masters[styleId]) {
        return educationContent.masters[styleId];
      } else if (category === 'oriental' && educationContent.oriental[styleId]) {
        return educationContent.oriental[styleId];
      }
    }
    
    return null;
  };
  
  // ========== 재시도 관련 ==========
  const [results, setResults] = useState(fullTransformResults || []);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryProgress, setRetryProgress] = useState('');
  
  // fullTransformResults가 변경되면 results도 업데이트
  useEffect(() => {
    if (fullTransformResults) {
      setResults(fullTransformResults);
    }
  }, [fullTransformResults]);
  
  // 실패한 결과 개수
  const failedCount = results.filter(r => !r.success).length;
  
  // currentIndex 범위 체크 (results 범위 내로 보정)
  const safeCurrentIndex = isFullTransform 
    ? Math.max(0, Math.min(currentIndex, results.length - 1))
    : 0;
  
  // 현재 보여줄 결과
  const currentResult = isFullTransform ? results[safeCurrentIndex] : null;
  // 단독변환: 재시도 성공 시 singleRetryResult 사용
  const [singleRetryResultState, setSingleRetryResultState] = useState(null);
  const displayImage = isFullTransform 
    ? currentResult?.resultUrl 
    : (singleRetryResultState?.resultUrl || resultImage);
  const displayArtist = isFullTransform 
    ? currentResult?.aiSelectedArtist 
    : (singleRetryResultState?.aiSelectedArtist || aiSelectedArtist);
  const displayWork = isFullTransform 
    ? currentResult?.selected_work 
    : (singleRetryResultState?.selected_work || aiSelectedWork);
  const displayCategory = isFullTransform ? currentResult?.style?.category : selectedStyle?.category;
  
  // ========== State ==========
  const [showInfo, setShowInfo] = useState(true);
  const [educationText, setEducationText] = useState('');
  const [isLoadingEducation, setIsLoadingEducation] = useState(true);
  const [savedToGallery, setSavedToGallery] = useState(false);
  const hasSavedRef = useRef(false);

  // ========== 거장 AI 대화 관련 State (v68) ==========
  // Modify 상태 (App.jsx에서 관리, 객체로 안전하게)
  const retransformingMasters = appRetransformingMasters || {};
  
  // 거장 변환 시작
  const startRetransforming = (masterKey) => {
    if (onRetransformingMastersChange) {
      onRetransformingMastersChange(prev => ({ ...prev, [masterKey]: true }));
    }
  };
  
  // 거장 변환 완료
  const stopRetransforming = (masterKey) => {
    if (onRetransformingMastersChange) {
      onRetransformingMastersChange(prev => {
        const newState = { ...prev };
        delete newState[masterKey];
        return newState;
      });
    }
  };
  
  // 변환 중 여부 (갤러리 버튼 비활성화용)
  const isAnyMasterRetransforming = Object.keys(retransformingMasters).length > 0;
  
  // 거장별 Modify 이미지 (App.jsx에서 관리, 갤러리 이동해도 유지)
  const masterResultImages = appMasterResultImages || {};
  const setMasterResultImages = (val) => {
    if (onMasterResultImagesChange) {
      onMasterResultImagesChange(typeof val === 'function' ? val(masterResultImages) : val);
    }
  };
  
  // 거장별 대화 데이터 (App.jsx에서 관리, 갤러리 이동해도 유지)
  const masterChatData = appMasterChatData || {};
  
  // 거장 키 추출 (displayArtist에서) - 영문/한글 모두 지원
  const getMasterKey = (artistName) => {
    if (!artistName) return null;
    const name = artistName.toUpperCase();
    if (name.includes('VAN GOGH') || name.includes('GOGH') || name.includes('고흐')) return 'VAN GOGH';
    if (name.includes('KLIMT') || name.includes('클림트')) return 'KLIMT';
    if (name.includes('MUNCH') || name.includes('뭉크')) return 'MUNCH';
    if (name.includes('CHAGALL') || name.includes('샤갈')) return 'CHAGALL';
    if (name.includes('PICASSO') || name.includes('피카소')) return 'PICASSO';
    if (name.includes('MATISSE') || name.includes('마티스')) return 'MATISSE';
    if (name.includes('FRIDA') || name.includes('KAHLO') || name.includes('프리다') || name.includes('칼로')) return 'FRIDA';
    if (name.includes('LICHTENSTEIN') || name.includes('리히텐')) return 'LICHTENSTEIN';
    return null;
  };
  
  const currentMasterKey = displayCategory === 'masters' ? getMasterKey(displayArtist) : null;
  
  // 현재 거장이 변환 중인지 (스피너 표시용)
  const isCurrentMasterWorking = currentMasterKey && retransformingMasters[currentMasterKey];
  
  // 현재 거장의 Modify 이미지
  const currentMasterResultImage = currentMasterKey ? masterResultImages[currentMasterKey] : null;
  
  // 현재 표시할 결과 이미지 (거장별 Modify 결과 우선)
  const finalDisplayImage = currentMasterResultImage || displayImage;
  
  // 거장별 대화 데이터 업데이트
  const updateMasterChatData = (masterKey, chatData) => {
    if (onMasterChatDataChange) {
      onMasterChatDataChange({
        ...masterChatData,
        [masterKey]: chatData
      });
    }
  };

  // 거장 AI Modify 핸들러 (다중 변환 지원)
  const handleMasterRetransform = async (correctionPrompt, masterKey) => {
    console.log('🔴 handleMasterRetransform 호출됨', { correctionPrompt, masterKey });
    
    // 이미 이 거장이 변환 중이면 차단
    if (!correctionPrompt || !masterKey || retransformingMasters[masterKey]) return;
    
    console.log('🔴 Modify 시작!', masterKey);
    startRetransforming(masterKey);  // 이 거장 변환 시작
    
    let success = false;
    
    try {
      // 원클릭 모드: currentResult의 style 사용, 단독: selectedStyle 사용
      const styleToUse = isFullTransform ? currentResult?.style : selectedStyle;
      
      // v69: 점진적 수정 - Original이 아닌 현재 결과물 기반으로 Modify
      // 이미 Modify한 결과가 있으면 그것을, 없으면 1차 결과를 사용
      const currentImageUrl = masterResultImages[masterKey] || displayImage;
      
      // URL을 Blob으로 변환 (processStyleTransfer는 File/Blob을 기대)
      let imageToModify;
      if (currentImageUrl && typeof currentImageUrl === 'string' && 
          (currentImageUrl.startsWith('http') || currentImageUrl.startsWith('blob:'))) {
        // URL인 경우 fetch해서 Blob으로 변환
        const response = await fetch(currentImageUrl);
        const blob = await response.blob();
        imageToModify = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      } else {
        // 이미 File/Blob인 경우 그대로 사용
        imageToModify = currentImageUrl || originalPhoto;
      }
      
      // 기존 FLUX API 호출 (보정 프롬프트 추가)
      const result = await processStyleTransfer(
        imageToModify,
        styleToUse,
        correctionPrompt  // 보정 프롬프트 전달
      );
      
      if (result.success && result.resultUrl) {
        success = true;
        
        // 거장별로 Modify 이미지 저장
        setMasterResultImages(prev => ({
          ...prev,
          [masterKey]: result.resultUrl
        }));
        
        // 갤러리에 자동 저장
        const category = styleToUse?.category;
        const rawName = displayArtist || styleToUse?.name || 'Converted Image';
        await saveToGallery(result.resultUrl, {
          category,
          artistName: rawName,
          movementName: '',
          workName: displayWork || null,
          styleId: styleToUse?.id || '',
          isRetransform: true
        });
      }
    } catch (error) {
      console.error('Master retransform error:', error);
    }
    
    // 완료 플래그 먼저 설정 (MasterChat이 메시지 추가하도록)
    if (success) {
      // v70: 2초 딜레이 추가 (거장이 정성들여 수정하는 느낌)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateMasterChatData(masterKey, {
        ...masterChatData[masterKey],
        retransformCompleted: true  // 완료 플래그
      });
    }
    
    // 그 다음 버튼 활성화
    stopRetransforming(masterKey);
  };


  // ========== 갤러리 자동 저장 ==========
  useEffect(() => {
    // 원클릭은 별도 저장 로직
    if (isFullTransform) {
      // 모든 Save result
      const saveAllResults = async () => {
        for (const result of fullTransformResults) {
          if (result.success && result.resultUrl) {
            const category = result.style?.category || selectedStyle?.category;
            const rawName = result.aiSelectedArtist || result.style?.name || 'Converted Image';
            const workName = result.selected_work || null;
            await saveToGallery(result.resultUrl, {
              category,
              artistName: rawName,
              movementName: result.style?.name || selectedStyle?.name || '',
              workName,
              styleId: result.style?.id || selectedStyle?.id || '',
              isRetransform: false
            });
          }
        }
        // console.log('✅ 원클릭 결과 모두 갤러리에 저장됨');
      };
      if (!hasSavedRef.current) {
        hasSavedRef.current = true;
        saveAllResults();
      }
      return;
    }
    
    // 단일 변환: 기존 로직
    if (hasSavedRef.current || !resultImage) return;
    
    const saveToGalleryAsync = async () => {
      // 스타일 정보 (i18n 표시용 원본 키 저장)
      const category = selectedStyle?.category;
      const rawName = aiSelectedArtist || selectedStyle?.name || 'Converted Image';
      const workName = aiSelectedWork || null;
      
      // 갤러리에 저장 (async)
      const saved = await saveToGallery(resultImage, {
        category,
        artistName: rawName,
        movementName: selectedStyle?.name || '',
        workName,
        styleId: selectedStyle?.id || '',
        isRetransform: false
      });
      if (saved) {
        hasSavedRef.current = true;
        setSavedToGallery(true);
        // console.log('✅ 갤러리에 자동 저장 완료 (IndexedDB):', styleName);
      }
    };
    
    saveToGalleryAsync();
  }, [resultImage, selectedStyle, aiSelectedArtist, fullTransformResults, isFullTransform]);


  // ========== 다시 시도 함수 ==========
  const handleRetry = async () => {
    if (!originalPhoto || isRetrying) return;
    
    const failedResults = results.filter(r => !r.success);
    if (failedResults.length === 0) return;
    
    setIsRetrying(true);
    // console.log(`🔄 다시 시도 시작: ${failedResults.length}개 실패한 변환`);
    
    let successCount = 0;
    let updatedResults = [...results];  // 업데이트된 결과 추적용
    
    for (let i = 0; i < failedResults.length; i++) {
      const failed = failedResults[i];
      const failedIndex = results.findIndex(r => r.style?.id === failed.style?.id);
      
      setRetryProgress('Retrying...');
      
      try {
        const result = await processStyleTransfer(
          originalPhoto,
          failed.style,
          null,
          () => {}  // 진행 콜백 불필요
        );
        
        if (result.success) {
          // 성공하면 해당 인덱스 결과 업데이트
          const newResult = {
            style: failed.style,
            resultUrl: result.resultUrl,
            aiSelectedArtist: result.aiSelectedArtist,
            selected_work: result.selected_work,
            success: true
          };
          
          setResults(prev => {
            const newResults = [...prev];
            newResults[failedIndex] = newResult;
            return newResults;
          });
          
          updatedResults[failedIndex] = newResult;  // 로컬 추적용도 업데이트
          successCount++;
          // console.log(`✅ 다시 시도 성공: ${failed.style?.name}`);
          
          // 갤러리에 저장 - i18n 원본 키 저장
          const category = failed.style?.category;
          const rawName = result.aiSelectedArtist || failed.style?.name || 'Converted Image';
          const workName = result.selected_work || null;
          await saveToGallery(result.resultUrl, {
            category,
            artistName: rawName,
            movementName: failed.style?.name || '',
            workName,
            styleId: failed.style?.id || '',
            isRetransform: false
          });
        } else {
          // console.log(`❌ 다시 시도 실패: ${failed.style?.name} - ${result.error}`);
        }
      } catch (error) {
        console.error(`❌ 다시 시도 에러: ${failed.style?.name}`, error);
      }
    }
    
    setIsRetrying(false);
    setRetryProgress('');
    
    if (successCount > 0) {
      // App.jsx 상태도 업데이트 (갤러리 이동 후에도 유지)
      if (onRetrySuccess) {
        onRetrySuccess({ isFullTransform: true, results: updatedResults });
      }
      alert(t.retrySuccess);
    }
    // 실패 시 alert 없이 자연스럽게 UI로 복귀
  };

  // ========== 단독변환 다시 시도 함수 ==========
  const handleSingleModeRetry = async () => {
    if (!originalPhoto || !selectedStyle || isRetrying) return;
    
    setIsRetrying(true);
    setRetryProgress(`${selectedStyle.name} Retrying...`);
    // console.log(`🔄 단독변환 다시 시도: ${selectedStyle.name}`);
    
    try {
      const result = await processStyleTransfer(
        originalPhoto,
        selectedStyle,
        null,
        (progress) => setRetryProgress(`${selectedStyle.name}: ${progress}`)
      );
      
      if (result.success) {
        // console.log(`✅ 단독변환 다시 시도 성공: ${selectedStyle.name}`);
        setSingleRetryResultState(result);
        
        // App.jsx 상태도 업데이트 (갤러리 이동 후에도 유지)
        if (onRetrySuccess) {
          onRetrySuccess(result);
        }
        
        // 갤러리에 저장 - i18n 원본 키 저장
        const category = selectedStyle.category;
        const rawName = result.aiSelectedArtist || selectedStyle.name || 'Converted Image';
        const workName = result.selected_work || null;
        await saveToGallery(result.resultUrl, {
          category,
          artistName: rawName,
          movementName: selectedStyle.name || '',
          workName,
          styleId: selectedStyle.id || '',
          isRetransform: false
        });
        
        alert(t.retrySuccess);
      } else {
        // console.log(`❌ 단독변환 다시 시도 실패: ${selectedStyle.name} - ${result.error}`);
        // 실패 시 alert 없이 자연스럽게 UI로 복귀
      }
    } catch (error) {
      console.error(`❌ 단독변환 다시 시도 에러:`, error);
      // 에러 시에도 alert 없이 UI로 복귀
    }
    
    setIsRetrying(false);
    setRetryProgress('');
  };


  // ========== Effects ==========
  // aiSelectedArtist가 변경될 때마다 2차 교육 재생성
  // 원클릭: currentIndex 변경 또는 currentResult 업데이트 시 재생성
  useEffect(() => {
    // console.log('🎨 ResultScreen mounted or aiSelectedArtist changed');
    generate2ndEducation();
  }, [aiSelectedArtist, currentIndex, currentResult?.aiSelectedArtist, currentResult?.selected_work]);

  // 원클릭: 화면 이동 시 현재 결과 로그
  useEffect(() => {
    console.log('🔍 [NavLog Debug] isFullTransform:', isFullTransform, 'currentResult:', !!currentResult);
    
    if (isFullTransform && currentResult) {
      // v68: 화면 전환 시 콘솔 네비 로그 (그룹핑 + 상세정보)
      const category = currentResult.style?.category;
      const styleName = currentResult.style?.name;
      const artist = currentResult.aiSelectedArtist;
      const work = currentResult.selected_work;
      
      console.log('');
      console.log(`📍 [${currentIndex + 1}/${results.length}] ─────────────────────`);
      
      if (category === 'masters') {
        const masterInfo = getMasterInfo(artist);
        console.log(`   🎨 ${masterInfo.fullName}`);
        console.log(`   📌 ${masterInfo.movement}`);
      } else if (category === 'movements') {
        const movementInfo = getMovementDisplayInfo(styleName, artist);
        console.log(`   🎨 ${movementInfo.title}`);
        console.log(`   👤 ${movementInfo.subtitle}`);
      } else if (category === 'oriental') {
        const orientalInfo = getOrientalDisplayInfo(artist);
        console.log(`   🎨 ${orientalInfo.title}`);
        console.log(`   📌 ${orientalInfo.subtitle}`);
      } else {
        console.log(`   🎨 ${styleName}`);
        console.log(`   👤 ${artist || '?'}`);
      }
      
      if (work) {
        console.log(`   🖼️ ${work}`);
      }
      
      if (currentResult.success) {
        console.log(`   ✅ 성공`);
      } else {
        console.log(`   ❌ 에러: ${currentResult.error}`);
      }
    }
  }, [currentIndex, isFullTransform, currentResult, results.length]);


  // ========== 원클릭용 키 매칭 (v51: educationMatcher.js 사용) ==========
  // 기존 복잡한 로직을 educationMatcher.js로 분리함


  // ========== 2차 교육 로드 (v51: 새로운 매칭 로직) ==========
  const generate2ndEducation = () => {
    // console.log('');
    // console.log('🔥🔥🔥 LOAD EDUCATION START (v51) 🔥🔥🔥');
    // console.log('   - category:', selectedStyle?.category);
    // console.log('   - isFullTransform:', isFullTransform);
    // console.log('   - displayArtist:', displayArtist);
    // console.log('   - displayWork:', displayWork);
    // console.log('');
    
    setIsLoadingEducation(true);
    
    let content = null;
    
    // ========== 원클릭: 새로운 매칭 로직 사용 ==========
    if (isFullTransform) {
      // console.log('📜 ONECLICK MODE - using educationMatcher.js');
      
      // currentResult에서 정보 추출
      const category = currentResult?.style?.category || displayCategory;
      const artist = currentResult?.aiSelectedArtist || displayArtist;
      const work = currentResult?.selected_work || displayWork;
      
      // console.log('   - category:', category);
      // console.log('   - artist:', artist);
      // console.log('   - work:', work);
      
      // 새로운 매칭 함수 사용
      const key = getEducationKey(category, artist, work);
      // console.log('   - matched key:', key);
      
      if (key) {
        // 거장 카테고리: 작품별 교육자료 우선 시도 (mastersResultEducation)
        // → fallback: 원클릭 거장 일반 교육 (oneclickMastersSecondary)
        if (category === 'masters' && mastersResultEducation[key]) {
          const edu = mastersResultEducation[key];
          content = edu.content || edu.description || edu.desc || null;
        }
        
        // 작품별 매칭 실패 시 원래 교육자료 데이터 사용
        if (!content) {
          const educationData = {
            masters: oneclickMastersSecondary,
            movements: oneclickMovementsSecondary,
            oriental: oneclickOrientalSecondary
          };
          content = getEducationContent(category, key, educationData);
        }
        
        if (content) {
          // console.log('✅ Found oneclick education for:', key);
          // console.log('   - content preview:', content.substring(0, 50) + '...');
        } else {
          // console.log('❌ No education data found for key:', key);
        }
      } else {
        // console.log('❌ No key matched');
      }
    }
    
    // ========== 단일 변환: 기존 교육자료 사용 ==========
    if (!content && !isFullTransform) {
      const category = selectedStyle.category;
      
      // 1. 동양화 (oriental)
      if (category === 'oriental') {
        // console.log('📜 Loading oriental education...');
        content = getOrientalEducation();
      }
      
      // 2. 미술사조 (movements)
      else if (category !== 'masters') {
        // console.log('📜 Loading movements education...');
        content = getMovementsEducation();
      }
      
      // 3. 거장 (masters)
      else {
        // console.log('📜 Loading masters education...');
        content = getMastersEducation();
      }
    }
    
    // 결과 설정
    if (content) {
      // console.log('✅ Education loaded successfully!');
      // console.log('   Content type:', typeof content);
      // console.log('   Content length:', content.length);
      // console.log('   Preview:', content.substring(0, 80) + '...');
      // console.log('   Setting educationText to:', content);
      setEducationText(content);
      // console.log('   ✅ setEducationText called');
    } else {
      console.error('❌ No education content found!');
      const fallback = getFallbackMessage();
      // console.log('   Using fallback:', fallback);
      setEducationText(fallback);
    }
    
    // console.log('   Setting isLoadingEducation to false');
    setIsLoadingEducation(false);
    // console.log('🏁 Loading complete');
    // console.log('');
  };


  // ========== 미술사조 교육 콘텐츠 (v49 - 동양화 방식) ==========
  const getMovementsEducation = (overrideArtist = null) => {
    const category = selectedStyle.category;
    const artistSource = overrideArtist || aiSelectedArtist;
    
    // console.log('');
    // console.log('========================================');
    // console.log('🎨 MOVEMENTS EDUCATION (v52):');
    // console.log('========================================');
    // console.log('   - category:', category);
    // console.log('   - artistSource:', artistSource);
    // console.log('========================================');
    // console.log('');
    
    // 화가 이름 정규화
    let artistName = (artistSource || '')
      .replace(/\s*\([^)]*\)/g, '')  // 괄호 제거
      .trim();
    
    if (!artistName) {
      // console.log('⚠️ No artist name provided');
      return null;
    }
    
    // 여러 매칭 패턴 시도
    const words = artistName.split(/\s+/);
    const patterns = [];
    
    // 특수문자 변환 함수 (é → e 등)
    const normalize = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // 패턴 1: 전체 이름 (소문자, 공백 제거)
    patterns.push(artistName.toLowerCase().replace(/\s+/g, ''));
    
    // 패턴 2: 전체 이름 (소문자, 하이픈)
    patterns.push(artistName.toLowerCase().replace(/\s+/g, '-'));
    
    // 패턴 3: 마지막 단어 (성)
    if (words.length > 1) {
      patterns.push(words[words.length - 1].toLowerCase());
    }
    
    // 패턴 4: 첫 단어 (이름)
    patterns.push(words[0].toLowerCase());
    
    // 패턴 5: 전체 소문자
    patterns.push(artistName.toLowerCase());
    
    // 패턴 6-10: 특수문자 제거 버전 (é → e 등)
    patterns.push(normalize(artistName.toLowerCase().replace(/\s+/g, '')));
    patterns.push(normalize(artistName.toLowerCase().replace(/\s+/g, '-')));
    if (words.length > 1) {
      patterns.push(normalize(words[words.length - 1].toLowerCase()));
    }
    patterns.push(normalize(words[0].toLowerCase()));
    patterns.push(normalize(artistName.toLowerCase()));
    
    // console.log('   - trying patterns:', patterns);
    // console.log('');
    
    // 각 패턴으로 매칭 시도
    let education = null;
    let matchedPattern = null;
    
    for (const pattern of patterns) {
      if (movementsEducation[pattern]) {
        education = movementsEducation[pattern];
        matchedPattern = pattern;
        break;
      }
    }
    
    if (education && education.description) {
      // console.log('✅ Found artist education with pattern:', matchedPattern);
      // console.log('✅ Original name:', artistName);
      // console.log('✅ Matched key:', matchedPattern);
      // console.log('✅ description length:', education.description.length);
      // console.log('========================================');
      // console.log('');
      return education.description;
    }
    
    // console.log('⚠️ No artist education found for:', artistName);
    // console.log('⚠️ Tried patterns:', patterns);
    // console.log('⚠️ Available keys (first 15):', Object.keys(movementsEducation).slice(0, 15));
    // console.log('========================================');
    // console.log('');
    
    // Fallback: 1차 교육 사용
    if (movementsOverview && movementsOverview[category]) {
      // console.log('📚 Using 1st education as fallback for category:', category);
      return movementsOverview[category].description || movementsOverview[category].desc;
    }
    
    return null;
  };


  // ========== 거장 교육 콘텐츠 (v62 - 화풍별 2차 교육) ==========
  const getMastersEducation = (overrideArtist = null) => {
    const artistSource = overrideArtist || aiSelectedArtist || selectedStyle.name || '';
    const artist = artistSource.replace(/\s*\([^)]*\)/g, '').trim();
    
    // console.log('');
    // console.log('========================================');
    // console.log('🎨 MASTERS EDUCATION (v62 화풍별):');
    // console.log('========================================');
    // console.log('   - artistSource:', artistSource);
    // console.log('   - normalized artist:', artist);
    // console.log('   - selectedStyle.id:', selectedStyle?.id);
    // console.log('========================================');
    // console.log('');
    
    // ========== 2차 교육자료 (작품별 → 거장 fallback) ==========
    // selectedStyle.id에서 masterId 추출
    const styleId = selectedStyle?.id || '';
    const masterId = styleId.replace('-master', ''); // 'vangogh-master' → 'vangogh'
    
    // 1단계: 작품별 교육자료 시도 (educationMatcher의 masterData.works 활용)
    if (masterId && aiSelectedWork) {
      const workSpecificKey = getMasterEducationKey(masterId, aiSelectedWork);
      if (workSpecificKey && mastersEducation[workSpecificKey]) {
        const education = mastersEducation[workSpecificKey];
        return education.description || education.desc;
      }
    }
    
    // 2단계: 거장 레벨 fallback
    if (masterId && mastersEducation[masterId]) {
      const education = mastersEducation[masterId];
      return education.description || education.desc;
    }
    
    // ========== 1차 교육자료 (거장 개요) ==========
    // 한글 이름 → mastersEducation 키 매핑
    const artistKeyMap = {
      '빈센트 반 고흐': 'vangogh-master',
      '반 고흐': 'vangogh-master',
      'van gogh': 'vangogh-master',
      'vincent van gogh': 'vangogh-master',
      '구스타프 클림트': 'klimt-master',
      '클림트': 'klimt-master',
      'klimt': 'klimt-master',
      'gustav klimt': 'klimt-master',
      '에드바르 뭉크': 'munch-master',
      '뭉크': 'munch-master',
      'munch': 'munch-master',
      'edvard munch': 'munch-master',
      '앙리 마티스': 'matisse-master',
      '마티스': 'matisse-master',
      'matisse': 'matisse-master',
      'henri matisse': 'matisse-master',
      '마르크 샤갈': 'chagall-master',
      '샤갈': 'chagall-master',
      'chagall': 'chagall-master',
      'marc chagall': 'chagall-master',
      '파블로 피카소': 'picasso-master',
      '피카소': 'picasso-master',
      'picasso': 'picasso-master',
      'pablo picasso': 'picasso-master',
      '프리다 칼로': 'frida-master',
      '프리다': 'frida-master',
      'frida': 'frida-master',
      'frida kahlo': 'frida-master',
      '로이 리히텐슈타인': 'lichtenstein-master',
      '리히텐슈타인': 'lichtenstein-master',
      'lichtenstein': 'lichtenstein-master',
      'roy lichtenstein': 'lichtenstein-master'
    };
    
    // 키 매칭 시도
    const normalizedArtist = artist.toLowerCase();
    let masterKey = artistKeyMap[artist] || artistKeyMap[normalizedArtist];
    
    // 부분 매칭 시도
    if (!masterKey) {
      for (const [name, key] of Object.entries(artistKeyMap)) {
        if (normalizedArtist.includes(name.toLowerCase()) || name.toLowerCase().includes(normalizedArtist)) {
          masterKey = key;
          break;
        }
      }
    }
    
    // console.log('   - masterKey:', masterKey);
    
    if (masterKey && mastersEducation[masterKey]) {
      const education = mastersEducation[masterKey];
      // console.log('✅ Found 1st education (거장 개요)!');
      // console.log('   - title:', education.title || education.name);
      // console.log('   - desc length:', education.description?.length || education.desc?.length);
      return education.description || education.desc;
    }
    
    // console.log('⚠️ Masters education not found for:', artist);
    // console.log('');
    
    return null;
  };



  // ========== 갤러리용 이름 포맷: i18n으로 이동 (displayConfig.js 활용) ==========
  // formatGalleryName, formatWorkName 제거됨 — saveToGallery에 원본 키 저장 → GalleryScreen에서 lang 기반 표시

  // 작품 제작연도 매핑
  const workYearMap = {
    // 반 고흐
    'The Starry Night': 1889,
    'Starry Night': 1889,
    'the starry night': 1889,
    'Sunflowers': 1888,
    'sunflowers': 1888,
    'Self-Portrait': 1889,
    'self-portrait': 1889,
    '별이 빛나는 밤': 1889,
    '해바라기': 1888,
    '자화상': 1889,
    // 클림트
    'The Kiss': 1908,
    'the kiss': 1908,
    'Judith I': 1901,
    'judith i': 1901,
    'Judith': 1901,
    'judith': 1901,
    'The Tree of Life': 1909,
    'Tree of Life': 1909,
    'the tree of life': 1909,
    '키스': 1908,
    '유디트': 1901,
    '생명의 나무': 1909,
    // 뭉크
    'The Scream': 1893,
    'the scream': 1893,
    'Madonna': 1894,
    'madonna': 1894,
    'Jealousy': 1895,
    'jealousy': 1895,
    '절규': 1893,
    '마돈나': 1894,
    '질투': 1895,
    // 마티스
    'The Dance': 1910,
    'the dance': 1910,
    'The Red Room': 1908,
    'the red room': 1908,
    'Harmony in Red': 1908,
    'harmony in red': 1908,
    'Woman with a Hat': 1905,
    'woman with a hat': 1905,
    '춤': 1910,
    '붉은 방': 1908,
    '모자를 쓴 여인': 1905,
    // 피카소
    "Les Demoiselles d'Avignon": 1907,
    "les demoiselles d'avignon": 1907,
    'Guernica': 1937,
    'guernica': 1937,
    '아비뇽의 처녀들': 1907,
    '게르니카': 1937,
    // 프리다 칼로
    'The Broken Column': 1944,
    'the broken column': 1944,
    'Self-Portrait with Monkeys': 1943,
    'self-portrait with monkeys': 1943,
    'Me and My Parrots': 1941,
    'Self-Portrait with Parrots': 1941,
    'Self-Portrait with Thorn Necklace': 1940,
    'Self-Portrait with Thorn Necklace and Hummingbird': 1940,
    '부러진 기둥': 1944,
    '원숭이와 자화상': 1943,
    '나와 앵무새': 1941,
    '앵무새와 자화상': 1941,
    '가시 목걸이 자화상': 1940,
    '가시 목걸이와 벌새': 1940
  };

  // 작품 연도 가져오기
  const getWorkYear = (workName) => {
    if (!workName) return null;
    
    // 직접 매칭
    if (workYearMap[workName]) return workYearMap[workName];
    
    // 소문자 변환 후 매칭
    const lower = workName.toLowerCase();
    if (workYearMap[lower]) return workYearMap[lower];
    
    // 괄호 제거 후 매칭 시도
    const withoutParens = workName.split('(')[0].trim();
    if (workYearMap[withoutParens]) return workYearMap[withoutParens];
    if (workYearMap[withoutParens.toLowerCase()]) return workYearMap[withoutParens.toLowerCase()];
    
    // 괄호 안 내용으로 매칭 시도
    const match = workName.match(/\(([^)]+)\)/);
    if (match) {
      if (workYearMap[match[1]]) return workYearMap[match[1]];
      if (workYearMap[match[1].toLowerCase()]) return workYearMap[match[1].toLowerCase()];
    }
    
    return null;
  };


  // ========== 동양화 스타일명 포맷 통일 ==========
  const formatOrientalStyle = (styleName) => {
    if (!styleName) return '동양화 기법';
    
    const normalized = styleName.toLowerCase().trim();
    
    // 동양화 스타일 통일 매핑: 한글명(영문명)
    const orientalMap = {
      // 한국
      '한국 전통화': '민화(Minhwa)',
      'korean-genre': '풍속도(Pungsokdo)',
      'korean-minhwa': '민화(Minhwa)',
      'korean-jingyeong': '진경산수화(Jingyeong)',
      
      // 중국
      'chinese gongbi': '공필화(Gongbi)',
      'chinese-gongbi': '공필화(Gongbi)',
      'gongbi': '공필화(Gongbi)',
      'chinese-ink': '수묵화(Ink Wash)',
      'chinese-ink-wash': '수묵화(Ink Wash)',
      'chinese-huaniao': '화조화(Huaniao)',
      
      // 일본
      '일본 우키요에': '우키요에(Ukiyo-e)',
      'japanese-ukiyoe': '우키요에(Ukiyo-e)',
      'ukiyoe': '우키요에(Ukiyo-e)',
      'ukiyo-e': '우키요에(Ukiyo-e)'
    };
    
    // 정확한 매칭
    if (orientalMap[styleName]) {
      return orientalMap[styleName];
    }
    if (orientalMap[normalized]) {
      return orientalMap[normalized];
    }
    
    // 부분 매칭 - 한국
    if (normalized.includes('minhwa') || normalized.includes('민화')) {
      return '민화(Minhwa)';
    }
    if (normalized.includes('pungsok') || normalized.includes('genre') || normalized.includes('풍속')) {
      return '풍속도(Pungsokdo)';
    }
    if (normalized.includes('jingyeong') || normalized.includes('진경')) {
      return '진경산수화(Jingyeong)';
    }
    // 부분 매칭 - 중국
    if (normalized.includes('gongbi') || normalized.includes('공필')) {
      return '공필화(Gongbi)';
    }
    if (normalized.includes('ink') || normalized.includes('수묵')) {
      return '수묵화(Ink Wash)';
    }
    // 부분 매칭 - 일본
    if (normalized.includes('ukiyo') || normalized.includes('우키요에')) {
      return '우키요에(Ukiyo-e)';
    }
    
    // 매핑에 없으면 Original 반환
    return styleName;
  };


  // ========== 화가 이름 한글(Full Name) 변환 ==========
  const formatArtistName = (artistName) => {
    if (!artistName) return 'Art 스타일';
    
    const normalized = artistName.toLowerCase().trim();
    // console.log('🎨 formatArtistName input:', artistName);
    // console.log('🎨 formatArtistName normalized:', normalized);
    
    // 영문 이름 → 한글 풀네임(Full Name) 매핑
    const nameMap = {
      // 고대 미술
      'ancient-greek-sculpture': '고대 조각(Ancient Sculpture)',
      'ancient-sculpture': '고대 조각(Ancient Sculpture)',
      'classical-sculpture': '고대 조각(Ancient Sculpture)',
      'classical sculpture': '고대 조각(Classical Sculpture)',
      'greek-sculpture': '고대 조각(Ancient Sculpture)',
      'roman-mosaic': '로마 모자이크(Roman Mosaic)',
      'ancient-mosaic': '로마 모자이크(Roman Mosaic)',
      'mosaic': '로마 모자이크(Roman Mosaic)',
      
      // 중세 미술
      'byzantine': '비잔틴(Byzantine)',
      'byzantine mosaic': '비잔틴 모자이크(Byzantine Mosaic)',
      'gothic': '고딕(Gothic)',
      'gothic stained glass': '고딕 스테인드글라스(Gothic Stained Glass)',
      'romanesque': '로마네스크(Romanesque)',
      'islamic miniature': '이슬람 세밀화(Islamic Miniature)',
      'islamic geometry': '이슬람 기하학(Islamic Geometry)',
      
      // 르네상스
      'leonardo': '레오나르도 다 빈치(Leonardo da Vinci)',
      'leonardo da vinci': '레오나르도 다 빈치(Leonardo da Vinci)',
      'michelangelo': '미켈란젤로 부오나로티(Michelangelo Buonarroti)',
      'raphael': '라파엘로 산치오(Raffaello Sanzio)',
      'botticelli': '산드로 보티첼리(Sandro Botticelli)',
      'titian': '티치아노 베첼리오(Tiziano Vecellio)',
      
      // 바로크
      'caravaggio': '미켈란젤로 메리시 다 카라바조(Caravaggio)',
      'michelangelo merisi da caravaggio': '미켈란젤로 메리시 다 카라바조(Caravaggio)',
      'rembrandt': '렘브란트 판 레인(Rembrandt van Rijn)',
      'velazquez': '디에고 벨라스케스(Diego Velázquez)',
      'rubens': '피터 파울 루벤스(Peter Paul Rubens)',
      'peter paul rubens': '피터 파울 루벤스(Peter Paul Rubens)',
      
      // 로코코
      'watteau': '장 앙투안 와토(Jean-Antoine Watteau)',
      'jean-antoine watteau': '장 앙투안 와토(Jean-Antoine Watteau)',
      'boucher': '프랑수아 부셰(François Boucher)',
      'françois boucher': '프랑수아 부셰(François Boucher)',
      'francois boucher': '프랑수아 부셰(François Boucher)',
      'jean-honoré fragonard': '장 오노레 프라고나르(Jean-Honoré Fragonard)',
      'jean-honore fragonard': '장 오노레 프라고나르(Jean-Honoré Fragonard)',
      'fragonard': '장 오노레 프라고나르(Jean-Honoré Fragonard)',
      
      // 신고전주의
      'jacques-louis-david': '자크 루이 다비드(Jacques-Louis David)',
      'david': '자크 루이 다비드(Jacques-Louis David)',
      'ingres': '장 오귀스트 도미니크 앵그르(Jean-Auguste-Dominique Ingres)',
      'jean-auguste-dominique ingres': '장 오귀스트 도미니크 앵그르(Jean-Auguste-Dominique Ingres)',
      
      // 낭만주의
      'turner': '윌리엄 터너(J.M.W. Turner)',
      'j.m.w. turner': '윌리엄 터너(J.M.W. Turner)',
      'william turner': '윌리엄 터너(J.M.W. Turner)',
      'friedrich': '카스파르 다비드 프리드리히(Caspar David Friedrich)',
      'caspar david friedrich': '카스파르 다비드 프리드리히(Caspar David Friedrich)',
      'delacroix': '외젠 들라크루아(Eugène Delacroix)',
      'eugène delacroix': '외젠 들라크루아(Eugène Delacroix)',
      'eugene delacroix': '외젠 들라크루아(Eugène Delacroix)',
      'goya': '프란시스코 고야(Francisco Goya)',
      'francisco goya': '프란시스코 고야(Francisco Goya)',
      
      // 사실주의
      'millet': '장 프랑수아 밀레(Jean-François Millet)',
      'jean-françois millet': '장 프랑수아 밀레(Jean-François Millet)',
      'jean-francois millet': '장 프랑수아 밀레(Jean-François Millet)',
      'manet': '에두아르 마네(Édouard Manet)',
      'édouard manet': '에두아르 마네(Édouard Manet)',
      'edouard manet': '에두아르 마네(Édouard Manet)',
      
      // 인상주의
      'monet': '클로드 모네(Claude Monet)',
      'claude monet': '클로드 모네(Claude Monet)',
      'renoir': '피에르 오귀스트 르누아르(Pierre-Auguste Renoir)',
      'pierre-auguste renoir': '피에르 오귀스트 르누아르(Pierre-Auguste Renoir)',
      'degas': '에드가 드가(Edgar Degas)',
      'edgar degas': '에드가 드가(Edgar Degas)',
      'caillebotte': '귀스타브 카유보트(Gustave Caillebotte)',
      'gustave caillebotte': '귀스타브 카유보트(Gustave Caillebotte)',
      
      // 후기인상주의
      'van gogh': '빈센트 반 고흐(Vincent van Gogh)',
      'vincent van gogh': '빈센트 반 고흐(Vincent van Gogh)',
      'cézanne': '폴 세잔(Paul Cézanne)',
      'cezanne': '폴 세잔(Paul Cézanne)',
      'paul cézanne': '폴 세잔(Paul Cézanne)',
      'paul cezanne': '폴 세잔(Paul Cézanne)',
      'gauguin': '폴 고갱(Paul Gauguin)',
      'paul gauguin': '폴 고갱(Paul Gauguin)',
      'seurat': '조르주 쇠라(Georges Seurat)',
      'georges seurat': '조르주 쇠라(Georges Seurat)',
      
      // 야수파
      'matisse': '앙리 마티스(Henri Matisse)',
      'henri matisse': '앙리 마티스(Henri Matisse)',
      'derain': '앙드레 드랭(André Derain)',
      'andré derain': '앙드레 드랭(André Derain)',
      'andre derain': '앙드레 드랭(André Derain)',
      'vlaminck': '모리스 드 블라맹크(Maurice de Vlaminck)',
      'maurice de vlaminck': '모리스 드 블라맹크(Maurice de Vlaminck)',
      
      // 표현주의
      'munch': '에드바르 뭉크(Edvard Munch)',
      'edvard munch': '에드바르 뭉크(Edvard Munch)',
      'kirchner': '에른스트 루트비히 키르히너(Ernst Ludwig Kirchner)',
      'ernst ludwig kirchner': '에른스트 루트비히 키르히너(Ernst Ludwig Kirchner)',
      'kokoschka': '오스카 코코슈카(Oskar Kokoschka)',
      'oskar kokoschka': '오스카 코코슈카(Oskar Kokoschka)',
      
      // 입체주의
      'picasso': '파블로 피카소(Pablo Picasso)',
      'pablo picasso': '파블로 피카소(Pablo Picasso)',
      
      // 초현실주의
      'magritte': '르네 마그리트(René Magritte)',
      'rené magritte': '르네 마그리트(René Magritte)',
      'rene magritte': '르네 마그리트(René Magritte)',
      'miro': '호안 미로(Joan Miró)',
      'miró': '호안 미로(Joan Miró)',
      'joan miro': '호안 미로(Joan Miró)',
      'joan miró': '호안 미로(Joan Miró)',
      'chagall': '마르크 샤갈(Marc Chagall)',
      'marc chagall': '마르크 샤갈(Marc Chagall)',
      
      // 팝아트 (워홀 제거)
      'lichtenstein': '로이 리히텐슈타인(Roy Lichtenstein)',
      'roy lichtenstein': '로이 리히텐슈타인(Roy Lichtenstein)',
      'haring': '키스 해링(Keith Haring)',
      'keith haring': '키스 해링(Keith Haring)',
      'keith-haring': '키스 해링(Keith Haring)',
      
      // 동양화 - 한국
      'korean-jingyeong': '진경산수화(Korean True-View Landscape)',
      'korean_jingyeong': '진경산수화(Korean True-View Landscape)',
      'jingyeong': '진경산수화(True-View Landscape)',
      'true-view': '진경산수화(True-View Landscape)',
      'true-view-landscape': '진경산수화(True-View Landscape)',
      'korean-landscape': '진경산수화(Korean Landscape)',
      
      'korean-minhwa': '민화(Korean Folk Painting)',
      'korean_minhwa': '민화(Korean Folk Painting)',
      'minhwa': '민화(Folk Painting)',
      'folk-painting': '민화(Folk Painting)',
      'korean-folk': '민화(Korean Folk)',
      
      'korean-genre': '풍속도(Korean Genre Painting)',
      'korean_genre': '풍속도(Korean Genre Painting)',
      'genre-painting': '풍속도(Genre Painting)',
      'korean-genre-painting': '풍속도(Korean Genre Painting)',
      'pungsokdo': '풍속도(Pungsokdo)',
      
      // 동양화 - 중국
      'chinese-ink': '수묵산수화(Chinese Ink Landscape)',
      'chinese_ink': '수묵산수화(Chinese Ink Landscape)',
      'ink-landscape': '수묵산수화(Ink Landscape)',
      'ink-painting': '수묵산수화(Ink Painting)',
      'shanshui': '수묵산수화(Shanshui)',
      'chinese-landscape': '수묵산수화(Chinese Landscape)',
      
      'chinese-gongbi': '공필화(Chinese Gongbi)',
      'chinese_gongbi': '공필화(Chinese Gongbi)',
      'gongbi': '공필화(Gongbi)',
      'gongbi-painting': '공필화(Gongbi Painting)',
      
      'chinese-huaniao': '화조화(Chinese Bird-and-Flower)',
      'chinese_huaniao': '화조화(Chinese Bird-and-Flower)',
      'huaniao': '화조화(Bird-and-Flower)',
      'bird-and-flower': '화조화(Bird-and-Flower)',
      'flower-and-bird': '화조화(Flower-and-Bird)',
      
      // 동양화 - 일본
      'japanese-ukiyoe': '우키요에(Japanese Ukiyo-e)',
      'japanese_ukiyoe': '우키요에(Japanese Ukiyo-e)',
      'ukiyoe': '우키요에(Ukiyo-e)',
      'ukiyo-e': '우키요에(Ukiyo-e)',
      'japanese-woodblock': '우키요에(Japanese Woodblock)',
      'woodblock-print': '우키요에(Woodblock Print)',
      
      // 한글 화가명도 매핑 (API가 한글로 반환하는 경우)
      '마티스': '앙리 마티스(Henri Matisse)',
      '피카소': '파블로 피카소(Pablo Picasso)',
      '뭉크': '에드바르 뭉크(Edvard Munch)',
      '반 고흐': '빈센트 반 고흐(Vincent van Gogh)',
      '클림트': '구스타프 클림트(Gustav Klimt)',
      '프리다': '프리다 칼로(Frida Kahlo)',
      '프리다 칼로': '프리다 칼로(Frida Kahlo)'
    };
    
    // 매핑에서 찾기
    if (nameMap[normalized]) {
      // console.log('🎨 formatArtistName found:', nameMap[normalized]);
      return nameMap[normalized];
    }
    
    // 부분 매칭 시도 (대문자/공백 변형 대응)
    for (const [key, value] of Object.entries(nameMap)) {
      if (normalized.replace(/[\s-_]/g, '') === key.replace(/[\s-_]/g, '')) {
        // console.log('🎨 formatArtistName partial match:', value);
        return value;
      }
    }
    
    // 매핑에 없으면 Original 반환
    // console.log('🎨 formatArtistName NOT FOUND, returning original:', artistName);
    return artistName;
  };


  // ========== 신고전 vs 낭만 vs 사실: 구체적 사조 매핑 ==========
  const getSpecificMovement = (artistName) => {
    const artist = artistName.toLowerCase();
    
    // 신고전주의
    const neoclassical = ['jacques-louis-david', 'david', 'ingres', 'jean-auguste-dominique ingres'];
    
    // 낭만주의
    const romantic = ['turner', 'j.m.w. turner', 'william turner', 
                      'friedrich', 'caspar david friedrich', 
                      'delacroix', 'eugène delacroix', 'eugene delacroix'];
    
    // 사실주의
    const realist = ['courbet', 'gustave courbet',
                     'manet', 'édouard manet', 'edouard manet'];
    
    if (neoclassical.some(name => artist.includes(name))) {
      return { text: '신고전주의', color: 'neoclassical' };
    }
    if (romantic.some(name => artist.includes(name))) {
      return { text: '낭만주의', color: 'romantic' };
    }
    if (realist.some(name => artist.includes(name))) {
      return { text: '사실주의', color: 'realist' };
    }
    
    return null; // 매칭 안 되면 null
  };

  // ========== 모더니즘: 세부 사조 매핑 ==========
  const getModernismMovement = (artistName) => {
    const artist = artistName.toLowerCase();
    
    // 입체주의 - v59: 브라크 제거 (피카소와 중복)
    const cubism = ['picasso', 'pablo picasso'];
    
    // 초현실주의 - v59: 달리 완전 삭제
    const surrealism = ['magritte', 'rené magritte', 'rene magritte',
                        'miro', 'miró', 'joan miro', 'joan miró',
                        'chagall', 'marc chagall'];
    
    // 팝아트 (워홀 제거)
    const popart = ['lichtenstein', 'roy lichtenstein',
                    'keith haring', 'keith-haring', 'haring'];
    
    if (cubism.some(name => artist.includes(name))) {
      return { text: '입체주의', color: 'cubism' };
    }
    if (surrealism.some(name => artist.includes(name))) {
      return { text: '초현실주의', color: 'surrealism' };
    }
    if (popart.some(name => artist.includes(name))) {
      return { text: '팝아트', color: 'popart' };
    }
    
    return null; // 매칭 안 되면 null
  };


  // ========== 동양화 교육 콘텐츠 (v30) ==========
  const getOrientalEducation = (overrideArtist = null) => {
    const styleId = selectedStyle.id;
    const artistSource = overrideArtist || aiSelectedArtist;
    
    console.log('');
    console.log('========================================');
    console.log('🔍 ORIENTAL EDUCATION DEBUG');
    console.log('========================================');
    console.log('📌 selectedStyle.id:', styleId);
    console.log('📌 aiSelectedArtist:', aiSelectedArtist);
    console.log('📌 overrideArtist:', overrideArtist);
    console.log('📌 artistSource:', artistSource);
    console.log('========================================');
    console.log('');
    
    
    // ========== 한국 전통회화 (3가지) ==========
    if (styleId === 'korean') {
      const genre = artistSource?.toLowerCase() || '';
      // console.log('🇰🇷 KOREAN ART DETECTION:');
      // console.log('   - genre string:', genre);
      // console.log('');
      
      // 민화
      if (genre.includes('minhwa') || genre.includes('민화')) {
        // console.log('✅ MATCH: Korean Minhwa (민화)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation['korean-minhwa']?.description 
            || orientalEducation.korean_default?.description;
      } 
      
      // 풍속화
      else if (genre.includes('genre') || genre.includes('풍속') || genre.includes('pungsokdo') || genre.includes('풍속도')) {
        // console.log('✅ MATCH: Korean Genre Painting (풍속화)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation['korean-pungsokdo']?.description 
            || orientalEducation.korean_default?.description;
      } 
      
      // 진경산수화
      else if (genre.includes('jingyeong') || genre.includes('진경') || genre.includes('landscape')) {
        // console.log('✅ MATCH: Korean True-View Landscape (진경산수화)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation['korean-jingyeong']?.description 
            || orientalEducation.korean_default?.description;
      }
      
      // 기본값 (매칭 실패시)
      else {
        // console.log('⚠️ DEFAULT: Korean Traditional Painting (한국 전통회화)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation.korean_default?.description;
      }
    }
    
    
    // ========== 중국 전통회화 (3가지) ==========
    if (styleId === 'chinese') {
      const artist = aiSelectedArtist?.toLowerCase() || '';
      // console.log('🇨🇳 CHINESE ART DETECTION:');
      // console.log('   - artist string:', artist);
      // console.log('');
      
      // 공필화
      if (artist.includes('gongbi') || artist.includes('공필')) {
        // console.log('✅ MATCH: Chinese Gongbi (工筆畫)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation['chinese-gongbi']?.description 
            || orientalEducation.chinese_default?.description;
      } 
      
      // 수묵화
      else if (artist.includes('ink') || artist.includes('수묵') || artist.includes('wash')) {
        // console.log('✅ MATCH: Chinese Ink Wash (水墨畫)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation['chinese-ink']?.description 
            || orientalEducation.chinese_default?.description;
      }
      
      // 기본값 (매칭 실패시)
      else {
        // console.log('⚠️ DEFAULT: Chinese Traditional Painting (중국 전통회화)');
        // console.log('========================================');
        // console.log('');
        return orientalEducation.chinese_default?.description;
      }
    }
    
    
    // ========== 일본 전통회화 (1가지) ==========
    if (styleId === 'japanese') {
      // console.log('🇯🇵 JAPANESE ART DETECTION:');
      // console.log('✅ MATCH: Japanese Ukiyo-e (浮世繪)');
      // console.log('========================================');
      // console.log('');
      return orientalEducation['japanese-ukiyoe']?.description 
          || orientalEducation.japanese_default?.description;
    }
    
    
    // console.log('⚠️ NO MATCH - Returning null');
    // console.log('========================================');
    // console.log('');
    return null;
  };


  // ========== Fallback 메시지 ==========
  const getFallbackMessage = () => {
    // 원클릭 모드에서 현재 결과가 실패인 경우
    if (isFullTransform && currentResult && !currentResult.success) {
      return 'Conversion failed. Please tap Retry below.';
    }
    
    // 원클릭인 경우 currentResult에서 정보 가져오기
    const category = isFullTransform ? currentResult?.style?.category : selectedStyle?.category;
    const styleName = isFullTransform 
      ? (currentResult?.aiSelectedArtist || currentResult?.style?.name)
      : (displayArtist || selectedStyle?.name);
    
    if (category === 'masters') {
      return `This artwork was converted in ${styleName} style.`;
    } else if (category === 'oriental') {
      return `This artwork was converted in ${styleName} style.`;
    } else {
      // movements (미술사조)
      return `This artwork was converted in ${styleName} style.`;
    }
  };


  // ========== 저장 (v74: 모바일 네이티브 지원) ==========
  const handleDownload = async () => {
    // 원클릭 모드면 현재 결과의 이미지, 아니면 단독 결과 이미지
    const imageToSave = finalDisplayImage || resultImage;
    if (!imageToSave) {
      alert(t.noImageToSave);
      return;
    }
    
    try {
      const styleId = isFullTransform ? currentResult?.style?.id : selectedStyle?.id;
      const fileName = `mastervalley-${styleId || 'art'}-${Date.now()}.jpg`;
      
      const result = await saveImage(imageToSave, fileName);
      
      if (result.success) {
        if (result.gallery) {
          alert(t.savedToGallery);
        } else if (isNativePlatform()) {
          alert(`${t.saved}\n${t.filesLocation}`);
        }
      } else if (result.error) {
        alert(`${t.saveFailed}: ${result.error}`);
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert(t.saveFailedRetry);
    }
  };


  // ========== 공유 (v74: 모바일 네이티브 지원 + 워터마크) ==========
  const handleShare = async () => {
    // 원클릭 모드면 현재 결과의 이미지, 아니면 단독 결과 이미지
    const imageToShare = finalDisplayImage || resultImage;
    if (!imageToShare) {
      alert(t.noImageToShare);
      return;
    }
    
    try {
      const styleId = isFullTransform ? currentResult?.style?.id : selectedStyle?.id;
      const styleName = isFullTransform ? currentResult?.style?.name : selectedStyle?.name;
      
      // 워터마크 추가
      const watermarkedImage = await addWatermark(imageToShare);
      
      const shareTitle = lang === 'ko' ? 'Master Valley 작품' : 'Master Valley Art';
      const shareText = lang === 'ko' 
        ? `${styleName || 'Art'} 스타일 작품 ✨`
        : `${styleName || 'Art'} style artwork ✨`;
      
      const result = await shareImage(watermarkedImage, shareTitle, shareText);
      
      if (result.clipboard) {
        alert(t.linkCopied);
      }
      // 성공이나 취소는 별도 알림 불필요
    } catch (error) {
      console.error('Share failed:', error);
      // 공유 실패 시 조용히 처리
    }
  };


  // ========== v72: 스와이프 핸들러 (viewIndex 기반) ==========
  const totalResults = isFullTransform ? results.length : 1;
  
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;
    const diffX = touchStartX - e.changedTouches[0].clientX;
    const diffY = touchStartY - e.changedTouches[0].clientY;
    
    // 수평 스와이프만 인식
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        // 왼쪽 스와이프 → 다음
        if (viewIndex < totalResults - 1) {
          const newIndex = viewIndex + 1;
          setViewIndex(newIndex);
          if (isFullTransform) setCurrentIndex(newIndex >= 0 ? newIndex : 0);
        }
      } else {
        // 오른쪽 스와이프 → 이전
        if (viewIndex > -1) {
          const newIndex = viewIndex - 1;
          setViewIndex(newIndex);
          if (isFullTransform && newIndex >= 0) setCurrentIndex(newIndex);
        }
      }
    }
    setTouchStartX(0);
    setTouchStartY(0);
  };


  // ========== Render ==========
  return (
    <div className="result-screen">
      <div 
        className="result-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Header 제거 - 목업에 없음 */}

        {/* ===== 원클릭 결과 화면 (목업 07-result-oneclick.html 준수) ===== */}
        {/* 원클릭: viewIndex === -1 → 1차 교육 + Original */}
        {isFullTransform && viewIndex === -1 && getPrimaryEducation() && (
          <div className="preview-card">
            <img src={originalPhotoUrl} alt="Original 사진" className="preview-image" />
            <div className="preview-info">
              <div className="preview-header">
                <span className="preview-icon">
                  {getStyleIcon(selectedStyle?.category, selectedStyle?.id, selectedStyle?.name)}
                </span>
                <div className="preview-text">
                  <div className="preview-style">
                    {getStyleTitle(selectedStyle?.category, selectedStyle?.id, selectedStyle?.name, lang)}
                  </div>
                  <div className="preview-subtitle">
                    {getStyleSubtitle(selectedStyle?.category, selectedStyle?.id, 'loading', null, selectedStyle?.name, lang)}
                  </div>
                </div>
              </div>
            </div>
            <div className="edu-card primary">
              <p>{getPrimaryEducation().content}</p>
            </div>
          </div>
        )}

        {/* 원클릭: viewIndex >= 0 → 결과만 + 스타일 정보 + 교육 (목업 07 준수) */}
        {isFullTransform && viewIndex >= 0 && results[viewIndex] && (
          <div className="oneclick-result-section">
            {/* 결과 이미지만 (목업: 248×248, 원본 없음) */}
            <div className="oneclick-image">
              <img src={masterResultImages[getMasterKey(results[viewIndex]?.aiSelectedArtist)] || results[viewIndex]?.resultUrl} alt="Result" />
            </div>
            
            {/* 스타일 정보 - 가운데 정렬 (목업: style-info) */}
            <div className="oneclick-style-info">
              <h3>
                {(() => {
                  const result = results[viewIndex];
                  const category = result?.style?.category;
                  const styleId = result?.style?.id;
                  const artistName = result?.aiSelectedArtist || result?.style?.name;
                  return getStyleTitle(category, styleId, artistName, lang);
                })()}
              </h3>
              {(() => {
                const result = results[viewIndex];
                const [sub1, sub2] = getStyleSubtitles(
                  result?.style?.category,
                  result?.style?.id,
                  'result-transformed',
                  result?.aiSelectedArtist,
                  result?.selected_work,
                  result?.style?.name,
                  lang
                );
                return (
                  <>
                    {sub1 && <div className="subtitle1">{sub1}</div>}
                    {sub2 && <div className="subtitle2">{sub2}</div>}
                  </>
                );
              })()}
            </div>
            
            {/* 교육 섹션 (목업: edu-section) - 거장만 토글 */}
            {displayCategory === 'masters' ? (
              <div className="oneclick-edu-section">
                <div className="edu-header">
                  <button className="toggle-btn" onClick={() => setShowInfo(!showInfo)}>
                    {showInfo ? '▼' : '▶'} {showInfo ? (lang === 'ko' ? '숨기기' : 'Hide') : (lang === 'ko' ? '보기' : 'Show')}
                  </button>
                </div>
                {showInfo && educationText && (
                  <div className="edu-content">
                    {educationText}
                  </div>
                )}
              </div>
            ) : (
              /* 사조/동양화는 항상 표시 */
              educationText && (
                <div className="oneclick-edu-section">
                  <div className="edu-content">
                    {educationText}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* 단일 변환: viewIndex에 따라 Original/결과 표시 */}
        {/* v72: Original 화면 - ProcessingScreen 카드형 레이아웃 */}
        {/* v73: 통합 함수 사용 */}
        {!isFullTransform && viewIndex === -1 && getPrimaryEducation() && (
          <div className="preview-card">
            <img src={originalPhotoUrl} alt="Original 사진" className="preview-image" />
            <div className="preview-info">
              <div className="preview-header">
                <span className="preview-icon">
                  {getStyleIcon(selectedStyle?.category, selectedStyle?.id, selectedStyle?.name)}
                </span>
                <div className="preview-text">
                  <div className="preview-style">
                    {getStyleTitle(selectedStyle?.category, selectedStyle?.id, selectedStyle?.name, lang)}
                  </div>
                  {/* v74: 단독 Original 화면 3줄 표기 (result-original) */}
                  {(() => {
                    const [sub1, sub2] = getStyleSubtitles(selectedStyle?.category, selectedStyle?.id, 'result-original', null, null, selectedStyle?.name, lang);
                    return (
                      <>
                        {sub1 && <div className="preview-subtitle">{sub1}</div>}
                        {sub2 && <div className="preview-subtitle sub2">{sub2}</div>}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
            <div className="edu-card primary">
              <p>{getPrimaryEducation().content || getPrimaryEducation().desc}</p>
            </div>
          </div>
        )}
        {!isFullTransform && viewIndex >= 0 && finalDisplayImage && (
          <div className="single-result-section">
            <div className="ba-section">
              <div className="ba-image">
                <img src={originalPhotoUrl} alt="Before" />
              </div>
              <div className="ba-image">
                <img src={finalDisplayImage} alt="After" />
              </div>
            </div>
          </div>
        )}

        {/* 단독변환 실패 시 다시 시도 버튼 */}
        {!isFullTransform && (!finalDisplayImage || isRetrying) && (
          <div className="retry-section">
            {isRetrying ? (
              <div className="retry-in-progress">
                <div className="spinner-medium"></div>
                <p className="retry-text">{t.aiRetrying}</p>
              </div>
            ) : (
              <div className="retry-prompt">
                <div className="retry-icon">🎨</div>
                <p className="fail-message">{t.conversionFailed}</p>
                <button 
                  className="btn btn-retry"
                  onClick={handleSingleModeRetry}
                >
                  <span className="btn-icon">✨</span>
                  {t.retry}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Toggle Button - 단독 변환 거장(masters)만 표시 (목업 준수) */}
        {/* 원클릭은 oneclick-edu-section에서 자체 토글 사용 */}
        {!isFullTransform && viewIndex >= 0 && displayCategory === 'masters' && (
          <div className="info-toggle">
            <button 
              className="toggle-button"
              onClick={() => setShowInfo(!showInfo)}
            >
              {showInfo 
                ? (lang === 'ko' ? '▼ 숨기기' : '▼ Hide')
                : (lang === 'ko' ? '▶ 보기' : '▶ Show')
              }
            </button>
          </div>
        )}

        {/* v72: 결과 화면 - 2차 교육자료 (단독 변환만) */}
        {/* 목업 준수: masters는 showInfo로 토글, 사조/동양화는 항상 표시 */}
        {/* 원클릭은 oneclick-result-section에서 교육 표시 */}
        {!isFullTransform && viewIndex >= 0 && (displayCategory !== 'masters' || showInfo) && (
          <div className="technique-card">
            
            {/* Card Header - ProcessingScreen과 동일 구조 */}
            <div className="card-header">
                <h2>
                  {(() => {
                    const category = isFullTransform ? currentResult?.style?.category : selectedStyle.category;
                    const styleId = isFullTransform ? currentResult?.style?.id : selectedStyle?.id;
                    const artistName = displayArtist || (isFullTransform ? currentResult?.style?.name : selectedStyle?.name);
                    return getStyleTitle(category, styleId, artistName, lang);
                  })()}
                </h2>
                {(() => {
                  const category = isFullTransform ? currentResult?.style?.category : selectedStyle.category;
                  const styleId = isFullTransform ? currentResult?.style?.id : selectedStyle?.id;
                  const artistName = displayArtist || (isFullTransform ? currentResult?.style?.name : selectedStyle?.name);
                  const [sub1, sub2] = getStyleSubtitles(category, styleId, 'result-transformed', displayArtist, displayWork, artistName, lang);
                  return (
                    <>
                      {sub1 && <div className="subtitle1">{sub1}</div>}
                      {sub2 && <div className="subtitle2">{sub2}</div>}
                    </>
                  );
                })()}
            </div>

            {/* Card Content */}
            <div className="card-content">
              {(() => {
                // console.log('');
                // console.log('🖼️ RENDERING EDUCATION CONTENT:');
                // console.log('   - isLoadingEducation:', isLoadingEducation);
                // console.log('   - educationText:', educationText);
                // console.log('   - educationText length:', educationText?.length);
                // console.log('');
                return null;
              })()}
              {isLoadingEducation ? (
                <div className="loading-education">
                  <div className="spinner"></div>
                  <p>{lang === 'ko' ? '작품 설명을 생성하고 있습니다...' : 'Loading artwork description...'}</p>
                </div>
              ) : (
                <div className="technique-explanation">
                  {educationText.split('\n\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index}>
                        {paragraph.trim().split('\n').map((line, lineIndex) => (
                          <React.Fragment key={lineIndex}>
                            {line}
                            {lineIndex < paragraph.trim().split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    )
                  ))}
                </div>
              )}
            </div>
            
          </div>
        )}

        {/* 다시 시도 버튼 (현재 보고 있는 결과가 실패한 경우에만 표시) */}
        {isFullTransform && currentResult && !currentResult.success && viewIndex >= 0 && (
          <div className="retry-section">
            {isRetrying ? (
              <div className="retry-in-progress">
                <div className="spinner-medium"></div>
                <p className="retry-text">{t.aiRetrying}</p>
              </div>
            ) : (
              <div className="retry-prompt">
                <div className="retry-icon">🎨</div>
                <p className="fail-message">{t.conversionFailed}</p>
                <button 
                  className="btn btn-retry"
                  onClick={handleRetry}
                >
                  <span className="btn-icon">✨</span>
                  {failedCount > 1 ? t.retryAll : t.retry}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 거장(AI) 대화 섹션 - 거장 카테고리 + 결과 화면일 때만 표시 */}
        {displayCategory === 'masters' && currentMasterKey && viewIndex >= 0 && (
          <MasterChat
            key={currentMasterKey}
            masterKey={currentMasterKey}
            onRetransform={(correctionPrompt) => handleMasterRetransform(correctionPrompt, currentMasterKey)}
            isRetransforming={isCurrentMasterWorking}
            retransformCost={100}
            savedChatData={masterChatData[currentMasterKey]}
            onChatDataChange={(data) => updateMasterChatData(currentMasterKey, data)}
            lang={lang}
          />
        )}

        {/* 원클릭 네비게이션 (채팅창 아래, 버튼 위) - ProcessingScreen과 동일 */}
        {isFullTransform && (
          <div className="fullTransform-nav">
            <button 
              onClick={() => {
                if (viewIndex === -1) return;
                if (viewIndex === 0) {
                  setViewIndex(-1);
                } else {
                  setViewIndex(v => v - 1);
                  setCurrentIndex(i => i - 1);
                }
              }}
              disabled={viewIndex === -1 || isRetrying}
              className="nav-btn"
              style={{ opacity: isRetrying ? 0.5 : 1 }}
            >
              ◀ Prev
            </button>
            <div className="nav-dots">
              <button
                className={`nav-dot edu ${viewIndex === -1 ? 'active' : ''}`}
                onClick={() => !isRetrying && setViewIndex(-1)}
                disabled={isRetrying}
                style={{ opacity: isRetrying ? 0.5 : 1 }}
              >📚</button>
              {fullTransformResults.map((_, idx) => (
                <button
                  key={idx}
                  className={`nav-dot ${viewIndex === idx ? 'active' : ''}`}
                  onClick={() => {
                    if (!isRetrying) {
                      setViewIndex(idx);
                      setCurrentIndex(idx);
                    }
                  }}
                  disabled={isRetrying}
                  style={{ opacity: isRetrying ? 0.5 : 1 }}
                />
              ))}
              <span className="nav-count">[{viewIndex === -1 ? 0 : viewIndex + 1}/{fullTransformResults.length}]</span>
            </div>
            <button 
              onClick={() => {
                if (viewIndex === -1) {
                  setViewIndex(0);
                  setCurrentIndex(0);
                } else if (viewIndex < fullTransformResults.length - 1) {
                  setViewIndex(v => v + 1);
                  setCurrentIndex(i => i + 1);
                }
              }}
              disabled={viewIndex === fullTransformResults.length - 1 || isRetrying}
              className="nav-btn"
              style={{ opacity: isRetrying ? 0.5 : 1 }}
            >
              Next ▶
            </button>
          </div>
        )}

        {/* 단독 변환 네비게이션 - 목업 준수: 제거됨 */}
        {/* 단독 변환은 네비게이션 없음 */}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn btn-save-share" 
            onClick={() => setShowSaveShareMenu(true)}
          >
            <span className="btn-icon">💾</span>
            {t.save}/{t.share}
          </button>
          
          <button 
            className="btn btn-gallery" 
            onClick={onGallery}
            disabled={isAnyMasterRetransforming || isRetrying}
            style={{ 
              opacity: (isAnyMasterRetransforming || isRetrying) ? 0.5 : 1,
              cursor: (isAnyMasterRetransforming || isRetrying) ? 'not-allowed' : 'pointer'
            }}
          >
            <span className="btn-icon">🖼️</span>
            {t.gallery}
          </button>
          
          <button 
            className="btn btn-reset" 
            onClick={onReset}
          >
            <span className="btn-icon">🔄</span>
            {t.newPhoto}
          </button>
        </div>
        
        {/* Save/Share 팝업 메뉴 */}
        {showSaveShareMenu && (
          <div className="save-share-overlay" onClick={() => setShowSaveShareMenu(false)}>
            <div className="save-share-menu" onClick={(e) => e.stopPropagation()}>
              <button 
                className="menu-item"
                onClick={() => {
                  setShowSaveShareMenu(false);
                  handleDownload();
                }}
              >
                <span className="menu-icon">💾</span>
                {t.saveToDevice}
              </button>
              <button 
                className="menu-item"
                onClick={() => {
                  setShowSaveShareMenu(false);
                  handleShare();
                }}
              >
                <span className="menu-icon">📤</span>
                {t.shareArt}
              </button>
              <button 
                className="menu-item menu-cancel"
                onClick={() => setShowSaveShareMenu(false)}
              >
                {t.cancel}
              </button>
            </div>
          </div>
        )}
        
      </div>

      {/* Styles */}
      <style>{`
        .result-screen {
          min-height: 100vh;
          background: #121212;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .result-container {
          max-width: 400px;
          width: 100%;
          background: #121212;
        }

        .result-header {
          text-align: center;
          color: white;
          margin-bottom: 2rem;
        }

        .result-header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
        }

        .result-subtitle {
          font-size: 1.1rem;
          opacity: 0.95;
          margin: 0;
        }

        /* ===== 원클릭 결과 화면 (목업 07-result-oneclick.html 준수) ===== */
        .oneclick-result-section {
          width: 100%;
          max-width: 340px;
          margin: 0 auto 16px;
        }

        .oneclick-image {
          width: 100%;
          aspect-ratio: 1 / 1;
          margin: 0 auto 12px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .oneclick-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ===== 단독변환 결과 (목업 06-result-single.html 준수) ===== */
        .single-result-section {
          width: 100%;
          max-width: 340px;
          margin: 0 auto 16px;
        }

        .ba-section {
          margin-bottom: 16px;
        }

        .ba-section .ba-image {
          width: 100%;
          aspect-ratio: 6 / 5;
          margin-bottom: 10px;
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .ba-section .ba-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .oneclick-style-info {
          text-align: center;
          margin-bottom: 12px;
          width: 100%;
        }

        .oneclick-style-info h3 {
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 6px;
        }

        .oneclick-style-info .subtitle1 {
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 4px;
        }

        .oneclick-style-info .subtitle2 {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 10px;
        }

        .oneclick-edu-section {
          margin-top: 12px;
        }

        .oneclick-edu-section .edu-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 8px;
        }

        .oneclick-edu-section .toggle-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          font-size: 11px;
          cursor: pointer;
          padding: 4px 8px;
        }

        .oneclick-edu-section .toggle-btn:hover {
          color: rgba(255,255,255,0.6);
        }

        .oneclick-edu-section .edu-content {
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          line-height: 1.75;
          text-align: left;
          white-space: pre-line;
        }

        .comparison-wrapper {
          background: none;
          padding: 0;
          border-radius: 0;
          box-shadow: none;
          margin-bottom: 1rem;
          max-width: 340px;
          margin-left: auto;
          margin-right: auto;
        }

        .info-toggle {
          text-align: right;
          margin-bottom: 8px;
          max-width: 340px;
          margin-left: auto;
          margin-right: auto;
        }

        .toggle-button {
          background: none;
          border: none;
          color: rgba(255,255,255,0.35);
          padding: 4px 8px;
          border-radius: 0;
          font-size: 11px;
          font-weight: 400;
          cursor: pointer;
          transition: color 0.2s;
        }

        .toggle-button:hover {
          background: none;
          color: rgba(255,255,255,0.5);
        }

        .technique-card {
          background: none;
          border-radius: 0;
          padding: 0;
          margin-bottom: 1rem;
          max-width: 340px;
          margin-left: auto;
          margin-right: auto;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-header {
          text-align: center;
          padding-bottom: 0;
          border-bottom: none;
          margin-bottom: 12px;
        }

        .card-header h2 {
          margin: 0 0 6px 0;
          color: #fff;
          font-size: 17px;
          font-weight: 700;
          line-height: 1.3;
          text-align: center;
        }

        .card-header .subtitle1 {
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 4px;
          text-align: center;
        }
        .card-header .subtitle2 {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          text-align: center;
        }

        .style-badge {
          display: inline-block;
          padding: 0.4rem 1rem;
          color: white;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          vertical-align: middle;
          transform: translateY(-1px);
        }

        .style-badge.neoclassical {
          background: #2E86AB;
        }

        .style-badge.romantic {
          background: #A23B72;
        }

        .style-badge.realist {
          background: #C77B58;
        }

        .style-badge.cubism {
          background: #5D5D5D;
        }

        .style-badge.surrealism {
          background: #9B59B6;
        }

        .style-badge.popart {
          background: #E74C3C;
        }

        .movement-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #121212;
          color: white;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
        }

        .loading-education {
          text-align: center;
          padding: 3rem 2rem;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-education p {
          color: rgba(255,255,255,0.6);
          font-size: 1rem;
        }

        .technique-explanation {
          background: none;
          padding: 0;
          border-radius: 0;
          border-left: none;
          max-width: 340px;
          margin: 0 auto;
        }

        .technique-explanation h3 {
          display: none;
        }

        .technique-explanation p {
          color: rgba(255,255,255,0.65);
          line-height: 1.75;
          font-size: 13px;
          margin: 0 0 10px 0;
          text-align: left;
        }
        
        .technique-explanation p:last-child {
          margin-bottom: 0;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          max-width: 340px;
          margin: 0 auto;
        }

        .btn {
          flex: 1;
          padding: 14px 8px;
          border: none;
          border-radius: 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .btn-icon {
          font-size: 1rem;
        }

        .btn-save-share {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
        }

        .btn-save-share:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
        }

        .btn-gallery {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .btn-gallery:hover {
          background: rgba(255,255,255,0.15);
        }

        .btn-reset {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.7);
          border: none;
        }

        .btn-reset:hover {
          background: rgba(255,255,255,0.1);
        }

        /* Save/Share 팝업 메뉴 */
        .save-share-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .save-share-menu {
          background: #1a1a1a;
          border-radius: 16px;
          padding: 8px;
          min-width: 200px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.2s ease;
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 14px 20px;
          border: none;
          background: transparent;
          font-size: 16px;
          font-weight: 500;
          color: #fff;
          cursor: pointer;
          border-radius: 12px;
          transition: background 0.2s;
        }

        .menu-item:hover {
          background: #2a2a2a;
        }

        .menu-icon {
          font-size: 20px;
        }

        .menu-cancel {
          color: #6b7280;
          justify-content: center;
          margin-top: 4px;
          border-top: 1px solid #e5e7eb;
          border-radius: 0 0 12px 12px;
        }

        /* 다시 시도 섹션 */
        .retry-section {
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .retry-prompt {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 20px;
          padding: 2rem;
        }

        .retry-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .fail-message {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          margin-bottom: 1.25rem;
        }

        .btn-retry {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .btn-retry:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
        }

        .retry-in-progress {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .retry-text {
          color: #5b21b6;
          font-size: 1rem;
          font-weight: 500;
        }

        .spinner-medium {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(139, 92, 246, 0.3);
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner-small {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .result-screen {
            padding: 1rem;
          }

          .result-header h1 {
            font-size: 2rem;
          }

          .result-subtitle {
            font-size: 0.95rem;
          }

          .comparison-wrapper {
            padding: 1rem;
          }

          .technique-card {
            padding: 1.5rem;
          }

          .technique-icon {
            font-size: 2.5rem;
            min-width: 2.5rem;
          }

          .card-header h2 {
            font-size: 1.25rem;
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }
        }

        /* 원클릭 네비게이션 */
        .fullTransform-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
          max-width: 340px;
          margin-left: auto;
          margin-right: auto;
        }
        .nav-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: rgba(255,255,255,0.7);
          padding: 6px 10px;
          border-radius: 12px;
          font-size: 11px;
          cursor: pointer;
        }
        .nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .nav-dots {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .nav-dot.done {
          background: rgba(102, 126, 234, 0.5);
        }
        .nav-dot.active {
          background: #667eea;
          transform: scale(1.3);
        }
        .nav-dot:disabled {
          opacity: 0.4;
          cursor: default;
        }
        .nav-dot.edu {
          width: auto;
          height: auto;
          background: none;
          font-size: 11px;
        }
        .nav-count {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          margin-left: 2px;
        }
        
        /* 원클릭 이미지 */
        .result-image-wrapper {
          width: 100%;
          max-width: 340px;
          aspect-ratio: 1 / 1;
          margin: 0 auto 16px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .result-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* v72: Original 화면 - ProcessingScreen 카드형 레이아웃 */
        .preview-card {
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
          margin: 16px auto;
          width: 100%;
          max-width: 340px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .preview-card .preview-image {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          display: block;
        }
        .preview-card .preview-info {
          padding: 16px;
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .preview-card .preview-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .preview-card .preview-icon {
          font-size: 2.2rem;
          line-height: 1;
        }
        .preview-card .preview-text {
          flex: 1;
        }
        .preview-card .preview-style {
          font-size: 1.35rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 6px;
          line-height: 1.3;
        }
        .preview-card .preview-subtitle {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.6);
          font-weight: 500;
        }
        .preview-card .preview-subtitle.sub2 {
          font-size: 0.9rem;
          color: #888;
          margin-top: 4px;
        }
        .preview-card .edu-card {
          padding: 16px;
          border-radius: 0;
          margin: 0;
        }
        .preview-card .edu-card.primary {
          background: transparent;
        }
        .preview-card .edu-card h3 {
          color: #667eea;
          margin: 0 0 10px;
          font-size: 15px;
        }
        .preview-card .edu-card p {
          color: rgba(255,255,255,0.65);
          line-height: 1.8;
          font-size: 13px;
          margin: 0;
          white-space: pre-line;
        }
      `}</style>
    </div>
  );
};

export default ResultScreen;
