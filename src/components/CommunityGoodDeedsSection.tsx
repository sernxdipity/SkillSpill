import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GoodDeed } from '../types';
import { getTranslatedGoodDeedMessage, getTranslatedGoodDeedTime } from '../utils/translationHelper';

interface CommunityGoodDeedsSectionProps {
  deeds: GoodDeed[];
  celebratedDeedIds: Set<string>;
  commentsCountMap: Record<string, number>;
  onSeeAll: () => void;
  onHideDeed: (deedId: string) => void;
  onCelebrateDeed: (deedId: string) => void;
  onOpenComments: (deed: GoodDeed) => void;
  currentUserName: string;
}

export const CommunityGoodDeedsSection: React.FC<CommunityGoodDeedsSectionProps> = ({
  deeds,
  celebratedDeedIds,
  commentsCountMap,
  onSeeAll,
  onHideDeed,
  onCelebrateDeed,
  onOpenComments,
  currentUserName,
}) => {
  const { t } = useTranslation();
  const [burstingDeedId, setBurstingDeedId] = useState<string | null>(null);

  // Filter out hidden deeds and take top 3 newest
  const visibleDeeds = deeds
    .filter((d) => !d.hidden)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3);

  const handleCelebrateClick = (deed: GoodDeed) => {
    const isOwn = deed.isCurrentUser || deed.actorName === currentUserName;
    if (!isOwn) {
      setBurstingDeedId(deed.id);
      setTimeout(() => setBurstingDeedId(null), 900);
    }
    onCelebrateDeed(deed.id);
  };

  return (
    <section className="space-y-3 pt-1">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FEF7DF] border border-[#FBE29D] flex items-center justify-center text-[#775537]">
            <span className="material-symbols-outlined text-[15px] fill text-amber-600">
              volunteer_activism
            </span>
          </div>
          <div>
            <h3 className="text-sm font-black text-[#775537] leading-none">
              {t('goodDeeds.title')}
            </h3>
          </div>
        </div>

        <button
          onClick={onSeeAll}
          className="text-xs font-bold text-[#775537] hover:underline cursor-pointer flex items-center gap-1 active:scale-95 transition-transform"
          type="button"
        >
          <span>{t('goodDeeds.seeAll')}</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>

      {/* Feed Cards List */}
      {visibleDeeds.length === 0 ? (
        <div className="bg-white rounded-2xl p-4 border border-[#775537]/15 text-center space-y-1 shadow-xs">
          <p className="text-xs font-bold text-[#775537]">{t('goodDeeds.empty')}</p>
          <p className="text-[11px] text-[#775537]/70">{t('goodDeeds.emptyDesc')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleDeeds.map((deed) => {
            const message = getTranslatedGoodDeedMessage(t, deed);
            const timeStr = getTranslatedGoodDeedTime(t, deed.timeKey);
            const isUser = deed.isCurrentUser || deed.actorName === currentUserName;
            const isCelebrated = celebratedDeedIds.has(deed.id);
            const isBursting = burstingDeedId === deed.id;
            const commentCount = commentsCountMap[deed.id] || 0;

            return (
              <div
                key={deed.id}
                className="bg-white rounded-2xl p-3.5 border border-[#775537]/15 shadow-xs hover:border-[#775537]/35 transition-all flex flex-col gap-3 group relative"
              >
                {/* Top Row: Icon, Message, Time, Hide */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Deed Icon Badge */}
                    <div
                      className="w-10 h-10 rounded-xl border border-[#775537]/20 flex items-center justify-center text-[#775537] shrink-0 shadow-2xs mt-0.5"
                      style={{ backgroundColor: deed.iconBg || '#FEF3D6' }}
                    >
                      <span className="material-symbols-outlined text-[20px]">{deed.icon}</span>
                    </div>

                    {/* Deed Message and Metadata */}
                    <div className="flex-1 min-w-0 pr-1">
                      <p className="text-xs font-semibold text-[#775537] leading-snug break-words">
                        {message}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-[#775537]/60 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">schedule</span>
                          {timeStr}
                        </span>

                        {isUser && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-[#FBE29D]/50 text-[#775537] border border-[#775537]/20">
                            {t('common.you', { defaultValue: 'You' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hide Activity Button */}
                  <button
                    onClick={() => onHideDeed(deed.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#775537]/40 hover:text-[#775537] hover:bg-[#F4F2EE] transition-colors cursor-pointer shrink-0"
                    title={t('goodDeeds.hideActivity')}
                    aria-label={t('goodDeeds.hideActivity')}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility_off</span>
                  </button>
                </div>

                {/* Bottom Row: Celebrate 🎉 & Comments 💬 Buttons */}
                <div className="pt-2 border-t border-[#775537]/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 relative">
                    {/* Confetti Burst Particle Micro-animation */}
                    {isBursting && (
                      <div className="absolute -top-6 left-6 pointer-events-none z-20 flex gap-1 motion-safe:animate-bounce">
                        <span className="text-sm">🎉</span>
                        <span className="text-xs">✨</span>
                        <span className="text-xs">🌟</span>
                      </div>
                    )}

                    {/* Celebrate Button */}
                    <button
                      onClick={() => handleCelebrateClick(deed)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs ${
                        isCelebrated
                          ? 'bg-[#FBE29D] border-[#775537]/40 text-[#775537] font-extrabold'
                          : 'bg-[#FEF7DF] border-[#FBE29D] text-[#775537] hover:bg-[#FBE29D]/50'
                      }`}
                      title={
                        isUser
                          ? t('goodDeeds.celebrateSelfError')
                          : isCelebrated
                          ? t('goodDeeds.celebrateRemoved')
                          : t('goodDeeds.celebrateBtn')
                      }
                      type="button"
                    >
                      <span className="text-sm">🎉</span>
                      <span>
                        {isCelebrated
                          ? t('goodDeeds.celebratedBtn')
                          : t('goodDeeds.celebrateBtn')}
                      </span>
                      <span className="px-1.5 py-0.2 rounded-full bg-white/70 text-[10px] font-black border border-[#775537]/20">
                        {deed.celebrations || 0}
                      </span>
                    </button>

                    {/* Comments Button */}
                    <button
                      onClick={() => onOpenComments(deed)}
                      className="px-3 py-1.5 rounded-full border border-[#775537]/20 bg-white hover:bg-[#F4F2EE] text-xs font-bold text-[#775537] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#775537]">
                        chat_bubble
                      </span>
                      <span>{t('goodDeeds.commentsBtn')}</span>
                      {commentCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#F4F2EE] text-[10px] font-black border border-[#775537]/15">
                          {commentCount}
                        </span>
                      )}
                    </button>
                  </div>

                  {commentCount > 0 && (
                    <button
                      onClick={() => onOpenComments(deed)}
                      className="text-[11px] font-semibold text-[#775537]/60 hover:text-[#775537] hover:underline cursor-pointer hidden sm:block"
                      type="button"
                    >
                      {t('goodDeeds.commentsCount', { count: commentCount })}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
