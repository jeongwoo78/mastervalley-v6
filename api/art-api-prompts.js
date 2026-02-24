// ========================================
// Master Valley API Prompts v1.0
// 11개 파일 통합 버전
// 2026-02-09
// ========================================
// 원칙:
//   1. 부정어 완전 금지 (NO/NOT/NEVER/-free 등 FLUX가 무시하거나 역효과)
//   2. 모든 프롬프트는 긍정문으로만 작성
//   3. 대표작 프롬프트에 화풍 공통 요소 포함 (통합 프롬프트)
// ========================================


// ═══════════════════════════════════════════════════════════════════
// ⚙️ 화가별 설정 (수정하기 쉬운 위치)
// ═══════════════════════════════════════════════════════════════════
// control_strength: 원본 구도 유지 정도 (0.0~1.0, 높을수록 원본 유지)
// brush_size: 붓터치 크기 (null = 붓터치 없음)
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
  'rubens':              { control_strength: 0.50, brush_size: '90mm' },
  'rembrandt':           { control_strength: 0.50, brush_size: '75mm' },
  'velazquez':           { control_strength: 0.50, brush_size: '75mm' },
  
  // === 로코코 ===
  'watteau':             { control_strength: 0.45, brush_size: '75mm' },
  'boucher':             { control_strength: 0.45, brush_size: '75mm' },
  
  // === 신고전/낭만/사실 ===
  'david':               { control_strength: 0.50, brush_size: '75mm' },
  'ingres':              { control_strength: 0.45, brush_size: '75mm' },
  'turner':              { control_strength: 0.45, brush_size: '75mm' },
  'delacroix':           { control_strength: 0.50, brush_size: '90mm' },
  'courbet':             { control_strength: 0.50, brush_size: '75mm' },
  'manet':               { control_strength: 0.50, brush_size: '75mm' },
  
  // === 인상주의 ===
  'renoir':              { control_strength: 0.30, brush_size: '75mm' },
  'monet':               { control_strength: 0.30, brush_size: '75mm' },
  'degas':               { control_strength: 0.50, brush_size: '75mm' },
  'caillebotte':         { control_strength: 0.50, brush_size: '75mm' },
  
  // === 후기인상주의 ===
  'vangogh':             { control_strength: 0.45, brush_size: '75mm' },
  'gauguin':             { control_strength: 0.60, brush_size: '75mm' },
  'cezanne':             { control_strength: 0.65, brush_size: '75mm' },
  
  // === 야수파 ===
  'matisse':             { control_strength: 0.45, brush_size: '75mm' },
  'derain':              { control_strength: 0.45, brush_size: '90mm' },
  'vlaminck':            { control_strength: 0.45, brush_size: '100mm' },
  
  // === 표현주의 ===
  'munch':               { control_strength: 0.20, brush_size: '100mm' },
  'kirchner':            { control_strength: 0.10, brush_size: '100mm' },
  'kokoschka':           { control_strength: 0.10, brush_size: '100mm' },
  
  // === 모더니즘/팝아트 ===
  'picasso':             { control_strength: 0.10, brush_size: '75mm' },
  'magritte':            { control_strength: 0.10, brush_size: '75mm' },
  'miro':                { control_strength: 0.20, brush_size: '75mm' },
  'chagall':             { control_strength: 0.20, brush_size: '75mm' },
  'lichtenstein':        { control_strength: 0.30, brush_size: null },
  
  // === 거장 ===
  'klimt':               { control_strength: 0.65, brush_size: '40mm' },
  'frida':               { control_strength: 0.80, brush_size: '25mm' },
  
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
// 텍스처 상수
// ═══════════════════════════════════════════════════════════════════
export const PAINT_TEXTURE = ' MUST look like HAND-PAINTED oil painting with VISIBLE THICK BRUSHSTROKES (20mm or thicker on subject).';
export const VINTAGE_TEXTURE = '';
export const EXCLUDE_VINTAGE = [
  'classical-sculpture', 'roman-mosaic', 'byzantine', 'gothic', 'islamic-miniature', 'lichtenstein'
];


// ═══════════════════════════════════════════════════════════════════
// 화가명 정규화 매핑
// ═══════════════════════════════════════════════════════════════════
export const ARTIST_NAME_MAPPING = {
  'leonardodavinci': 'leonardo', 'davinci': 'leonardo', '레오나르도': 'leonardo', '다빈치': 'leonardo', '레오나르도다빈치': 'leonardo',
  'vincentvangogh': 'vangogh', 'vincent': 'vangogh', 'gogh': 'vangogh', '반고흐': 'vangogh', '고흐': 'vangogh', '빈센트': 'vangogh', '빈센트반고흐': 'vangogh',
  'pierreaugusterenoir': 'renoir', '르누아르': 'renoir', '피에르오귀스트르누아르': 'renoir',
  'claudemonet': 'monet', '모네': 'monet', '클로드모네': 'monet',
  'edgardegas': 'degas', '드가': 'degas', '에드가드가': 'degas',
  'gustavecaillebotte': 'caillebotte', '카유보트': 'caillebotte', '귀스타브카유보트': 'caillebotte',
  'paulcezanne': 'cezanne', '세잔': 'cezanne', '폴세잔': 'cezanne',
  'henrimatisse': 'matisse', '마티스': 'matisse', '앙리마티스': 'matisse',
  'andrederain': 'derain', '드랭': 'derain',
  'mauricedevlaminck': 'vlaminck', '블라맹크': 'vlaminck',
  'edvardmunch': 'munch', '뭉크': 'munch', '에드바르뭉크': 'munch',
  'ernstludwigkirchner': 'kirchner', '키르히너': 'kirchner',
  'oskarkokoschka': 'kokoschka', '코코슈카': 'kokoschka',
  'pablopicasso': 'picasso', '피카소': 'picasso', '파블로피카소': 'picasso',
  'renemagritte': 'magritte', '마그리트': 'magritte', '르네마그리트': 'magritte',
  'joanmiro': 'miro', '미로': 'miro', '호안미로': 'miro',
  'marcchagall': 'chagall', '샤갈': 'chagall', '마르크샤갈': 'chagall',
  'roylichtenstein': 'lichtenstein', '리히텐슈타인': 'lichtenstein', '로이리히텐슈타인': 'lichtenstein',
  'gustavklimt': 'klimt', '클림트': 'klimt', '구스타프클림트': 'klimt',
  'fridakahlo': 'frida', '프리다': 'frida', '프리다칼로': 'frida',
  'antoinewatteau': 'watteau', '와토': 'watteau',
  'francoisboucher': 'boucher', '부셰': 'boucher',
  'jacqueslouisdavid': 'david', '다비드': 'david',
  'jeanaugustdominiqueingres': 'ingres', 'jeanaugustedominiqueingres': 'ingres', '앵그르': 'ingres',
  'jmwturner': 'turner', '터너': 'turner',
  'eugenedelacroix': 'delacroix', '들라크루아': 'delacroix',
  'gustavecourbet': 'courbet', '쿠르베': 'courbet',
  'edouardmanet': 'manet', '마네': 'manet',
  'caravaggio': 'caravaggio', '카라바조': 'caravaggio',
  'peterpaulrubens': 'rubens', '루벤스': 'rubens',
  'rembrandt': 'rembrandt', '렘브란트': 'rembrandt',
  'diegovelazquez': 'velazquez', '벨라스케스': 'velazquez',
  'sandrobotticelli': 'botticelli', '보티첼리': 'botticelli',
  'titian': 'titian', '티치아노': 'titian',
  'michelangelo': 'michelangelo', '미켈란젤로': 'michelangelo',
  'raphael': 'raphael', '라파엘로': 'raphael',
  'paulgauguin': 'gauguin', '고갱': 'gauguin', '폴고갱': 'gauguin',
  'classicalsculpture': 'classical-sculpture', 'sculpture': 'sculpture',
  'romanmosaic': 'roman-mosaic', 'mosaic': 'mosaic',
  'byzantine': 'byzantine', '비잔틴': 'byzantine',
  'gothic': 'gothic', '고딕': 'gothic',
};


// ═══════════════════════════════════════════════════════════════════
// 유틸리티 함수
// ═══════════════════════════════════════════════════════════════════

export function normalizeArtistKey(artist) {
  if (!artist) return '';
  const normalized = artist.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/-/g, '')
    .replace(/[^a-z가-힣]/g, '');
  return ARTIST_NAME_MAPPING[normalized] || normalized;
}

export function getArtistConfig(artist, styleId, category) {
  const artistKey = normalizeArtistKey(artist);
  if (artistKey && ARTIST_CONFIG[artistKey]) return ARTIST_CONFIG[artistKey];
  if (styleId && MOVEMENT_DEFAULTS[styleId]) return MOVEMENT_DEFAULTS[styleId];
  if (category === 'oriental') return { control_strength: 0.75, brush_size: null };
  if (category === 'modernism') return { control_strength: 0.50, brush_size: '75mm' };
  if (category === 'masters') return { control_strength: 0.55, brush_size: '75mm' };
  return { control_strength: 0.80, brush_size: '75mm' };
}

export function getBrushSize(artist, styleId, category) {
  return getArtistConfig(artist, styleId, category).brush_size;
}

export function getControlStrength(artist, styleId, category) {
  return getArtistConfig(artist, styleId, category).control_strength;
}


// ═══════════════════════════════════════════════════════════════════
// 🏛️ 고대 그리스·로마 / 중세
// ═══════════════════════════════════════════════════════════════════

export const ANCIENT_MEDIEVAL_PROMPTS = {
  
  // ─────────────────────────────────────────
  // 대리석 (통합) — 84w
  // ─────────────────────────────────────────
  'marble': {
    name: '대리석 조각',
    nameEn: 'Marble Sculpture',
    prompt: `Ancient Greek-Roman marble sculpture style. Pure white Carrara marble with smooth polished surface, carved stone texture. Subject wears classical draped toga or stola. Style reference sculptures: Nike of Samothrace, Augustus of Prima Porta, Eirene, Pietà. Preserve original gender and body proportions.`
  },

  // ─────────────────────────────────────────
  // 로마 모자이크 (통합) — 노출 없는 안전한 참조작품만
  // ─────────────────────────────────────────
  'mosaic': {
    name: '로마 모자이크',
    nameEn: 'Roman Mosaic',
    prompt: `Ancient mosaic art style. PRESERVE ORIGINAL FACE AND SKIN TONE exactly using appropriate colored tiles. Large visible tesserae tiles 50mm, thick black grout lines between every tile, earth tone palette terracotta ochre umber ivory. Subject wears classical draped toga or stola. Opus tessellatum technique with geometric borders.`
  },

  // ─────────────────────────────────────────
  // 비잔틴
  // ─────────────────────────────────────────
  
  // ★ 유스티니아누스 — 139w
  'byzantine-justinian': {
    name: '유스티니아누스 황제',
    nameEn: 'Emperor Justinian',
    prompt: `Byzantine sacred wall mosaic of the subject. Tiny glass and gold leaf tesserae cover every surface including face, skin, hair, and clothing. Shimmering gold leaf background wall. Large wide eyes gaze directly forward. A circular golden halo radiates behind the head. Rich jewel-tone glass tiles for robes. Clothing transformed into Byzantine imperial robes with gold and jewels. Blazing gold tiles dominate the entire surface. Gold 60%, imperial purple 20%, ivory 10%, crimson 10%. A shimmering gold leaf wall fills the entire background. A jeweled crown and halo decorate the figure. Skin is rendered in warm ochre and earth toned tiles. Gold tiles blaze on the crown and robe edges. Tiles are vertically aligned in strict rows. Even bright frontal light shines throughout. Gold-purple tile contrast defines the shading. Jewel tone accents are placed as dots on the gold ground.`
  },

  // ★ 테오도라 — 138w
  'byzantine-theodora': {
    name: '테오도라 황후',
    nameEn: 'Empress Theodora',
    prompt: `Byzantine sacred wall mosaic of the subject. Tiny glass and gold leaf tesserae cover every surface including face, skin, hair, and clothing. Shimmering gold leaf background wall. Large wide eyes gaze directly forward. A circular golden halo radiates behind the head. Rich jewel-tone glass tiles for robes. Clothing transformed into Byzantine imperial robes with gold and jewels. Gold and deep purple tiles encrusted with jewel accents fill the scene. Gold 50%, deep purple 25%, ruby red 15%, ivory 10%. A gold leaf wall with an architectural niche fills the background. A jeweled crown and gemstone accents decorate the figure. Skin is rendered in warm ochre and earth toned tiles. Bright gold tiles gleam on crown and gem borders. Tiles are vertically aligned in strict rows. Soft even frontal light shines throughout. Purple-ruby tile contrast shades the robes. Jewel tone accents are concentrated on the crown area.`
  },

  // ★ 데이시스 — 131w
  'byzantine-deesis': {
    name: '데이시스',
    nameEn: 'Deesis',
    prompt: `Byzantine sacred wall mosaic of the subject. Tiny glass and gold leaf tesserae cover every surface including face, skin, hair, and clothing. Shimmering gold leaf background wall. Large wide eyes gaze directly forward. A circular golden halo radiates behind the head. Rich jewel-tone glass tiles for robes. Clothing transformed into Byzantine imperial robes with gold and jewels. Deep gold and blue tiles radiate outward from the center. Gold 45%, deep blue 25%, burgundy 20%, ivory 10%. A shimmering gold leaf wall wraps the entire background. Skin is rendered in warm ochre and earth toned tiles. Gold tiles blaze intensely at the halo edges. Tiles are arranged radially outward from the halo center. Bright light descends from above. Deep blue tiles create shadow in the robe folds. The gold ground holds alternating deep blue and burgundy accents.`
  },

  // ★ 판토크라토르 — 144w
  'byzantine-pantocrator': {
    name: '판토크라토르',
    nameEn: 'Christ Pantocrator',
    prompt: `Byzantine sacred wall mosaic of the subject. Tiny glass and gold leaf tesserae cover every surface including face, skin, hair, and clothing. Shimmering gold leaf background wall. Large wide eyes gaze directly forward. A circular golden halo radiates behind the head. Rich jewel-tone glass tiles for robes. Clothing transformed into Byzantine imperial robes with gold and jewels. Massive gold tiles fill the dome overhead. Gold 50%, deep blue 30%, dark brown 10%, ivory 10%. A massive gold leaf dome fills the entire background. A golden halo with a cross pattern surrounds the head. Skin is rendered in ochre and earth toned tiles with deep tonal weight. Gold tiles burst with light on the halo cross. Tiles are densely arranged in concentric circles following the halo. Strong penetrating frontal light shines throughout. Deep blue tiles cast heavy shadow on one side of the face. The gold ground uses only deep blue and brown to create depth.`
  },

  // ─────────────────────────────────────────
  // 고딕 스테인드글라스
  // ─────────────────────────────────────────

  // ★ 샤르트르 — 140w
  'gothic-chartres': {
    name: '샤르트르 푸른 성모',
    nameEn: 'Blue Virgin of Chartres',
    prompt: `Gothic cathedral stained glass window of the subject. Colored glass pieces joined by thick black lead came lines forming every surface including face, skin, hair, and clothing. Light transmits through translucent glass creating jewel-like luminous glow. Uneven glass thickness with tiny bubbles visible. Flat angular forms with heavy black outlines. Clothing transformed into medieval long robes. Dense cobalt blue glass glows with light from behind. Chartres blue 55%, ruby red 20%, gold 15%, ivory 10%. Dense cobalt blue glass wraps the entire background. A halo, crown, and jeweled decorative border surround the scene. Skin is rendered in warm amber and earth toned glass pieces. Gold glass glows warmly in the halo and crown. Glass pieces are vertically arranged creating height. Light transmits from behind illuminating the figure. Deep blue glass creates shadow in the robe folds. Ruby and gold accents are placed as dots on the blue ground.`
  },

  // ★ 노트르담 — 139w
  'gothic-notredame': {
    name: '노트르담 장미창',
    nameEn: 'Notre-Dame Rose Window',
    prompt: `Gothic cathedral stained glass window of the subject. Colored glass pieces joined by thick black lead came lines forming every surface including face, skin, hair, and clothing. Light transmits through translucent glass creating jewel-like luminous glow. Uneven glass thickness with tiny bubbles visible. Flat angular forms with heavy black outlines. Clothing transformed into medieval long robes. Ruby, sapphire, emerald and gold glass radiate in concentric rings. Ruby red 30%, sapphire blue 30%, emerald green 20%, gold 20%. Intricate geometric patterns fill the entire background. Geometric medallions, petal arches, and repeating motifs decorate the scene. Skin is rendered in warm amber and earth toned glass. Gold glass gleams at each medallion border. Glass pieces radiate outward from the center. Even light transmits from all directions creating uniform luminosity. Deep ruby and sapphire glass alternate to create depth. Four jewel colors are distributed in alternating concentric rings.`
  },

  // ★ 생트샤펠 — 138w
  'gothic-saintechapelle': {
    name: '생트샤펠',
    nameEn: 'Sainte-Chapelle',
    prompt: `Gothic cathedral stained glass window of the subject. Colored glass pieces joined by thick black lead came lines forming every surface including face, skin, hair, and clothing. Light transmits through translucent glass creating jewel-like luminous glow. Uneven glass thickness with tiny bubbles visible. Flat angular forms with heavy black outlines. Clothing transformed into medieval long robes. Intense ruby red glass panels tower vertically with light pouring through. Ruby red 45%, deep blue 25%, gold 20%, ivory 10%. Towering vertical panels fill the entire background. Vertical columns and pointed arches decorate the space. Skin is rendered in warm amber and earth toned glass. Gold glass gleams on column ornaments and arch tops. Glass pieces are arranged in tall vertical strips reaching skyward. Light pours down from above like a waterfall. Deep ruby glass casts a red shadow across the entire robe. The ruby ground holds blue and gold placed in vertical stripes.`
  },

  // ─────────────────────────────────────────
  // 이슬람 (페르시아 세밀화)
  // ─────────────────────────────────────────

  // ★ 꽃을 든 귀족 — 131w
  'islamic-youth': {
    name: '꽃을 든 귀족',
    nameEn: 'Youth Holding a Flower',
    prompt: `Persian miniature painting of the subject on paper. Extremely fine thin brush with meticulous detail throughout the composition. Mineral pigments and gold leaf creating jewel-bright vivid colors. Intricate patterns filling garments densely. Fine precise black outlines defining forms. Clothing transformed into Persian court robes and turban. Soft gold and jewel-bright pigments fill the surface. Gold 30%, ruby red 25%, sapphire blue 25%, ivory 20%. An elaborate floral border frames the background. A feathered turban ornament and floral motifs decorate the scene. Skin is rendered smooth in warm ochre and earth tones. Gold leaf glows softly on the turban ornament and border. Brushwork flows in delicate curving lines. Gentle even light spreads throughout. Soft red-blue gradation shades the robe folds. Ruby and sapphire alternate within the gold border frame.`
  },

  // ★ 미라지 — 132w
  'islamic-miraj': {
    name: '미라지 (승천도)',
    nameEn: 'Miraj (Night Journey)',
    prompt: `Persian miniature painting of the subject on paper. Extremely fine thin brush with meticulous detail throughout the composition. Mineral pigments and gold leaf creating jewel-bright vivid colors. Intricate patterns filling garments densely. Fine precise black outlines defining forms. Clothing transformed into Persian court robes and turban. Blazing gold flames and lapis blue swirl across the scene. Gold 35%, lapis blue 25%, ruby red 20%, emerald 20%. Swirling clouds and flames fill the entire background. Flame halos and cloud spirals decorate the scene. Skin is rendered in warm ochre tones with a luminous glow. Gold leaf blazes explosively on the flames and halo. Brushwork sweeps diagonally upward. Intense golden light pours from above. Lapis blue and ruby red contrast within the clouds. Four jewel colors are scattered like flames on the gold ground.`
  },

  // ★ 시무르그 — 135w
  'islamic-simurgh': {
    name: '시무르그',
    nameEn: 'Simurgh',
    prompt: `Persian miniature painting of the subject on paper. Extremely fine thin brush with meticulous detail throughout the composition. Mineral pigments and gold leaf creating jewel-bright vivid colors. Intricate patterns filling garments densely. Fine precise black outlines defining forms. Clothing transformed into Persian court robes and turban. Turquoise and gold shimmer across a lush garden surface. Turquoise 30%, gold 30%, ruby red 20%, emerald 20%. A lush garden with flowers and trees fills the entire background. Flowers, vines, and feather motifs decorate every space. Skin is rendered in warm ochre tones with a rich feel. Gold leaf shimmers on ornamental edges and petal tips. Brushwork follows the curves of vines and floral patterns. Even bright light shines throughout. Emerald and turquoise create depth in the foliage. Four colors are distributed by nature with emerald for leaves and ruby for flowers.`
  },

  // ★ 정원의 연인들 — 136w
  'islamic-lovers': {
    name: '정원의 연인들',
    nameEn: 'Lovers in a Garden',
    prompt: `Persian miniature painting of the subject on paper. Extremely fine thin brush with meticulous detail throughout the composition. Mineral pigments and gold leaf creating jewel-bright vivid colors. Intricate patterns filling garments densely. Fine precise black outlines defining forms. Clothing transformed into Persian court robes and turban. Soft blue moonlight and gold reflections fill the scene. Gold 25%, soft blue 30%, rosy pink 25%, ivory 20%. A moonlit garden with cypress trees and flowering shrubs fills the background. Flowers, cypress, and crescent moon decorate the scene. Skin is rendered soft in warm ochre and earth tones. Gold leaf glows gently in the moonlight and water reflections. Brushwork follows the soft curves of trees and flowers. Gentle moonlight descends from above. Soft blue creates depth in the night sky and shadows. Pink and gold are placed like flower dots on the blue ground.`
  },

  // ★ 루스탐과 용 — 127w
  'islamic-rustam': {
    name: '루스탐과 용',
    nameEn: 'Rustam Slaying the Dragon',
    prompt: `Persian miniature painting of the subject on paper. Extremely fine thin brush with meticulous detail throughout the composition. Mineral pigments and gold leaf creating jewel-bright vivid colors. Intricate patterns filling garments densely. Fine precise black outlines defining forms. Clothing transformed into Persian court robes and turban. Vermillion and gold flash across rocky terrain. Vermillion 30%, lapis blue 25%, gold 25%, emerald 20%. Rocky mountains and rough terrain fill the background. Skin is rendered firm in warm ochre and earth tones. Gold leaf flashes sharply on the highest surfaces. Brushwork crosses dynamically along diagonal lines. Intense light strikes from the upper left. Deep lapis blue adds weight to the rocks and shadows. Vermillion and gold are concentrated at the center of the scene.`
  }
};


