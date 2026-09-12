import { useState, useEffect } from 'react'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from './firebase'

const SITE_URL = 'http://localhost:5173' // change after deployment

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #F5F6FA; min-height: 100vh; }
  .login-root { display: flex; min-height: 100vh; width: 100%; }
  .login-brand { display: none; flex: 1; background: #1B2A6B; flex-direction: column; justify-content: center; align-items: flex-start; padding: 64px 56px; position: relative; overflow: hidden; }
  @media (min-width: 900px) { .login-brand { display: flex; } }
  .login-brand::before { content: ''; position: absolute; bottom: -120px; right: -120px; width: 400px; height: 400px; border-radius: 50%; background: rgba(255,255,255,0.04); }
  .login-brand::after { content: ''; position: absolute; top: -80px; left: -80px; width: 280px; height: 280px; border-radius: 50%; background: rgba(227,0,27,0.12); }
  .brand-logo { font-size: 1.5rem; font-weight: 700; color: #fff; letter-spacing: -0.02em; margin-bottom: 48px; position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; }
  .brand-logo span { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: #E3001B; color: #fff; font-size: 1.1rem; font-weight: 800; border-radius: 8px; }
  .brand-tagline { font-size: 2.4rem; font-weight: 700; color: #fff; line-height: 1.2; letter-spacing: -0.03em; margin-bottom: 20px; position: relative; z-index: 1; }
  .brand-sub { font-size: 1rem; color: rgba(255,255,255,0.6); line-height: 1.6; max-width: 320px; position: relative; z-index: 1; }
  .brand-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 40px; position: relative; z-index: 1; }
  .brand-chip { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.85); font-size: 0.78rem; font-weight: 500; padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.15); }
  .login-form-panel { flex: 0 0 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px 24px; background: #fff; }
  @media (min-width: 900px) { .login-form-panel { flex: 0 0 440px; padding: 64px 48px; } }
  .form-box { width: 100%; max-width: 360px; }
  .form-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 40px; }
  .form-logo-icon { width: 40px; height: 40px; background: #E3001B; color: #fff; font-size: 1.2rem; font-weight: 800; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .form-logo-text { font-size: 1.2rem; font-weight: 700; color: #1B2A6B; }
  .form-heading { font-size: 1.75rem; font-weight: 700; color: #111827; letter-spacing: -0.02em; margin-bottom: 8px; }
  .form-sub { font-size: 0.9rem; color: #6B7280; margin-bottom: 36px; line-height: 1.5; }
  .btn-google { width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px; padding: 14px 16px; border: 1.5px solid #E5E7EB; border-radius: 10px; background: #fff; font-size: 0.95rem; font-weight: 500; color: #111827; cursor: pointer; transition: border-color 0.15s, background 0.15s, box-shadow 0.15s; font-family: inherit; }
  .btn-google:hover:not(:disabled) { border-color: #1B2A6B; background: #F5F6FA; box-shadow: 0 2px 8px rgba(27,42,107,0.08); }
  .btn-google:disabled { opacity: 0.6; cursor: not-allowed; }
  .google-icon { width: 20px; height: 20px; flex-shrink: 0; }
  .err { color: #E3001B; font-size: 0.85rem; margin-top: 12px; text-align: center; }
  .divider { display: flex; align-items: center; gap: 12px; margin: 28px 0; color: #9CA3AF; font-size: 0.8rem; }
  .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #E5E7EB; }
  .features { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
  .feature { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: #6B7280; }
  .feature-icon { width: 28px; height: 28px; background: #F5F6FA; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
  .success-box { text-align: center; padding: 20px 0; }
  .success-icon { font-size: 3.5rem; margin-bottom: 16px; }
  .success-box h3 { font-size: 1.3rem; font-weight: 700; color: #111827; margin-bottom: 8px; }
  .success-box p { font-size: 0.875rem; color: #6B7280; line-height: 1.6; margin-bottom: 24px; }
  .redirect-bar { height: 5px; background: #E5E7EB; border-radius: 3px; overflow: hidden; margin-bottom: 10px; }
  .redirect-fill { height: 100%; background: #E3001B; border-radius: 3px; transition: width 0.25s linear; }
  .redirect-label { font-size: 0.8rem; color: #9CA3AF; }
  .footer-note { margin-top: 36px; font-size: 0.75rem; color: #9CA3AF; text-align: center; line-height: 1.6; }
`

export default function Login() {
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [progress, setProgress] = useState(0)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    if (!success) return
    let p = 0
    const iv = setInterval(() => {
      p += 2; setProgress(p)
      if (p >= 100) { clearInterval(iv); window.location.href = SITE_URL }
    }, 100)
    return () => clearInterval(iv)
  }, [success])

  async function handleGoogleLogin() {
    setErr(''); setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      setUserName(result.user.displayName || result.user.email)
      setSuccess(true)
    } catch (e) {
      if (e.code === 'auth/popup-closed-by-user') {
        setErr('Popup closed. Please try again.')
      } else if (e.code === 'auth/cancelled-popup-request') {
        setErr('Sign in cancelled. Please try again.')
      } else {
        setErr('Google sign-in failed. Please try again.')
      }
    } finally { setLoading(false) }
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="login-root">

        {/* Left brand panel */}
        <div className="login-brand">
          <div className="brand-logo"><span>V</span> Vidya Course</div>
          <h2 className="brand-tagline">Learn with confidence,<br />every single day.</h2>
          <p className="brand-sub">
            Personal home tuition for Class 1–6 in Shakarpur and Laxmi Nagar. Hindi & English medium. All subjects covered.
          </p>
          <div className="brand-chips">
            <span className="brand-chip">Class 1–6</span>
            <span className="brand-chip">Mon–Fri</span>
            <span className="brand-chip">All subjects</span>
            <span className="brand-chip">Shakarpur, Laxmi Nagar</span>
            <span className="brand-chip">Weekly tests</span>
          </div>
        </div>

        {/* Right form panel */}
        <div className="login-form-panel">
          <div className="form-box">
            <div className="form-logo">
              <div className="form-logo-icon">V</div>
              <span className="form-logo-text">Vidya Course</span>
            </div>

            {success ? (
              <div className="success-box">
                <div className="success-icon">🎉</div>
                <h3>Welcome{userName ? `, ${userName.split(' ')[0]}` : ''}!</h3>
                <p>You're signed in successfully. Taking you to Vidya Course now…</p>
                <div className="redirect-bar">
                  <div className="redirect-fill" style={{ width: `${progress}%` }} />
                </div>
                <span className="redirect-label">Redirecting in {Math.ceil((100 - progress) / 20)}s</span>
              </div>
            ) : (
              <>
                <h1 className="form-heading">Welcome back</h1>
                <p className="form-sub">Sign in to access your tuition dashboard</p>

                <button className="btn-google" onClick={handleGoogleLogin} disabled={loading}>
                  <svg className="google-icon" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {loading ? 'Signing in…' : 'Continue with Google'}
                </button>

                {err && <p className="err">{err}</p>}

                <div className="divider">what you get</div>

                <div className="features">
                  <div className="feature"><div className="feature-icon">📚</div> Access all subjects — Hindi, English, Maths & more</div>
                  <div className="feature"><div className="feature-icon">📝</div> Weekly test results and progress tracking</div>
                  <div className="feature"><div className="feature-icon">🏠</div> Home tuition slots for Class 1–6</div>
                  <div className="feature"><div className="feature-icon">💬</div> Direct enquiry to Pawan Gupta</div>
                </div>
              </>
            )}

            <p className="footer-note">
              By signing in you agree to our terms of service.<br />
              Vidya Course · Shakarpur, Laxmi Nagar · pg19062004@gmail.com
            </p>
          </div>
        </div>
      </div>
    </>
  )
}