// ═══════════════════════════════════════════════════════════════════
// 🎨 Master Valley - API 설정 파일
// ═══════════════════════════════════════════════════════════════════
// brush_size: 붓터치 크기 (런타임 주입)
// control_strength: Depth ControlNet 강도 (0.0~1.0)
// ═══════════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════════
// 텍스처 상수
// ═══════════════════════════════════════════════════════════════════

// 유화 질감 강제 (샌드위치 끝)
export const PAINT_TEXTURE = ' MUST look like HAND-PAINTED oil painting with VISIBLE THICK BRUSHSTROKES (20mm or thicker on subject).';

// 빈티지 질감 (v71: 비활성화)
export const VINTAGE_TEXTURE = '';

// 빈티지 제외 스타일 (특수 질감)
export const EXCLUDE_VINTAGE = [
  'classical-sculpture',  // 대리석
  'roman-mosaic',         // 모자이크 타일
  'byzantine',            // 금박
  'gothic',               // 스테인드글라스
  'islamic-miniature',    // 미니어처 (종이)
  'lichtenstein'          // 팝아트 (현대적)
];

// ═══════════════════════════════════════════════════════════════════
// 화가별 설정
// ═══════════════════════════════════════════════════════════════════
export const ARTIST_CONFIG = {
  // === 고대/중세 ===
  'classical-sculpture': { control_strength: 0.55, brush_size: null },
  'sculpture':           { control_strength: 0.55, brush_size: null },
  'roman-mosaic':        { control_strength: 0.60, brush_size: '75mm' },
  'mosaic':              { control_strength: 0.60, brush_size: '75mm' },
  'byzantine':           { control_strength: 0.60, brush_size: null },
  'gothic':              { control_strength: 0.50, brush_size: null },
  'islamic-miniature':   { control_strength: 0.80, brush_size: '25mm' },
  
  // === 르네상스 ===
  'botticelli':          { control_strength: 0.70, brush_size: '75mm' },
  'leonardo':            { control_strength: 0.65, brush_size: '75mm' },
  'titian':              { control_strength: 0.70, brush_size: '75mm' },
  'michelangelo':        { control_strength: 0.70, brush_size: '75mm' },
  'raphael':             { control_strength: 0.70, brush_size: '75mm' },
  
  // === 바로크 ===
  'caravaggio':          { control_strength: 0.50, brush_size: '75mm' },
  'rubens':              { control_strength: 0.50, brush_size: '90mm' },    // 바로크 임파스토
  'rembrandt':           { control_strength: 0.50, brush_size: '75mm' },
  'velazquez':           { control_strength: 0.50, brush_size: '75mm' },
  
  // === 로코코 ===
  'watteau':             { control_strength: 0.45, brush_size: '75mm' },
  'boucher':             { control_strength: 0.45, brush_size: '75mm' },
  
  // === 신고전/낭만/사실 ===
  'david':               { control_strength: 0.50, brush_size: '75mm' },
  'ingres':              { control_strength: 0.45, brush_size: '75mm' },
  'turner':              { control_strength: 0.45, brush_size: '75mm' },
  'delacroix':           { control_strength: 0.50, brush_size: '90mm' },    // 격정적 낭만주의
  'courbet':             { control_strength: 0.50, brush_size: '75mm' },
  'manet':               { control_strength: 0.50, brush_size: '75mm' },
  
  // === 인상주의 ===
  'renoir':              { control_strength: 0.30, brush_size: '75mm' },
  'monet':               { control_strength: 0.30, brush_size: '75mm' },
  'degas':               { control_strength: 0.50, brush_size: '75mm' },
  'caillebotte':         { control_strength: 0.50, brush_size: '75mm' },
  
  // === 후기인상주의 ===
  'vangogh':             { control_strength: 0.45, brush_size: '75mm' },    // 임파스토
  'gauguin':             { control_strength: 0.60, brush_size: '75mm' },
  'cezanne':             { control_strength: 0.65, brush_size: '75mm' },
  
  // === 야수파 ===
  'matisse':             { control_strength: 0.45, brush_size: '75mm' },
  'derain':              { control_strength: 0.45, brush_size: '90mm' },    // 두꺼운 터치
  'vlaminck':            { control_strength: 0.45, brush_size: '100mm' },   // 가장 격렬
  
  // === 표현주의 ===
  'munch':               { control_strength: 0.40, brush_size: '100mm' },   // 물결치는 붓터치
  'kirchner':            { control_strength: 0.10, brush_size: '100mm' },   // 거친 표현주의
  'kokoschka':           { control_strength: 0.10, brush_size: '100mm' },   // 폭력적 붓터치
  
  // === 모더니즘/팝아트 ===
  'picasso':             { control_strength: 0.10, brush_size: '75mm' },
  'magritte':            { control_strength: 0.40, brush_size: '75mm' },
  'miro':                { control_strength: 0.40, brush_size: '75mm' },
  'chagall':             { control_strength: 0.40, brush_size: '75mm' },
  'lichtenstein':        { control_strength: 0.30, brush_size: null },      // 벤데이 점
  
  // === 거장 ===
  'klimt':               { control_strength: 0.65, brush_size: '40mm' },    // 세밀 금박
  'frida':               { control_strength: 0.80, brush_size: '25mm' },    // 세밀 상징
  
  // === 동양화 ===
  'korean':              { control_strength: 0.75, brush_size: null },
  'chinese':             { control_strength: 0.75, brush_size: null },
  'japanese':            { control_strength: 0.75, brush_size: null },
};


