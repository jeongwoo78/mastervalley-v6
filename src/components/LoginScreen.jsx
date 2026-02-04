// LoginScreen.jsx - Master Valley 로그인 화면 (Dark Theme)
// Based on mockup: 01-mockup-login-final.html
import React, { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signInWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../config/firebase';
import { Capacitor } from '@capacitor/core';

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const initGoogleAuth = async () => {
      const native = Capacitor.isNativePlatform();
      setIsNative(native);
      
      if (native) {
        try {
          const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
          await GoogleAuth.initialize({
            clientId: '539777702177-kk0l660744km8e2lc4l171i8ida8a8af.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
          });
          console.log('GoogleAuth initialized');
        } catch (err) {
          console.log('GoogleAuth init error:', err);
        }
      }
    };
    
    initGoogleAuth();
  }, []);

  // Google 로그인
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (isNative) {
        const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
        const googleUser = await GoogleAuth.signIn();
        const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
        const result = await signInWithCredential(auth, credential);
        onLoginSuccess(result.user);
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        onLoginSuccess(result.user);
      }
    } catch (err) {
      console.error('Google login error:', err);
      if (err.message?.includes('popup_closed')) {
        setError('Login cancelled');
      } else if (err.message?.includes('network')) {
        setError('Network error. Please try again.');
      } else {
        setError('Google login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // Apple 로그인
  const handleAppleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await signInWithPopup(auth, appleProvider);
      onLoginSuccess(result.user);
    } catch (err) {
      console.error('Apple login error:', err);
      setError('Apple login failed');
    } finally {
      setLoading(false);
    }
  };

  // 이메일 로그인/회원가입
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let result;
      if (isSignUp) {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      onLoginSuccess(result.user);
    } catch (err) {
      console.error('Email auth error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        {/* Logo & Title */}
        <div className="login-logo">
          <div className="logo-icon">🎨</div>
          <h1>Master Valley</h1>
          <p>Your photo becomes a masterpiece</p>
        </div>

        {/* Social Login */}
        <div className="social-login">
          <button 
            className="social-btn google-btn" 
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          
          <button 
            className="social-btn apple-btn" 
            onClick={handleAppleLogin}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        {/* Divider */}
        <div className="divider">
          <span>or</span>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailSubmit} className="email-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Switch */}
        <div className="auth-switch">
          <span>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </div>
      </div>

      <style>{`
        .login-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #121212;
          padding: 20px;
        }

        .login-container {
          width: 100%;
          max-width: 360px;
          padding: 40px 24px;
        }

        .login-logo {
          text-align: center;
          margin-bottom: 40px;
        }

        .logo-icon {
          font-size: 56px;
          margin-bottom: 16px;
        }

        .login-logo h1 {
          font-size: 28px;
          color: #fff;
          margin: 0 0 8px 0;
          font-weight: 700;
        }

        .login-logo p {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          margin: 0;
        }

        .social-login {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 14px 20px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .social-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .google-btn {
          background: #fff;
          color: #333;
        }

        .google-btn:hover:not(:disabled) {
          background: #f5f5f5;
        }

        .apple-btn {
          background: #000;
          color: white;
          border: 1px solid #333;
        }

        .apple-btn:hover:not(:disabled) {
          background: #1a1a1a;
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 24px 0;
          color: rgba(255,255,255,0.3);
          font-size: 13px;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.1);
        }

        .divider span {
          padding: 0 16px;
        }

        .email-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .email-form input {
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid #333;
          background: #1a1a1a;
          color: #fff;
          font-size: 15px;
        }

        .email-form input::placeholder {
          color: rgba(255,255,255,0.4);
        }

        .email-form input:focus {
          outline: none;
          border-color: #7c3aed;
        }

        .email-form button {
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: #7c3aed;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .email-form button:hover:not(:disabled) {
          background: #6d28d9;
        }

        .email-form button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          margin-top: 16px;
          padding: 12px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
          color: #ef4444;
          font-size: 14px;
          text-align: center;
        }

        .auth-switch {
          margin-top: 24px;
          text-align: center;
          color: rgba(255,255,255,0.5);
          font-size: 14px;
        }

        .auth-switch button {
          background: none;
          border: none;
          color: #7c3aed;
          font-weight: 600;
          cursor: pointer;
          margin-left: 8px;
        }

        .auth-switch button:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;
