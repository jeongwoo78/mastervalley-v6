// PicoArt - 거장(AI) 대화 컴포넌트
// ResultScreen 내에서 사용되는 인라인 대화 UI

import React, { useState, useEffect, useRef } from 'react';
import { getMasterChat } from '../i18n';

// API 기본 URL
const API_BASE_URL = 'https://mastervalley-v5.vercel.app';

// 거장별 테마 색상 (7명) - 색상은 i18n 불필요
const MASTER_THEMES = {
  'VAN GOGH': { primary: '#F5A623', gradient: 'linear-gradient(135deg, #F5A623, #e8941a)' },
  'KLIMT': { primary: '#D4AF37', gradient: 'linear-gradient(135deg, #D4AF37, #b8962e)' },
  'MUNCH': { primary: '#8B4513', gradient: 'linear-gradient(135deg, #8B4513, #6d360f)' },
  'CHAGALL': { primary: '#E6A8D7', gradient: 'linear-gradient(135deg, #E6A8D7, #7EB6D8)' },
  'MATISSE': { primary: '#FF6B6B', gradient: 'linear-gradient(135deg, #FF6B6B, #ee5a5a)' },
  'FRIDA': { primary: '#C41E3A', gradient: 'linear-gradient(135deg, #C41E3A, #a01830)' },
  'LICHTENSTEIN': { primary: '#FFD700', gradient: 'linear-gradient(135deg, #FFD700, #FF4500)' }
};

