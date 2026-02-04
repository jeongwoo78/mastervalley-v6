// ========================================
// i18n — 언어 선택 로직
// ========================================

// Masters education content
import * as koMasters from './ko/masters.js';
import * as enMasters from './en/masters.js';

// Movements education content
import * as koMovements from './ko/movements.js';
import * as enMovements from './en/movements.js';

// Oriental education content
import * as koOriental from './ko/oriental.js';
import * as enOriental from './en/oriental.js';

// Oneclick education content
import * as koOneclickMasters from './ko/oneclickMasters.js';
import * as enOneclickMasters from './en/oneclickMasters.js';
import * as koOneclickMovements from './ko/oneclickMovements.js';
import * as enOneclickMovements from './en/oneclickMovements.js';
import * as koOneclickOriental from './ko/oneclickOriental.js';
import * as enOneclickOriental from './en/oneclickOriental.js';

// UI text
import { ui as koUi } from './ko/ui.js';
import { ui as enUi } from './en/ui.js';

// MasterChat text
import { masterChat as koMasterChat } from './ko/masterChat.js';
import { masterChat as enMasterChat } from './en/masterChat.js';

const languages = {
  ko: {
    masters: koMasters,
    movements: koMovements,
    oriental: koOriental,
    oneclickMasters: koOneclickMasters,
    oneclickMovements: koOneclickMovements,
    oneclickOriental: koOneclickOriental,
    ui: koUi,
    masterChat: koMasterChat
  },
  en: {
    masters: enMasters,
    movements: enMovements,
    oriental: enOriental,
    oneclickMasters: enOneclickMasters,
    oneclickMovements: enOneclickMovements,
    oneclickOriental: enOneclickOriental,
    ui: enUi,
    masterChat: enMasterChat
  }
};

// 현재 언어 (기본값: en)
let currentLang = 'en';

export const setLanguage = (lang) => {
  if (languages[lang]) {
    currentLang = lang;
  }
};

export const getLanguage = () => currentLang;

export const t = (key) => {
  const keys = key.split('.');
  let value = languages[currentLang]?.ui;
  for (const k of keys) {
    value = value?.[k];
  }
  return value || key;
};

export const getEducation = (type, lang = currentLang) => {
  return languages[lang]?.[type] || languages['en']?.[type];
};

// MasterChat 텍스트 가져오기 (fallback: en)
export const getMasterChat = (lang = currentLang) => {
  return languages[lang]?.masterChat || languages['en']?.masterChat;
};

// ===== 교육 콘텐츠 Getter 함수들 =====

// Movements (사조) 교육 데이터
export const getMovementsBasicInfo = (lang = currentLang) => {
  return languages[lang]?.movements?.movementsBasicInfo || languages['en']?.movements?.movementsBasicInfo;
};

export const getMovementsLoadingEducation = (lang = currentLang) => {
  return languages[lang]?.movements?.movementsLoadingEducation || languages['en']?.movements?.movementsLoadingEducation;
};

export const getMovementsResultEducation = (lang = currentLang) => {
  return languages[lang]?.movements?.movementsResultEducation || languages['en']?.movements?.movementsResultEducation;
};

// Masters (거장) 교육 데이터
export const getMastersBasicInfo = (lang = currentLang) => {
  return languages[lang]?.masters?.mastersBasicInfo || languages['en']?.masters?.mastersBasicInfo;
};

export const getMastersLoadingEducation = (lang = currentLang) => {
  return languages[lang]?.masters?.mastersLoadingEducation || languages['en']?.masters?.mastersLoadingEducation;
};

export const getMastersResultEducation = (lang = currentLang) => {
  return languages[lang]?.masters?.mastersResultEducation || languages['en']?.masters?.mastersResultEducation;
};

// Oriental (동양화) 교육 데이터
export const getOrientalBasicInfo = (lang = currentLang) => {
  return languages[lang]?.oriental?.orientalBasicInfo || languages['en']?.oriental?.orientalBasicInfo;
};

export const getOrientalLoadingEducation = (lang = currentLang) => {
  return languages[lang]?.oriental?.orientalLoadingEducation || languages['en']?.oriental?.orientalLoadingEducation;
};

export const getOrientalResultEducation = (lang = currentLang) => {
  return languages[lang]?.oriental?.orientalResultEducation || languages['en']?.oriental?.orientalResultEducation;
};

// ===== 원클릭 교육 콘텐츠 Getter 함수들 =====

// Oneclick Movements
export const getOneclickMovementsPrimary = (lang = currentLang) => {
  return languages[lang]?.oneclickMovements?.oneclickMovementsPrimary || languages['en']?.oneclickMovements?.oneclickMovementsPrimary;
};

export const getOneclickMovementsSecondary = (lang = currentLang) => {
  return languages[lang]?.oneclickMovements?.oneclickMovementsSecondary || languages['en']?.oneclickMovements?.oneclickMovementsSecondary;
};

// Oneclick Masters
export const getOneclickMastersPrimary = (lang = currentLang) => {
  return languages[lang]?.oneclickMasters?.oneclickMastersPrimary || languages['en']?.oneclickMasters?.oneclickMastersPrimary;
};

export const getOneclickMastersSecondary = (lang = currentLang) => {
  return languages[lang]?.oneclickMasters?.oneclickMastersSecondary || languages['en']?.oneclickMasters?.oneclickMastersSecondary;
};

// Oneclick Oriental
export const getOneclickOrientalPrimary = (lang = currentLang) => {
  return languages[lang]?.oneclickOriental?.oneclickOrientalPrimary || languages['en']?.oneclickOriental?.oneclickOrientalPrimary;
};

export const getOneclickOrientalSecondary = (lang = currentLang) => {
  return languages[lang]?.oneclickOriental?.oneclickOrientalSecondary || languages['en']?.oneclickOriental?.oneclickOrientalSecondary;
};

export const getSupportedLanguages = () => [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ko', name: 'Korean', native: '한국어' },
];

export default { setLanguage, getLanguage, t, getEducation, getMasterChat, getSupportedLanguages };