// ═══════════════════════════════════════════════════════════════════
// 🎨 르네상스
// ═══════════════════════════════════════════════════════════════════

export const RENAISSANCE_PROMPTS = {

  // ─────────────────────────────────────────
  // 보티첼리
  // ─────────────────────────────────────────

  // ★ 프리마베라 — 105w
  'botticelli-primavera': {
    name: '프리마베라',
    nameEn: 'Primavera',
    prompt: `Tempera painting of the subject by Sandro Botticelli. Thin translucent layers build up to create a smooth luminous surface. Precise delicate dark outlines define every form clearly. Elegant elongated figures hold graceful S-curved postures. Edges between forms remain sharp and clean. Soft bright spring garden tone wraps the scene. Pale rose 30%, forest green 25%, gold 20%, ivory 25%. Dense orange grove and flowering meadow fill the background. Wildflowers, orange blossoms, and laurel wreaths decorate the scene. Skin luminous in pale ivory and soft pink. Gold accents glow softly on fabric edges. Brushwork follows the graceful contours of each form. Soft even spring light illuminates throughout. Forest green deepens in foliage behind figures. Pale tones layered delicately across the composition.`
  },

  // ★ 비너스의 탄생 — 108w
  'botticelli-birthofvenus': {
    name: '비너스의 탄생',
    nameEn: 'Birth of Venus',
    prompt: `Tempera painting of the subject by Sandro Botticelli. Thin translucent layers build up to create a smooth luminous surface. Precise delicate dark outlines define every form clearly. Elegant elongated figures hold graceful S-curved postures. Edges between forms remain sharp and clean. Soft ethereal pastel tone drifts across the scene like sea mist. Pale aqua blue 30%, soft pink 25%, ivory 25%, gold 20%. Calm turquoise sea and pale sky fill the background. Roses float gently in the breeze. Skin glows smooth like polished marble in pale ivory and soft pink. Gold shimmers across flowing hair and shell edges. Brushwork follows the flowing movement of wind and waves. Soft delicate light illuminates from the left. Aqua blue deepens gently in the sea and sky. Bright figures rise luminously against the cool blue ground.`
  },

  // ─────────────────────────────────────────
  // 레오나르도 다 빈치
  // ─────────────────────────────────────────

  // ★ 모나리자 — 115w (Gold Standard)
  'leonardo-monalisa': {
    name: '모나리자',
    nameEn: 'Mona Lisa',
    prompt: `Hand-painted oil painting of the subject by Leonardo da Vinci. Thin oil glazes are layered gradually over a toned ground. The surface appears smooth and glossy like polished enamel, with brushstrokes melted seamlessly into the surface. A deep golden brown atmosphere wraps the scene like drifting mist. Dark brown 35%, olive green 25%, golden amber 25%, ivory 15%. Distant hazy landscape dissolves into soft atmospheric depth behind the figure. Skin glows softly through warm amber and ivory glazes, outlines vanish as edges dissolve like smoke. Soft diffused light falls from the upper left, resting gently on the forehead and bridge of the nose. Deep dark brown surrounds the figure as forms fade softly at their boundaries. Bright layers are built up gradually over the toned ground.`
  },

  // ★ 최후의 만찬 — 108w
  'leonardo-lastsupper': {
    name: '최후의 만찬',
    nameEn: 'The Last Supper',
    prompt: `Tempera and oil mural of the subject by Leonardo da Vinci. Pigments mixed with egg and oil applied in thin layers on dry plaster over a white ground. The surface has a matte chalky quality. Heavy dark brown presses down across the scene. Dark brown 35%, deep blue 25%, crimson red 20%, ivory 20%. Deep perspective stone hall stretches toward a central vanishing point. Skin emerges softly from darkness in warm amber and ivory, outlines vanish as edges dissolve like smoke. Bright light pours through the window behind the central figure. Deep dark brown settles heavily across the ceiling and walls, forms fade softly at their boundaries. Red and blue garments alternate among figures within the dark architectural space.`
  },

  // ★ 암굴의 성모 — 123w
  'leonardo-virginrocks': {
    name: '암굴의 성모',
    nameEn: 'Virgin of the Rocks',
    prompt: `Hand-painted oil painting of the subject by Leonardo da Vinci. Thin oil glazes are layered gradually over a toned ground. The surface appears smooth and glossy like polished enamel, with brushstrokes melted seamlessly into the surface. Dark damp blue-brown cavern light pervades the scene. Dark brown 30%, deep blue-green 30%, amber gold 20%, ivory 20%. Sharp rocky pillars and a dark grotto surround the figures. Small wildflowers and moss grow from rock crevices. Skin glows softly in ivory and warm amber emerging from the darkness, outlines vanish as edges dissolve like smoke. Golden light gently seeps into hair and fabric edges. Dim light descends from above illuminating only the figures. Deep blue-green creates depth in the cave walls and shadows, forms fade softly at their boundaries. Bright skin and garments rise from the dark cavern.`
  },

  // ─────────────────────────────────────────
  // 티치아노
  // ─────────────────────────────────────────

  // ★ 바쿠스와 아리아드네 — 112w
  'titian-bacchus': {
    name: '바쿠스와 아리아드네',
    nameEn: 'Bacchus and Ariadne',
    prompt: `Hand-painted oil painting of the subject by Titian. Rich layered oil glazes build a luminous glowing surface. Colors are applied in broad warm masses rather than lines. Edges between forms dissolve softly into atmospheric warmth. Intense ultramarine and sunlight explode across the scene. Ultramarine blue 35%, crimson red 25%, gold 20%, ivory 20%. Dazzling ultramarine blue sky fills the entire background. Grapevines and garlands decorate the scene. Skin glows healthy in warm apricot and ivory. Crimson red blazes intensely on billowing drapery. Brushwork sweeps along bold diagonal motion. Bright Mediterranean sunlight illuminates the scene. Ultramarine blue creates deep depth in sky and fabrics. Vivid blue sky contrasts against red drapery and golden flesh.`
  },

  // ★ 성모 승천 — 119w
  'titian-assumption': {
    name: '성모 승천',
    nameEn: 'Assumption of the Virgin',
    prompt: `Hand-painted oil painting of the subject by Titian. Rich layered oil glazes build a luminous glowing surface. Colors are applied in broad warm masses rather than lines. Edges between forms dissolve softly into atmospheric warmth. Gold light surges upward and bursts across the scene. Crimson red 35%, golden yellow 30%, deep blue 20%, ivory 15%. Golden clouds fill the upper space while darkness settles below. Add golden clouds and small floating angels to decorate the scene. Skin holds a warm glow in ivory and golden tones. Gold light bursts from the upper clouds and robes. Brushwork surges powerfully upward. Intense golden light pours from above wrapping the central figure. Deep blue adds weight to the lower figures and shadows. Gold and crimson intensify toward the top.`
  },

  // ─────────────────────────────────────────
  // 미켈란젤로
  // ─────────────────────────────────────────

  // ★ 아담의 창조 — 111w
  'michelangelo-adam': {
    name: '아담의 창조',
    nameEn: 'Creation of Adam',
    prompt: `Buon fresco of the subject by Michelangelo. Pigments are pressed firmly into fresh wet plaster. Strong bold contours define every form with sculptural weight. The surface is matte and chalky like dried plaster. Edges between forms cut crisp and solid like carved stone. Warm apricot light glows under a vast open sky. Warm apricot 35%, soft grey 25%, olive green 20%, ivory 20%. Vast open sky leaves the space empty and expansive. Skin shines solid and sculptural in warm apricot and ivory. Light concentrates on the highest points of the form. Brushwork flows powerfully along the curves of the body. Soft even light reveals the forms throughout. Soft grey creates gentle shadows beneath the forms. Warm flesh rises vividly against the empty open sky.`
  },

  // ★ 최후의 심판 — 118w
  'michelangelo-lastjudgment': {
    name: '최후의 심판',
    nameEn: 'The Last Judgment',
    prompt: `Buon fresco of the subject by Michelangelo. Pigments are pressed firmly into fresh wet plaster. Strong bold contours define every form with sculptural weight. The surface is matte and chalky like dried plaster. Edges between forms cut crisp and solid like carved stone. Dark blue and flesh tones swirl in a massive vortex. Deep apricot 30%, dark blue 30%, burnt sienna 25%, ivory 15%. A vast sky splits between light above and darkness below. Add swirling forms and small hovering angels to decorate the scene. Skin shines firmly on the forms in deep apricot and burnt sienna. Intense light explodes around the central figure. Brushwork spirals following ascending and descending masses. Intense light radiates from the center dividing the scene. Dark blue sinks heavily at the bottom and edges. Bright flesh placed at center, dark blue reserved for the edges.`
  },

  // ─────────────────────────────────────────
  // 라파엘로
  // ─────────────────────────────────────────

  // ★ 아테네 학당 — 130w
  'raphael-athens': {
    name: '아테네 학당',
    nameEn: 'School of Athens',
    prompt: `Hand-painted oil painting of the subject by Raphael. Smooth refined layers of oil build a flawless luminous surface. Soft balanced outlines define forms with gentle clarity. Figures hold perfectly balanced harmonious postures. Edges between forms transition smoothly and gracefully. Warm sandstone light pours through arches across the scene. Warm sandstone 35%, terracotta 25%, soft blue 20%, ivory 20%. A grand arched stone hall recedes deeply in perspective. Classical statues and vaulted ceilings fill the architectural space. Skin glows healthy and ideal in warm ivory and apricot. Bright light pours through the central arch. Brushwork flows along the perspective lines into depth. Natural light streams from the central arch illuminating throughout. Terracotta creates warm shadows on columns and walls. Blue and red garments are dotted among figures within warm stone tones.`
  },

  // ★ 시스티나 마돈나 — 124w
  'raphael-sistinamadonna': {
    name: '시스티나 마돈나',
    nameEn: 'Sistine Madonna',
    prompt: `Hand-painted oil painting of the subject by Raphael. Smooth refined layers of oil build a flawless luminous surface. Soft balanced outlines define forms with gentle clarity. Figures hold perfectly balanced harmonious postures. Edges between forms transition smoothly and gracefully. Soft golden light glows through parting clouds. Deep blue 35%, golden yellow 25%, crimson red 20%, ivory 20%. Golden clouds part open revealing a heavenly space beyond. Curtains drawn aside on both sides with cherubs below. Skin glows soft and ideal in warm ivory and pale pink. Gold shimmers gently on cloud and curtain edges. Brushwork spreads outward following the parting curtains and clouds. Bright light pours from behind wrapping the central figure. Deep blue creates depth in robes and curtains. Blue robes and crimson drapery contrast against golden clouds.`
  },

  // ★ 갈라테아의 승리 — 120w
  'raphael-galatea': {
    name: '갈라테아의 승리',
    nameEn: 'Triumph of Galatea',
    prompt: `Hand-painted oil painting of the subject by Raphael. Smooth refined layers of oil build a flawless luminous surface. Soft balanced outlines define forms with gentle clarity. Figures hold perfectly balanced harmonious postures. Edges between forms transition smoothly and gracefully. A bright vibrant Mediterranean sea tone fills the scene. Aqua blue 35%, crimson red 25%, apricot 20%, ivory 20%. Bright aqua blue sea and sky fill the entire background. Add small cupids flying in the sky to decorate the scene. Skin glows healthy and lively in warm apricot and ivory. Crimson red blazes on the billowing cloak. Brushwork swirls following the churning sea and wind. Bright Mediterranean sunlight illuminates the scene. Aqua blue creates depth in waves and sky. Red cloak and golden flesh contrast against the vivid blue sea.`
  }
};


// ═══════════════════════════════════════════════════════════════════
// 🎭 바로크
// ═══════════════════════════════════════════════════════════════════

export const BAROQUE_PROMPTS = {

  // ─────────────────────────────────────────
  // 카라바조
  // ─────────────────────────────────────────

  // ★ 성 마태의 소명 — 108w
  'caravaggio-matthew': {
    name: '성 마태의 소명',
    nameEn: 'Calling of Saint Matthew',
    prompt: `Hand-painted oil painting of the subject by Caravaggio. Dark opaque ground covers the entire canvas. Paint applied directly in bold swift patches. Light alone carves forms out of surrounding darkness. The surface is smooth and unblended. Edges between lit flesh and black shadow cut hard and abrupt. Bright light cuts through deep darkness. Deep black 40%, golden amber 25%, dark brown 20%, ivory 15%. A dark interior shrouded in heavy shadow. Skin emerges sharply from darkness in warm amber and ivory. A shaft of golden light cuts diagonally across the scene. Brushwork follows the diagonal path of light. Intense light pours from the upper right. Deep black swallows everything outside the light. Warm amber concentrates where light falls, black claims everything else.`
  },

  // ★ 엠마오의 저녁식사 — 107w
  'caravaggio-supper': {
    name: '엠마오의 저녁식사',
    nameEn: 'Supper at Emmaus',
    prompt: `Hand-painted oil painting of the subject by Caravaggio. Dark opaque ground covers the entire canvas. Paint applied directly in bold swift patches. Light alone carves forms out of surrounding darkness. The surface is smooth and unblended. Edges between lit flesh and black shadow cut hard and abrupt. Deep darkness with sharp light striking from above and left. Deep black 30%, warm brown 25%, crimson red 20%, ivory 25%. A dark wall closes in behind the figures. Skin glows in warm amber and ivory lit dramatically from above. Bright light strikes the central figures and bright surfaces. Brushwork radiates outward from the center. Strong direct light falls from above and left. Deep black closes in from all sides pressing against figures. Warm tones and crimson gather at center while darkness claims the edges.`
  },

  // ─────────────────────────────────────────
  // 루벤스
  // ─────────────────────────────────────────

  // ★ 십자가에서 내려지심 — 109w
  'rubens-descent': {
    name: '십자가에서 내려지심',
    nameEn: 'Descent from the Cross',
    prompt: `Hand-painted oil painting of the subject by Peter Paul Rubens. Thick glossy oil paint overflows abundantly onto canvas. Rich sensuous colors burst with explosive energy. Outlines surge as forms move dynamically. Glossy richly textured surface with visible brushwork. Forms push into each other in flowing motion. Pale light cuts diagonally downward through deep darkness. Deep black 35%, ivory 25%, crimson red 20%, warm ochre 20%. Dark night sky fills the background. Skin glows pale in cold ivory and cool grey. Bright light concentrates on the central flesh and white cloth. Brushwork follows the diagonal path of light. Dramatic light pours from the upper left illuminating only the center. Deep black swallows the edges and background heavily. Bright flesh and white cloth placed at center with darkness surrounding all sides.`
  },

  // ★ 사랑의 정원 — 113w
  'rubens-garden': {
    name: '사랑의 정원',
    nameEn: 'The Garden of Love',
    prompt: `Hand-painted oil painting of the subject by Peter Paul Rubens. Thick glossy oil paint overflows abundantly onto canvas. Rich sensuous colors burst with explosive energy. Outlines surge as forms move dynamically. Glossy richly textured surface with visible brushwork. Forms push into each other in flowing motion. Warm golden light spreads warmly over a lavish garden scene. Gold 30%, crimson red 25%, olive green 25%, ivory 20%. Lush garden trees and Baroque architectural columns fill the background. Add small flying cupids and flower garlands to decorate the scene. Skin glows warmly in warm peach and pearlescent ivory. Gold light flashes across the figures and rich fabric folds. Brushwork flows along the elegant curves of the figures. Warm afternoon sunlight descends from the left. Olive green settles into the tree shade and deep garden areas. Crimson and gold placed on the figures with green reserved for the background garden.`
  },

  // ─────────────────────────────────────────
  // 렘브란트
  // ─────────────────────────────────────────

  // ★ 야경 — 102w
  'rembrandt-nightwatch': {
    name: '야경',
    nameEn: 'The Night Watch',
    prompt: `Hand-painted oil painting of the subject by Rembrandt. Thick oil paint builds up in rough impasto layers. Deep brown and golden tones emerge softly from surrounding darkness. Only the lit areas read clearly while the rest sinks into shadow. The surface is thick and rough with visible paint texture. Edges between light and dark dissolve softly. Golden spotlight pours through deep surrounding darkness. Deep black 35%, golden yellow 25%, warm brown 25%, ivory 15%. A dim arched building fades into deep darkness behind. Skin glows in warm golden tones and ivory where the light strikes. Strong golden light falls onto the central figures brightly. Rough brushwork in the foreground grows smoother toward the shadowed background. Intense spotlight strikes the center directly from the upper left. Deep black swallows the back rows and background heavily. Golden light concentrated on central figures with black claiming all the rest.`
  },

  // ★ 자화상 — 108w
  'rembrandt-selfportrait': {
    name: '자화상',
    nameEn: 'Self-Portrait',
    prompt: `Hand-painted oil painting of the subject by Rembrandt. Thick oil paint builds up in rough impasto layers. Deep brown and golden tones emerge softly from surrounding darkness. Only the lit areas read clearly while the rest sinks into shadow. The surface is thick and rough with visible paint texture. Edges between light and dark dissolve softly. Warm golden brown pulls a single face out of surrounding darkness. Warm brown 35%, golden yellow 25%, deep black 25%, ivory 15%. A dark plain brown surface fills simply behind the figure. Skin glows deeply in golden ivory and warm ochre. Soft golden light settles on the forehead, nose tip, and cheeks. Brushwork builds up in concentrated strokes, creating form through texture rather than contour. Warm light from the left gently envelops one half of the face. Deep brown swallows the right half and background. Golden tones reserved for the face only with brown and black claiming all the rest.`
  },

  // ★ 돌아온 탕자 — 106w
  'rembrandt-prodigal': {
    name: '돌아온 탕자',
    nameEn: 'Return of the Prodigal Son',
    prompt: `Hand-painted oil painting of the subject by Rembrandt. Thick oil paint builds up in rough impasto layers. Deep brown and golden tones emerge softly from surrounding darkness. Only the lit areas read clearly while the rest sinks into shadow. The surface is thick and rough with visible paint texture. Edges between light and dark dissolve softly. Warm crimson and gold spread quietly from deep surrounding darkness. Deep black 35%, crimson red 25%, gold 25%, ivory 15%. Deep darkness recedes endlessly behind the figures. Skin glows in warm golden tones and ivory where the light falls. Golden light concentrates warmly on the central figures. Brushwork flows downward wrapping gently from above. Warm light from the upper left softly illuminates only the central figures. Deep black swallows the surrounding areas and background deeply. Crimson and gold placed on central figures with black claiming all the rest.`
  },

  // ─────────────────────────────────────────
  // 벨라스케스
  // ─────────────────────────────────────────

  // ★ 시녀들 — 108w
  'velazquez-meninas': {
    name: '시녀들',
    nameEn: 'Las Meninas',
    prompt: `Hand-painted oil painting of the subject by Diego Velázquez. Thin fluid paint laid in subtle broken touches that dissolve up close. Silvery grey tones float through the composition. Outlines soften into atmospheric haze. The surface appears effortless with a luminous airy quality. Edges between forms blur into surrounding haze. Silvery grey light floats quietly through a deep palace interior. Silver grey 30%, black 25%, warm ochre 25%, ivory 20%. A deep palace room recedes toward an open doorway at the far wall. Skin glows softly in ivory and warm peach. Silver light sparkles softly on hair and silk fabric. Brushwork dissolves into shimmering daubs that scatter light across the scene. Soft natural light enters at an angle from the right window. Silver grey settles deep into the far room and ceiling. Bright ivory placed on foreground figures with black reserved for the deep background.`
  },

  // ★ 교황 인노켄티우스 10세 — 106w
  'velazquez-pope': {
    name: '교황 인노켄티우스 10세',
    nameEn: 'Portrait of Pope Innocent X',
    prompt: `Hand-painted oil painting of the subject by Diego Velázquez. Thin fluid paint laid in subtle broken touches that dissolve up close. Silvery grey tones float through the composition. Outlines soften into atmospheric haze. The surface appears effortless with a luminous airy quality. Edges between forms blur into surrounding haze. Intense crimson red dominates the entire scene with burning heat. Crimson red 45%, ivory 25%, gold 15%, black 15%. Deep crimson curtain fills completely behind the figure. Skin glows sharply in warm ivory and flushed pink. White light catches sharply on the silk ridges and folds. Brushwork follows the vertical flow of silk folds. Strong light strikes directly from the left onto the face and robes. Black sinks into the deep folds and background. Crimson claims most of the surface with ivory reserved for the face and silk only.`
  },

  // ★ 브레다의 항복 — 107w
  'velazquez-breda': {
    name: '브레다의 항복',
    nameEn: 'Surrender of Breda',
    prompt: `Hand-painted oil painting of the subject by Diego Velázquez. Thin fluid paint laid in subtle broken touches that dissolve up close. Silvery grey tones float through the composition. Outlines soften into atmospheric haze. The surface appears effortless with a luminous airy quality. Edges between forms blur into surrounding haze. Silvery haze floats lightly over a wide scene. Silver grey 30%, warm ochre 25%, olive green 25%, ivory 20%. A wide open plain fills the entire background. Skin glows softly in ivory and warm ochre. Silver light flashes coldly across the figures. Brushwork follows vertical lines upward. Soft even natural light illuminates the entire scene. Olive green settles into the lower areas and the ground. Silver and ochre placed on foreground figures with grey and green reserved for the background.`
  }
};


// ═══════════════════════════════════════════════════════════════════
// 🎀 로코코
// ═══════════════════════════════════════════════════════════════════

