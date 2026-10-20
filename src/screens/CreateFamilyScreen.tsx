import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CreateFamilyScreenProps {
  initialName?: string;
  onCreateSuccess: (groupName: string) => void;
  onBack: () => void;
  currentLang: string;
  onOpenLangModal: () => void;
}

export const CreateFamilyScreen: React.FC<CreateFamilyScreenProps> = ({
  initialName = 'The Happy Family',
  onCreateSuccess,
  onBack,
  currentLang,
  onOpenLangModal,
}) => {
  const { t } = useTranslation();
  const [groupName, setGroupName] = useState(initialName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = groupName.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onCreateSuccess(trimmed);
    }, 600);
  };

  const isEnabled = groupName.trim().length > 0;

  return (
    <main className="w-full max-w-[390px] min-h-screen md:min-h-[844px] bg-[#fbf9f6] relative flex flex-col justify-between overflow-hidden sm:rounded-[44px] md:shadow-2xl border-x md:border border-[#775537]/20 select-none">
      {/* Cozy Warm Ambient Glow Layers */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#fae19c]/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 -right-20 w-72 h-72 bg-[#cbe8e5]/35 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 left-10 w-60 h-60 bg-[#fae19c]/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col h-full justify-between flex-1">
        {/* 1. Header */}
        <header className="w-full px-5 pt-6 pb-3 flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={onBack}
            aria-label={t('common.back')}
            className="w-10 h-10 rounded-full bg-white border border-[#d3c4b9]/60 flex items-center justify-center text-[#775537] shadow-xs active:scale-95 transition-transform duration-150 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </button>

          {/* Brand Wordmark with Warm Butter Dot */}
          <div className="flex items-center gap-1.5 font-bold text-[18px] text-[#5d3e22] tracking-tight">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fae19c] inline-block shadow-xs border border-[#775537]/20"></span>
            <span>SkillSpill</span>
          </div>

          {/* Language Pill Switcher */}
          <button
            onClick={onOpenLangModal}
            aria-label={t('common.selectLanguage')}
            className="h-8 px-2.5 rounded-full bg-white border border-[#d3c4b9]/60 flex items-center gap-1 text-[#775537] shadow-xs active:scale-95 transition-transform duration-150 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">language</span>
            <span className="text-[11px] uppercase font-bold tracking-wider">{currentLang}</span>
            <span className="material-symbols-outlined text-[14px] text-[#82756b]">expand_more</span>
          </button>
        </header>

        {/* Form Body */}
        <div className="px-6 flex-1 flex flex-col justify-center py-4 space-y-6">
          {/* 2. Heading Section */}
          <div className="flex flex-col items-center text-center">
            {/* House / Heart Badge with soft Nebula tint */}
            <div className="w-16 h-16 rounded-full bg-[#cbe8e5]/50 border border-[#afccc9] flex items-center justify-center mb-4 sticker-shadow">
              <span className="material-symbols-outlined text-[#775537] text-[32px] fill">other_houses</span>
            </div>
            <h1 className="text-[24px] font-extrabold text-[#775537] tracking-tight mb-2">
              {t('createFamily.title')}
            </h1>
            <p className="text-[14px] text-[#50453c] max-w-[270px] leading-relaxed">
              {t('createFamily.subtitle')}
            </p>
          </div>

          {/* 3. Family Group Name Input Section */}
          <form onSubmit={handleSubmit} className="w-full space-y-2">
            <label className="block text-[14px] font-bold text-[#775537] pl-1" htmlFor="group-name-input">
              {t('createFamily.inputLabel')}
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-[#82756b]/80 pointer-events-none text-[22px]">
                diversity_3
              </span>
              <input
                id="group-name-input"
                autoComplete="off"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder={t('createFamily.inputPlaceholder')}
                className="w-full bg-white text-[#1a1c1c] text-[15px] font-medium rounded-full pl-12 pr-5 py-3.5 border-2 border-[#d3c4b9]/70 placeholder:text-[#82756b]/60 shadow-xs focus:outline-none focus:border-[#775537] focus:ring-2 focus:ring-[#fae19c]/50 transition-all duration-150"
                type="text"
              />
            </div>
            <p className="text-[12px] text-[#50453c] pl-2">
              {t('createFamily.inputHint')}
            </p>
          </form>

          {/* 4. Shared Wallet Explanation Card */}
          <div className="w-full p-4 rounded-2xl bg-[#cbe8e5]/25 border border-[#afccc9]/50 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#afccc9]/60 flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[#775537] text-[22px] fill">
                account_balance_wallet
              </span>
            </div>
            <div className="space-y-0.5">
              <h2 className="text-[14px] font-bold text-[#775537]">
                {t('createFamily.walletTitle')}
              </h2>
              <p className="text-[12px] text-[#50453c] leading-relaxed">
                {t('createFamily.walletDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* 5. Bottom Action Section */}
        <footer className="w-full px-6 pb-9 pt-2">
          <button
            onClick={handleSubmit}
            disabled={!isEnabled || isSubmitting}
            className={`w-full py-4 rounded-full text-[14px] font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
              isEnabled && !isSubmitting
                ? 'cursor-pointer bg-[#775537] text-white shadow-md hover:bg-[#68492f] active:scale-[0.98] sticker-shadow'
                : 'cursor-not-allowed bg-[#d3c4b9] text-white opacity-75 shadow-none'
            }`}
            type="button"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                <span>{t('createFamily.creatingBtn')}</span>
              </>
            ) : (
              <>
                <span>{t('createFamily.createBtn')}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
          <p className="text-[12px] text-center text-[#775537]/70 mt-3 font-medium">
            {t('createFamily.inviteLater')}
          </p>
        </footer>
      </div>
    </main>
  );
};