// ═══════════════════════════════════════════════════════════════════
// 사조별 기본값 (화가 매칭 안 될 때 fallback)
// ═══════════════════════════════════════════════════════════════════
export const MOVEMENT_DEFAULTS = {
  'ancient-greek-sculpture':              { control_strength: 0.55, brush_size: null },
  'roman-mosaic':                         { control_strength: 0.60, brush_size: '75mm' },
  'byzantine':                            { control_strength: 0.55, brush_size: null },
  'islamic-miniature':                    { control_strength: 0.80, brush_size: '25mm' },
  'gothic':                               { control_strength: 0.50, brush_size: null },
  'renaissance':                          { control_strength: 0.80, brush_size: '75mm' },
  'baroque':                              { control_strength: 0.70, brush_size: '75mm' },
  'rococo':                               { control_strength: 0.70, brush_size: '75mm' },
  'neoclassicism':                        { control_strength: 0.80, brush_size: '75mm' },
  'neoclassicism_vs_romanticism_vs_realism': { control_strength: 0.80, brush_size: '75mm' },
  'romanticism':                          { control_strength: 0.80, brush_size: '75mm' },
  'impressionism':                        { control_strength: 0.60, brush_size: '75mm' },
  'post-impressionism':                   { control_strength: 0.55, brush_size: '75mm' },
  'pointillism':                          { control_strength: 0.55, brush_size: '25mm' },
  'fauvism':                              { control_strength: 0.45, brush_size: '75mm' },
  'expressionism':                        { control_strength: 0.45, brush_size: '75mm' },
  'modernism':                            { control_strength: 0.50, brush_size: '75mm' },
  'korean':                               { control_strength: 0.75, brush_size: null },
  'chinese':                              { control_strength: 0.75, brush_size: null },
  'japanese':                             { control_strength: 0.75, brush_size: null },
};