export const ROCOCO_PROMPTS = {

  // ─────────────────────────────────────────
  // 와토
  // ─────────────────────────────────────────

  // ★ 키테라 섬으로의 순례 — 109w
  'watteau-cythera': {
    name: '키테라 섬으로의 순례',
    nameEn: 'Pilgrimage to Cythera',
    prompt: `Hand-painted oil painting of the subject by Jean-Antoine Watteau. Thin delicate brushstrokes laid lightly like silk threads. Soft pastel tones float like mist across the surface. Outlines dissolve softly into soft haze. The surface glows feather-light and translucent. Edges between forms vanish into surrounding soft light. Soft golden pink light spreads hazily over a distant landscape. Rose pink 30%, gold 25%, olive green 25%, sky blue 20%. Misty distant mountains and soft sky fill the entire background. Add small cupids floating in the sky to decorate the scene. Skin glows delicately in soft ivory and pale rose. Gold light shimmers softly across the figures. Brushwork flickers softly in light, sweeping strokes across the scene. Soft twilight glow wraps the scene from behind. Olive green settles gently into tree shade and meadow. Pink and gold placed on the figures with blue and green reserved for the distant background.`
  },

  // ★ 피에로 — 101w
  'watteau-pierrot': {
    name: '피에로',
    nameEn: 'Pierrot (Gilles)',
    prompt: `Hand-painted oil painting of the subject by Jean-Antoine Watteau. Thin delicate brushstrokes laid lightly like silk threads. Soft pastel tones float like mist across the surface. Outlines dissolve softly into soft haze. The surface glows feather-light and translucent. Edges between forms vanish into surrounding soft light. Silvery white light wraps the scene softly. Ivory white 40%, olive green 25%, warm brown 20%, sky blue 15%. Low trees and an overcast sky fill the background simply. Skin glows quietly in soft ivory and warm peach. Silver light spreads softly across the bright white fabric. Brushwork flows downward following the vertical folds of fabric. Soft frontal light illuminates the figure evenly. Olive green settles lightly into the lower areas and background trees. Ivory white claims the entire figure with green and brown reserved for the background.`
  },

  // ★ 사랑의 축제 — 103w
  'watteau-fete': {
    name: '사랑의 축제',
    nameEn: 'The Pleasures of the Ball',
    prompt: `Hand-painted oil painting of the subject by Jean-Antoine Watteau. Thin delicate brushstrokes laid lightly like silk threads. Soft pastel tones float like mist across the surface. Outlines dissolve softly into soft haze. The surface glows feather-light and translucent. Edges between forms vanish into surrounding soft light. Warm golden pastel light spreads over an elegant outdoor gathering. Gold 30%, rose pink 25%, ivory 25%, olive green 20%. Grand garden architecture and tall trees fill the background. Skin glows delicately in soft ivory and pale pink. Gold light sparkles softly across the figures. Brushwork flows along the flowing movement of figures. Warm afternoon light descends softly from the upper left. Olive green settles into tree shade and behind the architecture. Gold and pink placed on foreground figures with green reserved for the background garden.`
  },

  // ─────────────────────────────────────────
  // 부셰
  // ─────────────────────────────────────────

  // ★ 퐁파두르 부인 — 109w
  'boucher-pompadour': {
    name: '퐁파두르 부인',
    nameEn: 'Madame de Pompadour',
    prompt: `Hand-painted oil painting of the subject by François Boucher. Soft smooth paint laid lightly like billowing clouds. Sweet pastel pink and blue tint the surface decoratively. Outlines flow in graceful soft curves. The surface glows porcelain-smooth and ornamental. Edges between forms melt into gentle curves. Elegant sage green and rose pink wrap the scene with refinement. Sage green 30%, rose pink 25%, ivory 25%, gold 20%. An ornate Rococo interior and bookshelf fill the background. Rose bouquets and lace decorate the scene. Skin glows porcelain-smooth in soft ivory and delicate peach. Silver light sparkles softly on the silk folds. Brushwork flows along the soft curves of fabric. Soft indoor light wraps the figure evenly. Sage green settles into the deep folds and background. Green and pink placed on the figure with gold reserved for the background ornaments.`
  },

  // ★ 아침 식사 — 101w
  'boucher-breakfast': {
    name: '아침 식사',
    nameEn: 'Le Déjeuner',
    prompt: `Hand-painted oil painting of the subject by François Boucher. Soft smooth paint laid lightly like billowing clouds. Sweet pastel pink and blue tint the surface decoratively. Outlines flow in graceful soft curves. The surface glows porcelain-smooth and ornamental. Edges between forms melt into gentle curves. Warm cream light fills an intimate interior softly. Cream ivory 30%, powder blue 25%, rose pink 25%, gold 20%. An elegant Rococo interior wall and fireplace fill the background. Skin glows softly in ivory and warm peach. Soft light sparkles gently across the scene. Brushwork flows along the rounded forms in the scene. Soft morning light enters from the left window. Powder blue settles lightly into the wall and shadows. Pink and gold placed on the figures with blue and cream reserved for the interior background.`
  }
};


// ═══════════════════════════════════════════════════════════════════
// 🏛️ 신고전주의 / 낭만주의 / 사실주의
// ═══════════════════════════════════════════════════════════════════

export const NEO_ROMAN_REAL_PROMPTS = {

  // ─────────────────────────────────────────
  // 다비드 (신고전)
  // ─────────────────────────────────────────

  // ★ 나폴레옹 대관식 — 106w
  'david-coronation': {
    name: '나폴레옹 대관식',
    nameEn: 'Coronation of Napoleon',
    prompt: `Hand-painted oil painting of the subject by Jacques-Louis David. Smooth refined oil layers build a perfectly controlled surface. Cool restrained colors dominate with still gravity. Outlines cut forms sharply and clearly. The surface is marble-smooth and cold with perfectly smooth seamless surface. Edges between forms are cut crisp and clean. Grand golden light and crimson fill a vast ceremonial space. Crimson red 30%, gold 30%, ivory 25%, deep black 15%. Grand arched interior and high ceiling fill the background. Skin glows in warm ivory and soft apricot. Gold light blazes intensely across the central figures. Warm light from above directly illuminates the central figures. Deep black settles into the back rows and deep interior. Crimson and gold placed on the central figures with black reserved for the surrounding areas.`
  },

  // ★ 호라티우스 형제의 맹세 — 105w
  'david-horatii': {
    name: '호라티우스 형제의 맹세',
    nameEn: 'Oath of the Horatii',
    prompt: `Hand-painted oil painting of the subject by Jacques-Louis David. Smooth refined oil layers build a perfectly controlled surface. Cool restrained colors dominate with still gravity. Outlines cut forms sharply and clearly. The surface is marble-smooth and cold with perfectly smooth seamless surface. Edges between forms are cut crisp and clean. Cold restrained light fills a still Roman architecture. Crimson red 30%, warm ochre 25%, ivory 25%, deep brown 20%. Roman arches divide the background geometrically. Skin glows firm and sculptural in ochre and ivory. Bright light catches sharply on the central figures. Strong light from the left directly illuminates the central figures. Deep brown fills heavily inside the arches and background. Crimson and ivory placed on the foreground figures with brown reserved for the arched background.`
  },

  // ─────────────────────────────────────────
  // 앵그르 (신고전)
  // ─────────────────────────────────────────

  // ★ 드 브로이 공주 — 106w
  'ingres-broglie': {
    name: '드 브로이 공주',
    nameEn: 'Princesse de Broglie',
    prompt: `Hand-painted oil painting of the subject by Jean-Auguste-Dominique Ingres. Extremely smooth oil layers build an enamel-perfect surface. Precisely controlled colors radiate cool elegance. Outlines define forms exactly in flowing graceful curves. The surface is porcelain-smooth and flawless. Edges between forms are flowing yet distinctly defined. Cool sapphire blue wraps the scene with elegant formality. Sapphire blue 35%, ivory 30%, gold 20%, black 15%. A dark simple interior wall fills behind the figure. Elaborate lace and jewels decorate the scene. Skin glows cool and flawless in ivory and delicate peach. Silver light catches sharply on the silk surface. Soft light from the left illuminates the figure evenly. Deep blue sinks into the deep folds and background. Sapphire blue claims the figure with ivory reserved for the skin only.`
  },

  // ★ 왕좌의 나폴레옹 — 106w
  'ingres-napoleon': {
    name: '왕좌의 나폴레옹',
    nameEn: 'Napoleon on his Imperial Throne',
    prompt: `Hand-painted oil painting of the subject by Jean-Auguste-Dominique Ingres. Extremely smooth oil layers build an enamel-perfect surface. Precisely controlled colors radiate cool elegance. Outlines define forms exactly in flowing graceful curves. The surface is porcelain-smooth and flawless. Edges between forms are flowing yet distinctly defined. Heavy rich crimson and gold fill the scene. Crimson red 30%, gold 30%, ivory 20%, black 20%. A dark heavy background fills simply behind the figure. Skin glows sculptural in cool ivory and soft apricot. Gold light blazes intensely across the figure and embroidery. Even light from the front directly illuminates the entire figure. Black sinks heavily into the background. Crimson and gold claim the entire figure with black reserved for the background only.`
  },

  // ─────────────────────────────────────────
  // 터너 (낭만)
  // ─────────────────────────────────────────

  // ★ 비, 증기, 속도 — 107w
  'turner-rain': {
    name: '비, 증기, 속도',
    nameEn: 'Rain, Steam and Speed',
    prompt: `Hand-painted oil painting of the subject by J.M.W. Turner. Paint flows like water dissolving all solid forms. Luminous golden light and hot color explode through atmospheric mist. Outlines vanish completely leaving only light. The surface is a churning mix of fog, water, and light. Edges between forms dissolve entirely into vapor. Golden mist explodes outward through rain and steam. Gold yellow 35%, warm brown 25%, slate grey 25%, ivory 15%. A rain-soaked landscape and river dissolve into surrounding mist. Skin glows in warm golden tones and misty ivory. Bright golden light bursts explosively from the center of the mist. Brushwork races diagonally forward along the sweeping thrust of the bridge. Golden light pours through the mist from behind. Slate grey sinks heavily into the lower rain and fog. Gold placed at the central light with grey and brown reserved for the surrounding mist.`
  },

  // ★ 전함 테메레르 — 104w
  'turner-temeraire': {
    name: '전함 테메레르',
    nameEn: 'Fighting Temeraire',
    prompt: `Hand-painted oil painting of the subject by J.M.W. Turner. Paint flows like water dissolving all solid forms. Luminous golden light and hot color explode through atmospheric mist. Outlines vanish completely leaving only light. The surface is a churning mix of fog, water, and light. Edges between forms dissolve entirely into vapor. Blazing orange sunset spreads across a calm water surface. Orange 30%, gold yellow 25%, pale blue 25%, ivory 20%. A wide river and sunset sky fill the background horizontally. Skin glows in warm golden and orange tones. Orange light burns on the water reflections and center of the sky. Brushwork flows horizontally along the water surface. Warm light from the right sunset wraps the entire scene. Pale blue settles into the left sky and deep water. Orange and gold placed at the right sunset with blue reserved for the left sky.`
  },

  // ★ 노예선 — 105w
  'turner-slaveship': {
    name: '노예선',
    nameEn: 'Slave Ship',
    prompt: `Hand-painted oil painting of the subject by J.M.W. Turner. Paint flows like water dissolving all solid forms. Luminous golden light and hot color explode through atmospheric mist. Outlines vanish completely leaving only light. The surface is a churning mix of fog, water, and light. Edges between forms dissolve entirely into vapor. Burning crimson sky blazes explosively over heavy churning waves. Crimson red 35%, orange 25%, deep sea blue 25%, gold 15%. Heavy churning ocean and a burning sky fill the entire background. Skin glows in hot orange and crimson emerging from the heat. Crimson light explodes on wave crests and center of the sky. Brushwork follows the steep diagonal motion of the waves. Sunset light explodes from the sky behind. Deep sea blue sinks heavily into the wave troughs and lower edge. Crimson and orange blaze across the sky with blue reserved for the deep ocean below.`
  },

  // ─────────────────────────────────────────
  // 들라크루아 (낭만)
  // ─────────────────────────────────────────

  // ★ 민중을 이끄는 자유의 여신 — 106w
  'delacroix-liberty': {
    name: '민중을 이끄는 자유의 여신',
    nameEn: 'Liberty Leading the People',
    prompt: `Hand-painted oil painting of the subject by Eugène Delacroix. Thick rich paint applied in agitated passionate strokes. Fiery reds and deep jewel tones clash with explosive energy. Outlines break apart in dynamic turbulent motion. The surface churns with visible vigorous brushwork. Edges between forms shatter into surrounding movement. Smoky golden light cuts through thick haze and smoke. Warm ochre 30%, crimson red 25%, deep blue 25%, ivory 20%. Thick smoke and distant haze fill the background. Skin glows warm in ochre and ivory through the surrounding haze. Bright light catches on the highest surfaces. Brushwork surges diagonally upward following the upward surge. Strong light breaks through the smoke from the upper left. Deep blue and grey sink into the smoke and lower areas below. Crimson and ochre blaze at the center with blue reserved for the smoky edges.`
  },

  // ★ 사르다나팔루스의 죽음 — 106w
  'delacroix-sardanapalus': {
    name: '사르다나팔루스의 죽음',
    nameEn: 'Death of Sardanapalus',
    prompt: `Hand-painted oil painting of the subject by Eugène Delacroix. Thick rich paint applied in agitated passionate strokes. Fiery reds and deep jewel tones clash with explosive energy. Outlines break apart in dynamic turbulent motion. The surface churns with visible vigorous brushwork. Edges between forms shatter into surrounding movement. Burning crimson and gold swirl in swirling chaotic motion. Crimson red 35%, gold 25%, deep brown 25%, ivory 15%. Rich red drapery and dark chaos fill the entire background. Skin glows in warm ivory and flushed pink against the surrounding crimson. Gold light flashes across the swirling forms and fabric. Brushwork spirals diagonally inward toward the center. Warm dramatic light pours from the upper left across the scene. Deep brown sinks into the lower corners and shadowed areas. Crimson and gold dominate the surface with brown reserved for the deep shadows.`
  },

  // ─────────────────────────────────────────
  // 쿠르베 (사실주의)
  // ─────────────────────────────────────────

  // ★ 돌 깨는 사람들 — 104w
  'courbet-stonebreakers': {
    name: '돌 깨는 사람들',
    nameEn: 'The Stone Breakers',
    prompt: `Hand-painted oil painting of the subject by Gustave Courbet. Dense heavy paint applied with a palette knife in thick honest layers. Earthy muted colors ground the scene in unidealized reality. Outlines are rough and direct. The surface is thick and coarse with visible knife marks. Edges between forms are blunt and unpolished. Dry dusty earth tones weigh heavily across a barren roadside. Warm ochre 30%, raw umber 30%, olive green 25%, ivory 15%. A dry rocky hillside and bare earth fill the entire background. Skin glows rough in sunburnt ochre and weathered ivory. Dull flat light catches evenly across the scene. Paint is laid down in heavy rough strokes across the surface. Even harsh daylight presses down from above with cold harsh clarity. Raw umber sinks into the ground and rocky shadows. Ochre and umber spread evenly across the surface with olive reserved for sparse vegetation.`
  },

  // ★ 오르낭의 매장 — 104w
  'courbet-burial': {
    name: '오르낭의 매장',
    nameEn: 'A Burial at Ornans',
    prompt: `Hand-painted oil painting of the subject by Gustave Courbet. Dense heavy paint applied with a palette knife in thick honest layers. Earthy muted colors ground the scene in unidealized reality. Outlines are rough and direct. The surface is thick and coarse with visible knife marks. Edges between forms are blunt and unpolished. Heavy dark tones press down across the scene. Deep black 35%, raw umber 25%, warm ochre 25%, ivory 15%. Low grey cliffs and overcast sky stretch across the background. Skin glows pale in muted ivory and dull ochre. Dim light catches weakly across the figures. Brushwork moves horizontally following the long horizontal spread of figures. Flat overcast light falls evenly with flat even clarity. Deep black swallows the clothing and lower ground heavily. Black dominates the surface with ochre and ivory reserved for faces and cloth.`
  },

  // ★ 안녕하세요 쿠르베씨 — 102w
  'courbet-bonjour': {
    name: '안녕하세요 쿠르베씨',
    nameEn: 'Bonjour Monsieur Courbet',
    prompt: `Hand-painted oil painting of the subject by Gustave Courbet. Dense heavy paint applied with a palette knife in thick honest layers. Earthy muted colors ground the scene in unidealized reality. Outlines are rough and direct. The surface is thick and coarse with visible knife marks. Edges between forms are blunt and unpolished. Bright natural sunlight fills an open country road warmly. Sky blue 30%, warm ochre 25%, olive green 25%, ivory 20%. A wide open road and bright blue sky stretch across the background. Skin glows healthy in warm ochre and sunlit ivory. Bright sunlight catches evenly across the figures. Brushwork follows the horizontal stretch of the open road. Strong direct sunlight falls from above evenly. Olive green settles into roadside grass and distant trees. Sky blue claims the upper half with ochre and green reserved for the sunlit ground.`
  },

  // ─────────────────────────────────────────
  // 마네 (사실주의)
  // ─────────────────────────────────────────

  // ★ 폴리베르제르의 바 — 108w
  'manet-bar': {
    name: '폴리베르제르의 바',
    nameEn: 'A Bar at the Folies-Bergère',
    prompt: `Hand-painted oil painting of the subject by Édouard Manet. Loose brushstrokes capture transient effects of light and atmosphere. Muted color palette with bold confident marks. Outlines are decisive with minimal modelling. The surface shifts between precise foreground detail and hazy reflected background. Edges between forms vary from sharp to softly blurred. Glittering artificial light reflects in a vast mirror behind the bar. Deep black 30%, gold 25%, warm ochre 25%, ivory 20%. A shimmering mirror reflection of chandeliers and bustling crowd fills the background. Skin glows in cool ivory and soft peach under warm artificial light. Bright points of chandelier light scatter across the mirror reflection. Foreground details are painted with precision while background dissolves into hazy reflection. Warm artificial light falls from chandeliers above. Deep black gathers in the mirror depth and distant crowd. Gold and ivory claim the bar counter with black reserved for the reflected haze behind.`
  },

  // ★ 올랭피아 — 107w
  'manet-olympia': {
    name: '올랭피아',
    nameEn: 'Olympia',
    prompt: `Hand-painted oil painting of the subject by Édouard Manet. Bold flat areas of paint applied directly in alla prima technique with bold direct application. Stark contrasts between pale flesh and dark surroundings with minimal midtones. Outlines are bold and decisive with minimal modelling. The surface is flat and direct with flat even tonal planes. Edges between forms are abrupt and ungraduated. Stark pale ivory flesh stands boldly against deep surrounding darkness. Ivory 30%, deep black 30%, warm brown 20%, olive green 20%. Dark interior with green curtain and shadowed wall fills the background. Skin glows starkly pale in cool ivory with flat even tone. Bright harsh light illuminates the figure flatly from the front. Bold flat patches define the form with brutal contrasts. Even frontal light falls directly with abrupt tonal shifts. Deep black surrounds and presses close against the pale figure. Pale ivory claims the central figure with black and green reserved for the dark background.`
  },

  // ★ 풀밭 위의 점심 — 108w
  'manet-dejeuner': {
    name: '풀밭 위의 점심',
    nameEn: 'Le Déjeuner sur l\'herbe',
    prompt: `Hand-painted oil painting of the subject by Édouard Manet. Bold flat areas of paint applied directly on white canvas with bold direct application. Brutal contrasts between light and dark with only brutal tonal jumps. Outlines are bold painted in blocks. The surface is flat and direct with flattened spatial planes. Edges between forms are abrupt with figures appearing like playing cards. Bright pale flesh pops sharply against dense dark woodland. Olive green 30%, deep black 25%, ivory 25%, warm brown 20%. Dense sketchy forest and dappled woodland fill the background. Skin glows stark white against the dark foliage with minimal shading. Sharp light catches flatly on the pale central figures. Bold color blocks contrast brutally between light flesh and dark forest. Bright outdoor light falls from above with abrupt tonal shifts. Deep olive green and black sink into the dense forest behind. Pale ivory claims the figures with green and black reserved for the surrounding woodland.`
  }
};


// ═══════════════════════════════════════════════════════════════════
// 🌸 인상주의
// ═══════════════════════════════════════════════════════════════════

