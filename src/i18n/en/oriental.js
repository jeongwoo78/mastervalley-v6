// ========================================
// Oriental Art Education — English (en)
// i18n · 9 lines, 2 paragraphs (1st 3+2 / 2nd 2+2)
// 1st (loading) = past tense (historical narrative)
// 2nd (result) = present tense (applied technique)
// v70 - 2026-02-03 (subtitle1, subtitle2 separated)
// ========================================

// ========== Basic Info ==========
export const orientalBasicInfo = {
  // ── Country Level (Loading Screen) ──
  'korean': {
    loading: {
      name: 'Korean Traditional Painting',
      subtitle1: 'Minhwa · Pungsokdo · Jingyeong',
      subtitle2: 'Spirit captured in empty space'
    }
  },
  'chinese': {
    loading: {
      name: 'Chinese Traditional Painting',
      subtitle1: 'Ink Wash · Gongbi',
      subtitle2: 'Universe in shades of ink'
    }
  },
  'japanese': {
    loading: {
      name: 'Japanese Traditional Painting',
      subtitle1: 'Ukiyo-e',
      subtitle2: 'Beauty of the floating world'
    }
  },

  // ── Genre Level (Result Screen) ──
  'korean-minhwa': {
    result: {
      name: 'Korean Traditional Painting',
      subtitle1: 'Minhwa',
      subtitle2: 'Folk dreams on canvas'
    }
  },
  'korean-pungsokdo': {
    result: {
      name: 'Korean Traditional Painting',
      subtitle1: 'Pungsokdo',
      subtitle2: 'Daily life of the people'
    }
  },
  'korean-jingyeong': {
    result: {
      name: 'Korean Traditional Painting',
      subtitle1: 'Jingyeong Sansuhwa',
      subtitle2: 'Korean landscapes through Joseon eyes'
    }
  },
  'chinese-gongbi': {
    result: {
      name: 'Chinese Traditional Painting',
      subtitle1: 'Gongbi',
      subtitle2: 'Precision crafted by brush'
    }
  },
  'chinese-ink': {
    result: {
      name: 'Chinese Traditional Painting',
      subtitle1: 'Ink Wash Painting',
      subtitle2: 'Spirit painted in ink'
    }
  },
  'japanese-ukiyoe': {
    result: {
      name: 'Japanese Traditional Painting',
      subtitle1: 'Ukiyo-e',
      subtitle2: 'Floating world pressed in woodblock'
    }
  }
};


// ========== 1st Education: Country Overview (Loading, 5 lines = 3+2, past tense) ==========
export const orientalLoadingEducation = {

  // ── Korean ──
  korean: {
    description: `Korean painters learned Chinese brushwork, but what they painted was their own land and people.
Minhwa wished for fortune through magpies and tigers, while Pungsokdo captured the daily lives of common folk.
Jingyeong Sansuhwa depicted not idealized landscapes, but the real mountains and rivers before the painter's eyes.

Empty space speaks, and spirit flows through the brush tip — that is the aesthetics of Korean painting.
Within this flow, Korean painting unfolds.`
  },

  // ── Chinese ──
  chinese: {
    description: `Before a landscape scroll, Chinese literati read the world through ink.
Ink Wash painting raised mountains with gradations of ink alone and conjured mist through empty space.
Gongbi rendered every last petal with meticulous precision, offered to the emperor.

The wellspring of East Asian art, flowing for over a millennium, is Chinese traditional painting.
Now explore its depth through two streams.`
  },

  // ── Japanese ──
  japanese: {
    description: `In Edo-period Japan, a culture of savoring "ukiyo" — the floating world — blossomed.
Kabuki actors, beautiful women, and famous landscapes were printed as woodblocks and sold to the masses.
At the price of a bowl of rice, these prints were Edo popular culture itself.

When ukiyo-e crossed the ocean to Europe, it gave Monet and Van Gogh a decisive new vision.
Enter the world of Japanese woodblock prints — where East shook the foundations of Western art.`
  }
};


