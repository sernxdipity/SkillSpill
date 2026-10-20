import React from 'react';
import { useTranslation } from 'react-i18next';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
  currentLang: string;
  onOpenLangModal: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onLogin,
  currentLang,
  onOpenLangModal,
}) => {
  const { t } = useTranslation();

  return (
    <main className="w-full max-w-[412px] min-h-screen md:min-h-[852px] bg-[#f9f9f9] flex flex-col justify-between relative overflow-hidden md:rounded-3xl md:shadow-2xl border-x md:border border-[#775537]/20 select-none">
      {/* Playful Background Blobs & Storybook Doodles (Decorative Ambient) */}
      <div className="absolute -top-16 -left-14 w-48 h-48 rounded-full bg-[#fae19c]/40 blur-2xl pointer-events-none"></div>
      <div className="absolute top-1/3 -right-20 w-56 h-56 rounded-full bg-[#cbe8e5]/50 blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#fae19c]/30 blur-xl pointer-events-none"></div>

      {/* Top Safe Area & Header Navigation */}
      <header className="w-full pt-4 px-4 z-10">
        <div className="flex items-center justify-end">
          <button
            onClick={onOpenLangModal}
            aria-label="Change Language"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eeeeee] hover:bg-[#e2e2e2] text-[#50453c] transition-colors cursor-pointer active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">language</span>
            <span className="text-[12px] font-bold">{currentLang}</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
        </div>

        {/* App Branding Hero */}
        <div className="mt-4 text-center">
          <h1 className="font-display text-[38px] font-extrabold text-[#775537] tracking-tight drop-shadow-xs">
            SkillSpill
          </h1>
          <p className="text-[14px] text-[#50453c] font-medium mt-0.5 flex items-center justify-center gap-1.5">
            {t('welcome.tagline')}
          </p>
        </div>
      </header>

      {/* Main Central Illustration Showcase */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 my-2 relative z-10">
        <div className="w-full max-w-[380px] flex items-center justify-center p-0">
          <img
            alt={t('welcome.heroAlt')}
            className="w-full h-auto max-h-[400px] object-contain mix-blend-multiply"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvRpbRFh13_QVKZUXlwePMEpVmo4gKbqXuHKSKJ3mRribUcHABM0N7ZTj1vgehqHob4LvO8DbTUGSpN6gg23CSQPyBLWheDtdgMngzccFFY0dGzo3-Qyaxb8cvbX6eP9SMvKq25AGCv0aER6ZZWIhfHZ4NPTVKygEUZ9tUHdtOo6V70Zlzsgr-GOvv2uapjif4GH7-shqx09EjErglscDOu2_3nLmb-TaddPEtBBK2hgxZlPvCbqUv7V77ByA88ubIxlw"
            loading="eager"
          />
        </div>
        <p className="text-center text-[14px] font-medium text-[#50453c] max-w-[300px] mt-2 px-2 leading-relaxed">
          {t('welcome.description')}
        </p>
      </section>

      {/* Bottom Actions & Authentic Footer */}
      <footer className="w-full px-5 pb-6 pt-2 z-10 flex flex-col items-center">
        {/* Primary Stamp CTA Button */}
        <button
          onClick={onGetStarted}
          className="w-full h-14 bg-[#775537] text-white text-[17px] font-bold rounded-full flex items-center justify-center gap-2 hover:bg-[#63452b] active:translate-y-0.5 active:shadow-none transition-all duration-150 cursor-pointer shadow-md"
          type="button"
        >
          <span>{t('welcome.getStarted')}</span>
          <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
        </button>

        {/* Account Switcher Link */}
        <div className="mt-4 text-center">
          <p className="text-[14px] text-[#50453c]">
            {t('welcome.alreadyHaveAccount')}{' '}
            <button
              onClick={onLogin}
              className="text-[14px] text-[#775537] underline font-bold hover:text-[#5d3e22] active:opacity-75 transition-opacity cursor-pointer"
            >
              {t('welcome.logIn')}
            </button>
          </p>
        </div>

        {/* Subtle iOS style home indicator bar */}
        <div className="w-32 h-1 bg-[#775537]/20 rounded-full mt-4"></div>
      </footer>
    </main>
  );
};