export const IMPRESSIONISM_PROMPTS = {

  // ─────────────────────────────────────────
  // 르누아르
  // ─────────────────────────────────────────

  // ★ 보트 파티의 점심 — 104w
  'renoir-boating': {
    name: '보트 파티의 점심',
    nameEn: 'Luncheon of the Boating Party',
    prompt: `Hand-painted oil painting of the subject by Pierre-Auguste Renoir. Short dappled brushstrokes build warm luminous layers of color. Rosy pink and golden tones glow with sensuous warmth. Outlines blur into shimmering dappled light. The surface shimmers with a pearly iridescent quality. Edges between forms shimmer in surrounding warm light. Warm dappled sunlight filters through an awning onto a festive terrace. Warm peach 30%, cobalt blue 25%, ivory 25%, olive green 20%. A sunlit river stretches across the background. Skin glows in warm rosy peach and sunlit ivory. Bright spots of sunlight scatter across the figures and surfaces. Brushwork follows the dappled patterns of filtered sunlight. Warm afternoon light filters through the striped awning above. Olive green and blue settle into shadows beneath the awning. Rosy peach concentrates on the figures with blue and green reserved for the river background.`
  },

  // ★ 물랭 드 라 갈레트 — 105w
  'renoir-moulin': {
    name: '물랭 드 라 갈레트',
    nameEn: 'Bal du moulin de la Galette',
    prompt: `Hand-painted oil painting of the subject by Pierre-Auguste Renoir. Short dappled brushstrokes build warm luminous layers of color. Rosy pink and golden tones glow with sensuous warmth. Outlines blur into shimmering dappled light. The surface shimmers with a pearly iridescent quality. Edges between forms shimmer in surrounding warm light. Warm golden sunlight dapples through trees onto a lively gathering. Gold 30%, cobalt blue 25%, rosy pink 25%, olive green 20%. Trees and a sunlit outdoor gathering space fill the background. Skin glows in warm rosy pink and warm golden ivory. Bright spots of sunlight scatter across the figures. Brushwork follows the movement of light spreading through the scene. Warm dappled sunlight filters down through the tree canopy. Cobalt blue and olive green settle into the tree shadows. Gold and pink concentrate on the sunlit figures with green reserved for the shaded edges.`
  },

  // ★ 그네 — 106w
  'renoir-swing': {
    name: '그네',
    nameEn: 'The Swing',
    prompt: `Hand-painted oil painting of the subject by Pierre-Auguste Renoir. Short dappled brushstrokes build warm luminous layers of color. Rosy pink and golden tones glow with sensuous warmth. Outlines blur into shimmering dappled light. The surface shimmers with a pearly iridescent quality. Edges between forms shimmer in surrounding warm light. Warm dappled sunlight scatters through leaves onto a garden scene. Cobalt blue 30%, rosy pink 25%, olive green 25%, ivory 20%. Tall garden trees and lush green foliage fill the background. Skin glows in pale ivory and warm rosy peach. Bright spots of filtered sunlight scatter across the figures and ground. Brushwork scatters in loose strokes and coloured dots following the dappled light through the leaves. Warm dappled light filters through the leaves from above. Olive green and cobalt blue settle into tree shadows and foliage. Rosy pink and ivory concentrate on the central figure with green reserved for the surrounding garden.`
  },

  // ─────────────────────────────────────────
  // 드가
  // ─────────────────────────────────────────

  // ★ 무용 수업 — 107w
  'degas-danceclass': {
    name: '무용 수업',
    nameEn: 'The Dance Class',
    prompt: `Hand-painted oil painting of the subject by Edgar Degas. Chalky pastel-like paint applied in dry layered strokes. Muted cool tones create an intimate atmospheric distance. Outlines are precise yet cropped unexpectedly at the edges. The surface has a dry powdery texture like soft pastel on paper. Edges between forms shift abruptly with asymmetric framing. Soft diffused studio light fills a pale room. Pale ivory 35%, soft green 25%, warm ochre 20%, powder pink 20%. A bright interior with wooden floor and tall windows fills the background. Skin glows softly in pale ivory and warm peach. Soft light spreads evenly across the figures and floor. Brushwork follows the angular geometric lines of the space. Even soft light fills the room from tall windows on the left. Warm ochre settles into the wooden floor and shadows. Pale ivory and pink concentrate on the figures with green and ochre reserved for the walls and floor.`
  },

  // ★ 무대 위의 무희 — 103w
  'degas-star': {
    name: '무대 위의 무희',
    nameEn: 'The Star',
    prompt: `Hand-painted oil painting of the subject by Edgar Degas. Chalky pastel-like paint applied in dry layered strokes. Muted cool tones create an intimate atmospheric distance. Outlines are precise yet cropped unexpectedly at the edges. The surface has a dry powdery texture like soft pastel on paper. Edges between forms shift abruptly with asymmetric framing. Blazing stage spotlight isolates the central figure from surrounding darkness. Deep black 35%, warm gold 25%, powder pink 20%, ivory 20%. Dark backstage shadows and dim scenery fill the background. Skin glows in warm ivory and soft pink under the stage light. Strong spotlight concentrates intensely on the central figure. Brushwork follows diagonal lines across the scene. Intense stage light blazes from the front. Deep black fills the backstage wings and surrounding darkness. Gold and pink concentrate on the lit figure with black claiming all the surrounding stage.`
  },

  // ★ 압생트 — 103w
  'degas-absinthe': {
    name: '압생트',
    nameEn: 'L\'Absinthe',
    prompt: `Hand-painted oil painting of the subject by Edgar Degas. Chalky pastel-like paint applied in dry layered strokes. Muted cool tones create an intimate atmospheric distance. Outlines are precise yet cropped unexpectedly at the edges. The surface has a dry powdery texture like soft pastel on paper. Edges between forms shift abruptly with asymmetric framing. Pale washed-out light fills the scene with muted distance. Pale grey 30%, warm ochre 25%, olive green 25%, ivory 20%. An interior with simple tables and walls fills the background. Skin glows pale and muted in ivory and grey peach. Dim light falls weakly across the scene with cold harsh clarity. Brushwork follows the diagonal recession of the table lines. Flat even light falls with cold harsh clarity from the left. Olive green and ochre settle into the lower areas and floor shadows. Pale grey dominates the scene with ochre reserved for the wooden surfaces.`
  },

  // ─────────────────────────────────────────
  // 모네
  // ─────────────────────────────────────────

  // ★ 수련 — 106w
  'monet-waterlilies': {
    name: '수련',
    nameEn: 'Water Lilies',
    prompt: `Hand-painted oil painting of the subject by Claude Monet. Thick dabs of pure unmixed color placed side by side across the surface. Shimmering light dissolves all solid forms into vibrating color. Outlines vanish completely into flickering broken strokes. The surface vibrates with a dense patchwork of broken color strokes. Edges between forms shimmer and dissolve in open air. Shimmering blue green and pink reflections fill the entire surface edge to edge. Blue green 35%, soft pink 25%, lavender 25%, ivory 15%. A pond surface with only water surface edge to edge fills the entire background. Skin glows softly in warm ivory and pale pink reflected light. Soft pink and white light catches on the floating blossoms. Brushwork follows the horizontal drift of water reflections. Diffused even light falls from above onto the water surface. Lavender and blue green settle into the deep water reflections. Blue green dominates the water with pink and ivory reserved for the floating lilies.`
  },

  // ★ 인상, 해돋이 — 103w
  'monet-impression': {
    name: '인상, 해돋이',
    nameEn: 'Impression, Sunrise',
    prompt: `Hand-painted oil painting of the subject by Claude Monet. Thin washes of color laid quickly across the surface with the canvas showing through. Shimmering light dissolves all solid forms into vibrating color. Outlines vanish completely into flickering broken strokes. The surface shimmers with thin transparent layers and sparse brushwork. Edges between forms shimmer and dissolve in open air. Fiery orange sun cuts through cool blue morning haze over water. Cobalt blue 35%, orange 25%, slate grey 25%, ivory 15%. A misty waterfront dissolves into haze. Skin glows in warm orange and hazy ivory. Bright orange light burns at the center and its water reflection. Brushwork varies across the surface with impasto only on the sun and its bright reflection on the water. Dim morning light filters through thick atmospheric haze. Slate grey and cobalt blue settle into the mist and water. Orange concentrates at the center and reflection with blue grey claiming all the surrounding haze.`
  },

  // ★ 양산을 든 여인 — 103w
  'monet-parasol': {
    name: '양산을 든 여인',
    nameEn: 'Woman with a Parasol',
    prompt: `Hand-painted oil painting of the subject by Claude Monet. Thick dabs of pure unmixed color placed side by side across the surface. Shimmering light dissolves all solid forms into vibrating color. Outlines vanish completely into flickering broken strokes. The surface vibrates with a dense patchwork of broken color strokes. Edges between forms shimmer and dissolve in open air. Bright outdoor sunlight and wind sweep across a sunlit hilltop. Sky blue 30%, ivory 30%, olive green 25%, soft gold 15%. A bright windswept sky with billowing clouds fills the background. Skin glows in warm ivory and soft golden peach. Bright sunlight catches warmly across the figure. Brushwork follows sweeping diagonal strokes. Strong sunlight pours from above and behind the figure. Olive green settles into the grassy hillside and shadow below. Sky blue and ivory dominate the upper scene with green reserved for the grassy slope.`
  },

  // ─────────────────────────────────────────
  // 카유보트
  // ─────────────────────────────────────────

  // ★ 파리 거리, 비 오는 날 — 105w
  'caillebotte-paris': {
    name: '파리 거리, 비 오는 날',
    nameEn: 'Paris Street, Rainy Day',
    prompt: `Hand-painted oil painting of the subject by Gustave Caillebotte. Smooth precise paint applied with controlled photographic clarity. Cool silvery tones define modern urban light. Outlines are sharp and architecturally precise. The surface is smooth and controlled with meticulous detail. Edges between forms are crisp with geometric precision. Cool silvery light reflects off wet cobblestones in a modern city. Silver grey 30%, warm ochre 25%, deep black 25%, ivory 20%. Tall stone buildings and wide boulevards fill the background. Skin glows in cool ivory and soft grey peach. Silver light reflects off the wet pavement and surfaces. Brushwork follows the sharp one-point perspective of the street. Cool even overcast light falls from above with flat even illumination. Deep black concentrates in the dark areas and vertical elements. Silver grey dominates the wet ground with ochre reserved for the building facades.`
  },

  // ★ 마루 긁는 사람들 — 103w
  'caillebotte-floor': {
    name: '마루 긁는 사람들',
    nameEn: 'The Floor Scrapers',
    prompt: `Hand-painted oil painting of the subject by Gustave Caillebotte. Smooth precise paint applied with controlled photographic clarity. Cool silvery tones define modern urban light. Outlines are sharp and architecturally precise. The surface is smooth and controlled with meticulous detail. Edges between forms are crisp with geometric precision. Warm golden light pours through a window onto bare wooden floor. Warm ochre 35%, golden yellow 25%, ivory 20%, deep brown 20%. A bright interior with tall windows fills the background. Skin glows in warm ochre and sunlit golden ivory. Bright golden light catches on the floor surface and bare skin. Brushwork follows the long parallel lines of the floor planks. Strong warm light pours from the right window at an angle. Deep brown settles into the floor shadows and far wall. Golden ochre dominates the floor surface with brown reserved for the shadowed edges.`
  },

  // ★ 창가의 남자 — 104w
  'caillebotte-window': {
    name: '창가의 남자',
    nameEn: 'Man at the Window',
    prompt: `Hand-painted oil painting of the subject by Gustave Caillebotte. Smooth precise paint applied with controlled photographic clarity. Cool silvery tones define modern urban light. Outlines are sharp and architecturally precise. The surface is smooth and controlled with meticulous detail. Edges between forms are crisp with geometric precision. Bright outdoor light floods inward through an open window. Sky blue 30%, warm ochre 25%, deep black 25%, ivory 20%. A bright boulevard and balcony view fill the window opening. Skin glows in silhouetted warm ochre against the bright window. Bright outdoor light blazes through the open window from outside. Brushwork follows the vertical frame of the window. Strong backlight pours from the window creating a dark interior silhouette. Deep black fills the interior room and figure's back. Sky blue and ivory blaze in the window opening with black claiming the entire dark interior.`
  }
};


// ═══════════════════════════════════════════════════════════════════
// 🌻 후기인상주의
// ═══════════════════════════════════════════════════════════════════

export const POST_IMPRESSIONISM_PROMPTS = {

  // ─────────────────────────────────────────
  // 반 고흐
  // ─────────────────────────────────────────

  // ★ 별이 빛나는 밤 — 104w
  'vangogh-starrynight': {
    name: '별이 빛나는 밤',
    nameEn: 'The Starry Night',
    prompt: `Hand-painted oil painting of the subject by Vincent van Gogh. Thick impasto paint swirls and builds across the canvas. Intense complementary colors clash and vibrate intensely. Outlines ripple within heavy ridges of paint. The surface rises roughly in thick paint ridges. Edges between forms twist inside swirling strokes. Deep cobalt blue explodes with chrome yellow swirls. Cobalt blue 35%, chrome yellow 25%, deep navy 25%, ivory 15%. Swirling night sky and undulating hills fill the background. Thick swirling brushstrokes cover the skin in blue and yellow. Chrome yellow light bursts intensely from the bright areas. Brushwork spirals across the entire surface in massive swirls. Golden light spreads outward from the darkness. Deep navy sinks heavily into the dark areas. Cobalt blue claims the whole surface with chrome yellow placed only on the glowing parts.`
  },

  // ★ 밤의 카페 테라스 — 104w
  'vangogh-cafe': {
    name: '밤의 카페 테라스',
    nameEn: 'Café Terrace at Night',
    prompt: `Hand-painted oil painting of the subject by Vincent van Gogh. Thick impasto paint swirls and builds across the canvas. Intense complementary colors clash and vibrate intensely. Outlines ripple within heavy ridges of paint. The surface rises roughly in thick paint ridges. Edges between forms twist inside swirling strokes. Warm gaslight yellow clashes intensely with cold blue night sky. Chrome yellow 35%, cobalt blue 30%, warm ochre 20%, ivory 15%. A starlit deep blue night sky and dark street fill the background. Thick brushstrokes cover the skin in yellow and ochre. Intense chrome yellow light blazes on the figures and surroundings. Brushwork follows the contour of each surface: diagonal on the awning, vertical on walls, horizontal dabs on the ground. Golden gaslight pours strongly from the left. Cobalt blue sinks deeply into the darkness beyond the light. Chrome yellow claims the lit side with cobalt blue claiming the dark side.`
  },

  // ★ 해바라기 — 100w
  'vangogh-sunflowers': {
    name: '해바라기',
    nameEn: 'Sunflowers',
    prompt: `Hand-painted oil painting of the subject by Vincent van Gogh. Thick impasto paint swirls and builds across the canvas. Intense complementary colors clash and vibrate intensely. Outlines ripple within heavy ridges of paint. The surface rises roughly in thick paint ridges. Edges between forms twist inside swirling strokes. Chrome yellow dominates almost the entire surface with burning heat. Chrome yellow 40%, ochre yellow 25%, orange 20%, ivory 15%. A simple flat yellow fills the background. Thick brushstrokes cover the skin in yellow and ochre. Bright chrome yellow light catches on the raised paint ridges. Brushwork follows the curves of the petals and swirls into the seed heads. Warm light illuminates evenly from the front. Ochre and orange sink into the paint valleys and lower areas. Chrome yellow claims 80% of the surface with ochre and orange filling the rest.`
  },

  // ★ 회색 펠트 모자 자화상 — 104w
  'vangogh-selfportrait': {
    name: '회색 펠트 모자 자화상',
    nameEn: 'Self-Portrait with Grey Felt Hat',
    prompt: `Hand-painted oil painting of the subject by Vincent van Gogh. Thick impasto paint swirls and builds across the canvas. Intense complementary colors clash and vibrate intensely. Outlines ripple within heavy ridges of paint. The surface rises roughly in thick paint ridges. Edges between forms twist inside swirling strokes. Intense brushstrokes explode radially outward from the center. Cobalt blue 30%, chrome yellow 25%, olive green 25%, ivory 20%. Swirling blue and green brushstrokes fill the background. Radial brushstrokes cover the skin intensely in yellow, green, and blue. Chrome yellow light catches strongly on the forehead and nose. Brushwork radiates outward from the center. Warm light from the left illuminates one side of the form. Cobalt blue and olive green sink into the right side and background. Yellow and green placed on the bright side with blue reserved for the dark side and background.`
  },

  // ★ 사이프러스 밀밭 — 104w
  'vangogh-wheatfield': {
    name: '사이프러스 밀밭',
    nameEn: 'Wheat Field with Cypresses',
    prompt: `Hand-painted oil painting of the subject by Vincent van Gogh. Thick impasto paint swirls and builds across the canvas. Intense complementary colors clash and vibrate intensely. Outlines ripple within heavy ridges of paint. The surface rises roughly in thick paint ridges. Edges between forms twist inside swirling strokes. Golden yellow and cobalt blue clash intensely in swirling motion. Chrome yellow 30%, cobalt blue 25%, olive green 25%, ivory 20%. Swirling clouds and dark cypresses fill the background. Thick swirling brushstrokes cover the skin in yellow and green. Chrome yellow light blazes on the wheat field and bright clouds. Brushwork follows the swirling clouds and rolling waves of wheat. Strong sunlight illuminates the wheat field from above. Olive green and deep blue sink into the cypresses and shadows. Chrome yellow claims the lower wheat field with cobalt blue claiming the upper sky.`
  },

  // ─────────────────────────────────────────
  // 고갱
  // ─────────────────────────────────────────

  // ★ 타히티 여인들 — 104w
  'gauguin-tahitian': {
    name: '타히티 여인들',
    nameEn: 'Tahitian Women',
    prompt: `Hand-painted oil painting of the subject by Paul Gauguin. Flat unmixed color areas spread broadly across the surface. Intense primary colors are placed side by side decoratively. Outlines are enclosed by thick dark contour lines. The surface is matte and flat with minimal visible brushwork. Edges between forms are sharply defined by bold outlines. Intense primary colors fill the surface warmly and decoratively. Tropical orange 30%, turquoise 25%, chrome yellow 25%, crimson pink 20%. Intense color planes and lush foliage fill the background decoratively. Skin is filled flatly with warm ochre and orange color planes. Bright orange light rests flatly on the skin. Brushwork flows evenly along the horizontal direction of broad color areas. Warm even light illuminates the entire scene evenly. Turquoise and deep green sink into the background and shadows. Orange and pink placed on the figures with turquoise and green reserved for the background.`
  },

  // ★ 우리는 어디서 왔는가 — 104w
  'gauguin-where': {
    name: '우리는 어디서 왔는가',
    nameEn: 'Where Do We Come From?',
    prompt: `Hand-painted oil painting of the subject by Paul Gauguin. Flat unmixed color areas spread broadly across the surface. Intense primary colors are placed side by side decoratively. Outlines are enclosed by thick dark contour lines. The surface is matte and flat with minimal visible brushwork. Edges between forms are sharply defined by bold outlines. Deep blue and gold fill the surface heavily and deeply. Deep blue 35%, gold yellow 25%, olive green 25%, ivory 15%. Deep blue and green landscape fills the background. Skin is filled flatly with warm gold and ochre color planes. Gold light rests flatly on the figures. Brushwork flows in a long horizontal direction. Warm light wraps the entire scene evenly. Deep blue and olive green sink heavily into the background and lower areas. Gold and ochre placed on the figures with deep blue and green reserved for the background.`
  },

  // ★ 황색 그리스도 — 104w
  'gauguin-christ': {
    name: '황색 그리스도',
    nameEn: 'Yellow Christ',
    prompt: `Hand-painted oil painting of the subject by Paul Gauguin. Flat unmixed color areas spread broadly across the surface. Intense primary colors are placed side by side decoratively. Outlines are enclosed by thick dark contour lines. The surface is matte and flat with minimal visible brushwork. Edges between forms are sharply defined by bold outlines. Intense chrome yellow spreads boldly over an autumn landscape. Chrome yellow 35%, orange red 25%, olive green 25%, ivory 15%. Red autumn trees and yellow fields fill the background. Skin is filled flatly with intense yellow and ochre color planes. Chrome yellow light rests flatly across the entire figure. Brushwork fills evenly inside the bold contour lines. Autumn light illuminates the entire scene warmly and evenly. Olive green and orange red sink into the trees and lower areas. Chrome yellow claims the central figure with orange and green filling the surrounding background.`
  },

  // ─────────────────────────────────────────
  // 세잔
  // ─────────────────────────────────────────

  // ★ 사과 바구니 — 106w
  'cezanne-apples': {
    name: '사과 바구니',
    nameEn: 'Basket of Apples',
    prompt: `Hand-painted oil painting of the subject by Paul Cézanne. Thick paint laid in small flat patches placed side by side. Muted earth tones and restrained colors are placed structurally. Outlines build up thickly through multiple overlapping strokes. The surface is rough and angular like a mosaic of paint patches. Edges between forms split sharply at the boundary of color planes. Warm earthy warmth fills the scene with solid structural weight. Warm ochre 30%, olive green 25%, crimson red 25%, ivory 20%. A dark simple background fills behind. All forms are simplified into spheres and cylinders, surfaces filled with ochre and olive color patches. Bright ochre light rests in small patches on the top of rounded forms. Brushwork stacks in parallel strokes following the rounded volume of forms. Soft light from the left illuminates evenly. Olive green and deep ochre sink angularly into the underside of rounded forms. Ochre and red placed in the foreground with olive and dark tones reserved for the background.`
  },

  // ★ 생트빅투아르 산 — 106w
  'cezanne-montagne': {
    name: '생트빅투아르 산',
    nameEn: 'Mont Sainte-Victoire',
    prompt: `Hand-painted oil painting of the subject by Paul Cézanne. Thick paint laid in small flat patches placed side by side. Muted earth tones and restrained colors are placed structurally. Outlines build up thickly through multiple overlapping strokes. The surface is rough and angular like a mosaic of paint patches. Edges between forms split sharply at the boundary of color planes. Cool blue and warm ochre interlock structurally. Cobalt blue 30%, olive green 25%, warm ochre 25%, ivory 20%. Blue and green color patches fill the mountain and sky structurally. All forms are simplified into angular flat blocks, filled with blue and ochre patches. Bright ivory light rests on the mountain top and bright planes. Brushwork stacks in parallel diagonal strokes following the mountain structure. Soft light illuminates the entire scene evenly. Cobalt blue and olive green sink into the lower mountain and shadow planes. Blue placed on the sky and distant mountain with ochre and green reserved for the near foreground.`
  },

  // ★ 카드 놀이꾼 — 107w
  'cezanne-cards': {
    name: '카드 놀이꾼',
    nameEn: 'The Card Players',
    prompt: `Hand-painted oil painting of the subject by Paul Cézanne. Thick paint laid in small flat patches placed side by side. Muted earth tones and restrained colors are placed structurally. Outlines build up thickly through multiple overlapping strokes. The surface is rough and angular like a mosaic of paint patches. Edges between forms split sharply at the boundary of color planes. Heavy calm earth tones fill the scene with still weight. Warm ochre 30%, raw umber 25%, olive green 25%, ivory 20%. A dark simple brown background fills behind. The face divides into angular planes at the forehead, cheekbones, and jaw, each filled with ochre and olive patches. Bright ochre light rests on the convex planes of the forehead and nose. Brushwork stacks vertically following the columnar structure of forms. Soft light from above illuminates the figures evenly. Raw umber and olive green sink angularly below the cheekbones and into clothing folds. Ochre and umber placed on the figures with olive and dark brown reserved for the background.`
  }
};


// ═══════════════════════════════════════════════════════════════════
// 🦁 야수파
// ═══════════════════════════════════════════════════════════════════

