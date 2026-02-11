// PicoArt v30 - Style Transfer API (첫 응답에서 AI 정보 저장)
import { MODEL_CONFIG } from './modelConfig';

// API 기본 URL (앱에서는 절대 경로 필요)
const API_BASE_URL = 'https://mastervalley-v6.vercel.app';

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

const callFluxAPI = async (photoBase64, stylePrompt, onProgress) => {
  if (onProgress) onProgress('Processing...');

  const response = await fetch(`${API_BASE_URL}/api/flux-transfer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image: photoBase64,
      prompt: stylePrompt,
      control_type: 'depth',
      control_strength: 0.5,
      num_inference_steps: 28,
      guidance_scale: 3.5
    })
  });

  if (!response.ok) {
    throw new Error(`FLUX API error: ${response.status}`);
  }

  return response.json();
};

const callFluxWithAI = async (photoBase64, selectedStyle, onProgress, correctionPrompt = null) => {
  // 동적 이름으로 진행 메시지
  if (onProgress) {
    const styleName = selectedStyle?.name || 'Master';
    onProgress(`${styleName} in progress...`);
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

  const response = await fetch(`${API_BASE_URL}/api/flux-transfer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`FLUX API error: ${response.status}`);
  }

  return response.json();
};

const pollPrediction = async (predictionId, modelConfig, onProgress) => {
  let attempts = 0;
  const maxAttempts = 90;
  
  while (attempts < maxAttempts) {
    await sleep(2000);
    attempts++;

    const checkResponse = await fetch(`${API_BASE_URL}/api/check-prediction?id=${predictionId}`);
    
    if (!checkResponse.ok) {
      throw new Error('Failed to check status');
    }

    const result = await checkResponse.json();

    if (result.status === 'succeeded') {
      return result;
    }

    if (result.status === 'failed') {
      // 상세 에러 정보 로깅
      console.error('❌ FLUX Processing Failed:', {
        error: result.error,
        logs: result.logs,
        predictionId: predictionId
      });
      throw new Error(`Processing failed: ${result.error || 'Unknown error'}`);
    }

    if (onProgress) {
      const progress = Math.min(95, 10 + (attempts * 1.0));
      onProgress(`Processing... ${Math.floor(progress)}%`);
    }
  }

  throw new Error('Processing timeout');
};

export const processStyleTransfer = async (photoFile, selectedStyle, correctionPrompt = null, onProgress = null) => {
  try {
    const resizedPhoto = await resizeImage(photoFile, 1024);
    const photoBase64 = await fileToBase64(resizedPhoto);
    const modelConfig = getModelForStyle(selectedStyle);
    
    if (onProgress) {
      onProgress('Analyzing photo...');
    }

    let prediction;
    // v71: 재변환 시에는 항상 callFluxWithAI 사용 (correctionPrompt 전송 필수)
    if (correctionPrompt) {
      // 재변환 모드 - correctionPrompt 필수 전달
      prediction = await callFluxWithAI(photoBase64, selectedStyle, onProgress, correctionPrompt);
    } else if (modelConfig.model.includes('flux') && selectedStyle.prompt) {
      // 일반 변환 + 직접 프롬프트 (미술사조/동양화 등)
      prediction = await callFluxAPI(photoBase64, selectedStyle.prompt, onProgress);
    } else {
      // 일반 변환 + AI 자동 선택 (거장 모드)
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
    // console.log('🔍 Checking prediction status:', prediction.status);
    // console.log('🔍 Has output:', !!prediction.output);
    if (prediction.status === 'succeeded' && prediction.output) {
      // console.log('✅ Already completed (Prefer: wait mode)');
      result = prediction;
    } else {
      // console.log('⏳ Status not succeeded or no output, polling...');
      // console.log('   prediction.id:', prediction.id);
      result = await pollPrediction(prediction.id, modelConfig, onProgress);
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

    if (onProgress) onProgress('Downloading...');
    
    const imageResponse = await fetch(resultUrl);
    const blob = await imageResponse.blob();
    let localUrl = URL.createObjectURL(blob);
    let finalBlob = blob;

    // v78: 리히텐슈타인 프레임은 프롬프트로만 처리 (후처리 제거)
    // 프롬프트: "Thick black comic panel border frames the image"

    // console.log('✅ Using AI info from FIRST response:', aiSelectionInfo.artist, aiSelectionInfo.work);

    return {
      success: true,
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

export const mockStyleTransfer = async (photoFile, selectedStyle, onProgress) => {
  return new Promise((resolve) => {
    let progress = 0;
    const modelConfig = getModelForStyle(selectedStyle);
    
    const interval = setInterval(() => {
      progress += 10;
      if (onProgress) {
        onProgress(`${modelConfig.label} Processing... ${progress}%`);
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
