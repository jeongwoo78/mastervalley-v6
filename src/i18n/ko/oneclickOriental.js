// ========================================
// 원클릭 동양화 전용 교육자료
// v69 - 2026-02-03 (구조 수정: 국가→스타일)
// ----------------------------------------
// 1차: 시적 톤 (로딩 대기, 기대감)
// 2차: 국가 정의/특징(고정) → 스타일 소개/특징(변경)
// ========================================

// ==================== 기본정보 (2차 결과용) ====================

export const oneclickOrientalBasicInfo = {
  // 한국
  'korean-minhwa': {
    name: '한국 전통회화(Korean Traditional Painting)',
    subtitle1: '민화(民畵, Minhwa)',
    subtitle2: '소망을 담은 민중의 그림'
  },
  'korean-pungsokdo': {
    name: '한국 전통회화(Korean Traditional Painting)',
    subtitle1: '풍속도(風俗圖, Genre Painting)',
    subtitle2: '민중의 일상을 담다'
  },
  'korean-jingyeong': {
    name: '한국 전통회화(Korean Traditional Painting)',
    subtitle1: '진경산수화(眞景山水畵, True-view Landscape)',
    subtitle2: '조선의 눈으로 본 산천'
  },
  // 중국
  'chinese-ink': {
    name: '중국 전통회화(Chinese Traditional Painting)',
    subtitle1: '수묵화(水墨畵, Ink Wash Painting)',
    subtitle2: '먹으로 그린 정신의 풍경'
  },
  'chinese-gongbi': {
    name: '중국 전통회화(Chinese Traditional Painting)',
    subtitle1: '공필화(工筆畵, Gongbi Painting)',
    subtitle2: '정밀함의 극치'
  },
  // 일본
  'japanese-ukiyoe': {
    name: '일본 전통회화(Japanese Traditional Painting)',
    subtitle1: '우키요에(浮世繪, Ukiyo-e)',
    subtitle2: '떠도는 세상을 판화로 찍다'
  }
};

// ==================== 1차 교육자료 (로딩 화면용) ====================

export const oneclickOrientalPrimary = {
  content: `서양이 채울 때, 동양은 비웠습니다.
그리지 않음으로 말하는 법.

먹과 여백 사이의 한국,
산수와 장식 사이의 중국,
덧없음과 화려함이 공존하는 일본.

세 나라, 세 개의 붓끝.
이제, 당신이 머뭅니다.`
};

// ==================== 2차 교육자료 (결과 화면용) ====================

export const oneclickOrientalSecondary = {

  // ========== 한국 ==========
  'korean-minhwa': {
    content: `한국 전통회화는 여백을 살리고 붓끝에 정신을 담은 예술입니다.
선비는 먹으로, 민중은 색으로 그렸습니다.

민화는 조선 민중이 삶의 소망을 담아 그린 그림입니다.
호랑이, 까치, 모란 등 상징적 소재를 자유롭게 구성했습니다.`
  },

  'korean-pungsokdo': {
    content: `한국 전통회화는 여백을 살리고 붓끝에 정신을 담은 예술입니다.
선비는 먹으로, 민중은 색으로 그렸습니다.

풍속도는 조선 서민의 일상을 담은 그림입니다.
씨름, 빨래, 서당 풍경을 경쾌한 붓놀림으로 기록했습니다.`
  },

  'korean-jingyeong': {
    content: `한국 전통회화는 여백을 살리고 붓끝에 정신을 담은 예술입니다.
선비는 먹으로, 민중은 색으로 그렸습니다.

진경산수화는 조선의 실제 산천을 직접 보고 그린 그림입니다.
겸재 정선이 수직 준법과 대담한 구도로 완성했습니다.`
  },

  // ========== 중국 ==========
  'chinese-ink': {
    content: `중국 전통회화는 먹의 농담으로 우주의 기운을 담은 예술입니다.
문인의 정신과 궁정의 기교가 천 년간 공존했습니다.

수묵화는 먹의 농담만으로 세상을 그린 문인의 예술입니다.
그리지 않은 여백이 가장 많은 것을 말합니다.`
  },

  'chinese-gongbi': {
    content: `중국 전통회화는 먹의 농담으로 우주의 기운을 담은 예술입니다.
문인의 정신과 궁정의 기교가 천 년간 공존했습니다.

공필화는 한 올의 흐트러짐도 없이 정밀하게 그린 궁정 회화입니다.
투명한 색을 여러 겹 쌓아 깊이와 광택을 만들었습니다.`
  },

  // ========== 일본 ==========
  'japanese-ukiyoe': {
    content: `일본 전통회화는 덧없는 세상, 우키요를 그림으로 붙잡은 예술입니다.
순간의 아름다움을 선명한 색채로 새겼습니다.

우키요에는 에도 시대 서민이 즐긴 목판화입니다.
굵은 윤곽선과 평면적 색면이 인상파에 영감을 주었습니다.`
  }
};

export default {
  oneclickOrientalBasicInfo,
  oneclickOrientalPrimary,
  oneclickOrientalSecondary
};