export const FAUVISM_PROMPTS = {

  // ─────────────────────────────────────────
  // 마티스
  // ─────────────────────────────────────────

  // ★ 초록 줄무늬 — ~112w
  'matisse-greenstripe': {
    name: '초록 줄무늬',
    nameEn: 'The Green Stripe',
    prompt: `Hand-painted oil painting of the subject by Henri Matisse. Pure primary colors spread flatly in broad areas. Face and skin are painted freely in non-naturalistic colors like green, purple, and red. Forms are simplified into rhythmic flowing curves. Outlines flow in supple decorative curves. The surface is flat and decorative with bold visible brushmarks. Edges between forms are defined by bold color boundaries. A bold green stripe divides the face vertically down the center. Emerald green 30%, vermilion red 25%, chrome yellow 25%, violet 20%. Bold primary color planes split left and right filling the background. The left cheek and forehead painted in warm yellow-pink-orange, the right cheek and forehead in cool green-purple-blue. Yellow light rests flatly on the warm side forehead and cheeks. Brushwork flows along the vertical stripe down the center. Light illuminates warmly from the left. Green and violet sink coldly into the right face and background. Yellow and pink claim the left half with green and blue claiming the right half.`
  },

  // ★ 보라색 코트 — ~108w
  'matisse-purplecoat': {
    name: '보라색 코트',
    nameEn: 'Woman in Purple Coat',
    prompt: `Hand-painted oil painting of the subject by Henri Matisse. Pure primary colors spread flatly in broad areas. Face and skin are painted freely in non-naturalistic colors like green, purple, and red. Forms are simplified into rhythmic flowing curves. Outlines flow in supple decorative curves. The surface is flat and decorative with bold visible brushmarks. Edges between forms are defined by bold color boundaries. Deep purple dominates the scene with quiet elegance. Deep purple 35%, emerald green 25%, orange 20%, ivory 20%. Warm base with leaf patterns fills the background decoratively. Leaf patterns on background, ornamental coat patterns. The face is painted freely in warm peach and apricot tones, eyes accented with bold dark outlines. Orange light rests flatly on the face and bright areas. Brushwork flows along the elegant vertical curves of the coat. Even light illuminates the entire scene evenly. Deep purple sinks into the coat folds and dark areas. Purple claims the figure with green and orange reserved for the background.`
  },

  // ★ 드랭의 초상 — ~107w
  'matisse-derain': {
    name: '드랭의 초상',
    nameEn: 'Portrait of André Derain',
    prompt: `Hand-painted oil painting of the subject by Henri Matisse. Pure primary colors spread flatly in broad areas. Face and skin are painted freely in non-naturalistic colors like green, purple, and red. Forms are simplified into rhythmic flowing curves. Outlines flow in supple decorative curves. The surface is flat and decorative with bold visible brushmarks. Edges between forms are defined by bold color boundaries. Pure primary colors spread intensely across the face. Chrome yellow 30%, emerald green 25%, cobalt blue 25%, vermilion red 20%. Bright primary color planes fill the background simply. Yellow and green are placed boldly on the forehead and cheeks, red and blue painted roughly on the nose and jaw. Chrome yellow light rests in pure color on the forehead and bright surfaces. Brushwork follows the face contours boldly in broad color areas. Strong light illuminates the face directly from the front. Green and blue sink around the eyes and below the jaw. Yellow and red claim the bright planes with green and blue reserved for the shadows.`
  },

  // ★ 붉은 방 — ~108w
  'matisse-redroom': {
    name: '붉은 방',
    nameEn: 'The Red Room',
    prompt: `Hand-painted oil painting of the subject by Henri Matisse. Pure primary colors spread flatly in broad areas. Face and skin are painted freely in non-naturalistic colors like green, purple, and red. Forms are simplified into rhythmic flowing curves. Outlines flow in supple decorative curves. The surface is flat and decorative with bold visible brushmarks. Edges between forms are defined by bold color boundaries. Intense red overwhelms the walls and table surface. Vermilion red 40%, cobalt blue 25%, emerald green 20%, ivory 15%. Red-covered walls with blue arabesque patterns fill the background. Blue arabesque floral curve patterns as decoration. The face is painted flatly in warm orange and pink color planes. Ivory light rests flatly on bright surfaces. Brushwork flows along the decorative arabesque curve patterns. Green light enters from the window on the left. Deep red sinks into the table and deep wall surfaces. Red claims the entire interior with blue claiming the decorative patterns and green claiming the garden outside.`
  },

  // ─────────────────────────────────────────
  // 드랭
  // ─────────────────────────────────────────

  // ★ 콜리우르 항구 — ~108w
  'derain-collioure': {
    name: '콜리우르 항구',
    nameEn: 'Port of Collioure',
    prompt: `Hand-painted oil painting of the subject by André Derain. Pure unmixed colors placed straight from the tube onto the canvas. Face and skin are painted in bold non-naturalistic colors. Pure colors are placed in thick separate marks across the surface. Outlines are loose and freely open. The surface is rough and lively with quick brushmarks. Edges between forms are defined by clashing color marks. Pure primary colors are placed unmixed side by side. Cobalt blue 30%, vermilion red 25%, chrome yellow 25%, emerald green 20%. Color planes placed side by side with white canvas gaps fill the background. Rooftops are covered in vermilion red and orange, water painted in cobalt blue and green, sky in chrome yellow. Chrome yellow light rests in pure color on sunlit surfaces. Thick square dabs of color are placed side by side like a mosaic with white canvas gaps showing between them. Strong sunlight illuminates the entire scene evenly. Cobalt blue and emerald green sink into shadows and water. Red and yellow placed in the foreground with blue and green reserved for the sea and background.`
  },

  // ★ 런던 다리 — ~109w
  'derain-charingcross': {
    name: '런던 다리',
    nameEn: 'Charing Cross Bridge',
    prompt: `Hand-painted oil painting of the subject by André Derain. Pure unmixed colors placed straight from the tube onto the canvas. Face and skin are painted in bold non-naturalistic colors. Pure colors are placed in thick separate marks across the surface. Outlines are loose and freely open. The surface is rough and lively with quick brushmarks. Edges between forms are defined by clashing color marks. Non-naturalistic primary colors are placed unmixed side by side over the scene. Cobalt blue 30%, chrome yellow 25%, vermilion red 25%, violet 20%. Intense color planes of river and distant skyline fill the background. Water reflections are painted in bright chrome yellow and orange, structures in deep cobalt blue and green, sky in warm pink and orange. Chrome yellow light rests in pure color on water reflections and bright surfaces. Short disconnected strokes and color dots follow the horizontal current of the river. Warm light wraps the entire scene evenly. Cobalt blue and violet sink beneath the structures and into deep water. Yellow and red placed on the sky and reflections with blue and violet reserved for water and structures.`
  },

  // ★ 마티스 초상 — ~107w
  'derain-matisse': {
    name: '마티스 초상',
    nameEn: 'Portrait of Matisse',
    prompt: `Hand-painted oil painting of the subject by André Derain. Pure unmixed colors placed straight from the tube onto the canvas. Face and skin are painted in bold non-naturalistic colors. Pure colors are placed in thick separate marks across the surface. Outlines are loose and freely open. The surface is rough and lively with quick brushmarks. Edges between forms are defined by clashing color marks. Non-naturalistic primary colors are placed unmixed and roughly on the face. Vermilion red 30%, chrome yellow 25%, emerald green 25%, cobalt blue 20%. Bold primary color planes fill the background simply. Green, orange, and blue patches are placed roughly across the face, placed replacing natural skin tones. Bright yellow light rests in pure color on the forehead and nose. Thick impasto dabs build up the contours of the form roughly. Strong light illuminates the face directly from the front. Emerald green and blue sink into the face shadows and background. Red and yellow placed on the bright side with green and blue reserved for the dark side.`
  },

  // ─────────────────────────────────────────
  // 블라맹크
  // ─────────────────────────────────────────

  // ★ 샤투의 집들 — ~105w
  'vlaminck-chatou': {
    name: '샤투의 집들',
    nameEn: 'Houses at Chatou',
    prompt: `Hand-painted oil painting of the subject by Maurice de Vlaminck. Thick paint is hurled onto the canvas in fierce daubs and streaks. Explosive primary colors applied roughly with bold strokes. Colors are pushed to extreme saturation. Outlines tremble within rough aggressive strokes. The surface is thick and rough with aggressive paint marks. Edges between forms are defined by intense color clashes. Intense colors are placed unmixed clashing hard. Orange ochre 30%, cobalt blue 25%, vermilion red 25%, ivory 20%. Intense primary colored houses and sky fill the background. Surfaces are covered thickly in orange-red and white. Chrome yellow light is hurled thickly on bright surfaces. Brushwork strikes roughly downward following the vertical structure of houses and tree trunks. Strong light illuminates the entire scene from the front. Cobalt blue sinks heavily into shadows and beneath the rooftops. Orange and red claim the houses with blue claiming the sky and shadows.`
  },

  // ★ 붉은 나무들 — ~105w
  'vlaminck-redtrees': {
    name: '붉은 나무들',
    nameEn: 'Red Trees',
    prompt: `Hand-painted oil painting of the subject by Maurice de Vlaminck. Thick paint is hurled onto the canvas in fierce daubs and streaks. Explosive primary colors applied roughly with bold strokes. Colors are pushed to extreme saturation. Outlines tremble within rough aggressive strokes. The surface is thick and rough with aggressive paint marks. Edges between forms are defined by intense color clashes. Burning red and orange are laid thickly across the entire surface. Vermilion red 35%, orange 25%, cobalt blue 25%, chrome yellow 15%. Intense colored sky and fields fill the background. Forms are thickly covered in vermilion red and orange, ground roughly covered in yellow and ochre. Orange light rests thickly on the branches and bright surfaces. Brushwork surges intensely upward following the tree trunks. Strong light illuminates from behind the trees. Cobalt blue sinks heavily beneath the trees and into shadows. Red and orange claim the trees with blue claiming the sky and shadows.`
  },

  // ★ 부지발의 식당 — ~105w
  'vlaminck-bougival': {
    name: '부지발의 식당',
    nameEn: 'Restaurant at Bougival',
    prompt: `Hand-painted oil painting of the subject by Maurice de Vlaminck. Thick paint is hurled onto the canvas in fierce daubs and streaks. Explosive primary colors applied roughly with bold strokes. Colors are pushed to extreme saturation. Outlines tremble within rough aggressive strokes. The surface is thick and rough with aggressive paint marks. Edges between forms are defined by intense color clashes. Intense primary colors are placed thickly unmixed side by side. Vermilion red 30%, cobalt blue 25%, chrome yellow 25%, emerald green 20%. Primary colored buildings and street fill the background. Surfaces are divided in pink-red and blue-purple, ground thickly covered in bright yellow-orange. Chrome yellow light rests in pure color on bright surfaces. Brushwork strikes roughly downward following the vertical lines of the buildings. Strong light illuminates the entire scene evenly. Cobalt blue and green sink heavily into shadows and lower areas. Red and yellow placed on the buildings with blue and green reserved for shadows and background.`
  }
};


// ═══════════════════════════════════════════════════════════════════
// 😱 표현주의
// ═══════════════════════════════════════════════════════════════════

export const EXPRESSIONISM_PROMPTS = {

  // ─────────────────────────────────────────
  // 뭉크
  // ─────────────────────────────────────────

  // ★ 절규 — ~140w
  'munch-scream': {
    name: '절규',
    nameEn: 'The Scream',
    prompt: `Hand-painted oil painting of the subject by Edvard Munch. Wavy distorted lines swirl across the entire surface, trembling with rough unstable thick brushmarks. Outlines ripple and twist as edges warp into wavy distorted lines. Blood orange ripples across the entire surface. Blood orange 35%, cobalt blue 25%, sickly yellow 20%, ivory 20%. Undulating blood-red sky and dark landscape fill the background. Face and skin crudely distorted with naïve primitive features, eyes sink deep into hollow sockets, cheeks cave inward, painted in pale sickly ivory and yellow. Sickly yellow light rests on the face and bright areas of the sky. Rough thick brushwork follows undulating wave lines crossing the entire sky and landscape. Sunset light blazes in blood red from behind. Cobalt blue sinks heavily into the water and lower landscape. Orange and yellow claim the sky with blue claiming the water and lower areas.`
  },

  // ★ 마돈나 — ~132w
  'munch-madonna': {
    name: '마돈나',
    nameEn: 'Madonna',
    prompt: `Hand-painted oil painting of the subject by Edvard Munch. Wavy distorted lines swirl across the entire surface, trembling with rough unstable thick brushmarks. Outlines ripple and twist as edges warp into wavy distorted lines. A dark red aura wraps around the figure. Crimson red 30%, deep black 30%, ivory 25%, gold 15%. Deep black fills the background. Face and skin crudely distorted with naïve primitive features, the face elongates into a pale glowing oval of sickly ivory with a reddish flush. Red aura light radiates outward around the hair. Rough thick brushwork spreads outward following the undulating flow of the hair. Deep red light radiates from inside the figure outward. Deep black sinks into the background and deep within the hair. Ivory claims the skin with crimson claiming the aura and black claiming the background.`
  },

  // ★ 생의 춤 — ~150w
  'munch-danceoflife': {
    name: '생의 춤',
    nameEn: 'The Dance of Life',
    prompt: `Hand-painted oil painting of the subject by Edvard Munch. Wavy distorted lines swirl across the entire surface, trembling with rough unstable thick brushmarks. Outlines ripple and twist as edges warp into wavy distorted lines. Colors spread under cold moonlight. Crimson red 30%, deep blue 25%, ivory 25%, olive green 20%. Moonlit beach and undulating sea fill the background. Face and skin crudely distorted with naïve primitive features, forehead and cheeks pushed flat in a single tone of sickly ivory and pink. Moonlit ivory light reflects long on the figures and water. Rough thick brushwork flows along the undulating curves of the figures. Moonlight illuminates coldly from above. Deep blue and olive green sink heavily into the background and beneath the figures. Crimson red claims the central areas with ivory and black claiming the sides and blue claiming the background.`
  },

  // ─────────────────────────────────────────
  // 코코슈카
  // ─────────────────────────────────────────

  // ★ 바람의 신부 — ~141w
  'kokoschka-bride': {
    name: '바람의 신부',
    nameEn: 'Bride of the Wind',
    prompt: `Hand-painted oil painting of the subject by Oskar Kokoschka. Heavy slashing marks claw across the canvas with thick raw paint. Outlines twist and tremble within rough rapid strokes. Edges dissolve and bleed within rough brushwork. Stormy blue and green swirl powerfully across the surface. Cobalt blue 30%, olive green 25%, warm ochre 25%, ivory 20%. Swirling storm clouds and waves fill the background. Face and skin are roughly distorted, the face stretches long, cheekbones defined with rough strokes, painted roughly in ochre and blue-green. Ochre light rests roughly on the protruding planes of the face and hands. Brushwork spirals powerfully following the swirling storm. Cold light illuminates the figures from above. Cobalt blue and olive green sink into the storm and dark areas. Ochre claims the figures with blue and green claiming the stormy background.`
  },

  // ★ 퇴폐 미술가의 자화상 — ~147w
  'kokoschka-degenerate': {
    name: '퇴폐 미술가의 자화상',
    nameEn: 'Self-Portrait of a Degenerate Artist',
    prompt: `Hand-painted oil painting of the subject by Oskar Kokoschka. Heavy slashing marks claw across the canvas with thick raw paint. Outlines twist and tremble within rough rapid strokes. Edges dissolve and bleed within rough brushwork. Blue and green and ochre clash across the surface. Cobalt blue 30%, olive green 25%, ochre 25%, ivory 20%. Rough unstable color planes fill the background. Face and skin are roughly distorted in acidic blue-green tones tinted across the face, only the forehead and nose carry faint touches of ochre. Ochre light rests roughly on the protruding planes of the forehead and nose. Brushwork scratches across the face in short rapid strokes. Cold light illuminates the face directly from the front. Blue and green sink around the eyes and below the cheeks. Ochre placed on the bright planes with blue and green reserved for shadows and background.`
  },

  // ★ 2인 초상 — ~146w
  'kokoschka-double': {
    name: '2인 초상',
    nameEn: 'Double Portrait',
    prompt: `Hand-painted oil painting of the subject by Oskar Kokoschka. Heavy slashing marks claw across the canvas with thick raw paint. Outlines twist and tremble within rough rapid strokes. Edges dissolve and bleed within rough brushwork. Warm earth tones and cold blues clash across the surface. Warm ochre 35%, red brown 25%, apricot 20%, cobalt blue 20%. Warm brown-ochre color planes fill the background. Face and skin are roughly distorted in warm ochre and apricot, red-brown bleeds into the cheeks and lips, blue touches faintly around the eyes. Ochre light rests roughly on the protruding planes of foreheads and noses. Brushwork scratches rapidly between the figures in short strokes. Cold light illuminates both figures directly from the front. Blue sinks faintly around the eyes and below the cheeks. Ochre and apricot claim the bright planes with red-brown reserved for cheeks and blue for faint shadows.`
  },

  // ─────────────────────────────────────────
  // 키르히너
  // ─────────────────────────────────────────

  // ★ 베를린 거리 풍경 — ~159w
  'kirchner-berlin': {
    name: '베를린 거리 풍경',
    nameEn: 'Berlin Street Scene',
    prompt: `Hand-painted oil painting of the subject by Ernst Ludwig Kirchner. Sharp angular forms cut across the canvas with raw brushmarks. Forms simplify into jagged primitive shapes. Outlines break at hard angles. Edges between forms are defined by sharp color collisions. Dark navy and pink clash sharply across the surface. Dark navy 35%, hot pink 25%, acid green 20%, black 20%. Angular jagged buildings and narrow streets fill the background in navy. Face and skin are painted roughly in acidic colors, the body stretches elongated, jawline cuts sharply, nose extends long, pink and apricot tinted flatly across the face. Pink light rests on sharp edges of the face and protruding forms. Brushwork strikes sharply downward along the diagonal lines of the street. Strong artificial light falls sharply from above. Black and dark navy sink heavily beneath the figures and into building shadows. Pink and apricot claim the faces with navy and black reserved for coats, street and shadows.`
  },

  // ★ 군인으로서의 자화상 — ~154w
  'kirchner-soldier': {
    name: '군인으로서의 자화상',
    nameEn: 'Self-Portrait as a Soldier',
    prompt: `Hand-painted oil painting of the subject by Ernst Ludwig Kirchner. Sharp angular forms cut across the canvas with raw brushmarks. Forms simplify into jagged primitive shapes. Outlines break at hard angles. Edges between forms are defined by sharp color collisions. Sickly yellow and blue clash across the surface. Cobalt blue 35%, sickly yellow 25%, vermilion red 20%, black 20%. Red-orange color planes fill the background. Face and skin are painted roughly in acidic colors, the body stretches elongated, the face sharply angular, sickly yellow and ochre tinted across the skin. Yellow light rests roughly on the protruding planes of the forehead and nose. Brushwork strikes sharply downward along the vertical axis of the figure. Cold light illuminates the face directly from the front. Black and cobalt blue sink heavily into the clothing folds and shadows. Yellow claims the skin with blue claiming the clothing and red reserved for the background.`
  }
};


// ═══════════════════════════════════════════════════════════════════
// 🎭 모더니즘
// ═══════════════════════════════════════════════════════════════════

