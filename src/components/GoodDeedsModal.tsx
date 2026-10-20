import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GoodDeed } from '../types';
import { getTranslatedGoodDeedMessage, getTranslatedGoodDeedTime } from '../utils/translationHelper';

interface GoodDeedModalProps {
  deeds: GoodDeed[];
  celebratedDeedIds: Set<string>;
  commentsCountMap: Record<string, number>;
  feedSharingOptIn: boolean;
  onToggleFeedSharing: (enabled: boolean) => void;
  onHideDeed: (deedId: string) => void;
  onRestoreDeed: (deedId: string) => void;
  onCelebrateDeed: (deedId: string) => void;
  onOpenComments: (deed: GoodDeed) => void;
  onSimulateDeed?: () => void;
  onClose: () => void;
  currentUserName: string;
}

export const GoodDeedsModal: React.FC<GoodDeedModalProps> = ({
  deeds,
  celebratedDeedIds,
  commentsCountMap,
  feedSharingOptIn,
  onToggleFeedSharing,
  onHideDeed,
  onRestoreDeed,
  onCelebrateDeed,
  onOpenComments,
  onSimulateDeed,
  onClose,
  currentUserName,
}) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<'all' | 'help' | 'workshop' | 'quest'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showHidden, setShowHidden] = useState(false);
  const [burstingDeedId, setBurstingDeedId] = useState<string | null>(null);

  // Filter deeds
  const filteredDeeds = deeds
    .filter((d) => {
      // Visibility filter
      if (!showHidden && d.hidden) return false;
      if (showHidden && !d.hidden) return false;

      // Category filter
      if (activeFilter === 'help' && d.type !== 'help_completed') return false;
      if (
        activeFilter === 'workshop' &&
        d.type !== 'workshop_published' &&
        d.type !== 'workshop_completed'
      )
        return false;
      if (
        activeFilter === 'quest' &&
        d.type !== 'group_quest_completed' &&
        d.type !== 'volunteer_completed'
      )
        return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const msg = getTranslatedGoodDeedMessage(t, d).toLowerCase();
        const actor = (d.actorName || '').toLowerCase();
        const activity = (d.activityTitle || '').toLowerCase();
        return msg.includes(q) || actor.includes(q) || activity.includes(q);
      }

      return true;
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  const hiddenCount = deeds.filter((d) => d.hidden).length;

  const handleCelebrateClick = (deed: GoodDeed) => {
    const isOwn = deed.isCurrentUser || deed.actorName === currentUserName;
    if (!isOwn) {
      setBurstingDeedId(deed.id);
      setTimeout(() => setBurstingDeedId(null), 900);
    }
    onCelebrateDeed(deed.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#fcfbf9] text-[#775537] rounded-3xl w-full max-w-[430px] max-h-[92vh] flex flex-col shadow-2xl border border-[#775537]/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Sticky Header */}
        <header className="px-5 py-4 border-b border-[#775537]/10 flex items-center justify-between bg-white/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FEF7DF] border border-[#FBE29D] flex items-center justify-center text-[#775537] shadow-xs">
              <span className="material-symbols-outlined text-[20px] fill text-amber-600">
                volunteer_activism
              </span>
            </div>
            <div>
              <h2 className="text-base font-black text-[#775537] leading-tight">
                {t('goodDeeds.title')}
              </h2>
              <p className="text-[11px] font-medium text-[#775537]/70">
                {t('goodDeeds.allFeedSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F4F2EE] hover:bg-[#eae8e3] text-[#775537] flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            type="button"
            aria-label={t('common.close')}
          >
            ✕
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Privacy & Trust Box */}
          <div className="bg-[#FEF7DF] rounded-2xl p-3.5 border border-[#FBE29D] shadow-2xs space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#775537] mt-0.5 shrink-0">
                  verified_user
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#775537]">
                    {t('goodDeeds.privacyTitle')}
                  </h4>
                  <p className="text-[11px] text-[#775537]/80 leading-relaxed mt-0.5">
                    {t('goodDeeds.privacyDesc')}
                  </p>
                </div>
              </div>

              {/* Opt-in Toggle */}
              <button
                type="button"
                onClick={() => onToggleFeedSharing(!feedSharingOptIn)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  feedSharingOptIn ? 'bg-[#775537]' : 'bg-[#775537]/25'
                }`}
                role="switch"
                aria-checked={feedSharingOptIn}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    feedSharingOptIn ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 border-t border-[#775537]/10 flex items-center gap-1.5 text-[10px] text-[#775537]/70">
              <span className="material-symbols-outlined text-[13px]">lock</span>
              <span>{t('goodDeeds.privacyNotice')}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#775537]/50">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('common.search')}
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#775537]/15 text-xs text-[#775537] placeholder-[#775537]/40 focus:outline-none focus:border-[#775537]/40 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-[#775537]/50 hover:text-[#775537]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => {
                setActiveFilter('all');
                setShowHidden(false);
              }}
              type="button"
              className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
                !showHidden && activeFilter === 'all'
                  ? 'bg-[#775537] text-white shadow-xs'
                  : 'bg-white border border-[#775537]/15 text-[#775537] hover:bg-[#F4F2EE]'
              }`}
            >
              {t('goodDeeds.filterAll')}
            </button>
            <button
              onClick={() => {
                setActiveFilter('help');
                setShowHidden(false);
              }}
              type="button"
              className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
                !showHidden && activeFilter === 'help'
                  ? 'bg-[#775537] text-white shadow-xs'
                  : 'bg-white border border-[#775537]/15 text-[#775537] hover:bg-[#F4F2EE]'
              }`}
            >
              {t('goodDeeds.filterHelp')}
            </button>
            <button
              onClick={() => {
                setActiveFilter('workshop');
                setShowHidden(false);
              }}
              type="button"
              className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
                !showHidden && activeFilter === 'workshop'
                  ? 'bg-[#775537] text-white shadow-xs'
                  : 'bg-white border border-[#775537]/15 text-[#775537] hover:bg-[#F4F2EE]'
              }`}
            >
              {t('goodDeeds.filterWorkshops')}
            </button>
            <button
              onClick={() => {
                setActiveFilter('quest');
                setShowHidden(false);
              }}
              type="button"
              className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
                !showHidden && activeFilter === 'quest'
                  ? 'bg-[#775537] text-white shadow-xs'
                  : 'bg-white border border-[#775537]/15 text-[#775537] hover:bg-[#F4F2EE]'
              }`}
            >
              {t('goodDeeds.filterQuests')}
            </button>

            {hiddenCount > 0 && (
              <button
                onClick={() => setShowHidden(!showHidden)}
                type="button"
                className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                  showHidden
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-white border border-[#775537]/15 text-[#775537]/70 hover:bg-[#F4F2EE]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">visibility_off</span>
                <span>{showHidden ? t('common.done') : `Hidden (${hiddenCount})`}</span>
              </button>
            )}
          </div>

          {/* Activity Feed Items */}
          {filteredDeeds.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-[#775537]/15 text-center space-y-2 shadow-xs">
              <span className="material-symbols-outlined text-4xl text-[#775537]/40">
                volunteer_activism
              </span>
              <p className="text-xs font-bold text-[#775537]">
                {showHidden ? 'No hidden activities' : t('goodDeeds.empty')}
              </p>
              <p className="text-[11px] text-[#775537]/70">
                {showHidden
                  ? 'Activities you hide from your feed will appear here.'
                  : t('goodDeeds.emptyDesc')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDeeds.map((deed) => {
                const message = getTranslatedGoodDeedMessage(t, deed);
                const timeStr = getTranslatedGoodDeedTime(t, deed.timeKey);
                const isUser = deed.isCurrentUser || deed.actorName === currentUserName;
                const isCelebrated = celebratedDeedIds.has(deed.id);
                const isBursting = burstingDeedId === deed.id;
                const commentCount = commentsCountMap[deed.id] || 0;

                return (
                  <div
                    key={deed.id}
                    className="bg-white rounded-2xl p-4 border border-[#775537]/15 shadow-xs hover:border-[#775537]/30 transition-all flex flex-col gap-3 relative"
                  >
                    {/* Top Row: Icon, Message, Details, Hide */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {/* Deed Icon Badge */}
                        <div
                          className="w-10 h-10 rounded-xl border border-[#775537]/20 flex items-center justify-center text-[#775537] shrink-0 shadow-2xs mt-0.5"
                          style={{ backgroundColor: deed.iconBg || '#FEF3D6' }}
                        >
                          <span className="material-symbols-outlined text-[20px]">{deed.icon}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
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

                            {deed.hidden && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                                {t('goodDeeds.activityHidden')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Hide or Restore Button */}
                      <div className="shrink-0">
                        {deed.hidden ? (
                          <button
                            onClick={() => onRestoreDeed(deed.id)}
                            className="text-[10px] font-bold text-[#775537] hover:underline cursor-pointer"
                            type="button"
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            onClick={() => onHideDeed(deed.id)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[#775537]/40 hover:text-[#775537] hover:bg-[#F4F2EE] transition-colors cursor-pointer"
                            title={t('goodDeeds.hideActivity')}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[15px]">visibility_off</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Bottom Row: Celebrate 🎉 and Comments 💬 */}
                    <div className="pt-2 border-t border-[#775537]/10 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 relative">
                        {/* Confetti micro-animation */}
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
                          className="text-[11px] font-semibold text-[#775537]/60 hover:text-[#775537] hover:underline cursor-pointer"
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

          {/* Quick Simulation Help for demo/testing */}
          {onSimulateDeed && (
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={onSimulateDeed}
                className="px-3.5 py-1.5 rounded-full bg-[#F4F2EE] hover:bg-[#eae8e3] text-[11px] font-bold text-[#775537] border border-[#775537]/15 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">add_circle</span>
                <span>Simulate Good Deed Activity</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="p-4 border-t border-[#775537]/10 bg-white/80 backdrop-blur-md flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-[#775537] text-white text-xs font-bold shadow-xs hover:bg-[#60442c] transition-colors cursor-pointer"
            type="button"
          >
            {t('common.done')}
          </button>
        </footer>
      </div>
    </div>
  );
};
