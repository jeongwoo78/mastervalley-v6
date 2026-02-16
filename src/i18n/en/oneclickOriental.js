// ========================================
// OneClick Oriental Art Education Content
// v69 - 2026-02-03 (Structure: Country → Style)
// ----------------------------------------
// Primary: Poetic tone (loading, anticipation)
// Secondary: Country definition/features (fixed) → Style intro/features (variable)
// ========================================

// ==================== Basic Info (for Secondary/Result) ====================

export const oneclickOrientalBasicInfo = {
  // Korea
  'korean-minhwa': {
    name: 'Korean Traditional Painting',
    subtitle1: 'Minhwa (Folk Painting)',
    subtitle2: 'Aesthetics of empty space and color'
  },
  'korean-pungsokdo': {
    name: 'Korean Traditional Painting',
    subtitle1: 'Pungsokdo (Genre Painting)',
    subtitle2: 'Aesthetics of empty space and color'
  },
  'korean-jingyeong': {
    name: 'Korean Traditional Painting',
    subtitle1: 'Jingyeong Sansu (True-view Landscape)',
    subtitle2: 'Aesthetics of empty space and color'
  },
  // China
  'chinese-ink': {
    name: 'Chinese Traditional Painting',
    subtitle1: 'Ink Wash Painting (Shuǐmò)',
    subtitle2: 'Philosophy of ink and empty space'
  },
  'chinese-gongbi': {
    name: 'Chinese Traditional Painting',
    subtitle1: 'Gongbi (Meticulous Painting)',
    subtitle2: 'Philosophy of ink and empty space'
  },
  // Japan
  'japanese-ukiyoe': {
    name: 'Japanese Traditional Painting',
    subtitle1: 'Ukiyo-e (Floating World Pictures)',
    subtitle2: 'Beauty of the fleeting world'
  },
  'japanese-rinpa': {
    name: 'Japanese Traditional Painting',
    subtitle1: 'Rinpa (Decorative School)',
    subtitle2: 'Decorative beauty bloomed on gold leaf'
  }
};

// ==================== Primary Education (Loading Screen) ====================

export const oneclickOrientalPrimary = {
  content: `When the West filled, the East emptied.
The art of speaking by not painting.

Korea between ink and empty space,
China between landscape and decoration,
Japan where impermanence and splendor coexist.

Three nations, three brushstrokes.
Now, you pause here.`
};

// ==================== Secondary Education (Result Screen) ====================

export const oneclickOrientalSecondary = {

  // ========== Korea ==========
  'korean-minhwa': {
    content: `Korean traditional painting is an art that embraces empty space and captures spirit through the brush.
Scholars painted with ink, common people painted with color.

Minhwa are paintings where Joseon commoners expressed their wishes for life.
Tigers, magpies, peonies and other symbolic subjects were freely composed.`
  },

  'korean-pungsokdo': {
    content: `Korean traditional painting is an art that embraces empty space and captures spirit through the brush.
Scholars painted with ink, common people painted with color.

Pungsokdo are paintings capturing the daily life of Joseon commoners.
Wrestling, washing, and village school scenes were recorded with lively brushwork.`
  },

  'korean-jingyeong': {
    content: `Korean traditional painting is an art that embraces empty space and captures spirit through the brush.
Scholars painted with ink, common people painted with color.

Jingyeong sansu are paintings of Korea's actual mountains drawn from direct observation.
Jeong Seon perfected this style with vertical texture strokes and bold compositions.`
  },

  // ========== China ==========
  'chinese-ink': {
    content: `Chinese traditional painting is an art that captures the spirit of the universe through ink gradations.
The literati's spirit and court's technique coexisted for a thousand years.

Ink wash painting is the literati's art of depicting the world using only ink gradations.
The unpainted empty space speaks the most.`
  },

  'chinese-gongbi': {
    content: `Chinese traditional painting is an art that captures the spirit of the universe through ink gradations.
The literati's spirit and court's technique coexisted for a thousand years.

Gongbi is court painting executed with meticulous precision, without a single stray stroke.
Transparent colors are layered to create depth and luster.`
  },

  // ========== Japan ==========
  'japanese-ukiyoe': {
    content: `Japanese traditional painting is an art where popular sensibility and courtly splendor coexist.
Street prints and golden decorative painting each bloomed with their own beauty.

Ukiyo-e are woodblock prints enjoyed by Edo period commoners.
Bold outlines and flat color planes inspired the Impressionists.`
  },

  'japanese-rinpa': {
    content: `Japanese traditional painting is an art where popular sensibility and courtly splendor coexist.
Street prints and golden decorative painting each bloomed with their own beauty.

Rinpa is a courtly painting style that lavishly decorated nature over gold leaf.
Colors were pooled layer upon layer, giving flowers and waves a natural, flowing beauty.`
  }
};

export default {
  oneclickOrientalBasicInfo,
  oneclickOrientalPrimary,
  oneclickOrientalSecondary
};