export const MODERNISM_PROMPTS = {

  // ─────────────────────────────────────────
  // 클림트
  // ─────────────────────────────────────────

  // ★ 키스 — ~135w
  'klimt-kiss': {
    name: '키스',
    nameEn: 'The Kiss',
    prompt: `Hand-painted oil painting of the subject by Gustav Klimt. Gold leaf and metallic surfaces shimmer across the canvas, rich mosaic patterns fill ornamental shapes. Geometric and floral patterns wrap the figure. Edges blur between realistic skin and golden decoration. Radiant gold leaf wraps the scene in shimmering glow. Gold 40%, ocher yellow 20%, emerald green 20%, purple 20%. Flat golden mist fills the entire background. Rectangular geometric patterns on robe, circular flower patterns on dress, flower meadow. Face and hands painted soft ivory realistically, body disappears under gold leaf patterns. Gold glow spreads radiantly across robes and background. Decorative patterns flow along figure contours. Golden light shines from inside outward. Emerald green and purple sink into flower meadow and dress. Gold dominates figures and background, green and purple remain in flowers and decoration.`
  },

  // ★ 유디트 I — ~144w
  'klimt-judith': {
    name: '유디트 I',
    nameEn: 'Judith I',
    prompt: `Hand-painted oil painting of the subject by Gustav Klimt. Gold leaf and metallic surfaces shimmer across the canvas, rich mosaic patterns fill ornamental shapes. Geometric and floral patterns wrap the figure. Edges blur between realistic skin and golden decoration. Gold leaf wraps the scene in radiant glow. Gold 35%, deep black 25%, ivory pink 20%, dark green 20%. Gold stylized trees and decorative patterns fill the background. Wide gold choker necklace, jeweled decorative belt. Pink and light blue brushstrokes layered over ivory skin tone making skin appear luminous and alive. Gold leaf light spreads radiantly across necklace and background. Fine brushstrokes densely layered over face and skin. Golden light shines from inside outward illuminating the figure. Dark green and black sink into clothing and hair. Gold dominates background and decoration, ivory pink on skin, black and green remain in hair and clothing.`
  },

  // ★ 생명의 나무 — ~144w
  'klimt-treeoflife': {
    name: '생명의 나무',
    nameEn: 'The Tree of Life',
    prompt: `Hand-painted oil painting of the subject by Gustav Klimt. Gold leaf and metallic surfaces shimmer across the canvas, rich mosaic patterns fill ornamental shapes. Geometric and floral patterns wrap the forms. Edges blur between surfaces and golden decoration. Gold leaf spirals endlessly swirling across the entire canvas. Gold 40%, bronze brown 25%, emerald green 20%, ivory 15%. Warm gold color field fills the background decoratively. Spiral branches with triangles, circles, spiral motifs, black bird. Spiral branches swirl in bronze and gold extending outward, triangles and circles fill spaces between branches. Gold leaf light spreads radiantly over branches and motifs. Decorative patterns flow along the spiral swirls of branches. Golden light illuminates the entire scene evenly from inside outward. Bronze and green sink below branches and into roots. Gold dominates branches and background, bronze and green remain in motifs and roots.`
  },

  // ─────────────────────────────────────────
  // 피카소
  // ─────────────────────────────────────────

  // ★ 도라 마르의 초상 — ~159w
  'picasso-doramaar': {
    name: '도라 마르의 초상',
    nameEn: 'Portrait of Dora Maar',
    prompt: `Hand-painted oil painting of the subject by Pablo Picasso. The nose is seen from the side while the eyes face forward, bold black outlines divide the face into angular geometric planes. Vibrant primary colors fill each flat plane. Multiple viewpoints merge onto one surface. Edges between color planes are defined by thick black lines. Intense primary colors split into geometric planes. Vermilion red 25%, chrome yellow 25%, emerald green 25%, cobalt blue 25%. Simple color fields fill the background flatly. One eye painted red the other green, forehead and cheeks and chin each divided into different colored geometric planes painted flat. Chrome yellow light rests flatly on bright planes of the face. Bold black outlines drawn sharply along geometric divisions of face and body. Strong light illuminates the face flatly from the front. Blue and green sink into dark planes and background. Red and yellow claim bright planes, green and blue remain in dark planes.`
  },

  // ─────────────────────────────────────────
  // 프리다 칼로
  // ─────────────────────────────────────────

  // ★ 나와 앵무새들 — 짧은 버전
  'frida-parrots': {
    name: '나와 앵무새들',
    nameEn: 'Me and My Parrots',
    prompt: `Hand-painted oill painting of the subject by Frida Kahlo. Face and skin are painted in flat warm olive tones, intense direct gaze forward. Vibrant Mexican folk colors fill symbolic elements. Lush tropical foliage surrounds the figure. Me and My Parrots style. Bright feathers glow against a dark background. Dark olive green 35%, emerald green 25%, white 20%, vermilion red 20%. Dark olive green fills the entire background in stillness. Colorful parrots rest near the figure. Eyes gaze directly forward, skin painted in flat even warm olive tones. Even light rests on face and white blouse. Dense brushstrokes flow along hair and foliage. Even light illuminates the face from the front. Dark olive sinks deep into background and hair. Olive dominates the background, green and red fill accents, white remains on the blouse.`
  },

  // ★ 원숭이 자화상 — 짧은 버전
  'frida-monkeys': {
    name: '원숭이 자화상',
    nameEn: 'Self-Portrait with Monkeys',
    prompt: `Hand-painted oil painting of the subject by Frida Kahlo. Face and skin are painted in flat warm olive tones, intense direct gaze forward. Vibrant Mexican folk colors fill symbolic elements. Lush tropical foliage surrounds the figure. Self-Portrait with Monkeys style. Green foliage wraps closely. Deep green 35%, olive skin 25%, dark brown 20%, yellow green 20%. Dense tropical foliage fills the entire background thickly. Small monkey rests behind the figure. Eyes gaze intensely forward, skin painted in flat even warm olive tones. Even light rests on face and white blouse. Dense brushstrokes flow along leaves and foliage. Even light illuminates the face from the front. Deep green and brown sink into foliage and shadows. Green dominates background foliage, olive on skin, brown remains in shadows.`
  },

  // ─────────────────────────────────────────
  // 마그리트
  // ─────────────────────────────────────────

  // ★ 골콩드 — ~160w
  'magritte-golconda': {
    name: '골콩다',
    nameEn: 'Golconda',
    prompt: `Hand-painted oil painting by René Magritte. Muted naturalistic colors with even lighting. Dark grey 30%, pale blue 30%, beige 20%, crimson red 20%. Background of pale blue sky and red-roofed buildings. 40+ identical full-body standing figures of the subject are added floating weightlessly in a grid pattern, densely filling the entire sky and screen. Figures detailed in foreground, smaller and hazier with distance. Visible oil paint texture on all surfaces. Soft light from left. Blue sky, red rooftops, beige buildings.`
  },

  // ─────────────────────────────────────────
  // 미로
  // ─────────────────────────────────────────

  // ★ 카탈루냐 풍경 — ~140w
  'miro-catalan': {
    name: '카탈루냐 풍경',
    nameEn: 'The Catalan Landscape',
    prompt: `Hand-painted oil painting of the subject by Joan Miró. Black lines and primary color forms float freely on open canvas. Figures reduced to simple symbols like dots, lines, circles, triangles. Primary colors and black arranged across wide empty space. Outlines drawn in bold black lines. Symbols and lines play on warm earth. Warm ocher 35%, golden yellow 25%, black 20%, red 20%. Upper sky in yellow, lower earth in ocher divides the background. Triangles, circles, curves scatter in black and primary colors floating on ocher and yellow ground. Golden yellow spreads brightly across the sky area. Thin black lines freely connect symbols and forms flowing organically. Even light illuminates the entire surface flatly. Ocher and brown sink below the earth line. Ocher claims the earth, yellow claims the sky, black and red remain in symbols and lines.`
  },

  // ★ 별자리 시리즈 — ~146w
  'miro-constellation': {
    name: '별자리 시리즈',
    nameEn: 'Constellations Series',
    prompt: `Hand-painted oil painting of the subject by Joan Miró. Black lines and primary color forms float freely on open canvas. Figures reduced to simple symbols like dots, lines, circles, triangles. Primary colors and black arranged across wide empty space. Outlines drawn in bold black lines. Stars and symbols fill densely like a night sky. Cream beige 30%, black 25%, vermilion red 20%, cobalt blue 15%, chrome yellow 10%. Thin flat wash stains fill the background irregularly. Stars, eyes, crescents, hourglass forms painted in red, blue, yellow, black densely covering the surface. Primary color forms glow like jewels on pale beige background. Thin black lines connect stars and symbols like a web flowing throughout. Even light illuminates the entire surface flatly. Black sinks into lines and inside forms. Beige wash claims the background, red blue yellow fill the symbols, black remains in lines and outlines.`
  },

  // ★ 태양 앞의 여인 — ~151w
  'miro-bluestar': {
    name: '푸른 별 앞의 여인',
    nameEn: 'Woman in Front of the Sun',
    prompt: `Hand-painted oil painting of the subject by Joan Miró. Black lines and primary color forms float freely on open canvas. Figures reduced to simple symbols like dots, lines, circles, triangles. Primary colors and black arranged across wide empty space. Outlines drawn in bold black lines. A massive black form stands before the dark sky. Deep blue 35%, black 30%, vermilion red 20%, yellow green 15%. Deep dark blue fills the background uniformly. Large black figure at center, red circle sun and star symbols float nearby, yellow-green eye glows from the head. Red sun and yellow-green eye shine intensely against the dark background. Bold black lines draw the simple outline of the figure. Even light illuminates the entire surface flatly. Deep blue spreads uniformly across the entire background. Deep blue claims the background, black fills the figure, red remains on the sun, yellow-green on the eye.`
  },

  // ─────────────────────────────────────────
  // 샤갈
  // ─────────────────────────────────────────

  // ★ 꽃과 연인들 — ~157w
  'chagall-lovers': {
    name: '꽃과 연인들',
    nameEn: 'Lovers with Flowers',
    prompt: `Hand-painted oil painting of the subject by Marc Chagall. Intense deep blue and red fill the scene in floating fantasy. Thick rough brushstrokes with visible impasto texture shift boundaries between solid forms and open space. Outlines are simple and childlike, forms float and tilt freely. Colors are bold saturated jewel tones layered thickly. Bright bouquet radiates warmth against a dark background. Deep green 30%, dark blue 25%, vermilion red 20%, white pink 25%. Deep green and dark blue blend darkly filling the background. Add large bouquet with red, white, pink flowers to decorate the scene. Face painted in naïve folk art style with simplified features, flat planes of color, childlike proportions. Bright red and white of the bouquet glow vividly against the dark background. Thick bold brushstrokes follow figures and flower contours. Warm glowing light radiates from bouquet and face at center. Deep green and dark blue sink deep behind figures and toward edges. Green and blue claim the background, red and pink fill the flowers, ivory remains on skin.`
  },

  // ★ 신부 — ~149w
  'chagall-lamariee': {
    name: '신부',
    nameEn: 'La Mariée',
    prompt: `Hand-painted oil painting of the subject by Marc Chagall. Intense deep blue and red fill the scene in floating fantasy. Thick rough brushstrokes with visible impasto texture shift boundaries between solid forms and open space. Outlines are simple and childlike, forms float and tilt freely. Colors are bold saturated jewel tones layered thickly. Massive red veil swirls in the night sky. Crimson red 30%, deep navy blue 30%, white cream 20%, dark green 20%. Deep navy blue night sky fills the background. Add dreamlike violin, candelabra and moon floating in the background. Face painted in naïve folk art style with simplified features, flat planes of color, childlike proportions. White dress and red veil glow vividly against the dark night sky. Thick bold brushstrokes follow veil and dress flow. Warm glowing light radiates from the bride outward. Deep blue sinks deep into background and edges. Blue claims the night sky, red fills the veil, white fills the dress, green remains in village and figures.`
  },

  // ★ 나와 마을 — ~148w
  'chagall-village': {
    name: '나와 마을',
    nameEn: 'I and the Village',
    prompt: `Hand-painted oil painting of the subject by Marc Chagall. Intense deep blue and red fill the scene in floating fantasy. Thick rough brushstrokes with visible impasto texture shift boundaries between solid forms and open space. Outlines are simple and childlike, forms float and tilt freely. Colors are bold saturated jewel tones layered thickly. Jewel-like primary colors layer on geometric planes. Emerald green 30%, vermilion red 25%, deep blue 25%, white yellow 20%. Emerald green and deep blue divide into geometric planes filling the background. Add dreamlike village houses and church floating in the background. Face painted in naïve folk art style with emerald green skin, simplified features, flat planes of color, childlike proportions. Bold saturated colors glow like jewels across geometric planes. Thick bold brushstrokes follow geometric plane edges. Warm glowing light radiates evenly making colors glow. Deep blue sinks toward the top and edges. Green claims figure and background planes, red fills accents, blue fills sky and shadows, white remains on bright planes.`
  },

  // ─────────────────────────────────────────
  // 리히텐슈타인
  // ─────────────────────────────────────────

  // ★ 차 안에서 — ~85w
  'lichtenstein-inthecar': {
    name: '차 안에서',
    nameEn: 'In the Car',
    prompt: `COMIC PANEL FRAME with THICK BLACK BORDER around entire image. Pop art painting of the subject by Roy Lichtenstein "In the Car" (1963). EXTREMELY LARGE VISIBLE Ben-Day dots 15mm+ covering ALL skin and background areas. ULTRA THICK BLACK INK OUTLINES 20mm+ surrounding ALL shapes faces and figures. HEAVY BLACK CONTOUR LINES on EVERY edge. FLAT primary colors ONLY, vermilion red 30%, bright yellow 25%, black 25%, white 20%. Horizontal parallel lines create speed across background. Bright yellow hair and coat contrast sharply against red car body. Primary colors applied pure and unmixed with sharp clean boundaries.`
  },

  // ★ M-메이비 — ~85w
  'lichtenstein-mmaybe': {
    name: '아마도',
    nameEn: 'M-Maybe',
    prompt: `COMIC PANEL FRAME with THICK BLACK BORDER around entire image. Pop art painting of the subject by Roy Lichtenstein "M-Maybe" (1965). EXTREMELY LARGE VISIBLE Ben-Day dots 15mm+ covering ALL skin and background areas. ULTRA THICK BLACK INK OUTLINES 20mm+ surrounding ALL shapes faces and figures. HEAVY BLACK CONTOUR LINES on EVERY edge. FLAT primary colors ONLY, bright yellow 30%, blue 25%, black 25%, white 20%. Blue and yellow toned city buildings simplified in background. Bright yellow hair contrasts intensely against blue background. Primary colors applied pure and unmixed with sharp clean boundaries.`
  },

  // ★ 잊어! 날 잊어! — ~85w
  'lichtenstein-forgetit': {
    name: '날 잊어',
    nameEn: 'Forget It! Forget Me!',
    prompt: `COMIC PANEL FRAME with THICK BLACK BORDER around entire image. Pop art painting of the subject by Roy Lichtenstein "Forget It! Forget Me!" (1962). EXTREMELY LARGE VISIBLE Ben-Day dots 15mm+ covering ALL skin and background areas. ULTRA THICK BLACK INK OUTLINES 20mm+ surrounding ALL shapes faces and figures. HEAVY BLACK CONTOUR LINES on EVERY edge. FLAT primary colors ONLY, bright yellow 30%, black 30%, blue 20%, red 20%. Solid flat color fills background behind figures. Bright yellow hair contrasts intensely against dark blue-black male hair. Primary colors applied pure and unmixed with sharp clean boundaries.`
  },

  // ★ 오...알겠어 — ~85w
  'lichtenstein-ohhhalright': {
    name: '오 알았어',
    nameEn: 'Ohhh...Alright...',
    prompt: `COMIC PANEL FRAME with THICK BLACK BORDER around entire image. Pop art painting of the subject by Roy Lichtenstein "Ohhh...Alright..." (1964). EXTREMELY LARGE VISIBLE Ben-Day dots 15mm+ covering ALL skin and background areas. ULTRA THICK BLACK INK OUTLINES 20mm+ surrounding ALL shapes faces and figures. HEAVY BLACK CONTOUR LINES on EVERY edge. FLAT primary colors ONLY, bright yellow 30%, blue 30%, black 20%, red 20%. Blue color field fills area behind figure uniformly. Bright yellow hair contrasts against blue background, red lips accent sharply. Primary colors applied pure and unmixed with sharp clean boundaries.`
  },

  // ★ 팔레트가 있는 정물 — ~85w
  'lichtenstein-stilllife': {
    name: '정물화',
    nameEn: 'Still Life with Palette',
    prompt: `COMIC PANEL FRAME with THICK BLACK BORDER around entire image. Pop art painting of the subject by Roy Lichtenstein "Still Life with Palette" (1972). EXTREMELY LARGE VISIBLE Ben-Day dots 15mm+ covering ALL surfaces and background areas. ULTRA THICK BLACK INK OUTLINES 20mm+ surrounding ALL shapes and objects. HEAVY BLACK CONTOUR LINES on EVERY edge. FLAT primary colors ONLY, bright yellow 30%, blue 25%, black 25%, white 20%. Blue and black color fields form walls behind objects. Bright yellow objects contrast sharply against blue-black background. Diagonal leading lines flow toward center. Primary colors applied pure and unmixed with sharp clean boundaries.`
  }
};


// ═══════════════════════════════════════════════════════════════════
// 🎎 동양화
// ═══════════════════════════════════════════════════════════════════

export const ORIENTAL_PROMPTS = {

  // ─────────────────────────────────────────
  // 한국화
  // ─────────────────────────────────────────
  
  'minhwa': {
    name: '민화',
    nameEn: 'Korean Folk Painting (Minhwa)',
    prompt: `Korean folk painting (Minhwa) style from late Joseon Dynasty. MINERAL PIGMENTS on WARM YELLOWED HANJI PAPER with visible fiber texture. BOLD VIBRANT Obangsaek colors (red, blue, yellow, white, black) applied in LAYERS from light to dark. Various brush sizes creating different textures and lines. SIMPLIFIED EXAGGERATED FORMS with humor and naive charm. SYMBOLIC MOTIFS: tigers and magpies (호작도), peonies (모란), cranes, carp, ten longevity symbols. Unconventional compositions filling entire surface. Primitive folk art quality. Traditional Korean hanbok clothing if people present. Natural unadorned beauty - warm approachable charm with innocent smile.`
  },

  'pungsokdo': {
    name: '풍속도',
    nameEn: 'Korean Genre Painting (Pungsokdo)',
    prompt: `Korean genre painting (Pungsokdo) style by masters Kim Hongdo and Shin Yun-bok. LIGHT BLACK INK BRUSHWORK as base with highly DILUTED PALE BLUE AND BROWN color washes on hanji paper. DELICATE CONFIDENT BRUSH LINES for figures with MINIMAL SPARSE strokes - capture entire figure in just a few elegant lines. GENEROUS EMPTY NEGATIVE SPACE covering 60%+ of composition as essential aesthetic element. Very limited muted color palette with soft pastel accents. Light watercolor quality with visible HANJI PAPER FIBER TEXTURE throughout. Traditional Joseon hanbok clothing in elegant soft colors. Quiet understated natural beauty - gentle serene expression, unadorned simplicity like morning dew. SPARSE COMPOSITION with breathing room around every element.`
  },

  'jingyeong': {
    name: '진경산수',
    nameEn: 'Korean True-View Landscape (Jingyeong Sansu)',
    prompt: `Korean true-view landscape painting (Jingyeong Sansu/진경산수) style by master Jeong Seon (Gyeomjae). BOLD EXPRESSIVE BLACK INK brush strokes for craggy mountains. REAL KOREAN MOUNTAIN SCENERY - distinctive granite peaks of Diamond Mountains (Geumgangsan). Strong dynamic ink work with energetic brushstrokes. Authentic Korean topography. Misty atmospheric perspective with ink wash gradations on HANJI PAPER with visible fiber texture. GENEROUS EMPTY SPACE for sky and mist areas. PALE DILUTED ink washes for distant mountains. Traditional Korean landscape composition with dramatic vertical peaks.`
  },

  // ─────────────────────────────────────────
  // 중국화
  // ─────────────────────────────────────────
  
  'shuimohua': {
    name: '수묵화',
    nameEn: 'Chinese Ink Wash Painting (Shuimohua)',
    prompt: `BLACK INK on XUAN RICE PAPER with VISIBLE PAPER GRAIN texture. THREE INK INTENSITIES (dark, medium, light/濃淡) within SINGLE CONFIDENT brushstrokes - once painted cannot be changed. MONOCHROME gradations from deep black to silvery pale grey. EMPTY NEGATIVE SPACE (留白) as philosophical Daoist element - emptiness as important as painted areas. Spontaneous expressive strokes capturing life energy (氣韻/qi) over physical likeness. AXE-CUT TEXTURE STROKES (斧劈皴) for angular rocks and mountains. Misty atmospheric depth with soft washes. Traditional Chinese hanfu clothing (flowing robes with wide sleeves). Scholarly refined elegance with dignified serene bearing.`
  },

  'gongbi': {
    name: '공필화',
    nameEn: 'Chinese Meticulous Court Painting (Gongbi)',
    prompt: `Chinese meticulous court painting (Gongbi/工筆) style from Tang/Song Dynasty. FINE PRECISE INK OUTLINES drawn first, then COLOR WASHES applied LAYER BY LAYER from lightest to darkest building rich depth and volume. NATURAL MINERAL PIGMENTS on SILK with visible woven texture and LUMINOUS SUBTLE SHEEN throughout. Rich vivid saturated colors - vermillion (朱砂), malachite green (石綠), azurite blue (石青), gold leaf. ULTRA-FINE DETAILED BRUSHWORK - every eyelash and hair strand individually painted with hair-thin lines. Tang/Song Dynasty imperial court elegance. RICHLY FILLED composition with elaborate background elements. Elaborate decorative patterns on robes, ornate jade hair ornaments, gold jewelry, embroidered silk details. Regal dignified beauty with serene majestic bearing - imperial court splendor. Traditional Chinese hanfu clothing with LAVISH ornate details and layered textures.`
  },

  // ─────────────────────────────────────────
  // 일본화
  // ─────────────────────────────────────────
  
  // v79: 우키요에 5분기 — 피사체별 장르 분리
  // bijinga(여성/우타마로), yakushae(남성/샤라쿠), meishoe(풍경/히로시게), animal(동물/쿠니요시)
  
  'ukiyoe': {
    name: '우키요에 미인화',
    nameEn: 'Japanese Ukiyo-e Bijin-ga',
    prompt: `Japanese Ukiyo-e woodblock print in bijin-ga (美人画) beautiful woman style by Kitagawa Utamaro. STUNNINGLY BEAUTIFUL STYLIZED face with captivating almond eyes, graceful arched eyebrows, small delicate lips rendered as FLAT COLOR AREAS with BOLD BLACK OUTLINE edges. Skin as SINGLE FLAT TONE in warm ochre or earth tones. Elegant elongated neck and graceful hand gestures. EVERY surface is FLAT SOLID COLOR separated by BOLD BLACK OUTLINES 3mm thick - pure woodblock print aesthetic. LIMITED PALETTE of water-soluble pigments - indigo (藍), vermillion (朱), yellow ochre, green, pink. CHERRY WOOD BLOCK TEXTURE (桜板) visible in color areas with subtle wood grain. BAREN-PRESSED TEXTURE with bokashi gradation. COMPLETELY FLAT TWO-DIMENSIONAL - all beauty expressed through LINE QUALITY and PATTERN. Dramatic asymmetrical composition. Transform clothing to LUXURIOUS traditional KIMONO with intricate decorative patterns. Elegant Edo period aesthetic, idealized flattering woodblock portrait.`
  },

  'ukiyoe_yakushae': {
    name: '우키요에 역자회',
    nameEn: 'Japanese Ukiyo-e Yakusha-e',
    prompt: `Japanese Ukiyo-e woodblock print in yakusha-e (役者絵) kabuki actor portrait style by Toshusai Sharaku. STRIKINGLY HANDSOME masculine face with piercing intense eyes, strong angular jawline, powerful dignified expression - all rendered as FLAT COLOR AREAS with BOLD BLACK EDGES. BOLD DRAMATIC EXPRESSION with exaggerated theatrical features capturing charismatic intensity. DARK MICA BACKGROUND (雲母摺) creating silvery metallic sheen as SINGLE FLAT TONE. STRONG ANGULAR BLACK OUTLINES 4mm thick defining powerful masculine features. LIMITED PALETTE - deep indigo (藍), vermillion (朱), yellow ochre, black, grey. CHERRY WOOD BLOCK TEXTURE (桜板) visible throughout. Sharp geometric forms, dramatic asymmetry. COMPLETELY FLAT TWO-DIMENSIONAL - all power expressed through LINE WEIGHT and CONTRAST. Transform clothing to traditional HAKAMA (袴) with HAORI jacket and bold patterns. Commanding Edo period woodblock portrait.`
  },

  'ukiyoe_meishoe': {
    name: '우키요에 명소회',
    nameEn: 'Japanese Ukiyo-e Meisho-e Landscape',
    prompt: `Japanese Ukiyo-e woodblock print in meisho-e (名所絵) famous places landscape style by Utagawa Hiroshige. BREATHTAKINGLY BEAUTIFUL atmospheric perspective with layered landscape planes receding into distance. BOKASHI gradation technique (暈し) creating smooth sky and water transitions from deep indigo to pale blue. Rich emotional mood with poetic seasonal atmosphere. LIMITED PALETTE - Prussian blue (ベロ藍), vermillion, green, grey, soft pink. BOLD BLACK OUTLINES defining mountains, trees, bridges, architecture. Rain shown as fine parallel diagonal lines. Mist and fog dissolving distant forms. CHERRY WOOD BLOCK TEXTURE (桜板) visible throughout. Completely FLAT TWO-DIMENSIONAL aesthetic with dramatic atmospheric depth illusion. Serene contemplative Edo period landscape, stunning scenic masterpiece.`
  },

  'ukiyoe_animal': {
    name: '우키요에 동물화',
    nameEn: 'Japanese Ukiyo-e Animal Print',
    prompt: `Japanese Ukiyo-e woodblock print in animal portrait style by Utagawa Kuniyoshi (歌川国芳). ADORABLE EXPRESSIVE ANIMAL as central subject drawn with irresistible charm and vivid personality. Bright sparkling eyes full of character, endearing facial expression. BOLD BLACK OUTLINES 3mm thick defining fur texture and body form with playful energy. LIMITED PALETTE of water-soluble pigments - indigo (藍), vermillion (朱), yellow ochre, brown, grey. CHERRY WOOD BLOCK TEXTURE (桜板) visible in color areas. FLAT SOLID COLOR AREAS with subtle gradation for fur and features. Simple scenic background - garden, tatami room, or nature setting. Charming anthropomorphic quality capturing lovable animal personality. Completely FLAT TWO-DIMENSIONAL Edo period aesthetic, heartwarming masterpiece.`
  },

  'rinpa': {
    name: '린파',
    nameEn: 'Japanese Rinpa School Decorative Painting',
    prompt: `Japanese Rinpa school (琳派) decorative painting style by masters Sotatsu and Korin. BRILLIANT GOLD OR SILVER LEAF BACKGROUND (金箔/銀箔) with metallic sheen catching light. TARASHIKOMI technique (垂らし込み) - ink or pigment pooling on wet surface creating soft bleeding edges and marbled effects. MOKKOTSU boneless style (沒骨法) - PURELY BONELESS forms defined purely by color areas alone. STYLIZED NATURAL MOTIFS: irises (燕子花), plum blossoms (梅), waves, cranes, autumn grasses (秋草). BOLD ASYMMETRICAL COMPOSITION with dramatic use of negative space. FLAT TWO-DIMENSIONAL decorative aesthetic - pattern over realism. Vivid colors (deep indigo, vermillion, malachite green, white) against gold ground. Elegant Edo period aristocratic refinement. Transform clothing to traditional KIMONO with decorative Rinpa-style patterns.`
  }
};




// ═══════════════════════════════════════════════════════════════════
// 🔧 프롬프트 통합 및 유틸리티
// ═══════════════════════════════════════════════════════════════════

