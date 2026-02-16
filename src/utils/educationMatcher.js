// ========================================
// educationMatcher.js - displayConfig 기반 교육자료 매칭
// v72 - 2026-01-18
// ========================================
//
// 모든 정규화는 displayConfig.js에서 처리
// 이 파일은 교육자료 연결만 담당
//
// v72: getEducationKey 3개 인자 지원, getEducationContent 카테고리별 데이터 지원
//
// ========================================

import { normalizeKey, getArtistName, ALIASES } from './displayConfig.js';
import { MASTERS } from '../data/masterData.js';

// ========================================
// 거장 작품 매칭 헬퍼: selected_work → workKey
// masterData.works를 활용하여 API 반환 작품명을 키로 변환
// ========================================

function findWorkKey(masterKey, selectedWork) {
  if (!selectedWork || !masterKey) return null;
  
  const masterStyleId = `${masterKey}-master`;
  const master = MASTERS[masterStyleId];
  if (!master?.works) return null;
  
  const workLower = selectedWork.toLowerCase().trim();
  
  for (const [workKey, aliases] of Object.entries(master.works)) {
    for (const alias of aliases) {
      if (alias.toLowerCase() === workLower) {
        return workKey; // exact match
      }
    }
  }
  
  // 부분 매칭 (포함 관계)
  for (const [workKey, aliases] of Object.entries(master.works)) {
    for (const alias of aliases) {
      if (workLower.includes(alias.toLowerCase()) || alias.toLowerCase().includes(workLower)) {
        return workKey;
      }
    }
  }
  
  return null;
}

// ========================================
// 메인 함수: 교육자료 키 가져오기
// ========================================

/**
 * 교육자료 콘텐츠 가져오기
 * @param {string} category - 'movements' | 'masters' | 'oriental'
 * @param {string} key - 정규화된 키 (monet, vangogh, korean-minhwa 등)
 * @param {object} educationData - 교육자료 데이터 객체
 *   - 카테고리별 구조: { masters: {...}, movements: {...}, oriental: {...} }
 *   - 또는 직접 데이터: { vangogh: {...}, klimt: {...} }
 */
export function getEducationContent(category, key, educationData) {
  if (!educationData || !key) return null;
  
  // 카테고리별 데이터 구조인지 확인 (ProcessingScreen, ResultScreen에서 사용하는 형태)
  let targetData = educationData;
  if (educationData[category] && typeof educationData[category] === 'object') {
    targetData = educationData[category];
  }
  
  // 직접 매칭 시도
  if (targetData[key]) {
    console.log(`✅ getEducationContent: direct match for ${key}`);
    // v78: content → description → desc 순서로 fallback
    return targetData[key].content || targetData[key].description || targetData[key].desc || null;
  }
  
  // ALIASES를 통한 정규화 후 재시도
  const normalizedKey = normalizeKey(key);
  if (normalizedKey !== key && targetData[normalizedKey]) {
    console.log(`✅ getEducationContent: alias match ${key} → ${normalizedKey}`);
    return targetData[normalizedKey].content || targetData[normalizedKey].description || targetData[normalizedKey].desc || null;
  }
  
  // 거장 작품키 fallback: 'vangogh-starrynight' → 'vangogh'
  if (category === 'masters' && key.includes('-')) {
    const masterOnly = key.split('-')[0];
    if (targetData[masterOnly]) {
      console.log(`✅ getEducationContent: master fallback ${key} → ${masterOnly}`);
      return targetData[masterOnly].content || targetData[masterOnly].description || targetData[masterOnly].desc || null;
    }
  }
  
  console.log(`❌ getEducationContent: no match found for key: ${key} in category: ${category}`);
  return null;
}

/**
 * 거장 교육자료 키 가져오기
 * @param {string} masterKey - 거장 키 (vangogh, klimt 등)
 * @param {string} selectedWork - AI가 선택한 작품명
 * @returns {string} 작품별 키 (vangogh-starrynight) 또는 거장 키 (vangogh)
 */
