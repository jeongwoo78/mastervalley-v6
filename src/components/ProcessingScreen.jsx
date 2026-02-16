// PicoArt v71 - ProcessingScreen (displayConfig 기반)
// 원칙: 단일 변환 로직만 있고, 원클릭은 그걸 N번 반복
// v71: displayConfig.js 컨트롤 타워 사용
// v73: 통합 스타일 표시 함수 사용
// v77: i18n 지원
import React, { useEffect, useState } from 'react';
import { processStyleTransfer } from '../utils/styleTransferAPI';
import { educationContent } from '../data/educationContent';
// v77: 원클릭 교육자료 (i18n)
import { 
  getOneclickMovementsPrimary, 
  getOneclickMovementsSecondary,
  getOneclickMastersPrimary,
  getOneclickMastersSecondary,
  getOneclickOrientalPrimary,
  getOneclickOrientalSecondary
} from '../i18n';
// v73: displayConfig 통합 함수
import { normalizeKey, getDisplayInfo, getArtistName, getMovementDisplayInfo, getOrientalDisplayInfo, getMasterInfo, getCategoryIcon, getStyleIcon, getStyleTitle, getStyleSubtitle, getStyleSubtitles } from '../utils/displayConfig';
import { getEducationKey, getEducationContent } from '../utils/educationMatcher';

