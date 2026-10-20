import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SignupScreenProps {
  onSignupSuccess: (name: string, email: string) => void;
  onGoToLogin: () => void;
  onBack: () => void;
  currentLang: string;
  onOpenLangModal: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({
  onSignupSuccess,
  onGoToLogin,
  onBack,
  currentLang,
  onOpenLangModal,
}) => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg(t('signup.errName'));
      return;
    }
    if (!email.trim()) {
      setErrorMsg(t('signup.errEmail'));
      return;
    }
    if (password.length < 6) {
      setErrorMsg(t('signup.errPasswordLength'));
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(t('signup.errPasswordMatch'));
      return;
    }
    if (!agreed) {
      setErrorMsg(t('signup.errTerms'));
      return;
    }

    onSignupSuccess(fullName.trim(), email.trim());
  };

  return (
    <main className="w-full max-w-[390px] min-h-screen md:min-h-[844px] bg-gradient-to-b from-[#FAF8F5] via-[#F7F6F2] to-[#F2EFEA] relative flex flex-col justify-between overflow-hidden sm:rounded-[44px] px-6 pt-5 pb-7 md:shadow-2xl border-x md:border border-[#775537]/20 select-none">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-52 h-52 rounded-full bg-[#FBE29D]/40 blur-2xl pointer-events-none"></div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Navigation Header */}
        <header className="w-full flex items-center justify-between pt-2 pb-2">
          {/* Back Navigation Button */}
          <button
            onClick={onBack}
            aria-label={t('common.back')}
            className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#775537] hover:bg-stone-50 active:scale-95 transition-all cursor-pointer border border-[#775537]/15"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>

          {/* Brand Wordmark with Yellow Accent Dot on the right of SkillSpill */}
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-tight text-[#775537]">SkillSpill</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBE29D] border border-[#EAC97E] inline-block shadow-xs"></span>
          </div>

          {/* Language Switcher Pill */}
          <button
            onClick={onOpenLangModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-xs text-[#775537] font-medium text-xs hover:bg-stone-50 active:scale-95 transition-all cursor-pointer border border-[#775537]/15"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">language</span>
            <span className="font-bold">{currentLang}</span>
            <span className="material-symbols-outlined text-[15px] opacity-70">expand_more</span>
          </button>
        </header>

        {/* Chibi Character Illustration in warm glow */}
        <div className="w-full flex items-center justify-center my-2 relative">
          <div className="w-36 h-28 flex items-center justify-center overflow-hidden rounded-full bg-[#FEF7DF]/60 p-2 shadow-xs border border-[#FBE29D]/40">
            <img
              alt="Friendly neighbours waving together"
              className="w-full h-full object-contain mix-blend-multiply scale-115 pointer-events-none select-none"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoVQMm_6TwzVnTSVoJat5qwmHCA4yohJ1fKFWxOCH4xwFWeSpjnOC4JRCRtRD8s-texm9juXgAnLsY3Pmub1hxqoWnwyZ2jboBD3xi7YQ35H4d1qSnGMpHw_al5CGS12Jm_UOfFF-Ppcy_Yh7g099g3MyfNmr8f2CGxuWZWha4szqAkjdWFt_5yvw2Y1HLuXy8Un6H8Se4YmrH_n5GhcTkWpl1Rwkc99R5gjYSJqQ6I3-8ameFEEBdt1aZtIPQoVO3ENI"
              loading="eager"
            />
          </div>
        </div>

        {/* Title and Intro */}
        <section className="text-center mb-3">
          <h1 className="text-[23px] font-extrabold text-[#775537] leading-tight tracking-tight">
            {t('signup.title')}
          </h1>
          <p className="text-[12px] text-[#775537]/80 mt-1 font-medium leading-relaxed">
            {t('signup.subtitle')}
          </p>
        </section>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="w-full space-y-2.5">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-[#775537] ml-1" htmlFor="signup-name">
              {t('signup.fullNameLabel')}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#775537]/70 pointer-events-none">
                <span className="material-symbols-outlined text-[17px]">person</span>
              </span>
              <input
                id="signup-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('signup.fullNamePlaceholder')}
                className="w-full rounded-full bg-white border border-[#E2DDD5] pl-11 pr-4 py-3 text-xs text-[#775537] placeholder:text-stone-400 font-medium shadow-xs focus:border-[#775537] focus:ring-1 focus:ring-[#775537] transition-all outline-none"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-[#775537] ml-1" htmlFor="signup-email">
              {t('signup.emailLabel')}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#775537]/70 pointer-events-none">
                <span className="material-symbols-outlined text-[17px]">mail</span>
              </span>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('signup.emailPlaceholder')}
                className="w-full rounded-full bg-white border border-[#E2DDD5] pl-11 pr-4 py-3 text-xs text-[#775537] placeholder:text-stone-400 font-medium shadow-xs focus:border-[#775537] focus:ring-1 focus:ring-[#775537] transition-all outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-[#775537] ml-1" htmlFor="signup-password">
              {t('signup.passwordLabel')}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#775537]/70 pointer-events-none">
                <span className="material-symbols-outlined text-[17px]">lock</span>
              </span>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('signup.passwordPlaceholder')}
                className="w-full rounded-full bg-white border border-[#E2DDD5] pl-11 pr-11 py-3 text-xs text-[#775537] placeholder:text-stone-400 font-medium shadow-xs focus:border-[#775537] focus:ring-1 focus:ring-[#775537] transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-[#775537]/60 hover:text-[#775537] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-[#775537] ml-1" htmlFor="signup-confirm-password">
              {t('signup.confirmPasswordLabel')}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#775537]/70 pointer-events-none">
                <span className="material-symbols-outlined text-[17px]">lock</span>
              </span>
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('signup.confirmPasswordPlaceholder')}
                className="w-full rounded-full bg-white border border-[#E2DDD5] pl-11 pr-11 py-3 text-xs text-[#775537] placeholder:text-stone-400 font-medium shadow-xs focus:border-[#775537] focus:ring-1 focus:ring-[#775537] transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 text-[#775537]/60 hover:text-[#775537] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2 pt-1 pl-1">
            <input
              id="signup-terms"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded-md border-2 border-[#775537]/60 text-[#775537] focus:ring-0 cursor-pointer accent-[#775537]"
            />
            <label htmlFor="signup-terms" className="text-[11px] text-[#775537]/85 font-medium leading-tight">
              {t('signup.termsAgreement')}{' '}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="font-bold underline text-[#775537] hover:text-[#5c4129] cursor-pointer"
              >
                {t('signup.termsOfService')}
              </button>{' '}
              {t('signup.and')}{' '}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="font-bold underline text-[#775537] hover:text-[#5c4129] cursor-pointer"
              >
                {t('signup.privacyPolicy')}
              </button>
              .
            </label>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-700 font-semibold text-center bg-rose-50 py-1.5 px-3 rounded-full border border-rose-200">
              {errorMsg}
            </p>
          )}

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-full bg-[#775537] py-3.5 px-6 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:bg-[#5c4129] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{t('signup.signUpBtn')}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>

      {/* Footer Switcher & Miniature Glyphs */}
      <footer className="w-full text-center pt-3 pb-1 z-10 space-y-2">
        <p className="text-xs text-[#775537]/85 font-medium">
          {t('signup.alreadyHaveAccount')}{' '}
          <button
            onClick={onGoToLogin}
            className="font-bold text-[#775537] underline hover:text-[#5c4129] cursor-pointer ml-0.5"
          >
            {t('signup.logIn')}
          </button>
        </p>

        {/* Miniature glyph footer matching design image */}
        <div className="flex items-center justify-center gap-2 opacity-50 text-[#775537] pt-1">
          <span className="material-symbols-outlined text-[13px]">notifications</span>
          <span className="w-1 h-1 rounded-full bg-[#775537] inline-block opacity-60"></span>
          <span className="material-symbols-outlined text-[13px]">eco</span>
        </div>
      </footer>

      {/* Terms & Privacy Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[#775537]/20 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#775537]">{t('signup.termsTitle')}</h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-7 h-7 rounded-full bg-[#f3f3f3] text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-[#50453c] leading-relaxed space-y-2 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#775537]/10 max-h-56 overflow-y-auto">
              <p className="font-bold text-[#775537]">1. Friendly Neighborhood Code</p>
              <p>SkillSpill is built on mutual trust, neighborly respect, and sharing of skills and lending a hand.</p>
              <p className="font-bold text-[#775537]">2. Address Privacy</p>
              <p>Your exact street address is never shown publicly. Only approximate neighborhood areas are visible.</p>
              <p className="font-bold text-[#775537]">3. Shared Wallet Safety</p>
              <p>Only verified members of your family group can view or redeem credits from the shared family wallet.</p>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 rounded-full bg-[#775537] text-white text-xs font-bold cursor-pointer"
            >
              {t('signup.termsGotIt')}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
