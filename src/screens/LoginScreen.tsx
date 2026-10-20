import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LoginScreenProps {
  onLoginSuccess: (email: string) => void;
  onGoToSignUp: () => void;
  onBack: () => void;
  currentLang: string;
  onOpenLangModal: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onGoToSignUp,
  onBack,
  currentLang,
  onOpenLangModal,
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    onLoginSuccess(email.trim());
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      setForgotSubmitted(false);
      setShowForgotModal(false);
      setForgotEmail('');
    }, 2000);
  };

  return (
    <main className="w-full max-w-[390px] min-h-screen md:min-h-[844px] bg-gradient-to-b from-[#FAF8F5] via-[#F7F6F2] to-[#F2EFEA] relative flex flex-col justify-between overflow-hidden sm:rounded-[44px] px-6 pt-5 pb-7 md:shadow-2xl border-x md:border border-[#775537]/20 select-none">
      {/* Ambient background glows */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#FBE29D]/45 blur-2xl pointer-events-none"></div>
      <div className="absolute top-1/3 -left-16 w-44 h-44 rounded-full bg-[#C0DDDA]/40 blur-2xl pointer-events-none"></div>

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

          {/* Brand Wordmark with Yellow Accent Dot */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBE29D] border border-[#EAC97E] inline-block shadow-xs"></span>
            <span className="text-xl font-bold tracking-tight text-[#775537]">SkillSpill</span>
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

        {/* Chibi Character Illustration */}
        <div className="w-full flex items-center justify-center my-3 relative">
          <div className="w-48 h-36 flex items-center justify-center overflow-hidden rounded-2xl relative">
            <img
              alt="Friendly neighbours welcoming you"
              className="w-full h-full object-contain mix-blend-multiply scale-110 pointer-events-none select-none"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoVQMm_6TwzVnTSVoJat5qwmHCA4yohJ1fKFWxOCH4xwFWeSpjnOC4JRCRtRD8s-texm9juXgAnLsY3Pmub1hxqoWnwyZ2jboBD3xi7YQ35H4d1qSnGMpHw_al5CGS12Jm_UOfFF-Ppcy_Yh7g099g3MyfNmr8f2CGxuWZWha4szqAkjdWFt_5yvw2Y1HLuXy8Un6H8Se4YmrH_n5GhcTkWpl1Rwkc99R5gjYSJqQ6I3-8ameFEEBdt1aZtIPQoVO3ENI"
              loading="eager"
            />
          </div>
        </div>

        {/* Title and Intro */}
        <section className="text-center mb-5">
          <h1 className="text-[24px] font-extrabold text-[#775537] leading-tight tracking-tight">
            {t('login.title')}
          </h1>
          <p className="text-[13px] text-[#775537]/80 mt-1 font-medium leading-relaxed">
            {t('login.subtitle')}
          </p>
        </section>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="w-full space-y-3.5">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#775537] ml-1" htmlFor="login-email">
              {t('login.emailLabel')}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#775537]/70 pointer-events-none">
                <span className="material-symbols-outlined text-[18px]">mail</span>
              </span>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('login.emailPlaceholder')}
                className="w-full rounded-full bg-white border border-[#E2DDD5] pl-11 pr-4 py-3.5 text-sm text-[#775537] placeholder:text-stone-400 font-medium shadow-xs focus:border-[#775537] focus:ring-1 focus:ring-[#775537] transition-all outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#775537] ml-1" htmlFor="login-password">
              {t('login.passwordLabel')}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#775537]/70 pointer-events-none">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login.passwordPlaceholder')}
                className="w-full rounded-full bg-white border border-[#E2DDD5] pl-11 pr-11 py-3.5 text-sm text-[#775537] placeholder:text-stone-400 font-medium shadow-xs focus:border-[#775537] focus:ring-1 focus:ring-[#775537] transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-[#775537]/60 hover:text-[#775537] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[19px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <div className="flex justify-end pr-1 pt-0.5">
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setShowForgotModal(true);
                }}
                className="text-xs font-semibold text-[#775537]/80 hover:text-[#775537] hover:underline cursor-pointer"
              >
                {t('login.forgotPassword')}
              </button>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full rounded-full bg-[#775537] py-3.5 px-6 text-white font-bold text-base shadow-md flex items-center justify-center gap-2 hover:bg-[#5c4129] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{t('login.logInBtn')}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>

      {/* Footer Switcher */}
      <footer className="w-full text-center pt-6 pb-2 z-10">
        <p className="text-xs text-[#775537]/85 font-medium">
          {t('login.newToApp')}{' '}
          <button
            onClick={onGoToSignUp}
            className="font-bold text-[#775537] underline hover:text-[#5c4129] cursor-pointer ml-0.5"
          >
            {t('login.signUp')}
          </button>
        </p>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[#775537]/20 text-center animate-in fade-in zoom-in-95 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FBE29D] text-[#775537] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">lock_reset</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#775537]">{t('login.resetTitle')}</h3>
              <p className="text-xs text-[#775537]/75 mt-1">
                {t('login.resetDesc')}
              </p>
            </div>

            {forgotSubmitted ? (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 font-semibold">
                {t('login.resetSent')}
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder={t('login.emailPlaceholder')}
                  className="w-full rounded-full bg-[#FAF8F5] border border-[#775537]/25 px-4 py-3 text-xs text-[#775537] outline-none focus:border-[#775537]"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 rounded-full bg-[#f3f3f3] text-xs font-bold text-[#775537] cursor-pointer"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-full bg-[#775537] text-white text-xs font-bold cursor-pointer"
                  >
                    {t('login.sendLink')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
