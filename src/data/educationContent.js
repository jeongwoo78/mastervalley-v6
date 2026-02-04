// PicoArt v77 - 교육 콘텐츠 통합 (i18n 구조)
// 단독변환 로딩화면에서 사용
// 이제 i18n에서 교육 데이터를 가져옴

import { 
  getMovementsLoadingEducation,
  getMastersLoadingEducation,
  getOrientalLoadingEducation,
  getLanguage
} from '../i18n';

// v77: 동적으로 현재 언어의 교육 데이터 반환
const getEducationData = () => {
  const lang = getLanguage();
  return {
    movements: getMovementsLoadingEducation(lang) || {},
    masters: getMastersLoadingEducation(lang) || {},
    oriental: getOrientalLoadingEducation(lang) || {}
  };
};

// Proxy로 동적 접근 지원
export const educationContent = {
  get movements() { return getEducationData().movements; },
  get masters() { return getEducationData().masters; },
  get oriental() { return getEducationData().oriental; }
};

export default educationContent;
