import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Step3FamilyScreenProps {
  onCreateFamily: () => void;
  onJoinFamily: (code: string) => void;
  onMaybeLater: () => void;
  onBack: () => void;
  currentLang: string;
  onOpenLangModal: () => void;
}

export const Step3FamilyScreen: React.FC<Step3FamilyScreenProps> = ({
  onCreateFamily,
  onJoinFamily,
  onMaybeLater,
  onBack,
  currentLang,
  onOpenLangModal,
}) => {
  const { t } = useTranslation();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = joinCode.trim().toUpperCase();
    if (!cleaned) {
      setErrorMsg(t('step3.errCode'));
      return;
    }
    onJoinFamily(cleaned);
    setShowJoinModal(false);
  };

  return (
    <main className="w-full max-w-[420px] min-h-screen md:min-h-[852px] flex flex-col justify-between bg-gradient-to-b from-[#FAF6F0] via-[#FAF8F5] to-[#f9f9f9] relative px-5 py-4 pb-8 overflow-hidden md:rounded-3xl md:shadow-2xl border-x md:border border-[#775537]/20 select-none">
      {/* Top Header Navigation Block */}
      <header className="w-full">
        <div className="flex justify-between items-center pt-2 pb-2">
          {/* Back Action Button */}
          <button
            onClick={onBack}
            aria-label={t('common.back')}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xs text-[#775537] border border-[#d3c4b9]/30 active:scale-95 transition-transform cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </button>

          {/* SkillSpill Wordmark */}
          <div className="flex items-center">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#fae19c] mr-2 mb-0.5 border border-[#775537]/20"></span>
            <span className="font-extrabold text-[22px] tracking-tight text-[#775537]">SkillSpill</span>
          </div>

          {/* Language Selector Badge */}
          <button
            onClick={onOpenLangModal}
            aria-label={t('common.selectLanguage')}
            className="h-9 px-3 rounded-full bg-white border border-[#d3c4b9]/40 shadow-xs flex items-center gap-1.5 text-[#775537] active:scale-95 transition-transform cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">language</span>
            <span className="text-xs font-bold tracking-tight">{currentLang}</span>
          </button>
        </div>

        {/* Step Counter & Progress Indicator */}
        <div className="mt-4 px-1">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#775537]/70">{t('common.stepOf', { step: 3, total: 3 })}</span>
            <span className="text-xs font-semibold text-[#775537]/70">{t('step3.stepTitle')}</span>
          </div>
          {/* Progress Bar (100% full for Step 3 of 3) */}
          <div className="w-full h-1.5 rounded-full bg-[#775537]/15 mt-2 overflow-hidden">
            <div className="h-full rounded-full bg-[#775537] transition-all duration-500 w-full"></div>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <section className="w-full my-auto py-4 flex flex-col items-center">
        {/* Minimalist Icon Badge */}
        <div className="w-16 h-16 rounded-full bg-[#fae19c]/60 flex items-center justify-center mx-auto text-[#775537] mb-3 shadow-xs border border-[#dcc582]/40">
          <span className="material-symbols-outlined text-3xl fill">diversity_3</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-2xl font-black text-[#775537] text-center tracking-tight font-display">
          {t('step3.title')}
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[#775537]/80 text-center max-w-xs mx-auto leading-relaxed mt-1.5 font-medium">
          {t('step3.subtitle')}
        </p>

        {/* Shared Wallet Explanation Panel */}
        <div className="w-full bg-[#C0DDDA]/35 border border-[#C0DDDA]/70 p-4 rounded-2xl my-5 flex items-start gap-3.5 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-white/85 text-[#775537] shadow-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#C0DDDA]/50">
            <span className="material-symbols-outlined text-[20px] fill">account_balance_wallet</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold text-[#775537] leading-tight">{t('step3.pooledCreditsTitle')}</span>
            <span className="text-xs text-[#775537]/85 mt-1 leading-snug">
              {t('step3.pooledCreditsDesc')}
            </span>
          </div>
        </div>

        {/* Family Setup Interaction Cards (Bento Stack) */}
        <div className="w-full flex flex-col gap-3">
          {/* Card 1: Create a Family Group */}
          <button
            onClick={onCreateFamily}
            className="w-full bg-white rounded-2xl p-4 border border-[#775537]/10 shadow-xs flex items-center justify-between text-left transition-all active:scale-[0.99] hover:border-[#775537]/30 group cursor-pointer"
            type="button"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-[#fae19c]/50 flex items-center justify-center text-[#775537] mr-3.5 shrink-0 group-hover:scale-105 transition-transform border border-[#dcc582]/30">
                <span className="material-symbols-outlined text-2xl fill">add_home</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-[#775537] leading-tight">{t('step3.createGroupBtn')}</h2>
                <p className="text-xs text-[#775537]/75 mt-0.5 leading-normal">{t('createFamily.subtitle')}</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#775537]/50 text-xl group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </button>

          {/* Card 2: Join a Family Group */}
          <button
            onClick={() => setShowJoinModal(true)}
            className="w-full bg-white rounded-2xl p-4 border border-[#775537]/10 shadow-xs flex items-center justify-between text-left transition-all active:scale-[0.99] hover:border-[#775537]/30 group cursor-pointer"
            type="button"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-[#C0DDDA]/50 flex items-center justify-center text-[#775537] mr-3.5 shrink-0 group-hover:scale-105 transition-transform border border-[#C0DDDA]/80">
                <span className="material-symbols-outlined text-2xl fill">groups</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-[#775537] leading-tight">{t('step3.joinWithCodeBtn')}</h2>
                <p className="text-xs text-[#775537]/75 mt-0.5 leading-normal">{t('step3.joinModalDesc')}</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#775537]/50 text-xl group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </button>
        </div>
      </section>

      {/* Bottom Action Section */}
      <footer className="w-full pt-4">
        <button
          onClick={onMaybeLater}
          className="w-full py-4 rounded-full bg-[#775537] text-white font-bold text-base shadow-md sticker-shadow hover:bg-[#604229] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          type="button"
        >
          <span>{t('step3.maybeLaterBtn')}</span>
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
        <p className="text-xs text-center text-[#775537]/70 mt-3 font-medium">
          {t('createFamily.inviteLater')}
        </p>
      </footer>

      {/* Join Family Code Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[#775537]/20 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#C0DDDA]/50 text-[#775537] flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-2xl fill">groups</span>
            </div>
            <h3 className="text-lg font-bold text-[#775537] mb-1">{t('step3.joinModalTitle')}</h3>
            <p className="text-xs text-[#775537]/70 mb-4">
              {t('step3.joinModalDesc')}
            </p>
            <form onSubmit={handleJoinSubmit} className="space-y-3">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value);
                  setErrorMsg('');
                }}
                placeholder={t('step3.joinCodePlaceholder')}
                className="w-full text-center tracking-widest text-lg font-mono font-bold uppercase rounded-full bg-[#FAF8F5] border-2 border-[#775537]/25 py-3 px-4 focus:outline-none focus:border-[#775537]"
                autoFocus
              />
              {errorMsg && <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 py-3 rounded-full bg-[#f3f3f3] text-xs font-bold text-[#775537] hover:bg-stone-200 cursor-pointer"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#775537] text-xs font-bold text-white hover:bg-[#5f4024] cursor-pointer shadow-xs"
                >
                  {t('step3.joinGroupSubmit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
