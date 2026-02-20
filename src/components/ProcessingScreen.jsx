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
  getOneclickOrientalSecondary,
  getMastersResultEducation,
  getUi
} from '../i18n';
// v73: displayConfig 통합 함수
import { normalizeKey, getDisplayInfo, getArtistName, getMovementDisplayInfo, getOrientalDisplayInfo, getMasterInfo, getCategoryIcon, getStyleIcon, getStyleTitle, getStyleSubtitle, getStyleSubtitles } from '../utils/displayConfig';
import { getEducationKey, getEducationContent } from '../utils/educationMatcher';

const ProcessingScreen = ({ photo, selectedStyle, onComplete, lang = 'en' }) => {
  // i18n texts from ui.js
  const t = getUi(lang).processing;
  
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
      const categoryLabel = category === 'movements' ? t.movementsLabel : 
                           category === 'masters' ? t.mastersLabel : 
                           t.nationsLabel;
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
          setStatusText(t.checkingArtwork);
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
    const styleName = getStyleTitle(
      style.category, style.id, style.name, lang
    );

    // API 상태 객체 → i18n 텍스트 변환
    const mapProgress = (progressObj) => {
      // 레거시 문자열 호환 (혹시 문자열이 오면 그대로 표시)
      if (typeof progressObj === 'string') return progressObj;
      
      const { status, progress } = progressObj;
      const pct = progress ? ` ${progress}%` : '';
      
      switch (status) {
        case 'analyzing':   return t.analyzing;
        case 'downloading': return t.downloading || t.done;
        case 'processing':  
        default:            return `${styleName} ${t.inProgress}${pct}`;
      }
    };

    try {
      const result = await processStyleTransfer(
        photo,
        style,
        null,
        (progressObj) => {
          const mapped = mapProgress(progressObj);
          if (total > 1) {
            setStatusText(`${mapped} [${index + 1}/${total}]`);
          } else {
            setStatusText(mapped);
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
      return oneclickMovementsPrimary;
    } else if (category === 'masters') {
      // console.log('🎓 Using oneclickMastersPrimary');
      return oneclickMastersPrimary;
    } else if (category === 'oriental') {
      // console.log('🎓 Using oneclickOrientalPrimary');
      return oneclickOrientalPrimary;
    }
    return null;
  };


  // 제목 반환 (v67: 새 표기 형식)
  // 거장: 풀네임(영문, 생몰연도)
  // 미술사조: 사조(영문, 시기)
  // 동양화: 국가 전통회화
  const getTitle = (result) => {
    const cat = result?.style?.category;
    const artist = result?.aiSelectedArtist;
    const styleId = result?.style?.id;
    const styleName = result?.style?.name;
    
    // getStyleTitle과 동일 로직 사용 (복합사조 해결 + lang 지원)
    return getStyleTitle(cat, styleId, artist || styleName, lang);
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
      // 거장 카테고리: 작품별 교육자료 우선 시도 (mastersResultEducation)
      if (resultCategory === 'masters') {
        const mastersResult = getMastersResultEducation(lang);
        if (mastersResult[key]) {
          const edu = mastersResult[key];
          const content = edu.content || edu.description || edu.desc || null;
          if (content) {
            return content;
          }
        }
      }
      
      // 기존 원클릭 교육자료 fallback
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
                    {category === 'movements' ? t.movementsSub1 :
                     category === 'masters' ? t.mastersSub1 :
                     t.orientalSub1}
                  </div>
                  <div className="subtitle2">
                    {category === 'movements' ? t.movementsSub2 :
                     category === 'masters' ? t.mastersSub2 :
                     t.orientalSub2}
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

            {/* 점 네비게이션 (Prev/Next 제거 — 스와이프 + dot 탭만) */}
            <div className="dots-nav">
              <div className="dots">
                <button className={`dot edu ${viewIndex === -1 ? 'active' : ''}`} onClick={handleBackToEducation}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                </button>
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
            </div>

            {/* 프로그레스 섹션 - 하단 (단독변환 스타일 통일) */}
            <div className="progress-section">
              <div className="progress-status">
                <div className="spinner"></div>
                <p>{statusText}</p>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(completedCount / totalCount) * 100}%` }}></div>
              </div>
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
          align-items: center;
        }
        .progress-status {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .progress-status p {
          margin: 0;
          color: rgba(255,255,255,0.5);
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .progress-bar {
          width: 50%;
          height: 2px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #7c3aed, #a855f7);
          transition: width 0.3s;
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
          border-top: 2px solid #7c3aed;
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
        .edu-card h3 { color: #7c3aed; margin: 0 0 10px; font-size: 15px; }
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
          right: 20px;
          width: auto;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .single-status {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .single-status p {
          margin: 0;
          color: rgba(255,255,255,0.5);
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .single-progress-bar {
          width: 50vw;
          max-width: 170px;
          height: 2px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        .single-progress-fill {
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, #7c3aed, #a855f7);
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
          margin-top: 16px;
          padding: 12px 0 4px;
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
          background: rgba(124, 58, 237, 0.5);
        }
        .dot.active {
          background: #7c3aed;
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
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.4);
        }
        .dot.edu.active {
          color: #7c3aed;
          transform: none;
          background: none;
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
