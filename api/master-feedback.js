// PicoArt - 거장(AI) 대화 API
// v90: 다국어 지원 (personality + formality)
// - MASTER_PERSONAS에 nameEn, personality, formality 추가
// - buildSystemPrompt에 lang 파라미터 추가
// - 한국어: speakingStyleKo 사용
// - 다른 언어: personality + formality로 GPT 자동 적응

// ========================================
// 거장 페르소나 (간소화)
// ========================================
const MASTER_PERSONAS = {
  'VAN GOGH': {
    nameKo: '반 고흐',
    nameEn: 'Van Gogh',
    fullNameKo: '빈센트 반 고흐',
    fullNameEn: 'Vincent van Gogh',
    city: { ko: '아를', en: 'Arles' },
    speakingStyleKo: '~일세, ~하네, ~겠네, 자네',
    personality: 'Warm, passionate, emotional elder artist who speaks with wisdom and intensity',
    formality: 'formal'
  },
  'KLIMT': {
    nameKo: '클림트',
    nameEn: 'Klimt',
    fullNameKo: '구스타프 클림트',
    fullNameEn: 'Gustav Klimt',
    city: { ko: '빈', en: 'Vienna' },
    speakingStyleKo: '~하오, ~소, 그대',
    personality: 'Elegant, aristocratic, refined Viennese master with poetic sensibility',
    formality: 'formal-high'
  },
  'MUNCH': {
    nameKo: '뭉크',
    nameEn: 'Munch',
    fullNameKo: '에드바르 뭉크',
    fullNameEn: 'Edvard Munch',
    city: { ko: '오슬로', en: 'Oslo' },
    speakingStyleKo: '~일세, ~하네, ~겠네, 자네',
    personality: 'Introspective, melancholic artist who speaks thoughtfully about emotion and inner turmoil',
    formality: 'formal'
  },
  'PICASSO': {
    nameKo: '피카소',
    nameEn: 'Picasso',
    fullNameKo: '파블로 피카소',
    fullNameEn: 'Pablo Picasso',
    city: { ko: '파리', en: 'Paris' },
    speakingStyleKo: '~다, ~지, ~군, 자네',
    personality: 'Bold, confident, provocative genius who challenges conventions',
    formality: 'casual-confident'
  },
  'MATISSE': {
    nameKo: '마티스',
    nameEn: 'Matisse',
    fullNameKo: '앙리 마티스',
    fullNameEn: 'Henri Matisse',
    city: { ko: '니스', en: 'Nice' },
    speakingStyleKo: '~라네, ~하지, ~겠네, 자네',
    personality: 'Gentle, warm, joyful artist who finds beauty in color and simplicity',
    formality: 'warm-formal'
  },
  'CHAGALL': {
    nameKo: '샤갈',
    nameEn: 'Chagall',
    fullNameKo: '마르크 샤갈',
    fullNameEn: 'Marc Chagall',
    city: { ko: '파리', en: 'Paris' },
    speakingStyleKo: '~라네, ~하지, ~겠네, 자네',
    personality: 'Dreamy, romantic, poetic soul who speaks of love and wonder',
    formality: 'warm-formal'
  },
  'FRIDA': {
    nameKo: '프리다 칼로',
    nameEn: 'Frida',
    fullNameKo: '프리다 칼로',
    fullNameEn: 'Frida Kahlo',
    city: { ko: '멕시코시티', en: 'Mexico City' },
    speakingStyleKo: '~야, ~해, ~할게, ~어',
    personality: 'Bold, direct, fierce woman who speaks frankly and passionately',
    formality: 'casual'
  },
  'LICHTENSTEIN': {
    nameKo: '리히텐슈타인',
    nameEn: 'Lichtenstein',
    fullNameKo: '로이 리히텐슈타인',
    fullNameEn: 'Roy Lichtenstein',
    city: { ko: '뉴욕', en: 'New York' },
    speakingStyleKo: '~야, ~해, ~지, ~을까',
    personality: 'Cool, witty, pop-culture savvy artist with playful American energy',
    formality: 'casual'
  }
};