// ═══════════════════════════════════════════════════════════════════
// 화가명 정규화 매핑
// ═══════════════════════════════════════════════════════════════════
export const ARTIST_NAME_MAPPING = {
  'leonardodavinci': 'leonardo',
  'davinci': 'leonardo',
  '레오나르도': 'leonardo',
  '다빈치': 'leonardo',
  '레오나르도다빈치': 'leonardo',
  'vincentvangogh': 'vangogh',
  'vincent': 'vangogh',
  'gogh': 'vangogh',
  '반고흐': 'vangogh',
  '고흐': 'vangogh',
  '빈센트': 'vangogh',
  '빈센트반고흐': 'vangogh',
  'pierreaugusterenoir': 'renoir',
  '르누아르': 'renoir',
  '피에르오귀스트르누아르': 'renoir',
  'claudemonet': 'monet',
  '모네': 'monet',
  '클로드모네': 'monet',
  'edgardegas': 'degas',
  '드가': 'degas',
  '에드가드가': 'degas',
  'gustavecaillebotte': 'caillebotte',
  '카유보트': 'caillebotte',
  '귀스타브카유보트': 'caillebotte',
  'paulcezanne': 'cezanne',
  '세잔': 'cezanne',
  '폴세잔': 'cezanne',
  'henrimatisse': 'matisse',
  '마티스': 'matisse',
  '앙리마티스': 'matisse',
  'andrederain': 'derain',
  '드랭': 'derain',
  'mauricedevlaminck': 'vlaminck',
  '블라맹크': 'vlaminck',
  'edvardmunch': 'munch',
  '뭉크': 'munch',
  '에드바르뭉크': 'munch',
  'ernstludwigkirchner': 'kirchner',
  '키르히너': 'kirchner',
  'oskarkokoschka': 'kokoschka',
  '코코슈카': 'kokoschka',
  'pablopicasso': 'picasso',
  '피카소': 'picasso',
  '파블로피카소': 'picasso',
  'renemagritte': 'magritte',
  '마그리트': 'magritte',
  '르네마그리트': 'magritte',
  'joanmiro': 'miro',
  '미로': 'miro',
  '호안미로': 'miro',
  'marcchagall': 'chagall',
  '샤갈': 'chagall',
  '마르크샤갈': 'chagall',
  'roylichtenstein': 'lichtenstein',
  '리히텐슈타인': 'lichtenstein',
  '로이리히텐슈타인': 'lichtenstein',
  'gustavklimt': 'klimt',
  '클림트': 'klimt',
  '구스타프클림트': 'klimt',
  'fridakahlo': 'frida',
  '프리다': 'frida',
  '프리다칼로': 'frida',
  'antoinewatteau': 'watteau',
  '와토': 'watteau',
  'francoisboucher': 'boucher',
  '부셰': 'boucher',
  'jacqueslouisdavid': 'david',
  '다비드': 'david',
  'jeanaugustdominiqueingres': 'ingres',
  'jeanaugustedominiqueingres': 'ingres',
  '앵그르': 'ingres',
  'jmwturner': 'turner',
  '터너': 'turner',
  'eugenedelacroix': 'delacroix',
  '들라크루아': 'delacroix',
  'gustavecourbet': 'courbet',
  '쿠르베': 'courbet',
  'edouardmanet': 'manet',
  '마네': 'manet',
  'caravaggio': 'caravaggio',
  '카라바조': 'caravaggio',
  'peterpaulrubens': 'rubens',
  '루벤스': 'rubens',
  'rembrandt': 'rembrandt',
  '렘브란트': 'rembrandt',
  'diegovelazquez': 'velazquez',
  '벨라스케스': 'velazquez',
  'sandrobotticelli': 'botticelli',
  '보티첼리': 'botticelli',
  'titian': 'titian',
  '티치아노': 'titian',
  'michelangelo': 'michelangelo',
  '미켈란젤로': 'michelangelo',
  'raphael': 'raphael',
  '라파엘로': 'raphael',
  'paulgauguin': 'gauguin',
  '고갱': 'gauguin',
  '폴고갱': 'gauguin',
  'classicalsculpture': 'classical-sculpture',
  'sculpture': 'sculpture',
  'romanmosaic': 'roman-mosaic',
  'mosaic': 'mosaic',
  'byzantine': 'byzantine',
  '비잔틴': 'byzantine',
  'gothic': 'gothic',
  '고딕': 'gothic',
};


// ═══════════════════════════════════════════════════════════════════
// 유틸리티 함수
// ═══════════════════════════════════════════════════════════════════

/**
 * 화가명 정규화
 * @param {string} artist - 화가명 (다양한 형식)
 * @returns {string} - 정규화된 키
 */
export function normalizeArtistKey(artist) {
  if (!artist) return '';
  const normalized = artist.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/-/g, '')
    .replace(/[^a-z가-힣]/g, '');
  
  return ARTIST_NAME_MAPPING[normalized] || normalized;
}


/**
 * 화가 설정 가져오기
 * @param {string} artist - 화가명
 * @param {string} styleId - 사조 ID
 * @param {string} category - 카테고리 (movements/masters/oriental)
 * @returns {object} - { control_strength, brush_size }
 */
export function getArtistConfig(artist, styleId, category) {
  const artistKey = normalizeArtistKey(artist);
  
  // 1. 화가별 설정 확인
  if (artistKey && ARTIST_CONFIG[artistKey]) {
    return ARTIST_CONFIG[artistKey];
  }
  
  // 2. 사조별 기본값 확인
  if (styleId && MOVEMENT_DEFAULTS[styleId]) {
    return MOVEMENT_DEFAULTS[styleId];
  }
  
  // 3. 카테고리별 기본값
  if (category === 'oriental') {
    return { control_strength: 0.75, brush_size: null };
  } else if (category === 'modernism') {
    return { control_strength: 0.50, brush_size: '75mm' };
  } else if (category === 'masters') {
    return { control_strength: 0.55, brush_size: '75mm' };
  }
  
  // 4. 최종 기본값
  return { control_strength: 0.80, brush_size: '75mm' };
}


/**
 * 붓터치 크기 가져오기
 * @returns {string|null} - 예: '75mm' 또는 null
 */
export function getBrushSize(artist, styleId, category) {
  return getArtistConfig(artist, styleId, category).brush_size;
}


/**
 * 컨트롤 강도 가져오기
 * @returns {number} - 예: 0.45
 */
export function getControlStrength(artist, styleId, category) {
  return getArtistConfig(artist, styleId, category).control_strength;
}


// 콘솔 로그
console.log('⚙️ Master Valley API Config loaded:', Object.keys(ARTIST_CONFIG).length, 'artists');


export default {
  ARTIST_CONFIG,
  MOVEMENT_DEFAULTS,
  ARTIST_NAME_MAPPING,
  normalizeArtistKey,
  getArtistConfig,
  getBrushSize,
  getControlStrength
};