const MasterChat = ({ 
  masterKey,           // 거장 키 (예: "VAN GOGH")
  onRetransform,       // 재변환 콜백 (correctionPrompt를 전달)
  isRetransforming,    // 이 거장이 변환 중인지
  retransformCost = 100,  // 재변환 비용
  savedChatData,       // 저장된 대화 데이터 { messages, pendingCorrection, messageCount, isChatEnded }
  onChatDataChange,    // 대화 데이터 변경 콜백
  lang = 'ko'          // 언어 설정
}) => {
  // i18n 데이터 로드
  const chatText = getMasterChat(lang);
  
  // 저장된 데이터가 있으면 사용, 없으면 초기값
  const [messages, setMessages] = useState(savedChatData?.messages || []);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingCorrection, setPendingCorrection] = useState(savedChatData?.pendingCorrection || null);
  const [messageCount, setMessageCount] = useState(savedChatData?.messageCount || 0);
  const [isChatEnded, setIsChatEnded] = useState(savedChatData?.isChatEnded || false);
  const chatAreaRef = useRef(null);
  const hasGreeted = useRef(savedChatData?.messages?.length > 0);
  
  const MAX_MESSAGES = 30; // 최대 대화 횟수

  // 테마 색상
  const theme = MASTER_THEMES[masterKey] || MASTER_THEMES['VAN GOGH'];
  const masterName = chatText.masterNames[masterKey] || masterKey;
  
  // 한글 조사 선택 (받침 있으면 "이", 없으면 "가") - 한국어만 적용
  const getSubjectParticle = (name) => {
    if (lang !== 'ko') return '';
    const lastChar = name[name.length - 1];
    const hasJongsung = (lastChar.charCodeAt(0) - 0xAC00) % 28 !== 0;
    return hasJongsung ? '이' : '가';
  };

  // 대화 데이터 변경 시 부모에게 알림
  useEffect(() => {
    if (onChatDataChange) {
      onChatDataChange({
        messages,
        pendingCorrection,
        messageCount,
        isChatEnded
      });
    }
  }, [messages, pendingCorrection, messageCount, isChatEnded]);

  // 첫 마운트 시 인사 (저장된 대화 없을 때만)
  useEffect(() => {
    if (!hasGreeted.current && masterKey) {
      hasGreeted.current = true;
      loadGreeting();
    }
  }, []);

  // 스크롤 자동 이동
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // 첫 인사 로드 (i18n에서 가져옴)
  const loadGreeting = () => {
    const greeting = chatText.greetings[masterKey] || chatText.greetings['VAN GOGH'];
    setMessages([
      {
        role: 'master',
        content: greeting
      },
      {
        role: 'system',
        content: chatText.common.helpText
      }
    ]);
  };

  // 메시지 전송
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || isRetransforming || isChatEnded) return;
    
    // 20회 제한 체크
    if (messageCount >= MAX_MESSAGES) {
      setIsChatEnded(true);
      return;
    }

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // 사용자 메시지 추가 및 카운트 증가
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    const newCount = messageCount + 1;
    setMessageCount(newCount);
    
    // 20회 도달 시 종료 처리
    if (newCount >= MAX_MESSAGES) {
      setIsChatEnded(true);
      // 잠시 후 종료 메시지 표시
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'master', 
          content: chatText.farewellMessages[masterKey] || chatText.farewellMessages['VAN GOGH']
        }, {
          role: 'system',
          content: chatText.common.chatEnded
        }]);
      }, 500);
    }
    
    setIsLoading(true);
    try {
      // 대화 히스토리 구성 (Claude API 형식) - 시스템 메시지 제외
      const conversationHistory = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role === 'master' ? 'assistant' : 'user',
          content: msg.content
        }));

      const response = await fetch(`${API_BASE_URL}/api/master-feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterName: masterKey,
          conversationType: 'feedback',
          userMessage: userMessage,
          conversationHistory: conversationHistory,
          lang: lang
        })
      });
      
      const data = await response.json();
      
      console.log('Master feedback response:', data);
      
      if (data.success && data.masterResponse) {
        // 거장 응답 추가
        setMessages(prev => [...prev, {
          role: 'master',
          content: data.masterResponse
        }]);
        
        // 보정 프롬프트 저장
        if (data.correctionPrompt) {
          setPendingCorrection(data.correctionPrompt);
        }
      } else {
        // 응답 실패 시 에러 로그
        console.error('Invalid response:', data);
        setMessages(prev => [...prev, {
          role: 'master',
          content: chatText.common.errorMessage
        }]);
      }
    } catch (error) {
      console.error('Feedback error:', error);
      setMessages(prev => [...prev, {
        role: 'master',
        content: chatText.common.errorMessage
      }]);
    }
    setIsLoading(false);
  };

  // 재변환 실행
  const handleRetransform = async () => {
    if (!pendingCorrection || isRetransforming) return;
    
    // 부모 컴포넌트에 재변환 요청
    onRetransform(pendingCorrection);
  };

  // 재변환 완료 플래그 체크 (동기적으로 메시지 추가)
  useEffect(() => {
    if (savedChatData?.retransformCompleted) {
      showCompletionMessage();
      // 플래그 리셋
      if (onChatDataChange) {
        onChatDataChange({
          ...savedChatData,
          retransformCompleted: false
        });
      }
    }
  }, [savedChatData?.retransformCompleted]);
  
  // 완료 메시지 표시 함수 (i18n 사용)
  const showCompletionMessage = () => {
    const resultMessage = chatText.resultMessages[masterKey] || chatText.resultMessages['VAN GOGH'];
    setMessages(prev => [
      ...prev,
      { role: 'system', content: chatText.common.retransformComplete },
      { role: 'master', content: resultMessage }
    ]);
    setPendingCorrection(null);
  };

  // 엔터키 전송
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="master-chat-section" style={{ '--master-color': theme.primary }}>
      {/* 헤더 */}
      <div className="master-chat-header">
        <div className="master-avatar" style={{ background: theme.gradient }}>
          🎨
        </div>
        <div className="master-info">
          <h3>{chatText.common.chatWith.replace('{masterName}', masterName)}</h3>
        </div>
      </div>

      {/* 대화 영역 */}
      <div className="chat-area" ref={chatAreaRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            {msg.role === 'master' && (
              <div className="avatar" style={{ background: theme.gradient }}>🎨</div>
            )}
            {msg.role === 'system' ? (
              <div className="system-message">
                {msg.content}
                {/* 첫 시스템 메시지(idx 1)에만 추천 질문 표시 */}
                {idx === 1 && (
                  <div className="suggested-questions">
                    {(chatText.suggestedQuestions[masterKey] || []).map((q, qIdx) => (
                      <button
                        key={qIdx}
                        className="question-chip"
                        onClick={() => {
                          setInputValue(q);
                          // 바로 전송
                          setTimeout(() => {
                            document.querySelector('.send-btn')?.click();
                          }, 50);
                        }}
                        style={{ 
                          borderColor: `${theme.primary}60`,
                          color: theme.primary
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="sender">{msg.role === 'master' ? `${masterName}(AI)` : chatText.common.senderMe}</div>
                <div className="bubble" style={msg.role === 'master' ? { 
                  background: `${theme.primary}20`,
                  borderColor: `${theme.primary}40`
                } : {}}>
                  {msg.content}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* 타이핑 인디케이터 */}
        {isLoading && (
          <div className="chat-message master">
            <div className="avatar" style={{ background: theme.gradient }}>🎨</div>
            <div className="bubble typing" style={{ 
              background: `${theme.primary}20`,
              borderColor: `${theme.primary}40`
            }}>
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isChatEnded ? "대화가 종료되었습니다" : isRetransforming ? "변환 중..." : "수정 요청을 입력하세요..."}
          disabled={isLoading || isRetransforming || isChatEnded}
          style={{ borderColor: inputValue ? theme.primary : undefined }}
        />
        <button 
          className="send-btn"
          onClick={sendMessage}
          disabled={!inputValue.trim() || isLoading || isRetransforming || isChatEnded}
          style={{ background: theme.gradient }}
        >
          ➤
        </button>
      </div>

      {/* 재변환 버튼 */}
      <button 
        className="retransform-btn"
        onClick={handleRetransform}
        disabled={!pendingCorrection || isRetransforming || isChatEnded}
        style={{ 
          background: pendingCorrection && !isRetransforming && !isChatEnded ? theme.gradient : undefined,
          opacity: !pendingCorrection || isRetransforming || isChatEnded ? 0.5 : 1
        }}
      >
        {isRetransforming ? (
          <>
            <span className="spinner-small"></span>
            {lang === 'ko' 
              ? chatText.common.modifying.replace('{masterName}', masterName + getSubjectParticle(masterName))
              : chatText.common.modifying.replace('{masterName}', masterName)
            }
          </>
        ) : (
          chatText.common.requestModify.replace('${cost}', retransformCost)
        )}
      </button>

      <style>{`
        .master-chat-section {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 1.5rem;
        }

        .master-chat-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .master-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .master-info h3 {
          color: #333;
          font-size: 15px;
          font-weight: 600;
          margin: 0;
        }

        .chat-area {
          max-height: 200px;
          overflow-y: auto;
          margin-bottom: 12px;
          padding-right: 4px;
        }

        .chat-message {
          margin-bottom: 12px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chat-message.master {
          display: flex;
          gap: 8px;
        }

        .chat-message.master .avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
        }

        .chat-message .sender {
          font-size: 11px;
          color: #666;
          margin-bottom: 4px;
        }

        .chat-message.user .sender {
          text-align: right;
        }

        .chat-message.system {
          display: flex;
          justify-content: center;
          margin: 16px 0;
        }

        .system-message {
          background: rgba(0, 0, 0, 0.05);
          color: #666;
          font-size: 13px;
          padding: 8px 16px;
          border-radius: 20px;
          text-align: center;
        }

        .suggested-questions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-top: 12px;
        }

        .question-chip {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 16px;
          padding: 6px 12px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .question-chip:hover {
          background: rgba(0, 0, 0, 0.05);
          transform: translateY(-1px);
        }

        .question-chip:active {
          transform: translateY(0);
        }

        .chat-message.master .bubble {
          background: rgba(102, 126, 234, 0.15);
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: 12px;
          border-top-left-radius: 4px;
          padding: 10px 12px;
          color: #333;
          font-size: 14px;
          line-height: 1.5;
          max-width: 85%;
        }

        .chat-message.user {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .chat-message.user .bubble {
          background: #667eea;
          border-radius: 12px;
          border-top-right-radius: 4px;
          padding: 10px 12px;
          color: white;
          font-size: 14px;
          line-height: 1.5;
          max-width: 85%;
        }

        .chat-message .bubble.typing {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
        }

        .chat-message .bubble.typing span {
          width: 6px;
          height: 6px;
          background: var(--master-color, #667eea);
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .chat-message .bubble.typing span:nth-child(2) { animation-delay: 0.2s; }
        .chat-message .bubble.typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }

        .chat-input-area {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .chat-input {
          flex: 1;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 20px;
          padding: 10px 16px;
          color: #333;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input:focus {
          border-color: var(--master-color, #667eea);
        }

        .chat-input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        .send-btn {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, opacity 0.2s;
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .retransform-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          border-radius: 12px;
          padding: 14px;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .retransform-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
        }

        .retransform-btn:disabled {
          cursor: not-allowed;
          transform: none;
        }

        .spinner-small {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MasterChat;