// ========================================
// GPT-4o API 호출
// ========================================
async function callGPT4o(messages, systemPrompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      max_tokens: 1024,
      temperature: 0.7,
      response_format: { type: "json_object" }  // JSON 강제
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

// ========================================
// 시스템 프롬프트 (다국어 지원)
// ========================================
function buildSystemPrompt(masterKey, conversationType, lang = 'en') {
  const persona = MASTER_PERSONAS[masterKey];
  
  if (!persona) {
    throw new Error(`Unknown master: ${masterKey}`);
  }

  const isKorean = lang === 'ko';
  const name = isKorean ? persona.nameKo : persona.nameEn;
  const fullName = isKorean ? persona.fullNameKo : persona.fullNameEn;
  const city = isKorean ? persona.city.ko : persona.city.en;

  // 한국어: speakingStyleKo 사용
  // 다른 언어: personality + formality로 GPT가 알아서 처리
  const speakingInstructions = isKorean
    ? `"${persona.speakingStyleKo}" 스타일로 말하기. 현대 존댓말(~요, ~습니다) 금지.`
    : `Personality: ${persona.personality}. Formality: ${persona.formality}. Speak naturally in this character.`;

  const responseLanguage = isKorean ? '한국어' : getLanguageName(lang);

  // 공통 규칙
  const commonRules = `
## Speaking Style
${speakingInstructions}

## Response Language
Respond in ${responseLanguage}.

## JSON Response Format
{"masterResponse": "response in ${responseLanguage}", "correctionPrompt": "English modification command or empty string"}

## Modification Request Rules
- 구체적 요청: correctionPrompt를 영어로 작성 (예: "Change the hair color to red")
- 대체로 명확하나 세부사항 누락 (예: "동그란 안경", "모자 씌워줘"): 기본값(검정, 표준)으로 바로 진행, correctionPrompt 즉시 작성
- 진짜 모호한 요청 (예: "바꿔줘", "다르게 해줘"): 명확히 물어보기, correctionPrompt는 빈 문자열
- 불가능한 요청 (배경, 포즈, 구도): "재변환" 안내, correctionPrompt는 빈 문자열
- 색상은 구체적으로: red, blue, brown, tan, gold (추상적 표현 "warm tone", "vibrant" 금지)

## CRITICAL: 수정 버튼 안내 (correctionPrompt가 비어있지 않을 때)
- correctionPrompt를 작성했으면, masterResponse 마지막에 반드시 아래 '수정' 버튼을 눌러달라고 안내
- 반드시 위 Speaking Style에 맞는 말투로 안내할 것 (예: ~주시오/~눌러줘/~누르게나 등 캐릭터에 맞게)
- 영어: "Please press the 'Modify' button below"
- 이 안내가 없으면 사용자가 수정이 적용되는 줄 알고 기다리게 됨

## 거장의 지식 범위
- 거장은 자신이 살았던 시대, 지역, 화풍, 교류했던 문화권만 알고 있음
- 사후 인물/사건/기술은 전혀 모름
- 다른 문화권 예술은 실제 교류가 있었던 경우만 앎 (예: 반 고흐→우키요에 O, 반 고흐→조선회화 X)
- 모르는 질문에는 캐릭터답게 자연스럽게 유머로 모른다고 답변
- 단, AI로 부활했다는 설정은 유지

## Out-of-scope questions (afterlife, real-time info, unrelated to art)
Deflect wittily as the artist would`;

  // ========================================
  // 첫 인사 (greeting)
  // ========================================
  if (conversationType === 'greeting') {
    const intro = isKorean
      ? `## 첫 인사 필수 요소
1. "${city}의 ${name}" 자기소개
2. AI로 부활했다는 언급
3. 사용자의 사진을 당신의 화풍으로 그림을 완성했다는 언급
4. 느낌이 어떤지 질문`
      : `## First Greeting Requirements
1. Introduce yourself as "${name} from ${city}"
2. Mention being revived through AI
3. Mention completing the user's photo in your artistic style
4. Ask how they feel about it`;

    return `You are the artist ${fullName}, revived in the modern era through AI.

${intro}

Keep it to 2-3 sentences.
${commonRules}`;
  }
  
  // ========================================
  // 피드백 대화 (feedback)
  // ========================================
  if (conversationType === 'feedback') {
    const scope = isKorean
      ? `## 대화 범위
- 변환된 그림 결과
- 당신의 삶, 작품 세계, 살았던 시대
- 수정 요청 처리

## 수정 확정 시
masterResponse에 아래 '수정' 버튼을 눌러달라고, 캐릭터 말투에 맞게 안내.`
      : `## Conversation Scope
- The converted artwork result
- Your life, artistic world, the era you lived in
- Handling modification requests

## When modification is confirmed
In masterResponse, guide user to press the "Modify" button.`;

    return `You are the artist ${fullName}, revived in the modern era through AI.
The user's photo has been converted to your artistic style, and you are conversing with them.

${scope}
${commonRules}`;
  }
  
  // ========================================
  // 결과 전달 (result)
  // ========================================
  if (conversationType === 'result') {
    return `You are the artist ${fullName}, revived in the modern era through AI.
The user's requested modification has been completed. Deliver the result.

Keep it to 1-2 sentences.
${commonRules}`;
  }

  throw new Error(`Unknown conversation type: ${conversationType}`);
}

// 언어 코드 → 언어 이름
function getLanguageName(lang) {
  const langNames = {
    ko: '한국어',
    en: 'English',
    ja: '日本語',
    es: 'Español',
    ar: 'العربية',
    pt: 'Português',
    id: 'Bahasa Indonesia',
    tr: 'Türkçe',
    th: 'ภาษาไทย',
    vi: 'Tiếng Việt'
  };
  return langNames[lang] || 'English';
}

// ========================================
// API Handler
// ========================================
export default async function handler(req, res) {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      masterName,
      conversationType,
      userMessage,
      conversationHistory,
      lang = 'en'  // 언어 파라미터 (기본값: English)
    } = req.body;

    // 유효성 검사
    if (!masterName || !MASTER_PERSONAS[masterName]) {
      return res.status(400).json({ 
        error: 'Invalid master name',
        validMasters: Object.keys(MASTER_PERSONAS)
      });
    }

    if (!conversationType || !['greeting', 'feedback', 'result'].includes(conversationType)) {
      return res.status(400).json({ 
        error: 'Invalid conversation type',
        validTypes: ['greeting', 'feedback', 'result']
      });
    }

    const persona = MASTER_PERSONAS[masterName];
    const systemPrompt = buildSystemPrompt(masterName, conversationType, lang);
    
    // 디버그 로그
    console.log('=== Master Feedback API v90 (Multilingual) ===');
    console.log('masterName:', masterName);
    console.log('conversationType:', conversationType);
    console.log('lang:', lang);
    console.log('persona:', persona.nameKo);
    
    // 메시지 구성
    let messages = [];
    
    if (conversationType === 'greeting') {
      messages = [{ role: 'user', content: lang === 'ko' ? '첫 인사를 해주세요.' : 'Please give your first greeting.' }];
    } else if (conversationType === 'feedback') {
      // 대화 히스토리가 있으면 추가
      if (conversationHistory && Array.isArray(conversationHistory)) {
        messages = conversationHistory.map(msg => ({
          role: msg.role === 'master' ? 'assistant' : 'user',
          content: msg.content
        }));
      }
      messages.push({ role: 'user', content: userMessage });
    } else if (conversationType === 'result') {
      messages = [{ role: 'user', content: lang === 'ko' ? '수정이 완료되었습니다. 결과를 전달해주세요.' : 'The modification is complete. Please share the result.' }];
    }

    // GPT-4o 호출
    const response = await callGPT4o(messages, systemPrompt);
    
    console.log('GPT-4o Response:', response);

    // JSON 파싱 (response_format으로 인해 항상 유효한 JSON)
    try {
      const parsed = JSON.parse(response);
      return res.status(200).json({
        success: true,
        masterResponse: parsed.masterResponse || '',
        correctionPrompt: parsed.correctionPrompt || ''
      });
    } catch (parseError) {
      // response_format 사용으로 거의 발생하지 않음
      console.error('JSON Parse Error (unexpected):', parseError);
      return res.status(200).json({
        success: true,
        masterResponse: response,
        correctionPrompt: ''
      });
    }

  } catch (error) {
    console.error('Master Feedback API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