// ========== 2nd Education: Genre Results (Result, 4 lines = 2+2, present tense) ==========
export const orientalResultEducation = {

  // ── Korean: Minhwa ──
  'korean-minhwa': {
    description: `Minhwa's vibrant palette and free-spirited composition have been applied to your image.
Painted in the five cardinal colors (blue, red, yellow, white, black) and arranged freely without perspective.

Peonies symbolize wealth, carp represent success, and tigers ward off evil.
This is Joseon folk art — hung on folding screens in every home, each painting carrying a wish.`
  },

  // ── Korean: Pungsokdo ──
  'korean-pungsokdo': {
    description: `Pungsokdo's swift brushwork and restrained coloring have been applied to your image.
Fine-brush light-wash technique captures gestures and expressions, while empty space opens up the scene.

Wrestling men, women doing laundry, children dozing in village schools — everyday Joseon life comes alive.
This is Korean realism, brought to bloom by Kim Hong-do and Shin Yun-bok through the tip of a brush.`
  },

  // ── Korean: Jingyeong Sansuhwa ──
  'korean-jingyeong': {
    description: `Jingyeong Sansuhwa's vigorous texture strokes and bold composition have been applied to your image.
Breaking free from idealized landscapes, painters sketched the real mountains and rivers before their eyes.

The jagged peaks of Geumgangsan and rain falling over Inwangsan come alive through powerful brushstrokes.
This is the aesthetics of real landscape, perfected by Gyeomjae Jeong Seon — Korea's own vision of nature.`
  },

  // ── Chinese: Gongbi ──
  'chinese-gongbi': {
    description: `Gongbi's meticulous brushwork and luminous layered coloring have been applied to your image.
Fine brushes draw the outline first, then transparent colors are layered to build depth.

Flowers, birds, and figures are rendered strand by strand, captivating the imperial eye.
This is the pinnacle of East Asian fine painting — the height of color mastery, perfected by the court.`
  },

  // ── Chinese: Ink Wash ──
  'chinese-ink': {
    description: `Ink Wash painting's fluid washes and contemplative empty space have been applied to your image.
Mountains, water, mist, and clouds are expressed through nothing but gradations of ink, and empty space becomes infinite.

The splashed-ink technique scatters ink like rain, capturing the vitality of nature.
This is the purest form of East Asian painting — scholars transferred spirit, not form, onto silk.`
  },

  // ── Japanese: Ukiyo-e ──
  'japanese-ukiyoe': {
    description: `Ukiyo-e's striking outlines and vivid flat colors have been applied to your image.
Bold outlines define the form, and flat planes of color fill within — pure graphic impact.

Like Hokusai's *The Great Wave off Kanagawa*, a split second of nature's fury is carved into a single impression.
This is the vision that traveled from East to West, inspiring the Impressionists to see art anew.`
  },


  // ── Defaults (fallback, present tense) ──
  'korean_default': {
    description: `Korean traditional brushwork and the beauty of empty space have been applied to your image.
Scholars painted with ink gradations, while common folk painted with vivid color — both giving life to their world.

Empty space speaks, and spirit flows through the brush tip — the aesthetics of Korean painting.
This is the crystallization of 500 years of Joseon aesthetics, from Minhwa to Jingyeong Sansuhwa.`
  },
  'chinese_default': {
    description: `Chinese traditional ink and color harmony have been applied to your image.
A single brushstroke raises mountains, and a single empty space conjures mist.

The literati's spirit and the court's mastery coexist in Chinese painting.
This is the wellspring of East Asian art, flowing through Gongbi and Ink Wash for over a millennium.`
  },
  'japanese_default': {
    description: `Japanese traditional outlines and flat color planes have been applied to your image.
Bold outlines and vivid flat colors capture the beauty of the floating world.

Born from Edo popular culture, these prints crossed the ocean and shook Western art.
This is the vision of ukiyo-e — where East redefined how the West sees art.`
  }
};


export default { orientalBasicInfo, orientalLoadingEducation, orientalResultEducation };