// 모든 프롬프트 통합
export const ALL_PROMPTS = {
  ...ANCIENT_MEDIEVAL_PROMPTS,
  ...RENAISSANCE_PROMPTS,
  ...BAROQUE_PROMPTS,
  ...ROCOCO_PROMPTS,
  ...NEO_ROMAN_REAL_PROMPTS,
  ...IMPRESSIONISM_PROMPTS,
  ...POST_IMPRESSIONISM_PROMPTS,
  ...FAUVISM_PROMPTS,
  ...EXPRESSIONISM_PROMPTS,
  ...MODERNISM_PROMPTS,
  ...ORIENTAL_PROMPTS
};


/**
 * 프롬프트 가져오기
 * @param {string} key - 프롬프트 키 (예: 'vangogh-starrynight')
 * @returns {object|null} - 프롬프트 객체 또는 null
 */
export function getPrompt(key) {
  const normalized = key.toLowerCase().trim().replace(/\s+/g, '-');
  return ALL_PROMPTS[normalized] || null;
}


// 콘솔 로그
// ═══════════════════════════════════════════════════════════════════
// 🎨 화가별 기본 화풍 프롬프트 (artistStyles.js → v79 통합)
// ═══════════════════════════════════════════════════════════════════
export const ARTIST_STYLES = {
  
  // 🏛️ 고대 (특수 질감)
  'classical-sculpture': 'Ancient Greek-Roman marble sculpture style. Pure white Carrara marble with smooth polished surface, carved stone texture.',
  'roman-mosaic': 'Roman floor mosaic style. Large visible tesserae tiles 50mm, thick black grout lines, earth tone palette. PRESERVE ORIGINAL SKIN TONE AND FACIAL FEATURES using appropriate tile colors. Transform clothing to Roman toga or tunic with draped folds.',

  // ⛪ 중세
  'byzantine': 'Byzantine sacred icon style. Brilliant gold leaf background, flat frontal pose, large solemn eyes, rich jewel colors.',
  'gothic': 'Gothic stained glass style. Bold black lead lines, luminous jewel-tone translucent colors, light streaming through.',
  'islamic-miniature': 'Persian miniature painting style. Exquisite intricate details, vibrant jewel colors, delicate fine brushwork.',

  // 🎨 르네상스
  'botticelli': 'Old oil painting by Sandro Botticelli, Botticelli art style, elegant flowing lines, ethereal pale skin, graceful diaphanous fabrics billowing gently.',
  'leonardo': 'Old oil painting by Leonardo da Vinci, da Vinci art style, extreme sfumato technique, soft hazy edges dissolving like smoke, mysterious atmospheric depth. CRITICAL: Paint ONLY the subject from original photo, PRESERVE original face and facial features exactly.',
  'titian': 'Old oil painting by Titian, Titian art style, warm glowing golden flesh, rich luminous Venetian colors, bold loose brushwork.',
  'michelangelo': 'Old oil painting by Michelangelo, Michelangelo art style, powerful heroic muscular figures, dramatic foreshortening, monumental grandeur.',
  'raphael': 'Old oil painting by Raphael, Raphael art style, perfect harmonious beauty, serene balanced composition, gentle graceful expressions.',

  // 🎭 바로크
  'caravaggio': 'Old oil painting by Caravaggio, Caravaggio art style, extreme tenebrism, intense spotlight from absolute black darkness, dramatic theatrical illumination.',
  'rubens': 'Old oil painting by Peter Paul Rubens, Rubens art style, radiant luminous flesh, explosive swirling movement, rich passionate reds and golds.',
  'rembrandt': 'Old oil painting by Rembrandt, Rembrandt art style, intense golden glow, deep mysterious shadows, thick impasto highlights.',
  'velazquez': 'Old oil painting by Diego Velazquez, Velazquez art style, refined court elegance, masterful loose brushwork, subtle silver-grey palette.',

  // 🌸 로코코
  'watteau': 'Old oil painting by Antoine Watteau, Watteau art style, delicate feathery brushwork, soft dreamy pastoral scenes, romantic melancholic atmosphere.',
  'boucher': 'Old oil painting by François Boucher, Boucher art style, soft rosy flesh tones, light pastel palette, playful decorative elegance.',

  // 🏛️ 신고전주의
  'david': 'Old oil painting by Jacques-Louis David, David art style, crisp clear outlines, heroic idealized figures, dramatic moral intensity.',
  'ingres': 'Old oil painting by Jean-Auguste-Dominique Ingres, Ingres art style, smooth flowing contours, porcelain-smooth skin, elegant sinuous curves.',

  // 🌊 낭만주의
  'turner': 'Old oil painting by J.M.W. Turner, Turner art style, atmospheric sublime light, swirling mist dissolving forms, luminous golden glow.',
  'delacroix': 'Old oil painting by Eugène Delacroix, Delacroix art style, passionate revolutionary energy, vivid intense colors, turbulent swirling movement.',

  // 🌾 사실주의
  'courbet': 'Old oil painting by Gustave Courbet, Courbet art style, raw unidealized realism, bold palette knife texture, dark earthy tones.',
  'manet': 'Old oil painting by Édouard Manet, Manet art style, bold flat composition, striking light-dark contrast, loose confident brushwork.',

  // 🌅 인상주의
  'renoir': 'Old oil painting by Pierre-Auguste Renoir, Renoir art style, warm luminous glow, soft feathery brushstrokes, rosy pink flesh tones, dappled sunlight filtering through leaves.',
  'monet': 'Old oil painting by Claude Monet, Monet art style, broken color brushstrokes, soft hazy atmospheric light, colors blending and dissolving.',
  'degas': 'Old oil painting by Edgar Degas, Degas art style, unusual cropped angles, asymmetric composition, soft pastel chalky texture.',
  'caillebotte': 'Old oil painting by Gustave Caillebotte, Caillebotte art style, dramatic converging perspective, muted grey-blue tones, wet pavement reflections.',

  // 🌻 후기인상주의
  'vangogh': 'Old oil painting by Vincent van Gogh, Van Gogh art style, swirling spiral brushstrokes on face skin clothing and entire subject, thick impasto texture throughout, intense cobalt blue and chrome yellow.',
  'gauguin': 'Old oil painting by Paul Gauguin, Gauguin art style, bold black outlines, flat pure saturated colors, exotic tropical palette.',
  'cezanne': 'Old oil painting by Paul Cézanne, Cézanne art style, geometric structural forms, visible constructive brushstrokes, muted earthy palette.',

  // 🔥 야수파
  'matisse': 'Old oil painting by Henri Matisse, Matisse art style, bold flat pure colors, simplified expressive forms, vibrant emotional intensity.',
  'derain': 'Old oil painting by André Derain, Derain art style, explosive vivid colors, bold rough brushstrokes, raw fauvist energy.',
  'vlaminck': 'Old oil painting by Maurice de Vlaminck, Vlaminck art style, violent intense colors, thick aggressive brushwork, wild untamed energy.',

  // 😱 표현주의
  'munch': 'Old oil painting by Edvard Munch, Munch art style, INTENSE PSYCHOLOGICAL emotional depth, WAVY DISTORTED swirling lines throughout entire image, haunting symbolic colors (blood red sky, sickly yellows, deep blues), intense anxiety and existential dread.',
  'kirchner': 'Old oil painting by Ernst Ludwig Kirchner, Kirchner art style, sharp angular jagged forms, extreme bold clashing colors, elongated mask-like faces, raw primitive aggressive intensity.',
  'kokoschka': 'Old oil painting by Oskar Kokoschka, Kokoschka art style, violent turbulent slashing brushwork, harsh acidic feverish colors, deeply distorted psychological tension.',

  // 🎪 모더니즘
  'picasso': 'Old oil painting by Pablo Picasso, Picasso Cubist art style, geometric fragmentation on face and entire body, face broken into angular planes, nose from side profile while both eyes visible from front, jaw chin cheeks shattered into geometric segments, multiple viewpoints simultaneously.',
  'magritte': 'Old oil painting by René Magritte, Magritte Surrealist art style, philosophical visual paradox, mysterious object obscuring face, dreamlike impossible scenarios.',
  'miro': 'Old oil painting by Joan Miró, Miró art style, playful biomorphic shapes, childlike symbols floating, primary colors on white background, spontaneous whimsical lines.',
  'chagall': 'Old pastel oil painting by Marc Chagall, dreamy Chagall art style, floating figures, nostalgic romantic atmosphere, poetic lyrical quality, dreamlike imagery with horses birds butterflies flowers.',
  'lichtenstein': 'by Roy Lichtenstein, COMIC BOOK POP ART style, LARGE VISIBLE Ben-Day dots pattern covering entire surface, BOLD HEAVY BLACK INK OUTLINES 8mm+ like comic book printing surrounding ALL shapes faces and figures, FLAT primary colors ONLY (red blue yellow white black), halftone printing effect, THICK BLACK CONTOUR LINES on every edge.',

  // ⭐ 거장 전용
  'klimt': 'by Gustav Klimt, Klimt art style, ornate gold leaf patterns, intricate decorative mosaic, flat Byzantine-inspired figures, jewel-like embedded details, geometric robes with spirals and rectangles.',
  'frida': 'Old oil painting by Frida Kahlo, Frida Kahlo art style, intense direct gaze, symbolic personal elements, vibrant Mexican folk colors, lush tropical foliage background, raw emotional honesty.',

  // 🎎 동양화
  'minhwa': 'Korean folk painting (Minhwa) style from late Joseon Dynasty. MINERAL PIGMENTS on WARM YELLOWED HANJI PAPER with visible fiber texture. BOLD VIBRANT Obangsaek colors (red, blue, yellow, white, black) on warm-toned natural hanji. ROUGH FOLK ART brush strokes with naive charm. Simplified exaggerated forms with humor. Traditional Korean clothing (hanbok) if people present.',
  'pungsokdo': 'Korean genre painting (Pungsokdo) style by master Kim Hongdo. SOFT WATERCOLOR WASHES on traditional Korean paper. DELICATE FLOWING BRUSH LINES for figures. Everyday life scenes of Joseon Dynasty Korea. Limited subtle color palette - soft browns, muted greens, pale blues. EMPTY SPACE as compositional element. Light loose brushwork. Traditional Korean clothing (hanbok). Gentle humorous narrative quality.',
  'jingyeong': 'Korean true-view landscape painting (Jingyeong Sansu) style by master Jeong Seon. BOLD EXPRESSIVE BRUSH STROKES for mountains. Korean mountain scenery with distinctive granite peaks. Strong ink work with dynamic energy. Traditional Korean landscape composition. Misty atmospheric perspective. Pine trees with characteristic Korean style.',
  'shuimohua': 'Chinese ink wash painting (Shuimohua) style. BLACK INK on RICE PAPER with VISIBLE PAPER GRAIN texture. MONOCHROME ink with subtle grey gradations. EMPTY NEGATIVE SPACE as key compositional element. SPONTANEOUS EXPRESSIVE brush strokes. Soft atmospheric perspective. Traditional Chinese clothing (hanfu). Misty mountain backgrounds. Poetry and philosophy in visual form.',
  'gongbi': 'Chinese meticulous court painting (Gongbi) style. MUST look like TRADITIONAL HAND-PAINTED silk painting. FINE DETAILED BRUSHWORK with precise outlines. MINERAL PIGMENTS on silk with subtle sheen and VISIBLE SILK TEXTURE. Rich vivid colors - vermillion, malachite green, azurite blue, gold. Tang/Song Dynasty court elegance. Elaborate patterns on robes. Idealized graceful figures. Imperial court aesthetic. Classical painted quality. Traditional Chinese clothing (hanfu).',
  'ukiyoe': 'Japanese Ukiyo-e woodblock print style. FLAT COLOR AREAS with BOLD BLACK OUTLINES. LIMITED COLOR PALETTE of traditional woodblock inks. WOODGRAIN TEXTURE visible in color areas. Stylized Japanese figures with distinctive features. Dramatic compositions. Floating world aesthetic. Transform clothing to traditional kimono.',
  // v79: 일본화 5분기 추가
  'ukiyoe_yakushae': 'Japanese Ukiyo-e woodblock print yakusha-e style by Toshusai Sharaku. BOLD DRAMATIC masculine portrait, intense expression, dark mica background, strong angular outlines. HAKAMA with HAORI jacket. Edo period woodblock aesthetic.',
  'ukiyoe_meishoe': 'Japanese Ukiyo-e woodblock print meisho-e landscape style by Utagawa Hiroshige. Atmospheric perspective, BOKASHI gradation, limited palette. Completely flat two-dimensional Edo period scenic masterpiece.',
  'ukiyoe_animal': 'Japanese Ukiyo-e woodblock print animal style by Utagawa Kuniyoshi. ADORABLE EXPRESSIVE animal as central subject, bold outlines, flat color areas. Edo period charming animal portrait.',
  'rinpa': 'Japanese Rinpa school decorative painting by Sotatsu and Korin. GOLD OR SILVER LEAF BACKGROUND, TARASHIKOMI ink pooling technique, boneless color forms, stylized natural motifs. Elegant Edo period aristocratic refinement.'
};


/**
 * 화가 키로 화풍 프롬프트 가져오기
 * @param {string} artistKey - 화가 키 (예: 'vangogh', 'monet')
 * @returns {string|null} 화풍 프롬프트
 */
export function getArtistStyle(artistKey) {
  const normalized = artistKey.toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/é/g, 'e')
    .replace(/ó/g, 'o');
  
  return ARTIST_STYLES[normalized] || null;
}


/**
 * 화가 이름으로 화풍 프롬프트 가져오기 (다양한 표기 지원)
 * @param {string} artistName - 화가 이름 (영문, 한글, 풀네임 등)
 * @returns {string|null} 화풍 프롬프트
 */
export function getArtistStyleByName(artistName) {
  const normalized = artistName.toUpperCase().trim();
  
  const nameToKey = {
    // 고대
    'CLASSICAL': 'classical-sculpture', 'SCULPTURE': 'classical-sculpture', '조각': 'classical-sculpture',
    'CLASSICAL SCULPTURE': 'classical-sculpture', 'GREEK SCULPTURE': 'classical-sculpture', 'ROMAN SCULPTURE': 'classical-sculpture',
    'MARBLE': 'classical-sculpture', 'MARBLE SCULPTURE': 'classical-sculpture',
    'MOSAIC': 'roman-mosaic', 'ROMAN': 'roman-mosaic', '모자이크': 'roman-mosaic',
    'ROMAN MOSAIC': 'roman-mosaic', 'ANCIENT MOSAIC': 'roman-mosaic',
    // 중세
    'BYZANTINE': 'byzantine', '비잔틴': 'byzantine', 'BYZANTINE ICON': 'byzantine', 'BYZANTINE MOSAIC': 'byzantine',
    'GOTHIC': 'gothic', '고딕': 'gothic', 'GOTHIC STAINED GLASS': 'gothic', 'STAINED GLASS': 'gothic',
    'ISLAMIC': 'islamic-miniature', 'MINIATURE': 'islamic-miniature', '이슬람': 'islamic-miniature',
    'ISLAMIC MINIATURE': 'islamic-miniature', 'PERSIAN MINIATURE': 'islamic-miniature', 'OTTOMAN MINIATURE': 'islamic-miniature',
    // 르네상스
    'BOTTICELLI': 'botticelli', '보티첼리': 'botticelli', 'SANDRO BOTTICELLI': 'botticelli',
    'LEONARDO': 'leonardo', 'DA VINCI': 'leonardo', '다빈치': 'leonardo', '레오나르도': 'leonardo', 'LEONARDO DA VINCI': 'leonardo',
    'TITIAN': 'titian', '티치아노': 'titian', 'TIZIANO': 'titian',
    'MICHELANGELO': 'michelangelo', '미켈란젤로': 'michelangelo', 'MICHELANGELO BUONARROTI': 'michelangelo',
    'RAPHAEL': 'raphael', '라파엘로': 'raphael', 'RAFFAELLO': 'raphael', 'RAFFAELLO SANZIO': 'raphael',
    // 바로크
    'CARAVAGGIO': 'caravaggio', '카라바조': 'caravaggio', 'MICHELANGELO MERISI DA CARAVAGGIO': 'caravaggio',
    'RUBENS': 'rubens', '루벤스': 'rubens', 'PETER PAUL RUBENS': 'rubens',
    'REMBRANDT': 'rembrandt', '렘브란트': 'rembrandt', 'REMBRANDT VAN RIJN': 'rembrandt',
    'VELÁZQUEZ': 'velazquez', 'VELAZQUEZ': 'velazquez', '벨라스케스': 'velazquez', 'DIEGO VELÁZQUEZ': 'velazquez', 'DIEGO VELAZQUEZ': 'velazquez',
    // 로코코
    'WATTEAU': 'watteau', '와토': 'watteau', 'ANTOINE WATTEAU': 'watteau', 'JEAN-ANTOINE WATTEAU': 'watteau',
    'BOUCHER': 'boucher', '부셰': 'boucher', 'FRANÇOIS BOUCHER': 'boucher', 'FRANCOIS BOUCHER': 'boucher',
    // 신고전/낭만/사실
    'DAVID': 'david', '다비드': 'david', 'JACQUES-LOUIS DAVID': 'david',
    'INGRES': 'ingres', '앵그르': 'ingres', 'JEAN-AUGUSTE-DOMINIQUE INGRES': 'ingres',
    'TURNER': 'turner', '터너': 'turner', 'J.M.W. TURNER': 'turner', 'WILLIAM TURNER': 'turner',
    'DELACROIX': 'delacroix', '들라크루아': 'delacroix', 'EUGÈNE DELACROIX': 'delacroix', 'EUGENE DELACROIX': 'delacroix',
    'COURBET': 'courbet', '쿠르베': 'courbet', 'GUSTAVE COURBET': 'courbet',
    'MANET': 'manet', '마네': 'manet', 'ÉDOUARD MANET': 'manet', 'EDOUARD MANET': 'manet',
    // 인상주의
    'RENOIR': 'renoir', '르누아르': 'renoir', 'PIERRE-AUGUSTE RENOIR': 'renoir',
    'MONET': 'monet', '모네': 'monet', 'CLAUDE MONET': 'monet',
    'DEGAS': 'degas', '드가': 'degas', 'EDGAR DEGAS': 'degas',
    'CAILLEBOTTE': 'caillebotte', '카유보트': 'caillebotte', '칼리보트': 'caillebotte', 'GUSTAVE CAILLEBOTTE': 'caillebotte',
    // 후기인상주의
    'VAN GOGH': 'vangogh', 'GOGH': 'vangogh', '반 고흐': 'vangogh', '고흐': 'vangogh', '빈센트': 'vangogh', 'VINCENT VAN GOGH': 'vangogh',
    'GAUGUIN': 'gauguin', '고갱': 'gauguin', 'PAUL GAUGUIN': 'gauguin',
    'CÉZANNE': 'cezanne', 'CEZANNE': 'cezanne', '세잔': 'cezanne', 'PAUL CÉZANNE': 'cezanne', 'PAUL CEZANNE': 'cezanne',
    // 야수파
    'MATISSE': 'matisse', '마티스': 'matisse', 'HENRI MATISSE': 'matisse',
    'DERAIN': 'derain', '드랭': 'derain', 'ANDRÉ DERAIN': 'derain', 'ANDRE DERAIN': 'derain',
    'VLAMINCK': 'vlaminck', '블라맹크': 'vlaminck', 'MAURICE DE VLAMINCK': 'vlaminck',
    // 표현주의
    'MUNCH': 'munch', '뭉크': 'munch', 'EDVARD MUNCH': 'munch',
    'KIRCHNER': 'kirchner', '키르히너': 'kirchner', 'ERNST LUDWIG KIRCHNER': 'kirchner',
    'KOKOSCHKA': 'kokoschka', '코코슈카': 'kokoschka', 'OSKAR KOKOSCHKA': 'kokoschka',
    // 모더니즘
    'PICASSO': 'picasso', '피카소': 'picasso', 'PABLO PICASSO': 'picasso',
    'MAGRITTE': 'magritte', '마그리트': 'magritte', 'RENÉ MAGRITTE': 'magritte', 'RENE MAGRITTE': 'magritte',
    'MIRÓ': 'miro', 'MIRO': 'miro', '미로': 'miro', 'JOAN MIRÓ': 'miro', 'JOAN MIRO': 'miro',
    'CHAGALL': 'chagall', '샤갈': 'chagall', 'MARC CHAGALL': 'chagall',
    'LICHTENSTEIN': 'lichtenstein', '리히텐슈타인': 'lichtenstein', 'ROY LICHTENSTEIN': 'lichtenstein',
    // 거장 전용
    'KLIMT': 'klimt', '클림트': 'klimt', 'GUSTAV KLIMT': 'klimt',
    'FRIDA': 'frida', 'KAHLO': 'frida', '프리다': 'frida', '칼로': 'frida', 'FRIDA KAHLO': 'frida',
    // 동양화
    'MINHWA': 'minhwa', '민화': 'minhwa', 'KOREAN FOLK': 'minhwa',
    'PUNGSOKDO': 'pungsokdo', '풍속도': 'pungsokdo', 'GENRE PAINTING': 'pungsokdo', 'KIM HONGDO': 'pungsokdo',
    'JINGYEONG': 'jingyeong', '진경산수': 'jingyeong', 'TRUE VIEW': 'jingyeong', 'JEONG SEON': 'jingyeong',
    'SHUIMOHUA': 'shuimohua', '수묵화': 'shuimohua', 'INK WASH': 'shuimohua',
    'GONGBI': 'gongbi', '공필화': 'gongbi', 'METICULOUS': 'gongbi',
    'UKIYOE': 'ukiyoe', '우키요에': 'ukiyoe', 'WOODBLOCK': 'ukiyoe', 'UKIYO-E': 'ukiyoe',
    // v79: 일본화 5분기 추가
    'BIJIN-GA': 'ukiyoe', 'BIJINGA': 'ukiyoe', '미인화': 'ukiyoe',
    'YAKUSHA-E': 'ukiyoe_yakushae', 'YAKUSHAE': 'ukiyoe_yakushae', '역자회': 'ukiyoe_yakushae', 'SHARAKU': 'ukiyoe_yakushae',
    'MEISHO-E': 'ukiyoe_meishoe', 'MEISHOE': 'ukiyoe_meishoe', '명소회': 'ukiyoe_meishoe', 'HIROSHIGE': 'ukiyoe_meishoe',
    'KUNIYOSHI': 'ukiyoe_animal', '동물화': 'ukiyoe_animal',
    'RINPA': 'rinpa', '린파': 'rinpa', 'SOTATSU': 'rinpa', 'KORIN': 'rinpa'
  };
  
  for (const [name, key] of Object.entries(nameToKey)) {
    if (normalized.includes(name)) {
      return ARTIST_STYLES[key];
    }
  }
  
  return null;
}

console.log('📚 Artist Styles loaded:', Object.keys(ARTIST_STYLES).length, 'artists');
console.log('🎨 Master Valley API Prompts loaded:', Object.keys(ALL_PROMPTS).length, 'prompts');


