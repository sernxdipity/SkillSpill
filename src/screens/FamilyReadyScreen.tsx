import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FamilyReadyScreenProps {
  groupName: string;
  inviteCode: string;
  onContinue: () => void;
  onBack: () => void;
  currentLang: string;
  onOpenLangModal: () => void;
}

export const FamilyReadyScreen: React.FC<FamilyReadyScreenProps> = ({
  groupName,
  inviteCode,
  onContinue,
  onBack,
  currentLang,
  onOpenLangModal,
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join my family group on SkillSpill!`,
          text: `Join "${groupName}" on SkillSpill using my invitation code: ${inviteCode}`,
          url: window.location.href,
        });
      } catch {
        // user dismissed
      }
    } else {
      handleCopy();
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 2500);
    }
  };

  return (
    <main className="w-full max-w-[420px] min-h-screen md:min-h-[852px] flex flex-col justify-between px-4 pb-6 pt-3 relative bg-[#fdfaf7] md:rounded-3xl md:shadow-2xl border-x md:border border-[#775537]/20 select-none">
      {/* 1. Header */}
      <header className="flex items-center justify-between w-full h-14 relative z-10">
        {/* Left: Circular back button */}
        <button
          onClick={onBack}
          aria-label={t('common.back')}
          className="w-10 h-10 rounded-full bg-white border border-[#d3c4b9]/60 flex items-center justify-center text-[#775537] shadow-xs hover:bg-[#eeeeee] transition-transform active:scale-95 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>

        {/* Center: SkillSpill Wordmark with Butter Yellow Accent Dot */}
        <div className="flex items-center justify-center font-bold text-lg tracking-tight text-[#775537]">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#fae19c] mr-1.5 ring-1 ring-[#775537]/20"></span>
          <span>SkillSpill</span>
        </div>

        {/* Right: Language Dropdown Chip */}
        <button
          onClick={onOpenLangModal}
          aria-label={t('common.selectLanguage')}
          className="rounded-full px-3 py-1 bg-white border border-[#d3c4b9]/70 text-xs font-semibold text-[#775537] flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
          type="button"
        >
          <span>{currentLang}</span>
          <span className="material-symbols-outlined text-[16px] text-[#775537]/70">expand_more</span>
        </button>
      </header>

      {/* CONTENT BODY */}
      <div className="flex-1 flex flex-col items-center justify-center py-2">
        {/* 2. SUCCESS CONFIRMATION HERO */}
        <section className="flex flex-col items-center text-center mb-5 relative w-full">
          {/* Badge with playful sparkles around it */}
          <div className="relative flex items-center justify-center mb-3">
            {/* Ambient Butter Yellow sparkles */}
            <span className="material-symbols-outlined absolute -top-1.5 -left-4 text-[#dcc582] text-[20px] select-none fill sparkle-anim-1">
              kid_star
            </span>
            <span className="material-symbols-outlined absolute -bottom-1 -right-3 text-[#fae19c] text-[18px] select-none fill sparkle-anim-2">
              sparkles
            </span>
            <span className="material-symbols-outlined absolute top-2 -right-5 text-[#dcc582] text-[14px] select-none fill sparkle-anim-3">
              kid_star
            </span>
            {/* Main circular badge */}
            <div className="w-20 h-20 rounded-full bg-[#cbe8e5]/60 border-2 border-[#775537]/25 flex items-center justify-center paper-shadow">
              <span className="material-symbols-outlined text-[#775537] text-[40px] font-bold">check</span>
            </div>
          </div>

          <h1 className="text-[24px] font-extrabold text-[#775537] tracking-tight font-display">
            {t('familyReady.title')}
          </h1>
          <p className="text-[14px] text-[#50453c] max-w-[280px] mt-1 text-center font-medium leading-relaxed">
            {t('familyReady.subtitle')}
          </p>
        </section>

        {/* 3. FAMILY GROUP INFORMATION & INVITATION CARD */}
        <section className="w-full bg-white rounded-3xl p-5 border border-[#d3c4b9]/50 paper-shadow flex flex-col gap-3.5 text-center">
          {/* Group Header Details */}
          <div>
            <span className="text-[11px] font-bold text-[#82756b] tracking-wider block uppercase">
              {t('familyReady.familyGroupTag')}
            </span>
            <h2 className="text-[18px] font-extrabold text-[#775537] mt-0.5">{groupName}</h2>
            {/* Role Badge */}
            <div className="mt-2 inline-flex items-center gap-1.5 bg-[#fae19c]/40 border border-[#dcc582]/60 text-[#775537] px-3 py-1 rounded-full text-xs font-semibold mx-auto">
              <span className="material-symbols-outlined text-[15px] text-[#6e5d25] fill">verified_user</span>
              <span>{t('familyReady.adminBadge')}</span>
            </div>
          </div>

          {/* Subtle Dashed Divider */}
          <div className="w-full border-t border-dashed border-[#d3c4b9]/60 my-0.5"></div>

          {/* Invitation Code Box Area */}
          <div className="flex flex-col items-center">
            <span className="text-[12px] font-semibold text-[#82756b]">{t('familyReady.invitationCodeLabel')}</span>
            <div className="bg-[#fae19c] border-2 border-[#775537]/20 rounded-2xl py-3 px-7 shadow-inner my-2 inline-block">
              <span className="font-mono tracking-widest text-2xl font-black text-[#775537] select-all">
                {inviteCode}
              </span>
            </div>
            <p className="text-[12px] text-[#82756b] mt-0.5 font-medium">
              {t('familyReady.shareHint')}
            </p>
          </div>

          {/* Action Buttons Inside Card */}
          <div className="flex items-center gap-2.5 pt-1 w-full">
            <button
              onClick={handleCopy}
              className={`flex-1 text-xs font-bold py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 border transition-all active:scale-95 cursor-pointer ${
                copied
                  ? 'bg-[#cbe8e5] text-[#775537] border-[#775537]/30'
                  : 'bg-[#f3f3f3] hover:bg-[#eeeeee] text-[#775537] border-[#d3c4b9]/40'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? t('common.copied') : t('common.copyCode')}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex-1 bg-[#f3f3f3] hover:bg-[#eeeeee] text-[#775537] text-xs font-bold py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 border border-[#d3c4b9]/40 transition-transform active:scale-95 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              <span>{t('common.shareInvite')}</span>
            </button>
          </div>

          {sharedToast && (
            <div className="text-[11px] text-emerald-700 font-bold bg-emerald-50 py-1 px-3 rounded-full border border-emerald-200">
              {t('common.inviteCopiedToast')}
            </div>
          )}
        </section>

        {/* 4. SHARED WALLET REMINDER PANEL */}
        <section className="w-full bg-[#cbe8e5]/35 border border-[#afccc9]/70 rounded-2xl p-3.5 mt-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white border border-[#afccc9]/80 flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[#775537] text-[20px] fill">
              account_balance_wallet
            </span>
          </div>
          <div className="flex flex-col text-left">
            <h3 className="text-sm font-bold text-[#775537] leading-tight">{t('familyReady.sharedWalletTitle')}</h3>
            <p className="text-xs text-[#50453c] font-normal leading-snug mt-0.5">
              {t('familyReady.sharedWalletDesc')}
            </p>
          </div>
        </section>
      </div>

      {/* 5. BOTTOM SECTION */}
      <footer className="w-full pt-3 pb-1 flex flex-col items-center">
        <button
          onClick={onContinue}
          className="w-full bg-[#775537] hover:bg-[#62452c] text-white font-bold py-3.5 px-6 rounded-full text-base sticker-btn-shadow transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          type="button"
        >
          <span>{t('familyReady.continueBtn')}</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
        <span className="text-xs text-[#775537]/70 text-center font-medium mt-2.5">
          {t('familyReady.inviteMoreLater')}
        </span>
      </footer>
    </main>
  );
};