const ProcessingScreen = ({ photo, selectedStyle, onComplete, lang = 'en' }) => {
  // i18n texts
  const texts = {
    ko: {
      analyzing: '사진 분석 중...',
      inProgress: '변환 중...',
      checking: '작품 확인 중...',
      done: '완료!',
      movementsComplete: '개 사조 변환 완료',
      mastersComplete: '명 거장 변환 완료',
      nationsComplete: '개국 동양화 변환 완료',
      fullTransform: '✨ 전체 변환',
      processing: '🎨 작업 중',
      tapToView: '👆 완료된 결과를 확인하세요',
      error: '오류'
    },
    en: {
      analyzing: 'Analyzing photo...',
      inProgress: 'in progress...',
      checking: 'Checking artwork...',
      done: 'Done!',
      movementsComplete: 'movements complete',
      mastersComplete: 'masters complete',
      nationsComplete: 'nations complete',
      fullTransform: '✨ Full Transform',
      processing: '🎨 Processing',
      tapToView: '👆 Tap to view completed results',
      error: 'Error'
    }
  };
  const t = texts[lang] || texts.en;
  
  // v77: 원클릭 교육 데이터 (i18n)
  const oneclickMovementsPrimary = getOneclickMovementsPrimary(lang);
  const oneclickMovementsSecondary = getOneclickMovementsSecondary(lang);
  const oneclickMastersPrimary = getOneclickMastersPrimary(lang);
  const oneclickMastersSecondary = getOneclickMastersSecondary(lang);
  const oneclickOrientalPrimary = getOneclickOrientalPrimary(lang);
  const oneclickOrientalSecondary = getOneclickOrientalSecondary(lang);

  const [statusText, setStatusText] = useState(t.analyzing);
  const [showEducation, setShowEducation] = useState(false);
  
  // 원클릭 상태
  const [completedResults, setCompletedResults] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [viewIndex, setViewIndex] = useState(-1);
  const [touchStartX, setTouchStartX] = useState(0);
  
  // 원클릭 여부
  const isFullTransform = selectedStyle?.isFullTransform === true;
  const category = selectedStyle?.category;
  
  // 원클릭 시 전달받은 스타일 배열 사용 (styleData import 불필요!)
  const styles = isFullTransform ? (selectedStyle?.styles || []) : [];
  const totalCount = styles.length;

  useEffect(() => {
    startProcess();
  }, []);

  // ========== 메인 프로세스 ==========
  const startProcess = async () => {
    if (isFullTransform) {
      // 원클릭: 1차 교육 표시 후 순차 변환
      setShowEducation(true);
      const categoryLabel = category === 'movements' ? (lang === 'ko' ? '개 사조' : 'movements') : 
                           category === 'masters' ? (lang === 'ko' ? '명 거장' : 'masters') : 
                           (lang === 'ko' ? '개국 동양화' : 'nations');
      setStatusText(`${totalCount} ${categoryLabel} ${t.inProgress}`);
      await sleep(1500);
      
      const results = [];
      for (let i = 0; i < styles.length; i++) {
        const style = styles[i];
        // 진행 메시지: displayConfig에서 적절한 이름 가져오기
        const progressName = category === 'masters' 
          ? style.name  // 거장: "Van Gogh in progress..."
          : getStyleTitle(category, style.id, style.name, lang);  // 사조/동양화: 정식 이름
        setStatusText(`${progressName} ${t.inProgress} [${i + 1}/${totalCount}]`);
        
        const result = await processSingleStyle(style, i, totalCount);
        results.push(result);
        setCompletedCount(i + 1);
        setCompletedResults([...results]);
        
        if (i < styles.length - 1) {
          setStatusText(t.checking);
          await sleep(2000);
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      const categoryLabel2 = category === 'movements' ? t.movementsComplete : 
                            category === 'masters' ? t.mastersComplete : t.nationsComplete;
      setStatusText(`${t.done} ${totalCount} ${categoryLabel2}`);
      await sleep(1000);
      
      onComplete(selectedStyle, results, { isFullTransform: true, category, results });
    } else {
      // 단일 변환
      setShowEducation(true);
      const eduContent = getSingleEducationContent(selectedStyle);
      if (eduContent) {
        setStatusText(t.analyzing);
      }
      await sleep(1000);
      
      const result = await processSingleStyle(selectedStyle);
      
      if (result.success) {
        const catLabel = selectedStyle.category === 'movements' ? selectedStyle.name :
                         selectedStyle.category === 'masters' ? selectedStyle.name :
                         selectedStyle.name;
        setStatusText(`${t.done} ${catLabel}`);
        await sleep(1000);
        onComplete(selectedStyle, result.resultUrl, result);
      } else {
        setStatusText(`${t.error}: ${result.error}`);
        await sleep(1500);
        onComplete(selectedStyle, null, { ...result, success: false });
      }
    }
  };

  // ========== 단일 스타일 변환 (핵심 함수 - 원클릭도 이거 사용) ==========
  const processSingleStyle = async (style, index = 0, total = 1) => {
    try {
      const result = await processStyleTransfer(
        photo,
        style, // category 포함된 스타일 객체 그대로 전달
        null,
        (progressText) => {
          if (total > 1) {
            setStatusText(`${progressText} [${index + 1}/${total}]`);
          } else {
            setStatusText(progressText);
          }
        }
      );

      if (result.success) {
        return {
          style,
          resultUrl: result.resultUrl,
          aiSelectedArtist: result.aiSelectedArtist,
          selected_work: result.selected_work,  // 거장 모드: 선택된 작품
          success: true
        };
      } else {
        return { 
          style, 
          error: result.error, 
          aiSelectedArtist: result.aiSelectedArtist,  // 실패해도 보존
          selected_work: result.selected_work,
          success: false 
        };
      }
    } catch (err) {
      return { style, error: err.message, success: false };
    }
  };

  // ========== 교육자료 ==========
  
  // 단일 변환용 1차 교육 (로컬 함수 - import된 getEducationContent와 구분)
  const getSingleEducationContent = (style) => {
    const cat = style.category;
    if (cat === 'movements') return educationContent.movements[style.id];
    if (cat === 'masters') return educationContent.masters[style.id];
    if (cat === 'oriental') return educationContent.oriental[style.id];
    return null;
  };

  // 원클릭 1차 교육 (분리된 파일에서 가져오기)
  const getPrimaryEducation = () => {
    // console.log('🎓 getPrimaryEducation called, category:', category);
    
    if (category === 'movements') {
      // console.log('🎓 Using oneclickMovementsPrimary');
      return { ...oneclickMovementsPrimary, title: '2,500년 서양미술사 관통' };
    } else if (category === 'masters') {
      // console.log('🎓 Using oneclickMastersPrimary');
      return oneclickMastersPrimary;
    } else if (category === 'oriental') {
      // console.log('🎓 Using oneclickOrientalPrimary');
      return oneclickOrientalPrimary;
    }
    return null;
  };

  // ========== 포맷 함수들 (ResultScreen과 통일) ==========
  
  // 화가명 포맷: 한글명(영문명)
  const formatArtistName = (artistName) => {
    if (!artistName) return '';
    
    const nameMap = {
      // 그리스로마
      'roman mosaic': '로마 모자이크(Roman Mosaic)',
      'greek sculpture': '그리스 조각(Greek Sculpture)',
      'classical sculpture': '고대 조각(Classical Sculpture)',
      'pompeii fresco': '폼페이 프레스코(Pompeii Fresco)',
      // 중세
      'giotto': '지오토 디 본도네(Giotto di Bondone)',
      'byzantine': '비잔틴(Byzantine)',
      'gothic': '고딕(Gothic)',
      'gothic stained glass': '고딕 스테인드글라스(Gothic Stained Glass)',
      'islamic miniature': '이슬람 세밀화(Islamic Miniature)',
      'islamic geometry': '이슬람 기하학(Islamic Geometry)',
      // 르네상스
      'leonardo': '레오나르도 다 빈치(Leonardo da Vinci)',
      'leonardo da vinci': '레오나르도 다 빈치(Leonardo da Vinci)',
      'michelangelo': '미켈란젤로 부오나로티(Michelangelo Buonarroti)',
      'raphael': '라파엘로 산치오(Raffaello Sanzio)',
      'botticelli': '산드로 보티첼리(Sandro Botticelli)',
      'jan van eyck': '얀 반 에이크(Jan van Eyck)',
      'titian': '티치아노 베첼리오(Tiziano Vecellio)',
      // 바로크
      'caravaggio': '미켈란젤로 메리시 다 카라바조(Caravaggio)',
      'rembrandt': '렘브란트 판 레인(Rembrandt van Rijn)',
      'rembrandt van rijn': '렘브란트 판 레인(Rembrandt van Rijn)',
      'vermeer': '요하네스 베르메르(Johannes Vermeer)',
      'johannes vermeer': '요하네스 베르메르(Johannes Vermeer)',
      'rubens': '피터 파울 루벤스(Peter Paul Rubens)',
      'peter paul rubens': '피터 파울 루벤스(Peter Paul Rubens)',
      'velázquez': '디에고 벨라스케스(Diego Velázquez)',
      'velazquez': '디에고 벨라스케스(Diego Velázquez)',
      'diego velázquez': '디에고 벨라스케스(Diego Velázquez)',
      'diego velazquez': '디에고 벨라스케스(Diego Velázquez)',
      // 로코코
      'watteau': '장 앙투안 와토(Jean-Antoine Watteau)',
      'jean-antoine watteau': '장 앙투안 와토(Jean-Antoine Watteau)',
      'fragonard': '장 오노레 프라고나르(Jean-Honoré Fragonard)',
      'jean-honoré fragonard': '장 오노레 프라고나르(Jean-Honoré Fragonard)',
      'boucher': '프랑수아 부셰(François Boucher)',
      'françois boucher': '프랑수아 부셰(François Boucher)',
      'francois boucher': '프랑수아 부셰(François Boucher)',
      // 신고전/낭만/사실
      'david': '자크 루이 다비드(Jacques-Louis David)',
      'jacques-louis david': '자크 루이 다비드(Jacques-Louis David)',
      'ingres': '장 오귀스트 도미니크 앵그르(Jean-Auguste-Dominique Ingres)',
      'delacroix': '외젠 들라크루아(Eugène Delacroix)',
      'eugène delacroix': '외젠 들라크루아(Eugène Delacroix)',
      'eugene delacroix': '외젠 들라크루아(Eugène Delacroix)',
      'goya': '프란시스코 고야(Francisco Goya)',
      'francisco goya': '프란시스코 고야(Francisco Goya)',
      'turner': '윌리엄 터너(J.M.W. Turner)',
      'friedrich': '카스파르 다비드 프리드리히(Caspar David Friedrich)',
      'courbet': '귀스타브 쿠르베(Gustave Courbet)',
      'millet': '장 프랑수아 밀레(Jean-François Millet)',
      'jean-françois millet': '장 프랑수아 밀레(Jean-François Millet)',
      // 인상주의
      'monet': '클로드 모네(Claude Monet)',
      'claude monet': '클로드 모네(Claude Monet)',
      'renoir': '피에르 오귀스트 르누아르(Pierre-Auguste Renoir)',
      'pierre-auguste renoir': '피에르 오귀스트 르누아르(Pierre-Auguste Renoir)',
      'degas': '에드가 드가(Edgar Degas)',
      'edgar degas': '에드가 드가(Edgar Degas)',
      'manet': '에두아르 마네(Édouard Manet)',
      'édouard manet': '에두아르 마네(Édouard Manet)',
      'edouard manet': '에두아르 마네(Édouard Manet)',
      'caillebotte': '귀스타브 카유보트(Gustave Caillebotte)',
      // 후기인상주의
      'van gogh': '빈센트 반 고흐(Vincent van Gogh)',
      'vincent van gogh': '빈센트 반 고흐(Vincent van Gogh)',
      'cézanne': '폴 세잔(Paul Cézanne)',
      'cezanne': '폴 세잔(Paul Cézanne)',
      'paul cézanne': '폴 세잔(Paul Cézanne)',
      'paul cezanne': '폴 세잔(Paul Cézanne)',
      'gauguin': '폴 고갱(Paul Gauguin)',
      'paul gauguin': '폴 고갱(Paul Gauguin)',
      'seurat': '조르주 쇠라(Georges Seurat)',
      'georges seurat': '조르주 쇠라(Georges Seurat)',
      'toulouse-lautrec': '앙리 드 툴루즈 로트렉(Henri de Toulouse-Lautrec)',
      'henri de toulouse-lautrec': '앙리 드 툴루즈 로트렉(Henri de Toulouse-Lautrec)',
      // 야수파
      'matisse': '앙리 마티스(Henri Matisse)',
      'henri matisse': '앙리 마티스(Henri Matisse)',
      'derain': '앙드레 드랭(André Derain)',
      'andré derain': '앙드레 드랭(André Derain)',
      'andre derain': '앙드레 드랭(André Derain)',
      'vlaminck': '모리스 드 블라맹크(Maurice de Vlaminck)',
      // 표현주의
      'munch': '에드바르 뭉크(Edvard Munch)',
      'edvard munch': '에드바르 뭉크(Edvard Munch)',
      'kirchner': '에른스트 루트비히 키르히너(Ernst Ludwig Kirchner)',
      'ernst ludwig kirchner': '에른스트 루트비히 키르히너(Ernst Ludwig Kirchner)',
      'kokoschka': '오스카 코코슈카(Oskar Kokoschka)',
      // 모더니즘 (입체주의/초현실/팝아트)
      'picasso': '파블로 피카소(Pablo Picasso)',
      'pablo picasso': '파블로 피카소(Pablo Picasso)',
      'braque': '조르주 브라크(Georges Braque)',
      'magritte': '르네 마그리트(René Magritte)',
      'rené magritte': '르네 마그리트(René Magritte)',
      'miro': '호안 미로(Joan Miró)',
      'miró': '호안 미로(Joan Miró)',
      'joan miro': '호안 미로(Joan Miró)',
      'chagall': '마르크 샤갈(Marc Chagall)',
      'marc chagall': '마르크 샤갈(Marc Chagall)',
      'lichtenstein': '로이 리히텐슈타인(Roy Lichtenstein)',
      'roy lichtenstein': '로이 리히텐슈타인(Roy Lichtenstein)',
      'haring': '키스 해링(Keith Haring)',
      'keith haring': '키스 해링(Keith Haring)',
      // 거장 (한글명)
      '반 고흐': '빈센트 반 고흐(Vincent van Gogh)',
      '클림트': '구스타프 클림트(Gustav Klimt)',
      '뭉크': '에드바르 뭉크(Edvard Munch)',
      '마티스': '앙리 마티스(Henri Matisse)',
      '피카소': '파블로 피카소(Pablo Picasso)',
      '프리다 칼로': '프리다 칼로(Frida Kahlo)',
      '프리다': '프리다 칼로(Frida Kahlo)'
    };
    
    const normalized = artistName.toLowerCase().trim();
    return nameMap[normalized] || nameMap[artistName] || artistName;
  };

  // 작품명 포맷: 한글명(영문명) - 거장용
  const formatWorkName = (workName) => {
    if (!workName) return '';
    
    const workMap = {
      // 반 고흐
      'The Starry Night': '별이 빛나는 밤(The Starry Night)',
      'Starry Night': '별이 빛나는 밤(Starry Night)',
      'Sunflowers': '해바라기(Sunflowers)',
      'Self-Portrait': '자화상(Self-Portrait)',
      // 클림트
      'The Kiss': '키스(The Kiss)',
      'The Tree of Life': '생명의 나무(The Tree of Life)',
      'Judith I': '유디트(Judith)',
      'Judith': '유디트(Judith)',
      // 뭉크
      'The Scream': '절규(The Scream)',
      'Madonna': '마돈나(Madonna)',
      'Jealousy': '질투(Jealousy)',
      // 마티스
      'The Dance': '춤(The Dance)',
      'The Red Room': '붉은 방(The Red Room)',
      'Woman with a Hat': '모자를 쓴 여인(Woman with a Hat)',
      // 피카소
      'Guernica': '게르니카(Guernica)',
      "Les Demoiselles d'Avignon": "아비뇽의 처녀들(Les Demoiselles d'Avignon)",
      // 프리다 칼로
      'Me and My Parrots': '나와 앵무새(Me and My Parrots)',
      'Self-Portrait with Parrots': '앵무새와 자화상(Self-Portrait with Parrots)',
      'The Broken Column': '부러진 기둥(The Broken Column)',
      'Self-Portrait with Thorn Necklace': '가시 목걸이 자화상(Self-Portrait with Thorn Necklace)',
      'Self-Portrait with Monkeys': '원숭이와 자화상(Self-Portrait with Monkeys)'
    };
    
    return workMap[workName] || workName;
  };

  // 작품 제작연도 매핑
  const workYearMap = {
    // 반 고흐
    'The Starry Night': 1889,
    'Starry Night': 1889,
    'Sunflowers': 1888,
    'Self-Portrait': 1889,
    '별이 빛나는 밤': 1889,
    '해바라기': 1888,
    '자화상': 1889,
    // 클림트
    'The Kiss': 1908,
    'Judith I': 1901,
    'Judith': 1901,
    'The Tree of Life': 1909,
    'Tree of Life': 1909,
    '키스': 1908,
    '유디트': 1901,
    '생명의 나무': 1909,
    // 뭉크
    'The Scream': 1893,
    'Madonna': 1894,
    'Jealousy': 1895,
    '절규': 1893,
    '마돈나': 1894,
    '질투': 1895,
    // 마티스
    'The Dance': 1910,
    'The Red Room': 1908,
    'Harmony in Red': 1908,
    'Woman with a Hat': 1905,
    '춤': 1910,
    '붉은 방': 1908,
    '모자를 쓴 여인': 1905,
    // 피카소
    "Les Demoiselles d'Avignon": 1907,
    'Guernica': 1937,
    '아비뇽의 처녀들': 1907,
    '게르니카': 1937,
    // 프리다 칼로
    'The Broken Column': 1944,
    'Self-Portrait with Monkeys': 1943,
    'Me and My Parrots': 1941,
    'Self-Portrait with Parrots': 1941,
    'Self-Portrait with Thorn Necklace': 1940,
    'Self-Portrait with Thorn Necklace and Hummingbird': 1940,
    '부러진 기둥': 1944,
    '원숭이와 자화상': 1943,
    '나와 앵무새': 1941,
    '앵무새와 자화상': 1941,
    '가시 목걸이 자화상': 1940,
    '가시 목걸이와 벌새': 1940
  };

  // 작품 연도 가져오기
  const getWorkYear = (workName) => {
    if (!workName) return null;
    
    // 직접 매칭
    if (workYearMap[workName]) return workYearMap[workName];
    
    // 괄호 제거 후 매칭 시도
    const withoutParens = workName.split('(')[0].trim();
    if (workYearMap[withoutParens]) return workYearMap[withoutParens];
    
    // 괄호 안 내용으로 매칭 시도
    const match = workName.match(/\(([^)]+)\)/);
    if (match && workYearMap[match[1]]) return workYearMap[match[1]];
    
    return null;
  };

  // 동양화 스타일 포맷: 한글명(영문명)
  const formatOrientalStyle = (styleName) => {
    if (!styleName) return '';
    
    const orientalMap = {
      // 한국
      '한국 전통화': '민화(Minhwa)',
      'korean-minhwa': '민화(Minhwa)',
      'korean-genre': '풍속도(Pungsokdo)',
      'korean-jingyeong': '진경산수화(Jingyeong)',
      // 중국
      'Chinese Gongbi': '공필화(Gongbi)',
      'chinese-gongbi': '공필화(Gongbi)',
      'chinese-ink': '수묵화(Ink Wash)',
      'chinese-ink-wash': '수묵화(Ink Wash)',
      // 일본
      '일본 우키요에': '우키요에(Ukiyo-e)',
      'japanese-ukiyoe': '우키요에(Ukiyo-e)'
    };
    
    const normalized = styleName?.toLowerCase?.().trim() || '';
    
    if (orientalMap[styleName]) return orientalMap[styleName];
    if (orientalMap[normalized]) return orientalMap[normalized];
    
    // 부분 매칭 - 한국
    if (normalized.includes('minhwa') || normalized.includes('민화')) {
      return '민화(Minhwa)';
    }
    if (normalized.includes('pungsok') || normalized.includes('genre') || normalized.includes('풍속')) {
      return '풍속도(Pungsokdo)';
    }
    if (normalized.includes('jingyeong') || normalized.includes('진경')) {
      return '진경산수화(Jingyeong)';
    }
    // 부분 매칭 - 중국
    if (normalized.includes('gongbi') || normalized.includes('공필')) {
      return '공필화(Gongbi)';
    }
    if (normalized.includes('ink wash') || normalized.includes('수묵')) {
      return '수묵화(Ink Wash)';
    }
    // 부분 매칭 - 일본
    if (normalized.includes('ukiyo') || normalized.includes('우키요에')) {
      return '우키요에(Ukiyo-e)';
    }
    
    return styleName;
  };

  // 카테고리별 부제 포맷 (v71)
  const getSubtitle = (result) => {
    const cat = result?.style?.category;
    const artist = result?.aiSelectedArtist;
    const styleName = result?.style?.name;
    
    if (cat === 'masters') {
      const masterInfo = getMasterInfo(artist);
      // v73: 결과 미리보기니까 tagline 사용
      return masterInfo.tagline || '거장';
    } else if (cat === 'movements') {
      const movementInfo = getMovementDisplayInfo(styleName, artist);
      return movementInfo.subtitle;
    } else if (cat === 'oriental') {
      const orientalInfo = getOrientalDisplayInfo(artist);
      return orientalInfo.subtitle;
    } else {
      return formatArtistName(artist);
    }
  };

  // 제목 반환 (v67: 새 표기 형식)
  // 거장: 풀네임(영문, 생몰연도)
  // 미술사조: 사조(영문, 시기)
  // 동양화: 국가 전통회화
  const getTitle = (result) => {
    const cat = result?.style?.category;
    const artist = result?.aiSelectedArtist;
    const styleName = result?.style?.name;
    
    if (cat === 'masters' && artist) {
      const masterInfo = getMasterInfo(artist);
      return masterInfo.fullName;
    } else if (cat === 'movements') {
      const movementInfo = getMovementDisplayInfo(styleName, artist);
      return movementInfo.title;
    } else if (cat === 'oriental') {
      const orientalInfo = getOrientalDisplayInfo(artist);
      return orientalInfo.title;
    }
    return result?.style?.name || '';
  };

  // 하위 호환성: getMasterFullName → getTitle 으로 대체
  const getMasterFullName = (result) => getTitle(result);

  // 원클릭 2차 교육 (결과별) - v51: educationMatcher.js 사용
  const getSecondaryEducation = (result) => {
    if (!result) return null;
    
    const artistName = result.aiSelectedArtist || '';
    const workName = result.selected_work || '';
    const resultCategory = result.style?.category;
    
    // v51: educationMatcher.js 사용 (ResultScreen과 동일)
    const key = getEducationKey(resultCategory, artistName, workName);
    
    // v66: 간단한 매칭 로그
    console.log(`📚 교육자료 매칭: ${resultCategory} → ${key || '없음'} (${artistName}, ${workName || '-'})`);
    
    if (key) {
      // 교육자료 데이터 객체 구성
      const educationData = {
        masters: oneclickMastersSecondary,
        movements: oneclickMovementsSecondary,
        oriental: oneclickOrientalSecondary
      };
      
      // console.log('📦 educationData constructed:');
      // console.log('   - masters keys:', Object.keys(oneclickMastersSecondary || {}).slice(0, 5));
      // console.log('   - checking key:', key, 'in category:', resultCategory);
      
      // 직접 확인
      if (resultCategory === 'masters') {
        // console.log('   - direct check:', oneclickMastersSecondary?.[key] ? 'EXISTS' : 'NOT FOUND');
      }
      
      const content = getEducationContent(resultCategory, key, educationData);
      // console.log('   - getEducationContent returned:', content ? 'HAS CONTENT' : 'NULL');
      
      if (content) {
        // console.log('✅ Found education content for:', key);
        // 교육자료 파일에서 name 가져오기
        let eduName = artistName;
        if (resultCategory === 'masters' && oneclickMastersSecondary[key]) {
          eduName = oneclickMastersSecondary[key].name || artistName;
        } else if (resultCategory === 'movements' && oneclickMovementsSecondary[key]) {
          eduName = oneclickMovementsSecondary[key].name || artistName;
        } else if (resultCategory === 'oriental' && oneclickOrientalSecondary[key]) {
          eduName = oneclickOrientalSecondary[key].name || artistName;
        }
        return { name: eduName, content: content };
      }
    }
    
    // console.log('❌ No education found');
    return null;
  };

  // v51: artistNameToKey 함수는 더 이상 사용하지 않음
  // educationMatcher.js의 getEducationKey로 대체됨
  // (하위 호환성을 위해 주석으로 보존)
  /*
  const artistNameToKey = (artistName, workName, resultCategory, educationData) => {
    // ... 기존 코드 생략 ...
  };
  */

  // ========== UI 핸들러 ==========
  const handleDotClick = (idx) => {
    if (idx < completedCount) setViewIndex(idx);
  };
  
  const handleBackToEducation = () => setViewIndex(-1);

  const [touchStartY, setTouchStartY] = useState(0);

  const handleTouchStart = (e) => {
    if (!isFullTransform) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (!isFullTransform || !touchStartX) return;
    const diffX = touchStartX - e.changedTouches[0].clientX;
    const diffY = touchStartY - e.changedTouches[0].clientY;
    
    // 수평 스와이프만 인식 (X축 이동이 Y축보다 커야 함)
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0 && viewIndex < completedCount - 1) setViewIndex(v => v + 1);
      if (diffX < 0 && viewIndex > -1) setViewIndex(v => v - 1);
    }
    setTouchStartX(0);
    setTouchStartY(0);
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // 현재 보여줄 결과
  const previewResult = viewIndex >= 0 ? completedResults[viewIndex] : null;
  const previewEdu = previewResult ? getSecondaryEducation(previewResult) : null;

  return (
    <div className="processing-screen">
      <div 
        className="processing-content"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ===== 원클릭 모드 (목업 05-loading-oneclick.html 준수) ===== */}
        {isFullTransform && (
          <>
            {/* 상단 상태 제거 - 하단 프로그레스에만 표시 */}

            {/* 1차 교육 + Original */}
            {viewIndex === -1 && showEducation && getPrimaryEducation() && (
              <div className="oneclick-preview">
                <div className="img-placeholder">
                  <img src={URL.createObjectURL(photo)} alt="Original" />
                </div>
                
                {/* 스타일 정보 - 가운데 정렬 (목업 준수) */}
                <div className="oneclick-style-info">
                  <h3>{getStyleTitle(selectedStyle?.category, selectedStyle?.id, selectedStyle?.name, lang)}</h3>
                  <div className="subtitle1">
                    {category === 'movements' ? (lang === 'ko' ? '그리스에서 모더니즘까지' : 'From Greece to Modernism') :
                     category === 'masters' ? (lang === 'ko' ? '일곱 개의 세계' : 'Seven worlds') :
                     (lang === 'ko' ? '한국 · 중국 · 일본' : 'Korea · China · Japan')}
                  </div>
                  <div className="subtitle2">
                    {category === 'movements' ? (lang === 'ko' ? '서양미술 2,500년을 관통하다' : 'Traversing 2,500 years of Western art') :
                     category === 'masters' ? (lang === 'ko' ? '묻고, 부수고, 다시 세우다' : 'Question, break, rebuild') :
                     (lang === 'ko' ? '닮은 듯 다른 세 나라의 미학' : 'Three nations, alike yet distinct')}
                  </div>
                </div>
                
                {/* 교육 콘텐츠 - 왼쪽 정렬 (목업 준수) */}
                <div className="oneclick-edu-content">
                  {getPrimaryEducation().content}
                </div>
              </div>
            )}

            {/* 결과 미리보기 */}
            {viewIndex >= 0 && previewResult && (
              <div className="oneclick-preview">
                <div className="img-placeholder">
                  <img src={previewResult.resultUrl} alt="" />
                </div>
                
                <div className="oneclick-style-info">
                  <h3>{getTitle(previewResult)}</h3>
                  {(() => {
                    const result = previewResult;
                    const [sub1, sub2] = getStyleSubtitles(
                      result?.style?.category,
                      result?.style?.id,
                      'result-transformed',
                      result?.aiSelectedArtist,
                      result?.selected_work,
                      result?.style?.name,
                      lang
                    );
                    return (
                      <>
                        {sub1 && <div className="subtitle1">{sub1}</div>}
                        {sub2 && <div className="subtitle2">{sub2}</div>}
                      </>
                    );
                  })()}
                </div>
                
                {previewEdu && (
                  <div className="oneclick-edu-content">
                    {previewEdu.content}
                  </div>
                )}
              </div>
            )}

            {/* 점 네비게이션 + 이전/다음 버튼 */}
            <div className="dots-nav">
              <button 
                className="nav-btn"
                onClick={() => {
                  if (viewIndex === -1 && completedCount > 0) {
                    setViewIndex(completedCount - 1);
                  } else if (viewIndex > 0) {
                    setViewIndex(viewIndex - 1);
                  } else if (viewIndex === 0) {
                    setViewIndex(-1);
                  }
                }}
                disabled={viewIndex === -1 && completedCount === 0}
              >
                ◀ Prev
              </button>
              
              <div className="dots">
                <button className={`dot edu ${viewIndex === -1 ? 'active' : ''}`} onClick={handleBackToEducation}>📚</button>
                {styles.map((_, idx) => (
                  <button 
                    key={idx}
                    className={`dot ${idx < completedCount ? 'done' : ''} ${viewIndex === idx ? 'active' : ''}`}
                    onClick={() => handleDotClick(idx)}
                    disabled={idx >= completedCount}
                  />
                ))}
                <span className="count">[{viewIndex === -1 ? 0 : viewIndex + 1}/{totalCount}]</span>
              </div>
              
              <button 
                className="nav-btn"
                onClick={() => {
                  if (viewIndex === -1 && completedCount > 0) {
                    setViewIndex(0);
                  } else if (viewIndex >= 0 && viewIndex < completedCount - 1) {
                    setViewIndex(viewIndex + 1);
                  }
                }}
                disabled={viewIndex >= completedCount - 1 || completedCount === 0}
              >
                Next ▶
              </button>
            </div>

            {/* 프로그레스 섹션 - 하단 (목업 준수) */}
            <div className="progress-section">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(completedCount / totalCount) * 100}%` }}></div>
              </div>
              <div className="progress-text">{statusText}</div>
            </div>
          </>
        )}

        {/* ===== 단일 변환 모드 (이모지 35%, 진행 표시 하단 고정) ===== */}
        {!isFullTransform && showEducation && (
          <div className="single-loading-container">
            {/* 이모지 아이콘 - 35% 고정 */}
            <div className="single-loading-icon">
              {getStyleIcon(selectedStyle?.category, selectedStyle?.id, selectedStyle?.name)}
            </div>
            
            {/* 콘텐츠 - 이모지 아래 */}
            <div className="single-loading-content">
              {/* 제목 + 부제 (가운데 정렬) */}
              <div className="single-loading-title">
                {getStyleTitle(selectedStyle?.category, selectedStyle?.id, selectedStyle?.name, lang)}
              </div>
              {(() => {
                const [sub1, sub2] = getStyleSubtitles(selectedStyle?.category, selectedStyle?.id, 'loading-single', null, null, selectedStyle?.name, lang);
                return (
                  <>
                    {sub1 && <div className="single-loading-subtitle">{sub1}</div>}
                    {sub2 && <div className="single-loading-subtitle sub2">{sub2}</div>}
                  </>
                );
              })()}
              
              {/* 교육 콘텐츠 (왼쪽 정렬) */}
              {getSingleEducationContent(selectedStyle) && (
                <div className="single-loading-edu">
                  <p>{getSingleEducationContent(selectedStyle).desc}</p>
                </div>
              )}
            </div>
            
            {/* 하단 고정: 상태 + 프로그레스 바 */}
            <div className="single-bottom-fixed">
              <div className="single-status">
                <div className="spinner"></div>
                <p>{statusText}</p>
              </div>
              <div className="single-progress-bar">
                <div className="single-progress-fill"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .processing-screen {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background: #121212;
        }
        .processing-content {
          background: #121212;
          padding: 20px;
          border-radius: 16px;
          max-width: 400px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        /* ===== 원클릭 로딩 스타일 (목업 05-loading-oneclick.html 준수) ===== */
        .status.oneclick {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          margin-bottom: 16px;
        }
        .status.oneclick p {
          margin: 0;
          color: rgba(255,255,255,0.5);
          font-size: 12px;
        }
        .status.oneclick .spinner {
          width: 12px;
          height: 12px;
          border-width: 2px;
        }
        
        .oneclick-preview {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .oneclick-preview .img-placeholder {
          width: 100%;
          max-width: 340px;
          aspect-ratio: 1 / 1;
          background: #1a1a1a;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .oneclick-preview .img-placeholder img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .oneclick-style-info {
          width: 100%;
          max-width: 340px;
          text-align: center;
          margin-bottom: 12px;
        }
        .oneclick-style-info h3 {
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 6px;
        }
        .oneclick-style-info .subtitle1 {
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 4px;
        }
        .oneclick-style-info .subtitle2 {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 12px;
        }
        
        .oneclick-edu-content {
          width: 100%;
          max-width: 340px;
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          line-height: 1.8;
          text-align: left;
          white-space: pre-line;
        }
        
        .progress-section {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .progress-bar {
          width: 50%;
          height: 2px;
          background: rgba(255,255,255,0.1);
          border-radius: 1px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s;
        }
        .progress-text {
          text-align: right;
          margin-top: 8px;
          font-size: 11px;
          color: rgba(255,255,255,0.4);
        }
        
        /* ===== 단일 변환 상태 (가운데 정렬) ===== */
        .status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .status p { margin: 0; color: rgba(255,255,255,0.6); font-size: 13px; }
        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top: 2px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .edu-card {
          padding: 16px;
          border-radius: 10px;
          margin: 16px 0;
        }
        .edu-card.primary {
          background: transparent;
        }
        .edu-card.secondary {
          background: transparent;
        }
        .edu-card h3 { color: #667eea; margin: 0 0 10px; font-size: 15px; }
        .edu-card h4 { color: #4CAF50; margin: 0 0 8px; font-size: 14px; }
        .edu-card p { color: rgba(255,255,255,0.65); line-height: 1.8; font-size: 13px; margin: 0; white-space: pre-line; }
        .hint { color: rgba(255,255,255,0.4); font-size: 12px; text-align: center; margin-top: 12px !important; }
        
        /* 단독 로딩 화면 (이모지 35%, 진행 표시 하단 고정) */
        .single-loading-container {
          position: relative;
          width: 100%;
          min-height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .single-loading-icon {
          position: absolute;
          top: 35%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 56px;
        }
        .single-loading-content {
          position: absolute;
          top: calc(35% + 45px);
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 340px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: 80px;
        }
        .single-loading-title {
          width: 100%;
          max-width: 340px;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
          text-align: center;
        }
        .single-loading-subtitle {
          width: 100%;
          max-width: 340px;
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          margin-bottom: 4px;
          text-align: center;
        }
        .single-loading-subtitle.sub2 {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 20px;
        }
        .single-loading-edu {
          width: 100%;
          max-width: 340px;
          text-align: left;
        }
        .single-loading-edu p {
          color: rgba(255,255,255,0.7);
          line-height: 1.8;
          font-size: 13px;
          margin: 0 0 12px;
          white-space: pre-line;
        }
        .single-loading-edu p:last-child {
          margin-bottom: 0;
        }
        
        /* 하단 고정: 상태 + 프로그레스 바 */
        .single-bottom-fixed {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 340px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .single-status {
          width: 100%;
          max-width: 340px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .single-status p {
          margin: 0;
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .single-progress-bar {
          width: 100%;
          max-width: 340px;
          height: 2px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        .single-progress-fill {
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          animation: singleProgress 2s ease-in-out infinite;
        }
        @keyframes singleProgress {
          0% { width: 20%; }
          50% { width: 60%; }
          100% { width: 20%; }
        }
        
        .preview { background: #1a1a1a; border-radius: 12px; overflow: hidden; margin: 16px 0; }
        .preview img { width: 100%; display: block; }
        .preview-info { 
          padding: 16px; 
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .preview-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .preview-icon {
          font-size: 2.2rem;
          line-height: 1;
        }
        .preview-text {
          flex: 1;
        }
        .preview-style { 
          font-size: 1.35rem; 
          font-weight: 600; 
          color: #fff; 
          margin-bottom: 6px;
          line-height: 1.3;
        }
        .preview-subtitle { 
          font-size: 1.05rem; 
          font-weight: 600; 
          color: rgba(255,255,255,0.8);
        }
        .preview-subtitle.sub2 {
          font-size: 0.95rem;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          margin-top: 4px;
        }
        
        .dots-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
        }
        .dots-nav .nav-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: rgba(255,255,255,0.7);
          padding: 6px 10px;
          border-radius: 12px;
          font-size: 11px;
          cursor: pointer;
        }
        .dots-nav .nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .dots {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .dot.done {
          background: rgba(102, 126, 234, 0.5);
        }
        .dot.active {
          background: #667eea;
          transform: scale(1.3);
        }
        .dot:disabled {
          opacity: 0.4;
          cursor: default;
        }
        .dot.edu {
          width: auto;
          height: auto;
          background: none;
          font-size: 11px;
        }
        .count {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          margin-left: 2px;
        }
      `}</style>
    </div>
  );
};

export default ProcessingScreen;
