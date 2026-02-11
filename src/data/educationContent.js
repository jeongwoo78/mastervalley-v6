// PicoArt v78 - 교육 콘텐츠 통합 (i18n 구조)
// 단독변환 로딩화면에서 사용
// i18n에서 교육 데이터를 가져오고 속성명 변환
// v78: name→title, description→desc 속성명 변환 추가

import { 
  getMovementsLoadingEducation,
  getMastersLoadingEducation,
  getOrientalLoadingEducation,
  getLanguage
} from '../i18n';

// ========================================
// 속성명 변환: i18n 구조 → 기존 구조
// i18n: { name, description }
// 기존: { title, desc }
// ========================================
const transformEducationData = (data) => {
  if (!data) return {};
  
  const transformed = {};
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === 'object') {
      transformed[key] = {
        title: value.name || value.title || key,
        desc: value.description || value.desc || ''
      };
    }
  }
  return transformed;
};

// ========================================
// 키 매핑 (masterData.js style.id → 교육데이터 키)
// ========================================
const STYLE_ID_ALIASES = {
  // movements 사조 레벨 매핑
  'ancient': 'ancient',
  'medieval': 'medieval',
  'renaissance': 'renaissance',
  'baroque': 'baroque',
  'rococo': 'rococo',
  'neoclassicism_vs_romanticism_vs_realism': 'neoclassicism_vs_romanticism_vs_realism',
  'neoclassicism-romanticism-realism': 'neoclassicism_vs_romanticism_vs_realism',
  'impressionism': 'impressionism',
  'postImpressionism': 'postImpressionism',
  'post-impressionism': 'postImpressionism',
  'fauvism': 'fauvism',
  'expressionism': 'expressionism',
  'modernism': 'modernism',
  
  // masters 거장 매핑 (-master 접미사 제거)
  'vangogh-master': 'vangogh',
  'klimt-master': 'klimt',
  'munch-master': 'munch',
  'matisse-master': 'matisse',
  'chagall-master': 'chagall',
  'picasso-master': 'picasso',
  'frida-master': 'frida',
  'lichtenstein-master': 'lichtenstein',
  
  // oriental 동양화 매핑
  'korean': 'korean',
  'chinese': 'chinese',
  'japanese': 'japanese'
};

// Proxy로 동적 접근 + 키 매핑 지원
const createProxyWithAliases = (getData) => {
  return new Proxy({}, {
    get(target, prop) {
      const data = getData();
      
      // 직접 키가 있으면 반환
      if (data[prop]) return data[prop];
      
      // 별칭으로 매핑된 키가 있으면 반환
      const mappedKey = STYLE_ID_ALIASES[prop];
      if (mappedKey && data[mappedKey]) return data[mappedKey];
      
      // -master 접미사 제거 후 시도
      if (typeof prop === 'string' && prop.endsWith('-master')) {
        const withoutMaster = prop.replace('-master', '');
        if (data[withoutMaster]) return data[withoutMaster];
      }
      
      return undefined;
    },
    // Proxy의 keys 순회 지원
    ownKeys() {
      return Object.keys(getData());
    },
    getOwnPropertyDescriptor(target, prop) {
      const data = getData();
      if (data[prop]) {
        return { enumerable: true, configurable: true };
      }
      return undefined;
    }
  });
};

// v78: 동적으로 현재 언어의 교육 데이터 반환 (속성명 변환 포함)
const getTransformedMovements = () => {
  const lang = getLanguage();
  const raw = getMovementsLoadingEducation(lang) || {};
  return transformEducationData(raw);
};

const getTransformedMasters = () => {
  const lang = getLanguage();
  const raw = getMastersLoadingEducation(lang) || {};
  return transformEducationData(raw);
};

const getTransformedOriental = () => {
  const lang = getLanguage();
  const raw = getOrientalLoadingEducation(lang) || {};
  return transformEducationData(raw);
};

// Proxy로 동적 접근 + 키 매핑 지원
export const educationContent = {
  get movements() { return createProxyWithAliases(getTransformedMovements); },
  get masters() { return createProxyWithAliases(getTransformedMasters); },
  get oriental() { return createProxyWithAliases(getTransformedOriental); }
};

export default educationContent;
