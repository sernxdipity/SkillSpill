import React from 'react';
import { useTranslation } from 'react-i18next';

interface AllSetScreenProps {
  neighbourhood: string;
  onExplore: () => void;
  currentLang: string;
  onOpenLangModal: () => void;
}

export const AllSetScreen: React.FC<AllSetScreenProps> = ({
  neighbourhood,
  onExplore,
  currentLang,
  onOpenLangModal,
}) => {
  const { t } = useTranslation();
  const displayCommunity = neighbourhood || 'Maple Heights';

  return (
    <main className="w-full max-w-[390px] min-h-screen md:min-h-[844px] bg-gradient-to-b from-[#f9f9f9] to-[#f3f3f3] border-x md:border border-[#d3c4b9]/60 sm:rounded-[44px] md:shadow-2xl relative flex flex-col justify-between overflow-hidden select-none">
      {/* Top Header: Wordmark & Language Selector */}
      <header className="pt-6 px-4 pb-2 flex items-center justify-between w-full z-10">
        {/* Centered SkillSpill Wordmark with Butter Yellow Dot */}
        <div className="flex items-center space-x-1.5 pl-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#fae19c] border border-[#775537] inline-block"></span>
          <span className="text-[22px] font-extrabold text-[#775537] tracking-tight">SkillSpill</span>
        </div>

        {/* Language Selector Pill */}
        <button
          onClick={onOpenLangModal}
          aria-label={t('common.selectLanguage')}
          className="flex items-center space-x-1 px-3 py-1 bg-white border border-[#775537]/25 rounded-full text-[#775537] paper-stamp-shadow active:scale-95 transition-transform cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">language</span>
          <span className="text-[12px] font-bold">{currentLang}</span>
          <span className="material-symbols-outlined text-[14px]">expand_more</span>
        </button>
      </header>

      {/* Main Content Stage */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 text-center -mt-4">
        {/* Success Hero Graphic Container with Floating Sparkles */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Floating Butter Yellow Sparkle 1 (Top Left) */}
          <div className="absolute -top-3 -left-4 text-[#fae19c] sparkle-anim-1 pointer-events-none drop-shadow-xs">
            <span className="material-symbols-outlined fill text-[24px]">auto_awesome</span>
          </div>

          {/* Floating Butter Yellow Sparkle 2 (Top Right) */}
          <div className="absolute -top-1 -right-3 text-[#fae19c] sparkle-anim-2 pointer-events-none drop-shadow-xs">
            <span className="material-symbols-outlined fill text-[18px]">star</span>
          </div>

          {/* Floating Sparkle 3 (Bottom Left) */}
          <div className="absolute -bottom-1 -left-2 text-[#fae19c] sparkle-anim-3 pointer-events-none drop-shadow-xs">
            <span className="material-symbols-outlined fill text-[14px]">sparkles</span>
          </div>

          {/* Floating Mini Dot/Particle (Bottom Right) */}
          <div className="absolute bottom-2 -right-3 w-3 h-3 rounded-full bg-[#fae19c] border border-[#775537]/40 sparkle-anim-1 pointer-events-none"></div>

          {/* Hero Badge: Soft Nebula Teal wash with 2px Old Copper border */}
          <div className="w-28 h-28 rounded-full bg-[#cbe8e5] border-2 border-[#775537] flex items-center justify-center paper-stamp-shadow relative z-0">
            {/* Concentric subtle inner ring for tactile sticker feel */}
            <div className="w-24 h-24 rounded-full border border-[#775537]/30 border-dashed flex items-center justify-center bg-white/40">
              <span className="material-symbols-outlined text-[#775537] text-[44px] font-bold">check</span>
            </div>
          </div>
        </div>

        {/* Welcome Message Hierarchy */}
        <div className="max-w-[310px] space-y-2 mb-8">
          <h1 className="text-[26px] font-extrabold text-[#775537] tracking-tight font-display">
            {t('allSet.title')}
          </h1>
          <p className="text-[14px] text-[#775537]/90 leading-relaxed px-1 font-medium">
            {t('allSet.subtitle')}
          </p>
        </div>

        {/* Community Confirmation Card (Butter Yellow Pill/Card) */}
        <div className="w-full bg-[#fae19c] border-[1.5px] border-[#775537] rounded-2xl p-4 paper-stamp-shadow relative transition-all duration-200">
          <div className="flex items-center space-x-3 text-left">
            {/* House / Community Icon Frame */}
            <div className="w-12 h-12 rounded-full bg-white border-[1.5px] border-[#775537] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#775537] text-[24px]">home</span>
            </div>

            {/* Neighborhood Info */}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-[#775537] font-extrabold tracking-wider block">
                {t('allSet.yourCommunity')}
              </span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-[17px] text-[#775537] truncate font-bold">
                  {displayCommunity}
                </span>
              </div>
            </div>

            {/* Verified tick sticker badge */}
            <div className="w-6 h-6 rounded-full bg-[#cbe8e5] border border-[#775537] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[14px] text-[#775537] font-bold">done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Button Area with Safe Margin Padding */}
      <footer className="p-5 pb-8 w-full z-10">
        <button
          onClick={onExplore}
          className="w-full min-h-[52px] bg-[#775537] hover:bg-[#5c4129] text-white text-[15px] font-bold rounded-full border-2 border-[#775537] flex items-center justify-center space-x-2 paper-button-shadow active:translate-y-0.5 active:shadow-none transition-all duration-150 cursor-pointer"
          type="button"
        >
          <span className="tracking-wide">{t('allSet.exploreBtn')}</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </footer>
    </main>
  );
};