export function getMasterEducationKey(masterKey, selectedWork) {
  const normalizedMaster = normalizeKey(masterKey);
  
  // 작품별 키 시도: vangogh + "The Starry Night" → "vangogh-starrynight"
  const workKey = findWorkKey(normalizedMaster, selectedWork);
  if (workKey) {
    const compositeKey = `${normalizedMaster}-${workKey}`;
    console.log(`🎨 getMasterEducationKey: ${normalizedMaster} + "${selectedWork}" → ${compositeKey}`);
    return compositeKey;
  }
  
  // fallback: 거장 키만 반환
  console.log(`🎨 getMasterEducationKey: ${normalizedMaster} (no work match for "${selectedWork}")`);
  return normalizedMaster;
}

/**
 * 사조 화가 교육자료 키 가져오기
 * @param {string} artistName - AI가 선택한 화가명
 */
export function getMovementEducationKey(artistName) {
  const normalized = normalizeKey(artistName);
  return normalized;
}

/**
 * 동양화 교육자료 키 가져오기
 * @param {string} styleId - 동양화 스타일 ID
 */
export function getOrientalEducationKey(styleId) {
  const normalized = normalizeKey(styleId);
  return normalized;
}

/**
 * 통합 함수: 카테고리별 교육자료 키 가져오기
 * @param {string} category - 'movements' | 'masters' | 'oriental'
 * @param {object|string} apiResponseOrArtist - API 응답 객체 또는 화가명 문자열
 * @param {string} [selectedWork] - 작품명 (문자열로 호출할 때만 사용)
 * 
 * 사용법 1 (객체): getEducationKey('masters', { aiSelectedArtist: 'vangogh', selected_work: 'The Starry Night' })
 * 사용법 2 (문자열): getEducationKey('masters', 'vangogh', 'The Starry Night')
 */
export function getEducationKey(category, apiResponseOrArtist, selectedWork) {
  let aiSelectedArtist, selected_work, styleId, masterId;
  
  // 문자열로 호출된 경우 (ProcessingScreen, ResultScreen에서 사용)
  if (typeof apiResponseOrArtist === 'string') {
    aiSelectedArtist = apiResponseOrArtist;
    selected_work = selectedWork;
    styleId = apiResponseOrArtist;
    masterId = apiResponseOrArtist;
  } 
  // 객체로 호출된 경우
  else if (apiResponseOrArtist && typeof apiResponseOrArtist === 'object') {
    aiSelectedArtist = apiResponseOrArtist.aiSelectedArtist;
    selected_work = apiResponseOrArtist.selected_work;
    styleId = apiResponseOrArtist.styleId;
    masterId = apiResponseOrArtist.masterId;
  }
  // null/undefined인 경우
  else {
    return null;
  }
  
  switch (category) {
    case 'masters':
      return getMasterEducationKey(masterId || aiSelectedArtist, selected_work);
      
    case 'movements':
      return getMovementEducationKey(aiSelectedArtist);
      
    case 'oriental':
      return getOrientalEducationKey(styleId || aiSelectedArtist);
      
    default:
      return normalizeKey(aiSelectedArtist || styleId || '');
  }
}

/**
 * 화가 표시 정보 가져오기
 * @param {string} artistName - 화가명 (어떤 형식이든)
 */
export function getArtistDisplayInfo(artistName) {
  return getArtistName(artistName);
}

// ========================================
// 하위 호환성 유지 (기존 코드 지원)
// ========================================

// 사조 화가명 → 교육자료 키 (레거시)
export function normalizeArtistKey(artistName) {
  return normalizeKey(artistName);
}

// 동양화 스타일 → 교육자료 키 (레거시)
export function normalizeOrientalKey(styleId) {
  return normalizeKey(styleId);
}

export default {
  getEducationContent,
  getMasterEducationKey,
  getMovementEducationKey,
  getOrientalEducationKey,
  getEducationKey,
  getArtistDisplayInfo,
  normalizeArtistKey,
  normalizeOrientalKey
};