// ═══════════════════════════════════════════════════════════════════
// 🗺️ 대표작 이름 매핑 (한글/영문 → 키)
// ═══════════════════════════════════════════════════════════════════
export const masterworkNameMapping = {
  // 반 고흐 (vangogh-seascape 삭제됨)
  'the starry night': 'vangogh-starrynight', '별이 빛나는 밤': 'vangogh-starrynight', 'starry night': 'vangogh-starrynight',
  'sunflowers': 'vangogh-sunflowers', '해바라기': 'vangogh-sunflowers',
  'self-portrait with grey felt hat': 'vangogh-selfportrait', '회색 펠트 모자 자화상': 'vangogh-selfportrait', 'grey felt hat': 'vangogh-selfportrait',
  'café terrace at night': 'vangogh-cafe', 'cafe terrace': 'vangogh-cafe', '밤의 카페 테라스': 'vangogh-cafe',
  'wheat field with cypresses': 'vangogh-wheatfield', '사이프러스 밀밭': 'vangogh-wheatfield', 'cypresses': 'vangogh-wheatfield',
  
  // 클림트
  'the kiss': 'klimt-kiss', '키스': 'klimt-kiss',
  'the tree of life': 'klimt-treeoflife', '생명의 나무': 'klimt-treeoflife',
  'judith i': 'klimt-judith', 'judith': 'klimt-judith', '유디트': 'klimt-judith',
  
  // 뭉크
  'the scream': 'munch-scream', '절규': 'munch-scream',
  'madonna': 'munch-madonna', '마돈나': 'munch-madonna',
  'the dance of life': 'munch-danceoflife', '생의 춤': 'munch-danceoflife',
  
  // 마티스 (matisse-dance 삭제됨, matisse-derain 추가)
  'the red room': 'matisse-redroom', '붉은 방': 'matisse-redroom',
  'the green stripe': 'matisse-greenstripe', '초록 줄무늬': 'matisse-greenstripe',
  'woman in a purple coat': 'matisse-purplecoat', '보라색 코트': 'matisse-purplecoat',
  'portrait of andré derain': 'matisse-derain', 'portrait of derain': 'matisse-derain', 'derain portrait': 'matisse-derain', '드랭의 초상': 'matisse-derain',
  
  // 피카소
  'portrait of dora maar': 'picasso-doramaar', 'dora maar': 'picasso-doramaar', '도라 마르': 'picasso-doramaar',
  
  // 프리다 칼로
  'me and my parrots': 'frida-parrots', '나와 앵무새들': 'frida-parrots',
  'self-portrait with monkeys': 'frida-monkeys', '원숭이와 자화상': 'frida-monkeys',
  
  // 샤갈
  'the birthday': 'chagall-lovers', '생일': 'chagall-lovers',
  'i and the village': 'chagall-village', '나와 마을': 'chagall-village',
  'la mariée': 'chagall-lamariee', 'the bride': 'chagall-lamariee',
  
  // 리히텐슈타인
  'in the car': 'lichtenstein-inthecar',
  "m-maybe": 'lichtenstein-mmaybe',
  'forget it! forget me!': 'lichtenstein-forgetit',
  "oh, alright...": 'lichtenstein-ohhhalright',
  'still life with crystal bowl': 'lichtenstein-stilllife',
  'still life with palette': 'lichtenstein-stilllife',
  'still life': 'lichtenstein-stilllife',
  
  // 로마 모자이크
  'alexander mosaic': 'mosaic-alexander', '알렉산더 모자이크': 'mosaic-alexander',
  'cave canem': 'mosaic-cave-canem', '카베 카넴': 'mosaic-cave-canem',
  'dionysus mosaic': 'mosaic-dionysus', '디오니소스': 'mosaic-dionysus',
  'oceanus and tethys': 'mosaic-oceanus', '오케아노스': 'mosaic-oceanus',
  'four seasons mosaic': 'mosaic-seasons', '사계절 모자이크': 'mosaic-seasons',
  'nile mosaic': 'mosaic-nile', '나일 모자이크': 'mosaic-nile',
  
  // 고딕/비잔틴/이슬람
  'blue virgin of chartres': 'gothic-chartres', 'notre-dame rose window': 'gothic-notredame',
  'sainte-chapelle': 'gothic-saintechapelle',
  'emperor justinian': 'byzantine-justinian', 'empress theodora': 'byzantine-theodora',
  'deesis': 'byzantine-deesis', 'christ pantocrator': 'byzantine-pantocrator',
  'youth holding a flower': 'islamic-youth', 'miraj': 'islamic-miraj',
  'simurgh': 'islamic-simurgh', 'lovers in a garden': 'islamic-lovers',
  'rustam slaying the dragon': 'islamic-rustam',
  
  // 르네상스
  'primavera': 'botticelli-primavera', '프리마베라': 'botticelli-primavera',
  'venus and mars': 'botticelli-venusmars',
  'the last supper': 'leonardo-lastsupper', '최후의 만찬': 'leonardo-lastsupper',
  'virgin of the rocks': 'leonardo-virginrocks', '암굴의 성모': 'leonardo-virginrocks',
  'bacchus and ariadne': 'titian-bacchus', '바쿠스와 아리아드네': 'titian-bacchus',
  'assumption of the virgin': 'titian-assumption', '성모 승천': 'titian-assumption',
  'creation of adam': 'michelangelo-adam', '아담의 창조': 'michelangelo-adam',
  'the last judgment': 'michelangelo-lastjudgment', '최후의 심판': 'michelangelo-lastjudgment',
  'school of athens': 'raphael-athens', '아테네 학당': 'raphael-athens',
  'sistine madonna': 'raphael-sistinamadonna', 'triumph of galatea': 'raphael-galatea',
  
  // 바로크
  'calling of saint matthew': 'caravaggio-matthew', 'saint matthew': 'caravaggio-matthew',
  'supper at emmaus': 'caravaggio-supper', '엠마오의 저녁식사': 'caravaggio-supper',
  'descent from the cross': 'rubens-descent', '십자가에서 내려지심': 'rubens-descent',
  'the garden of love': 'rubens-garden', '사랑의 정원': 'rubens-garden',
  'the night watch': 'rembrandt-nightwatch', '야경': 'rembrandt-nightwatch',
  'return of the prodigal son': 'rembrandt-prodigal',
  'las meninas': 'velazquez-meninas', '시녀들': 'velazquez-meninas',
  'portrait of pope innocent x': 'velazquez-pope', 'surrender of breda': 'velazquez-breda',
  
  // 로코코
  'pilgrimage to cythera': 'watteau-cythera', 'pierrot': 'watteau-pierrot',
  'the pleasures of the ball': 'watteau-fete', '사랑의 축제': 'watteau-fete',
  'madame de pompadour': 'boucher-pompadour', '퐁파두르 부인': 'boucher-pompadour',
  'le dejeuner': 'boucher-breakfast', '아침 식사': 'boucher-breakfast',
  
  // 신고전/낭만/사실
  'death of marat': 'david-marat', '마라의 죽음': 'david-marat',
  'coronation of napoleon': 'david-coronation', 'oath of the horatii': 'david-horatii',
  'princesse de broglie': 'ingres-broglie', '드 브로이 공주': 'ingres-broglie',
  'napoleon on his imperial throne': 'ingres-napoleon', '왕좌의 나폴레옹': 'ingres-napoleon',
  'rain, steam and speed': 'turner-rain', 'fighting temeraire': 'turner-temeraire',
  'slave ship': 'turner-slaveship',
  'liberty leading the people': 'delacroix-liberty', '민중을 이끄는 자유의 여신': 'delacroix-liberty',
  'death of sardanapalus': 'delacroix-sardanapalus',
  'the stone breakers': 'courbet-stonebreakers', 'a burial at ornans': 'courbet-burial',
  'bonjour monsieur courbet': 'courbet-bonjour',
  'bar at the folies-bergère': 'manet-bar', 'bar at the folies-bergere': 'manet-bar', '폴리베르제르의 바': 'manet-bar',
  'the fifer': 'manet-fifer', '피리 부는 소년': 'manet-fifer',
  
  // 인상주의
  'luncheon of the boating party': 'renoir-boating', 'bal du moulin de la galette': 'renoir-moulin',
  'the swing': 'renoir-swing', '그네': 'renoir-swing',
  'the dance class': 'degas-danceclass', 'the star': 'degas-star', "l'absinthe": 'degas-absinthe',
  'water lilies': 'monet-waterlilies', '수련': 'monet-waterlilies',
  'impression, sunrise': 'monet-impression', 'woman with a parasol': 'monet-parasol',
  'paris street, rainy day': 'caillebotte-paris', 'the floor scrapers': 'caillebotte-floor',
  'man at the window': 'caillebotte-window',
  
  // 후기인상주의
  'tahitian women': 'gauguin-tahitian', '타히티 여인들': 'gauguin-tahitian',
  'where do we come from?': 'gauguin-where', 'yellow christ': 'gauguin-christ',
  'basket of apples': 'cezanne-apples', 'mont sainte-victoire': 'cezanne-montagne',
  'the card players': 'cezanne-cards',
  
  // 야수파
  'collioure harbour': 'derain-collioure', 'charing cross bridge': 'derain-charingcross',
  'portrait of matisse': 'derain-matisse',
  'the river': 'vlaminck-chatou', 'red trees': 'vlaminck-redtrees', 'bougival': 'vlaminck-bougival',
  
  // 표현주의 (kirchner-oldwomen 삭제됨)
  'street, berlin': 'kirchner-berlin', 'self-portrait as a soldier': 'kirchner-soldier',
  'bride of the wind': 'kokoschka-bride', 'portrait of a degenerate artist': 'kokoschka-degenerate',
  'double portrait': 'kokoschka-double',
  
  // 모더니즘
  'golconda': 'magritte-golconda',
  'catalan landscape': 'miro-catalan', 'constellation': 'miro-constellation', 'blue star': 'miro-bluestar'
};


// ═══════════════════════════════════════════════════════════════════
// 📋 화가별 대표작 목록
// ═══════════════════════════════════════════════════════════════════
export function getArtistMasterworkList(artistKey) {
  const normalized = artistKey.toLowerCase().trim();
  
  const artistMasterworks = {
    'roman-mosaic': ['mosaic-alexander', 'mosaic-cave-canem', 'mosaic-dionysus', 'mosaic-oceanus', 'mosaic-seasons', 'mosaic-nile'],
    'gothic': ['gothic-chartres', 'gothic-notredame', 'gothic-saintechapelle'],
    'byzantine': ['byzantine-justinian', 'byzantine-theodora', 'byzantine-deesis', 'byzantine-pantocrator'],
    'islamic-miniature': ['islamic-youth', 'islamic-miraj', 'islamic-simurgh', 'islamic-lovers', 'islamic-rustam'],
    'botticelli': ['botticelli-primavera', 'botticelli-venusmars'],
    'leonardo': ['leonardo-lastsupper', 'leonardo-virginrocks'],
    'titian': ['titian-bacchus', 'titian-assumption'],
    'michelangelo': ['michelangelo-adam', 'michelangelo-lastjudgment'],
    'raphael': ['raphael-athens', 'raphael-sistinamadonna', 'raphael-galatea'],
    'caravaggio': ['caravaggio-matthew', 'caravaggio-supper'],
    'rubens': ['rubens-descent', 'rubens-garden'],
    'rembrandt': ['rembrandt-nightwatch', 'rembrandt-selfportrait', 'rembrandt-prodigal'],
    'velazquez': ['velazquez-meninas', 'velazquez-pope', 'velazquez-breda'],
    'watteau': ['watteau-cythera', 'watteau-pierrot', 'watteau-fete'],
    'boucher': ['boucher-pompadour', 'boucher-breakfast'],
    'david': ['david-marat', 'david-coronation', 'david-horatii'],
    'ingres': ['ingres-broglie', 'ingres-napoleon'],
    'turner': ['turner-rain', 'turner-temeraire', 'turner-slaveship'],
    'delacroix': ['delacroix-liberty', 'delacroix-sardanapalus'],
    'courbet': ['courbet-stonebreakers', 'courbet-burial', 'courbet-bonjour'],
    'manet': ['manet-bar', 'manet-fifer'],
    'renoir': ['renoir-boating', 'renoir-moulin', 'renoir-swing'],
    'degas': ['degas-danceclass', 'degas-star', 'degas-absinthe'],
    'monet': ['monet-waterlilies', 'monet-impression', 'monet-parasol'],
    'caillebotte': ['caillebotte-paris', 'caillebotte-floor', 'caillebotte-window'],
    // vangogh-seascape 삭제됨
    'vangogh': ['vangogh-starrynight', 'vangogh-cafe', 'vangogh-sunflowers', 'vangogh-selfportrait', 'vangogh-wheatfield'],
    'gauguin': ['gauguin-tahitian', 'gauguin-where', 'gauguin-christ'],
    'cezanne': ['cezanne-apples', 'cezanne-montagne', 'cezanne-cards'],
    // matisse-dance 삭제됨, matisse-derain 추가
    'matisse': ['matisse-greenstripe', 'matisse-purplecoat', 'matisse-redroom', 'matisse-derain'],
    'derain': ['derain-collioure', 'derain-charingcross', 'derain-matisse'],
    'vlaminck': ['vlaminck-chatou', 'vlaminck-redtrees', 'vlaminck-bougival'],
    'klimt': ['klimt-kiss', 'klimt-judith', 'klimt-treeoflife'],
    'munch': ['munch-scream', 'munch-madonna', 'munch-danceoflife'],
    'kokoschka': ['kokoschka-bride', 'kokoschka-degenerate', 'kokoschka-double'],
    // kirchner-oldwomen 삭제됨
    'kirchner': ['kirchner-berlin', 'kirchner-soldier'],
    'picasso': ['picasso-doramaar'],
    'frida': ['frida-parrots', 'frida-monkeys'],
    'magritte': ['magritte-golconda'],
    'miro': ['miro-catalan', 'miro-constellation', 'miro-bluestar'],
    'chagall': ['chagall-lovers', 'chagall-lamariee', 'chagall-village'],
    'lichtenstein': ['lichtenstein-inthecar', 'lichtenstein-mmaybe', 'lichtenstein-forgetit', 'lichtenstein-ohhhalright', 'lichtenstein-stilllife']
  };
  
  return artistMasterworks[normalized] || [];
}


// ═══════════════════════════════════════════════════════════════════
// 🤖 AI Vision 선택 가이드
// ═══════════════════════════════════════════════════════════════════
const MASTER_GUIDES = {
  'roman-mosaic': `
ROMAN MOSAIC - SELECT ONE:
1. "Alexander Mosaic" → battle, action, warriors | Style: Pompeii battle scene, earth tones
2. "Cave Canem" → animals, pets, dogs | Style: guard dog in black and white
3. "Dionysus Mosaic" → celebration, party, portrait | Style: grape vines, purple green gold
4. "Oceanus and Tethys" → water, ocean, portrait | Style: sea god, ocean blue turquoise
5. "Four Seasons Mosaic" → portrait, face, circular | Style: portrait in medallion
6. "Nile Mosaic" → landscape, animals, panoramic | Style: river with wildlife`,

  'gothic': `
GOTHIC STAINED GLASS - SELECT ONE:
1. "Blue Virgin of Chartres" → mother and child, religious, blue | Style: Chartres cobalt blue
2. "Notre-Dame Rose Window" → circular, symmetrical | Style: radial kaleidoscopic
3. "Sainte-Chapelle" → tall vertical, red, biblical | Style: ruby red and deep blue`,

  'byzantine': `
BYZANTINE MOSAIC - SELECT ONE:
1. "Emperor Justinian" → MALE portrait, authority | Style: gold leaf, purple robes
2. "Empress Theodora" → FEMALE portrait, royalty | Style: jeweled crown, gold
3. "Deesis" → religious, central figure | Style: Christ with golden halo
4. "Christ Pantocrator" → intense, frontal | Style: monumental, golden halo`,

  'islamic-miniature': `
ISLAMIC MINIATURE - SELECT ONE:
1. "Youth Holding a Flower" → single portrait, elegant | Style: S-curved posture, jewel tones
2. "Miraj" → fantasy, celestial, spiritual | Style: celestial ascension, gold lapis
3. "Simurgh" → animals, birds, mythical | Style: giant bird, iridescent colors
4. "Lovers in a Garden" → COUPLE, romantic | Style: moonlit garden, soft jewel tones
5. "Rustam Slaying the Dragon" → action, battle | Style: epic battle, dynamic`,

  'botticelli': `
BOTTICELLI - SELECT ONE:
1. "Primavera" → spring, flowers, multiple figures | Style: ethereal pale figures, graceful
2. "Venus and Mars" → COUPLE, reclining | Style: soft flesh tones, playful satyrs`,

  'leonardo': `
LEONARDO DA VINCI - SELECT ONE:
1. "The Last Supper" → GROUP, dramatic, interior | Style: perspective, dramatic gestures
2. "Virgin of the Rocks" → religious, grotto | Style: dark grotto, sfumato`,

  'vangogh': `
VAN GOGH - SELECT ONE:
1. "The Starry Night" → night sky, swirling, landscape, FEMALE portrait | Style: swirling spirals, cobalt yellow
2. "Café Terrace at Night" → outdoor café, night, FEMALE portrait | Style: cobalt sky, yellow lanterns
3. "Sunflowers" → flowers, still life | Style: chrome yellow, thick impasto
4. "Self-Portrait" → MALE portrait ONLY | Style: swirling background, blue
5. "Wheat Field with Cypresses" → landscape, FEMALE portrait | Style: swirling sky, golden wheat`,

  'klimt': `
KLIMT - SELECT ONE:
1. "The Kiss" → COUPLE, romantic, embrace | Style: gold leaf, spiral patterns
2. "Judith I" → FEMALE, powerful, seductive | Style: gold collar, direct gaze
3. "The Tree of Life" → decorative, symbolic | Style: spiral tree, gold mosaic`,

  'munch': `
MUNCH - SELECT ONE:
1. "The Scream" → anxiety, fear, distress, tension, surprise → MALE or FEMALE | Style: wavy lines, blood-red sky
2. "Madonna" → calm, dreamy, mysterious, sensual → FEMALE ONLY | Style: flowing hair, dark aura
3. "The Dance of Life" → GROUP (2+ people), celebration | Style: pale figures, dark shore`,

  'matisse': `
MATISSE - SELECT ONE:
1. "The Green Stripe" → portrait, bold color | Style: green shadow on face
2. "Woman in a Purple Coat" → portrait, elegant | Style: decorative patterns
3. "The Red Room" → interior, decorative | Style: dominant red, patterns
4. "Portrait of André Derain" → MALE portrait | Style: wild brushstrokes, vivid colors`,

  'picasso': `
PICASSO - SELECT ONE:
1. "Portrait of Dora Maar" → portrait, fragmented | Style: face from multiple angles`,

  'frida': `
FRIDA KAHLO - SELECT ONE:
1. "Me and My Parrots" → portrait with birds | Style: parrots on shoulders, lush leaves
2. "Self-Portrait with Monkeys" → portrait with animals | Style: monkeys, tropical plants`,

  'chagall': `
CHAGALL - SELECT ONE:
1. "Lovers with Flowers" → COUPLE, romantic, flowers | Style: floating figures, dreamlike, bouquet
2. "La Mariée" → bride, celebration, wedding | Style: red veil, night sky, floating
3. "I and the Village" → portrait, village, dreamlike | Style: geometric planes, emerald green`,

  'lichtenstein': `
LICHTENSTEIN - SELECT ONE:
1. "In the Car" → COUPLE in car | Style: Ben-Day dots, speech bubble
2. "M-Maybe" → FEMALE portrait, contemplative | Style: blonde hair, thought bubble
3. "Forget It! Forget Me!" → emotional, dramatic | Style: tears, bold colors
4. "Oh, Alright..." → FEMALE, phone | Style: pop art, speech bubble
5. "Still Life with Crystal Bowl" → objects, still life | Style: bold outlines, dots`
};


/**
 * 사조별 대표작 가이드 (AI Vision용)
 */
export function getMovementMasterworkGuide(movementKey) {
  const movementArtists = {
    'ancient': ['roman-mosaic'],
    'medieval': ['gothic', 'byzantine', 'islamic-miniature'],
    'renaissance': ['botticelli', 'leonardo'],
    'baroque': [],
    'rococo': [],
    'neoclassicism-romanticism': [],
    'impressionism': [],
    'post-impressionism': ['vangogh'],
    'fauvism': ['matisse'],
    'expressionism': ['munch'],
    'modernism': ['picasso', 'chagall', 'lichtenstein']
  };
  
  const artists = movementArtists[movementKey];
  if (!artists || artists.length === 0) return '';
  
  let guide = `\n📚 MASTERWORK SELECTION GUIDE:\n`;
  artists.forEach(artist => {
    if (MASTER_GUIDES[artist]) {
      guide += `\n${MASTER_GUIDES[artist]}\n`;
    }
  });
  
  return guide;
}


/**
 * 화가별 대표작 가이드 (AI Vision용)
 */
export function getArtistMasterworkGuide(artistKey) {
  const normalized = artistKey.toLowerCase().trim();
  const workList = getArtistMasterworkList(normalized);
  
  if (!workList || workList.length === 0) return '';
  
  // MASTER_GUIDES에서 가이드 가져오기
  if (MASTER_GUIDES[normalized]) {
    return MASTER_GUIDES[normalized];
  }
  
  // 가이드가 없으면 대표작 목록만 반환
  return `Available masterworks: ${workList.join(', ')}`;
}


/**
 * AI용 대표작 가이드 (프롬프트 반환)
 */
export function getMasterworkGuideForAI(workKey) {
  const prompt = getPrompt(workKey);
  if (!prompt) return '';
  return prompt.prompt || '';
}


// ═══════════════════════════════════════════════════════════════════
// 📦 Default Export (파일 끝에 위치해야 모든 변수 초기화 후 export됨)
// ═══════════════════════════════════════════════════════════════════
export default {
  ANCIENT_MEDIEVAL_PROMPTS,
  RENAISSANCE_PROMPTS,
  BAROQUE_PROMPTS,
  ROCOCO_PROMPTS,
  NEO_ROMAN_REAL_PROMPTS,
  IMPRESSIONISM_PROMPTS,
  POST_IMPRESSIONISM_PROMPTS,
  FAUVISM_PROMPTS,
  EXPRESSIONISM_PROMPTS,
  MODERNISM_PROMPTS,
  ORIENTAL_PROMPTS,
  ALL_PROMPTS,
  getPrompt,
  masterworkNameMapping,
  getArtistMasterworkList,
  getMovementMasterworkGuide,
  getArtistMasterworkGuide,
  getMasterworkGuideForAI
};
