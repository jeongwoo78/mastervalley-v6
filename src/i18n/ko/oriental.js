// ========================================
// 동양화 교육 콘텐츠 — 한국어 (ko)
// i18n 구조 · 9줄 2문단 (1차 3+2 / 2차 2+2)
// 1차(로딩) = 과거형 (역사 이야기)
// 2차(결과) = 현재형 (적용된 기법 설명)
// v70 - 2026-02-03 (subtitle1, subtitle2 분리)
// ========================================

// ========== 기본정보 ==========
export const orientalBasicInfo = {
  // ── 국가 레벨 (로딩 화면) ──
  'korean': {
    loading: {
      name: '한국 전통회화(Korean Traditional Painting)',
      subtitle1: '민화 · 풍속도 · 진경산수화',
      subtitle2: '여백에 정신을 담다'
    }
  },
  'chinese': {
    loading: {
      name: '중국 전통회화(Chinese Traditional Painting)',
      subtitle1: '수묵화 · 공필화',
      subtitle2: '먹의 농담으로 우주를 담다'
    }
  },
  'japanese': {
    loading: {
      name: '일본 전통회화(Japanese Traditional Painting)',
      subtitle1: '우키요에 · 린파',
      subtitle2: '거리의 판화, 금빛 장식화'
    }
  },

  // ── 장르 레벨 (결과 화면) ──
  'korean-minhwa': {
    result: {
      name: '한국 전통회화(Korean Traditional Painting)',
      subtitle1: '민화(Minhwa)',
      subtitle2: '소망을 담은 민중의 그림'
    }
  },
  'korean-pungsokdo': {
    result: {
      name: '한국 전통회화(Korean Traditional Painting)',
      subtitle1: '풍속도(Pungsokdo)',
      subtitle2: '민중의 일상을 담다'
    }
  },
  'korean-jingyeong': {
    result: {
      name: '한국 전통회화(Korean Traditional Painting)',
      subtitle1: '진경산수화(Jingyeong Sansuhwa)',
      subtitle2: '조선의 눈으로 본 산천'
    }
  },
  'chinese-gongbi': {
    result: {
      name: '중국 전통회화(Chinese Traditional Painting)',
      subtitle1: '공필화(Gongbi)',
      subtitle2: '붓끝으로 빚은 정밀함'
    }
  },
  'chinese-ink': {
    result: {
      name: '중국 전통회화(Chinese Traditional Painting)',
      subtitle1: '수묵화(Ink Wash)',
      subtitle2: '먹으로 그린 정신의 풍경'
    }
  },
  'japanese-ukiyoe': {
    result: {
      name: '일본 전통회화(Japanese Traditional Painting)',
      subtitle1: '우키요에(Ukiyo-e)',
      subtitle2: '떠도는 세상을 판화로 찍다'
    }
  },
  'japanese-rinpa': {
    result: {
      name: '일본 전통회화(Japanese Traditional Painting)',
      subtitle1: '린파(Rinpa)',
      subtitle2: '금박 위에 피어난 장식의 미학'
    }
  }
};


// ========== 1차 교육: 국가 Overview (로딩 화면, 5줄 = 3+2, 과거형) ==========
export const orientalLoadingEducation = {

  // ── 한국 ──
  korean: {
    description: `조선의 화가들은 중국에서 건너온 화법을 배웠지만, 그린 것은 이 땅의 산천과 사람이었습니다.
민화는 까치와 호랑이로 복을 빌었고, 풍속도는 서민의 일상을 담았습니다.
진경산수화는 관념이 아닌, 눈앞에 펼쳐진 실제 산천을 그렸습니다.\n\n여백이 말하고, 붓끝에 정신을 담는 예술이 한국 전통회화입니다.
소망과 일상과 산천을 붓에 담아, 이 땅의 것으로 피워낸 한국 회화를 만납니다.`
  },

  // ── 중국 ──
  chinese: {
    description: `한 폭의 산수화 앞에서 중국의 문인은 세상을 읽었습니다.
수묵화는 먹의 농담만으로 산을 세우고, 여백으로 안개를 피웠습니다.
공필화는 꽃잎 한 장까지 세밀하게 그려 황제에게 바쳤습니다.\n\n천 년 넘게 이어진 동양 회화의 원류가 중국 전통회화입니다.
먹과 채색으로 천 년을 이어, 동양 회화의 원류가 된 중국 회화를 만납니다.`
  },

  // ── 일본 ──
  japanese: {
    description: `에도의 거리에서는 판화가, 교토의 궁정에서는 장식화가 꽃피었습니다.
우키요에는 배우와 미인, 명소의 풍경을 목판에 새겨 서민에게 팔렸습니다.
린파는 금박 위에 붓꽃과 풍신을 그려 넣어 귀족의 눈을 사로잡았습니다.\n\n대중의 감각과 궁정의 화려함이 공존하는 예술이 일본 전통회화입니다.
거리와 궁정에서 태어나 바다를 건너, 서양을 뒤흔든 일본 회화를 만납니다.`
  }
};


