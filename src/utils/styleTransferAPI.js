// PicoArt v80 - Style Transfer API (이중 차감 방지 + predictionId 폴링)
import { MODEL_CONFIG } from './modelConfig';

// API 기본 URL (앱에서는 절대 경로 필요)
const API_BASE_URL = 'https://mastervalley-v6.vercel.app';

// v80: 이중 차감 방지 - 이미 차감된 transformId 추적
const chargedTransformIds = new Set();

const fileToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const resizeImage = async (file, maxWidth = 1024) => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        resolve(new File([blob], file.name, { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.95);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// v78: 리히텐슈타인 프레임은 프롬프트로만 처리 (후처리 함수 비활성화)
// const addBlackFrame = async (imageUrl, frameWidth = 20) => {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = 'anonymous';
//     
//     img.onload = () => {
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       
//       // 캔버스 크기 = 원본 + 프레임 (양쪽)
//       canvas.width = img.width + (frameWidth * 2);
//       canvas.height = img.height + (frameWidth * 2);
//       
//       // 검은 배경으로 채우기
//       ctx.fillStyle = '#000000';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//       
//       // 중앙에 원본 이미지 배치
//       ctx.drawImage(img, frameWidth, frameWidth);
//       
//       // Blob으로 변환
//       canvas.toBlob((blob) => {
//         if (blob) {
//           const framedUrl = URL.createObjectURL(blob);
//           resolve({ url: framedUrl, blob });
//         } else {
//           reject(new Error('Failed to create framed image'));
//         }
//       }, 'image/png');
//     };
//     
//     img.onerror = () => reject(new Error('Failed to load image for framing'));
//     img.src = imageUrl;
//   });
// };

const getModelForStyle = (style) => {
  const model = style.model || 'SDXL';
  return MODEL_CONFIG[model];
};

// v80: callFluxAPI 제거 (masterData에 prompt 필드 없어 데드 코드)
// 모든 스타일이 callFluxWithAI 경유

const callFluxWithAI = async (photoBase64, selectedStyle, onProgress, correctionPrompt = null) => {
  // 진행 상태 전달
  if (onProgress) {
    onProgress({ status: 'processing' });
  }

  const requestBody = {
    image: photoBase64,
    selectedStyle: selectedStyle
  };
  
  // v68: 거장 AI 대화 보정 프롬프트 추가
  if (correctionPrompt) {
    requestBody.correctionPrompt = correctionPrompt;
    console.log('🔄 [재변환 요청]');
    console.log('   - correctionPrompt:', correctionPrompt);
    console.log('   - selectedStyle.id:', selectedStyle?.id);
    console.log('   - selectedStyle.category:', selectedStyle?.category);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);

  const response = await fetch(`${API_BASE_URL}/api/flux-transfer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody),
    signal: controller.signal
  });

  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error(`FLUX API error: ${response.status}`);
  }

  return response.json();
};

const pollPrediction = async (predictionId, modelConfig, onProgress) => {
  let attempts = 0;
  const maxAttempts = 90;
  
  // 백그라운드 복귀 시 즉시 폴링 재개
  let resolveWait = null;
  const onVisible = () => {
    if (document.visibilityState === 'visible' && resolveWait) {
      resolveWait();  // sleep 즉시 종료 → 바로 상태 체크
    }
  };
  document.addEventListener('visibilitychange', onVisible);
  
  const smartSleep = (ms) => new Promise(resolve => {
    resolveWait = resolve;
    setTimeout(() => { resolveWait = null; resolve(); }, ms);
  });
  
  try {
    while (attempts < maxAttempts) {
      await smartSleep(2000);
      attempts++;

      try {
        const checkResponse = await fetch(`${API_BASE_URL}/api/check-prediction?id=${predictionId}`);
        
        if (!checkResponse.ok) {
          console.warn(`⚠️ Poll check failed: ${checkResponse.status}, retrying...`);
          continue;
        }

        const result = await checkResponse.json();

        if (result.status === 'succeeded') {
          return result;
        }

        if (result.status === 'failed' || result.status === 'canceled') {
          console.error('❌ FLUX Processing Failed:', {
            error: result.error,
            predictionId: predictionId
          });
          throw new Error(`Processing failed: ${result.error || 'Unknown error'}`);
        }

        if (onProgress) {
          const progress = Math.min(95, 10 + (attempts * 1.0));
          onProgress({ status: 'processing', progress: Math.floor(progress) });
        }
      } catch (fetchError) {
        // 네트워크 에러(백그라운드 복귀 등) → 재시도
        if (fetchError.message?.includes('Processing failed')) throw fetchError;
        console.warn(`⚠️ Poll network error: ${fetchError.message}, retrying...`);
      }
    }

    throw new Error('Processing timeout');
  } finally {
    document.removeEventListener('visibilitychange', onVisible);
  }
};

export const processStyleTransfer = async (photoFile, selectedStyle, correctionPrompt = null, onProgress = null) => {
  // v80: 멱등성 키 생성 (이중 차감 방지)
  const transformId = crypto.randomUUID ? crypto.randomUUID() : 
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const resizedPhoto = await resizeImage(photoFile, 1024);
    const photoBase64 = await fileToBase64(resizedPhoto);
    const modelConfig = getModelForStyle(selectedStyle);
    
    if (onProgress) {
      onProgress({ status: 'analyzing' });
    }

    let prediction;
    // v80: 모든 경로를 callFluxWithAI로 통일 (서버가 predictionId 즉시 반환)
    if (correctionPrompt) {
      // 재변환 모드 - correctionPrompt 필수 전달
      prediction = await callFluxWithAI(photoBase64, selectedStyle, onProgress, correctionPrompt);
    } else {
      // 일반 변환 (거장/미술사조/동양화 모두)
      prediction = await callFluxWithAI(photoBase64, selectedStyle, onProgress, null);
    }

    // ========== v30: 첫 응답에서 AI 선택 정보 저장 ==========
    // v77: 간소화된 로그
    if (prediction._debug) {
      const d = prediction._debug;
      console.log(`📍 FLUX ${d.version} | ${d.selection.category} | ${d.selection.artist} | ${d.selection.masterwork || '-'} | ${d.prompt.wordCount}w | ctrl:${d.flux.control} | ${d.elapsed}초`);
    } else {
      console.log(`📍 FLUX | ${prediction.selected_artist || '?'} | ${prediction.selected_work || '?'}`);
    }

    const aiSelectionInfo = {
      artist: prediction.selected_artist || null,
      work: prediction.selected_work || null,  // 거장 모드: 선택된 대표작
      method: prediction.selection_method || null,
      details: prediction.selection_details || null
    };

    // ========== 이미 완료된 응답인 경우 polling 건너뛰기 ==========
    let result;
    if (prediction.status === 'succeeded' && prediction.output) {
      result = prediction;
    } else {
      // v79: 서버가 predictionId 반환 → 클라이언트에서 폴링
      const pollId = prediction.predictionId || prediction.id;
      if (!pollId) {
        throw new Error('No prediction ID received from server');
      }
      result = await pollPrediction(pollId, modelConfig, onProgress);
    }

    // console.log('');
    // console.log('========================================');
    // console.log('🔍 POLLING RESPONSE (for comparison)');
    // console.log('========================================');
    // console.log('📦 result keys:', Object.keys(result));
    // console.log('🎨 selected_artist:', result.selected_artist);
    // console.log('========================================');
    // console.log('');

    if (result.status !== 'succeeded') {
      throw new Error('Processing did not succeed');
    }

    const resultUrl = Array.isArray(result.output) ? result.output[0] : result.output;

    if (!resultUrl) {
      throw new Error('No result image');
    }

    if (onProgress) onProgress({ status: 'downloading' });
    
    const imageResponse = await fetch(resultUrl);
    const blob = await imageResponse.blob();
    let localUrl = URL.createObjectURL(blob);
    let finalBlob = blob;

    // v78: 리히텐슈타인 프레임은 프롬프트로만 처리 (후처리 제거)
    // 프롬프트: "Thick black comic panel border frames the image"

    // console.log('✅ Using AI info from FIRST response:', aiSelectionInfo.artist, aiSelectionInfo.work);

    return {
      success: true,
      transformId,  // v80: 이중 차감 방지용 멱등성 키
      resultUrl: localUrl,
      blob: finalBlob,
      remoteUrl: resultUrl,
      model: modelConfig.model,
      cost: modelConfig.cost,
      time: modelConfig.time,
      aiSelectedArtist: aiSelectionInfo.artist,
      selected_work: aiSelectionInfo.work,  // 거장 모드: 선택된 대표작
      selectionMethod: aiSelectionInfo.method,
      selectionDetails: aiSelectionInfo.details
    };

  } catch (error) {
    console.error('Style transfer error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// v80: 안전한 크레딧 차감 (이중 차감 방지)
// 호출 측에서 result.success 확인 후 사용
export const deductCredit = async (transformId, cost, userId) => {
  // 1차 방어: 클라이언트 메모리 (같은 세션 내 이중 차감 방지)
  if (chargedTransformIds.has(transformId)) {
    console.warn(`⚠️ 이미 차감된 transformId: ${transformId}`);
    return { success: true, alreadyCharged: true };
  }
  
  try {
    // 2차 방어: 서버 멱등성 체크 (Firestore transaction)
    const response = await fetch(`${API_BASE_URL}/api/deduct-credit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transformId, cost, userId })
    });
    
    const data = await response.json();
    
    if (data.success) {
      chargedTransformIds.add(transformId);  // 메모리에도 기록
    }
    
    return data;  // { success, balance, alreadyCharged }
  } catch (error) {
    console.error('Credit deduction error:', error);
    // 네트워크 에러 시 차감 안 함 (소비자 보호 우선)
    return { success: false, error: error.message };
  }
};

export const mockStyleTransfer = async (photoFile, selectedStyle, onProgress) => {
  return new Promise((resolve) => {
    let progress = 0;
    const modelConfig = getModelForStyle(selectedStyle);
    
    const interval = setInterval(() => {
      progress += 10;
      if (onProgress) {
        onProgress({ status: 'processing', progress });
      }
      
      if (progress >= 100) {
        clearInterval(interval);
        const url = URL.createObjectURL(photoFile);
        resolve({
          success: true,
          resultUrl: url,
          blob: photoFile,
          model: modelConfig.model,
          isMock: true
        });
      }
    }, 200);
  });
};

export const applyStyleTransfer = processStyleTransfer;
