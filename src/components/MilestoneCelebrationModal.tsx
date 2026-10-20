import React from 'react';
import { useTranslation } from 'react-i18next';
import { CommunityQuest } from '../types';

interface MilestoneCelebrationModalProps {
  quest: CommunityQuest;
  milestoneLevel: 25 | 50 | 75 | 100;
  onClose: () => void;
  onViewGoodDeeds?: () => void;
}

export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
  quest,
  milestoneLevel,
  onClose,
  onViewGoodDeeds,
}) => {
  const { t } = useTranslation();

  const isCompleted = milestoneLevel === 100;

  const milestoneInfo = {
    25: {
      badge: '🥉 25%',
      color: 'bg-amber-100 text-amber-900 border-amber-300',
      title: t('quests.milestone25', { defaultValue: '25% Community Milestone reached! 🥉' }),
    },
    50: {
      badge: '🥈 50%',
      color: 'bg-slate-100 text-slate-800 border-slate-300',
      title: t('quests.milestone50', { defaultValue: 'Halfway mark! 50% Community Milestone reached! 🥈' }),
    },
    75: {
      badge: '🥇 75%',
      color: 'bg-amber-100 text-amber-900 border-amber-300',
      title: t('quests.milestone75', { defaultValue: '75% Community Milestone reached! 🥇' }),
    },
    100: {
      badge: '🏆 100%',
      color: 'bg-yellow-200 text-yellow-950 border-yellow-400',
      title: t('quests.milestone100', { defaultValue: 'Quest Completed! 100% Community Goal Achieved! 🏆' }),
    },
  }[milestoneLevel];

  return (
    <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#775537]/20 shadow-2xl text-[#775537] space-y-4 animate-in zoom-in-95 duration-200 relative overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle decorative particles (respecting motion-reduce) */}
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-[#FBE29D]/40 rounded-full blur-xl pointer-events-none motion-reduce:hidden" />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-[#C0DDDA]/40 rounded-full blur-xl pointer-events-none motion-reduce:hidden" />

        {/* Milestone Icon / Badge */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="w-16 h-16 rounded-3xl bg-[#FEF7DF] border-2 border-[#FBE29D] flex items-center justify-center text-3xl shadow-sm motion-safe:animate-bounce">
            {isCompleted ? '🏆' : milestoneLevel >= 75 ? '🔥' : milestoneLevel >= 50 ? '🌟' : '🎉'}
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-black border ${milestoneInfo.color}`}>
            {milestoneInfo.badge}
          </span>

          <h3 className="text-lg font-black text-[#775537] tracking-tight leading-snug">
            {isCompleted
              ? t('quests.questCompletedTitle', { defaultValue: 'Quest Completed! 🎉' })
              : t('quests.milestoneCelebrationTitle', { defaultValue: 'Milestone Reached! 🎉' })}
          </h3>

          <p className="text-xs font-medium text-[#775537]/80 leading-relaxed px-2">
            {isCompleted
              ? t('quests.questCompletedDesc', {
                  defaultValue: 'Congratulations! You and your neighbours completed this challenge together.',
                })
              : milestoneInfo.title}
          </p>
        </div>

        {/* Quest Summary Card */}
        <div className="p-3.5 bg-[#FAF8F5] border border-[#775537]/15 rounded-2xl space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold">
            <span>{quest.title}</span>
            <span className="text-emerald-800">
              {quest.currentProgress.toLocaleString()} / {quest.target.toLocaleString()} {quest.unit}
            </span>
          </div>

          <div className="w-full bg-[#EAE7E1] rounded-full h-2 overflow-hidden flex p-0.5">
            <div
              className="bg-[#775537] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((quest.currentProgress / quest.target) * 100))}%` }}
            />
          </div>

          {/* Reward Badge if 100% completed */}
          {isCompleted && (
            <div className="mt-2 pt-2 border-t border-[#775537]/10 flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-[#FEF7DF] border border-[#FBE29D] flex items-center justify-center text-amber-800 text-lg shrink-0">
                <span className="material-symbols-outlined text-[20px]">{quest.rewardBadgeIcon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                  {t('quests.badgeAwardedTitle', {
                    title: quest.rewardBadgeTitle,
                    defaultValue: `Participation Badge: ${quest.rewardBadgeTitle}`,
                  })}
                </span>
                <span className="text-[10px] text-[#775537]/70 block leading-tight">
                  {t('quests.badgeAwardedNotice', {
                    defaultValue: 'Badge awarded. Spendable credits are not awarded for self-reported entries.',
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          {isCompleted && onViewGoodDeeds && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewGoodDeeds();
              }}
              className="w-full py-2.5 rounded-xl bg-[#FBE29D] hover:bg-[#fae19c] active:scale-98 text-xs font-bold text-[#775537] border border-[#775537]/25 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
              <span>{t('goodDeeds.title', { defaultValue: 'Community Good Deeds' })}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#775537] hover:bg-[#5c4129] active:scale-98 text-xs font-bold text-white transition-all shadow-xs cursor-pointer text-center"
          >
            {t('common.continue', { defaultValue: 'Continue' })}
          </button>
        </div>
      </div>
    </div>
  );
};