// ========== 2차 교육: 장르별 결과 (결과 화면, 4줄 = 2+2, 현재형) ==========
export const orientalResultEducation = {

  // ── 한국: 민화 ──
  'korean-minhwa': {
    description: `민화의 화려한 색채와 자유로운 구도가 적용되었습니다.
오방색(청·적·황·백·흑)으로 칠하고, 원근법 없이 자유롭게 배치한 것이 특징입니다.\n\n모란은 부귀, 잉어는 출세, 호랑이는 벽사를 상징합니다.
집집마다 병풍에 걸었던 조선의 생활 미술이자, 소망을 담은 그림입니다.`
  },

  // ── 한국: 풍속도 ──
  'korean-pungsokdo': {
    description: `풍속도의 빠른 필선과 담백한 채색이 적용되었습니다.
세필담채법으로 인물의 동작과 표정을 포착하고, 여백으로 공간을 열어둡니다.\n\n씨름하는 장정, 빨래하는 아낙, 서당에서 조는 아이 — 조선의 일상이 살아 있습니다.
김홍도와 신윤복이 꽃피운, 붓끝으로 기록된 조선의 리얼리즘입니다.`
  },

  // ── 한국: 진경산수화 ──
  'korean-jingyeong': {
    description: `진경산수화의 힘찬 준법과 대담한 구도가 적용되었습니다.
이상적인 관념 산수를 벗어나, 눈앞에 펼쳐진 실제 산천을 직접 보고 그린 것이 특징입니다.\n\n금강산의 뾰족한 봉우리와 인왕산에 내리는 비의 풍경이 힘찬 필선으로 되살아납니다.
겸재 정선이 완성한, 이 땅의 진짜 풍경을 담은 미학입니다.`
  },

  // ── 중국: 공필화 ──
  'chinese-gongbi': {
    description: `공필화의 정밀한 필치와 투명한 채색이 적용되었습니다.
가느다란 붓으로 윤곽을 먼저 그리고, 투명한 색을 여러 겹 쌓아 깊이를 만듭니다.\n\n꽃과 새, 인물을 한 올 한 올 세밀하게 그려 황제의 눈을 사로잡습니다.
동양 세밀화의 정점이자, 궁정이 꽃피운 채색의 극치입니다.`
  },

  // ── 중국: 수묵화 ──
  'chinese-ink': {
    description: `수묵화의 먹 번짐과 여백의 미학이 적용되었습니다.
먹의 농담만으로 산과 물, 안개와 구름을 표현하고, 여백은 그 자체로 무한한 공간이 됩니다.\n\n파묵법으로 먹을 뿌리듯 번지게 하여 자연의 생명력을 담습니다.
문인이 붓 대신 정신을 화폭에 옮긴, 천 년 동양 회화의 정수입니다.`
  },

  // ── 일본: 우키요에 ──
  'japanese-ukiyoe': {
    description: `우키요에의 강렬한 윤곽선과 평면적 색면이 적용되었습니다.
대담한 윤곽선으로 형태를 잡고, 그 안을 평면적 색면으로 채우는 것이 특징입니다.\n\n호쿠사이의 〈가나가와의 큰 파도〉처럼 순간의 역동을 한 판에 새겨냅니다.
인상파에게 영감을 준, 동양에서 서양으로 건너간 시선입니다.`
  },

  // ── 일본: 린파 ──
  'japanese-rinpa': {
    description: `린파의 금박 장식과 대담한 화면 구성이 적용되었습니다.
금박 위에 안료를 얹고, 색을 겹겹이 흘려 넣어 자연의 질감을 만듭니다.\n\n오가타 고린의 〈붓꽃도 병풍〉처럼 화려한 자연이 금빛 위에 피어납니다.
귀족의 미감에서 태어나 아르누보에 영감을 준, 일본 장식화의 정수입니다.`
  },


  // ── 기본값 (매칭 실패 시, 현재형) ──
  'korean_default': {
    description: `한국 전통회화의 붓놀림과 여백의 미학이 적용되었습니다.
선비는 먹의 농담으로, 민중은 색채로 삶을 그린 것이 특징입니다.\n\n여백이 말하고, 붓끝에 정신을 담는 것이 한국 회화의 미학입니다.
민화, 풍속도, 진경산수화로 이어지는 조선 500년의 결정체입니다.`
  },
  'chinese_default': {
    description: `중국 전통회화의 먹과 채색의 조화가 적용되었습니다.
먹의 농담 하나로 산을 세우고, 여백 하나로 안개를 피우는 것이 특징입니다.\n\n문인의 정신과 궁정의 기교가 공존하는 것이 중국 회화입니다.
공필화와 수묵화로 이어지는 천 년 동양 회화의 원류입니다.`
  },
  'japanese_default': {
    description: `일본 전통회화의 윤곽선과 장식적 색면이 적용되었습니다.
대담한 윤곽선과 금박 위의 화려한 채색으로 아름다움을 새기는 것이 특징입니다.\n\n에도의 대중문화에서 태어난 판화와 궁정의 장식화가 공존하는 예술입니다.
거리와 궁정에서 태어나 바다를 건너, 서양을 뒤흔든 일본 회화입니다.`
  }
};


export default { orientalBasicInfo, orientalLoadingEducation, orientalResultEducation };
