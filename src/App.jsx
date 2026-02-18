// Master Valley v77 - Main App (i18n 지원)
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Preferences } from '@capacitor/preferences';
import { auth } from './config/firebase';
import { setLanguage, getLanguage, t, getUi } from './i18n';
import LoginScreen from './components/LoginScreen';
import CategorySelection from './components/CategorySelection';
import PhotoStyleScreen from './components/PhotoStyleScreen';
import ProcessingScreen from './components/ProcessingScreen';
import ResultScreen from './components/ResultScreen';
import GalleryScreen from './components/GalleryScreen';
import AddFundsScreen from './components/AddFundsScreen';
import MenuScreen from './components/MenuScreen';
// LanguageScreen removed - 메뉴 아코디언에서 직접 변경
import InsufficientBalancePopup from './components/InsufficientBalancePopup';
import './styles/App.css';

const App = () => {
  // 인증 상태
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 언어 상태 (기본: 영어)
  const [lang, setLang] = useState('en');

  // 화면 상태: 'category' | 'photoStyle' | 'processing' | 'result' | 'addFunds' | 'menu'
  const [currentScreen, setCurrentScreen] = useState('category');
  const [showGallery, setShowGallery] = useState(false);
  
  // 크레딧 상태
  const [userCredits, setUserCredits] = useState(2.50);
  
  // 잔액 부족 팝업
  const [showInsufficientPopup, setShowInsufficientPopup] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState(0);
  
  // 데이터 상태
  const [mainCategory, setMainCategory] = useState(null);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [aiSelectedArtist, setAiSelectedArtist] = useState(null);
  const [aiSelectedWork, setAiSelectedWork] = useState(null);
  
  // 원클릭 결과
  const [fullTransformResults, setFullTransformResults] = useState(null);
  
  // 거장 관련
  const [masterChatData, setMasterChatData] = useState({});
  const [currentMasterIndex, setCurrentMasterIndex] = useState(0);
  const [masterResultImages, setMasterResultImages] = useState({});
  const [retransformingMasters, setRetransformingMasters] = useState({});

  // 앱 시작 시 저장된 언어 로드
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const { value } = await Preferences.get({ key: 'mastervalley-lang' });
        if (value) {
          setLang(value);
          setLanguage(value);
        }
      } catch (e) {
        console.log('Failed to load language setting');
      }
    };
    loadSavedLanguage();
  }, []);

  // 언어 변경 핸들러 (저장 포함)
  const handleLanguageChange = async (newLang) => {
    setLang(newLang);
    setLanguage(newLang);
    try {
      await Preferences.set({ key: 'mastervalley-lang', value: newLang });
    } catch (e) {
      console.log('Failed to save language setting');
    }
  };

  // Firebase 인증 상태 감시
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        console.log('✅ User logged in:', currentUser.email);
      }
    });

    return () => unsubscribe();
  }, []);

  // 로그인 성공
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      handleReset();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 1단계: 대카테고리 선택
  const handleCategorySelect = (categoryId) => {
    setMainCategory(categoryId);
    setCurrentScreen('photoStyle');
  };

  // 2단계: 사진 + 스타일 선택 완료 → 변환 시작
  const handlePhotoStyleSelect = (photo, style) => {
    setUploadedPhoto(photo);
    setSelectedStyle(style);
    setCurrentScreen('processing');
  };

  // 변환 완료
  const handleProcessingComplete = (style, resultImageUrl, result) => {
    if (result && result.isFullTransform) {
      setFullTransformResults(result.results);
      setResultImage(null);
      setAiSelectedArtist(null);
      setAiSelectedWork(null);
      setCurrentMasterIndex(0);
    } else {
      setFullTransformResults(null);
      setResultImage(resultImageUrl);
      
      if (result && result.aiSelectedArtist) {
        setAiSelectedArtist(result.aiSelectedArtist);
      } else {
        setAiSelectedArtist(null);
      }
      
      if (result && result.selected_work) {
        setAiSelectedWork(result.selected_work);
      } else {
        setAiSelectedWork(null);
      }
    }
    
    setCurrentScreen('result');
  };

  // 처음으로
  const handleReset = () => {
    setCurrentScreen('category');
    setMainCategory(null);
    setUploadedPhoto(null);
    setSelectedStyle(null);
    setResultImage(null);
    setAiSelectedArtist(null);
    setAiSelectedWork(null);
    setFullTransformResults(null);
    setMasterChatData({});
    setCurrentMasterIndex(0);
    setMasterResultImages({});
    setRetransformingMasters({});
  };

  // 뒤로가기
  const handleBackToCategory = () => {
    setCurrentScreen('category');
    setMainCategory(null);
    setUploadedPhoto(null);
  };

  // Add Funds 화면
  const handleGoToAddFunds = () => {
    setCurrentScreen('addFunds');
  };

  // Menu 화면
  const handleGoToMenu = () => {
    setCurrentScreen('menu');
  };

  // 계정 삭제 (나중에 구현)
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      console.log('Delete account requested');
      // TODO: Implement account deletion
    }
  };

  // 다시 시도 성공 시
  const handleRetrySuccess = (result) => {
    if (result.isFullTransform) {
      setFullTransformResults(result.results);
    } else {
      setResultImage(result.resultUrl);
      setAiSelectedArtist(result.aiSelectedArtist || null);
      setAiSelectedWork(result.selected_work || null);
    }
  };

  // 로딩 중
  if (authLoading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>{getUi(lang).common.loading}</p>
        <style>{`
          .auth-loading {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: white;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // 로그인 안 된 경우
  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} lang={lang} />;
  }

  return (
    <div className="app">
      {/* 잔액 부족 팝업 */}
      {showInsufficientPopup && (
        <InsufficientBalancePopup
          requiredAmount={requiredAmount}
          currentBalance={userCredits}
          onAddFunds={() => {
            setShowInsufficientPopup(false);
            setCurrentScreen('addFunds');
          }}
          onClose={() => setShowInsufficientPopup(false)}
          lang={lang}
        />
      )}

      {/* 갤러리 화면 */}
      {showGallery && (
        <GalleryScreen 
          onBack={() => setShowGallery(false)} 
          onHome={() => {
            setShowGallery(false);
            handleReset();
          }}
          lang={lang}
        />
      )}

      {/* 메인 앱 */}
      {!showGallery && (
        <>
          {currentScreen === 'category' && (
            <CategorySelection 
              onSelect={handleCategorySelect}
              onGallery={() => setShowGallery(true)}
              onMenu={handleGoToMenu}
              userCredits={userCredits}
              lang={lang}
            />
          )}

          {currentScreen === 'addFunds' && (
            <AddFundsScreen
              onBack={() => setCurrentScreen('category')}
              userCredits={userCredits}
              onPurchase={(pack) => {
                // 나중에 RevenueCat 연동
                setUserCredits(prev => prev + pack.value);
                setCurrentScreen('category');
              }}
              lang={lang}
            />
          )}

          {currentScreen === 'menu' && (
            <MenuScreen
              onBack={() => setCurrentScreen('category')}
              onGallery={() => setShowGallery(true)}
              onAddFunds={handleGoToAddFunds}
              onLanguage={handleLanguageChange}
              onSupport={() => console.log('Support')}
              onLogout={handleLogout}
              onDeleteAccount={handleDeleteAccount}
              lang={lang}
            />
          )}

          {currentScreen === 'photoStyle' && (
            <PhotoStyleScreen
              mainCategory={mainCategory}
              onBack={handleBackToCategory}
              onSelect={handlePhotoStyleSelect}
              userCredits={userCredits}
              lang={lang}
            />
          )}

          {currentScreen === 'processing' && (
            <ProcessingScreen
              photo={uploadedPhoto}
              selectedStyle={selectedStyle}
              onComplete={handleProcessingComplete}
              lang={lang}
            />
          )}

          {currentScreen === 'result' && (
            <ResultScreen
              originalPhoto={uploadedPhoto}
              resultImage={resultImage}
              selectedStyle={selectedStyle}
              aiSelectedArtist={aiSelectedArtist}
              aiSelectedWork={aiSelectedWork}
              fullTransformResults={fullTransformResults}
              onReset={handleReset}
              onGallery={() => setShowGallery(true)}
              onRetrySuccess={handleRetrySuccess}
              masterChatData={masterChatData}
              onMasterChatDataChange={setMasterChatData}
              currentMasterIndex={currentMasterIndex}
              onMasterIndexChange={setCurrentMasterIndex}
              masterResultImages={masterResultImages}
              onMasterResultImagesChange={setMasterResultImages}
              retransformingMasters={retransformingMasters}
              onRetransformingMastersChange={setRetransformingMasters}
              lang={lang}
            />
          )}
        </>
      )}

      <style>{`
        .app {
          min-height: 100vh;
          position: relative;
        }
        
        .user-header {
          position: fixed;
          top: 0;
          right: 0;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 0 0 0 12px;
        }
        
        .user-email {
          color: white;
          font-size: 13px;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .logout-btn {
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default App;
