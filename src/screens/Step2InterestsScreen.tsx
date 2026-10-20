import React from 'react';
import { useTranslation } from 'react-i18next';
import { INTEREST_OPTIONS } from '../data/initialData';
import { getTranslatedInterest } from '../utils/translationHelper';

interface Step2InterestsScreenProps {
  selectedInterests: string[];
  setSelectedInterests: React.Dispatch<React.SetStateAction<string[]>>;
  onContinue: () => void;
  onSkip: () => void;
  onBack: () => void;
  currentLang: string;
  onOpenLangModal: () => void;
}

export const Step2InterestsScreen: React.FC<Step2InterestsScreenProps> = ({
  selectedInterests,
  setSelectedInterests,
  onContinue,
  onSkip,
  onBack,
  currentLang,
  onOpenLangModal,
}) => {
  const { t } = useTranslation();

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const count = selectedInterests.length;

  return (
    <main className="w-full max-w-[390px] min-h-screen md:min-h-[844px] bg-gradient-to-b from-[#FAF6F0] via-[#FAF8F5] to-[#F5EFEB] flex flex-col justify-between px-4 py-5 md:shadow-2xl sm:rounded-[44px] border-x md:border border-[#775537]/20 relative overflow-hidden select-none">
      {/* Decorative warm ambient glow blurs */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#fae19c]/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -left-20 w-48 h-48 bg-[#cbe8e5]/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full flex flex-col z-10">
        {/* 1. Header */}
        <header className="flex items-center justify-between w-full h-12 pt-1 pb-2">
          {/* Left: Back Button */}
          <button
            onClick={onBack}
            aria-label={t('common.back')}
            className="w-10 h-10 rounded-full bg-white border-[1.5px] border-[#775537]/25 flex items-center justify-center text-[#775537] sticker-shadow-sm active:scale-95 transition-transform duration-150 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>

          {/* Center: Brand Wordmark */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#fae19c] ring-1 ring-[#775537]/30 inline-block"></span>
            <span className="text-[20px] text-[#775537] tracking-tight font-extrabold">SkillSpill</span>
          </div>

          {/* Right: Language Selector */}
          <button
            onClick={onOpenLangModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border-[1.5px] border-[#775537]/25 text-[#775537] sticker-shadow-sm active:scale-95 transition-transform duration-150 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">language</span>
            <span className="text-[12px] font-bold">{currentLang}</span>
            <span className="material-symbols-outlined text-[16px] text-[#775537]/70">expand_more</span>
          </button>
        </header>

        {/* 2. Progress Tracker */}
        <section aria-label="Onboarding Progress" className="mt-4 w-full">
          <div className="flex justify-between items-center mb-1.5 px-0.5">
            <span className="text-[10px] uppercase tracking-wider text-[#775537]/70 font-bold">{t('common.stepOf', { step: 2, total: 3 })}</span>
            <span className="text-[11px] text-[#775537]/70 font-semibold">{t('step2.stepTitle')}</span>
          </div>
          {/* Progress Bar (filled 67%) */}
          <div className="w-full h-1.5 bg-[#E5DCD1] rounded-full overflow-hidden flex">
            <div className="h-full bg-[#775537] w-[67%] rounded-full transition-all duration-300"></div>
          </div>
        </section>

        {/* 3. Page Introduction */}
        <div className="text-center mb-4 mt-4">
          <h2 className="text-[24px] font-extrabold text-[#775537] tracking-tight">
            {t('step2.title')}
          </h2>
          <p className="text-[13px] text-[#50453c] font-medium mt-1 leading-snug">
            {t('step2.subtitle')}
          </p>
        </div>

        {/* 4. Interest Selection Header & Counter Badge */}
        <div className="mt-2 flex items-center justify-between px-1">
          <h3 className="text-[14px] font-bold text-[#775537]">
            {t('step2.sectionTitle')}
          </h3>
          <div className="px-2.5 py-0.5 rounded-full bg-[#fae19c]/70 border border-[#775537]/30 text-[#775537] text-[11px] font-bold flex items-center gap-1.5 transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-[#775537]"></span>
            <span>{t('step2.selectedCount', { count })}</span>
          </div>
        </div>

        {/* 5. 2-Column Grid of 8 Rounded Selectable Interest Cards */}
        <section aria-label="Interest Categories" className="mt-3 grid grid-cols-2 gap-2.5 pb-2">
          {INTEREST_OPTIONS.map((rawItem) => {
            const item = getTranslatedInterest(t, rawItem);
            const isSelected = selectedInterests.includes(item.id);
            const bgClass = isSelected
              ? item.id === 'gardening'
                ? 'bg-[#e2f0ee] border-[#775537] sticker-shadow'
                : 'bg-[#FEF3D6] border-[#775537] sticker-shadow'
              : 'bg-white border-[#EAE2D8] sticker-shadow-sm';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleInterest(item.id)}
                className={`group relative p-3 rounded-2xl border-[1.5px] text-left flex flex-col justify-between h-[100px] transition-all duration-150 active:scale-[0.98] cursor-pointer ${bgClass}`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="w-8 h-8 rounded-full bg-white/90 border border-[#775537]/20 flex items-center justify-center text-[#775537]">
                    <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                  </div>
                  {/* Checkmark badge */}
                  {isSelected && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#775537] text-white border border-[#775537]">
                      <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                    </span>
                  )}
                </div>
                <div className="mt-auto">
                  <span className="text-[13px] font-bold text-[#775537] block leading-tight">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-[#775537]/70 block mt-0.5">
                    {item.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </section>
      </div>

      {/* 6. Bottom Action Section */}
      <footer className="w-full pt-3 pb-1 flex flex-col items-center gap-2 z-10">
        {/* Primary Pill CTA */}
        <button
          onClick={onContinue}
          className="w-full h-[50px] rounded-full bg-[#775537] text-white text-[15px] font-bold flex items-center justify-center gap-2 sticker-shadow active:scale-[0.98] transition-all hover:bg-[#62452c] cursor-pointer"
          type="button"
        >
          <span>{t('step2.continueBtn')}</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>

        {/* Secondary Text CTA */}
        <button
          onClick={onSkip}
          className="py-1 text-[12px] font-bold text-[#775537]/75 hover:text-[#775537] transition-colors tracking-wide cursor-pointer"
          type="button"
        >
          {t('step2.skipBtn')}
        </button>

        {/* Bottom Safe Area & subtle accent dot */}
        <div className="pt-1 flex items-center justify-center gap-1.5 opacity-60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#775537]/30"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#fae19c] ring-1 ring-[#775537]/20"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#775537]/30"></span>
        </div>
      </footer>
    </main>
  );
};
