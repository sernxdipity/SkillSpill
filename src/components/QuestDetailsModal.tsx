import React from 'react';
import { useTranslation } from 'react-i18next';
import { CommunityQuest } from '../types';

interface QuestDetailsModalProps {
  quest: CommunityQuest;
  userName: string;
  onJoinQuest: (questId: string) => void;
  onOpenLeaveConfirm: (quest: CommunityQuest) => void;
  onOpenLogContribution: (quest: CommunityQuest) => void;
  onClose: () => void;
}

export const QuestDetailsModal: React.FC<QuestDetailsModalProps> = ({
  quest,
  userName,
  onJoinQuest,
  onOpenLeaveConfirm,
  onOpenLogContribution,
  onClose,
}) => {
  const { t } = useTranslation();

  const pct = Math.min(100, Math.round((quest.currentProgress / quest.target) * 100));
  const isStepQuest = quest.unit === 'steps';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div
        className="bg-[#fcfbf9] text-[#775537] rounded-t-3xl sm:rounded-3xl w-full max-w-[430px] max-h-[90vh] flex flex-col shadow-2xl border-t sm:border border-[#775537]/20 overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Handle for mobile */}
        <div className="sm:hidden w-12 h-1 bg-[#775537]/20 rounded-full mx-auto mt-2 mb-1" />

        {/* Modal Header */}
        <header className="px-5 py-3.5 border-b border-[#775537]/10 flex items-center justify-between bg-white/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#775537]">emoji_events</span>
            <h3 className="text-sm font-black text-[#775537]">{t('quests.viewDetails', { defaultValue: 'Quest Details' })}</h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-7 h-7 rounded-full bg-[#F4F2EE] hover:bg-[#eae8e3] text-[#775537] flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
            aria-label={t('quests.closeModal', { defaultValue: 'Close' })}
          >
            ✕
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Illustration if available */}
          {quest.illustrationUrl && (
            <div className="w-full h-36 rounded-2xl overflow-hidden bg-white/80 border border-[#775537]/15 shadow-2xs flex items-center justify-center">
              <img
                src={quest.illustrationUrl}
                alt={quest.title}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>
          )}

          {/* Title & Tags */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${quest.tagColor || 'bg-[#eeeeee]'}`}>
                {t(quest.categoryLabelKey, { defaultValue: quest.category })}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF8F5] border border-[#775537]/15 text-[#775537]">
                {t('quests.durationDays', { current: quest.currentDay, total: quest.totalDurationDays })}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF7DF] border border-[#FBE29D] text-amber-900">
                {t('quests.daysRemaining', { days: quest.daysRemaining })}
              </span>
            </div>

            <h2 className="text-xl font-black text-[#775537] tracking-tight">{quest.title}</h2>
            <p className="text-xs text-[#775537]/80 font-medium leading-relaxed">{quest.description}</p>
          </div>

          {/* Progress Card (Single shared target) */}
          <div className="p-4 bg-white rounded-2xl border border-[#775537]/15 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#775537] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-amber-700">flag</span>
                <span>{t('quests.communityProgress')}:</span>
              </span>
              <span className="font-black text-sm text-[#775537]">
                {quest.currentProgress.toLocaleString()} / {quest.target.toLocaleString()} {quest.unit}
              </span>
            </div>

            {/* Percentage Bar */}
            <div className="w-full bg-[#EAE7E1] rounded-full h-3 overflow-hidden flex p-0.5">
              <div
                className="bg-[#775537] h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#775537]/75 font-semibold pt-0.5">
              <span>{t('quests.percentageCompleted', { pct })}</span>
              <span>{t('quests.participantsCount', { count: quest.participantsCount })}</span>
            </div>
          </div>

          {/* User's Contribution Spotlight */}
          <div className="p-3.5 bg-[#FAF8F5] border border-[#775537]/15 rounded-2xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#775537] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#775537]">person</span>
                <span>{t('quests.yourContribution')}:</span>
              </span>
              <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                {quest.userContribution.toLocaleString()} {quest.unit}
              </span>
            </div>
            {quest.isJoined ? (
              <p className="text-[10px] text-[#775537]/65">
                {quest.userContribution > 0
                  ? `You have contributed ${Math.round((quest.userContribution / quest.target) * 100)}% of the community goal!`
                  : 'You have joined this quest. Tap Log below to record your first contribution!'}
              </p>
            ) : (
              <p className="text-[10px] text-[#775537]/65">
                {t('quests.joinToLogPrompt', { defaultValue: 'Join this quest to contribute.' })}
              </p>
            )}
          </div>

          {/* Rules and Guidelines */}
          <div className="p-3.5 bg-white border border-[#775537]/10 rounded-2xl space-y-1">
            <h4 className="font-extrabold text-[#775537] text-[11px] uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">info</span>
              <span>{t('quests.rulesTitle', { defaultValue: 'Quest Guidelines & Rules' })}</span>
            </h4>
            <p className="text-[11px] text-[#775537]/80 leading-relaxed font-medium">{quest.detailedRules}</p>
          </div>

          {/* Team Contributors List */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#775537]">
                {isStepQuest
                  ? t('quests.walkingTeam', { defaultValue: 'Walking Team' })
                  : t('quests.teamContributors', { defaultValue: 'Team Contributors' })}
              </h4>
              <span className="text-[10px] font-semibold text-[#775537]/60">
                {quest.participants.length} listed
              </span>
            </div>

            <div className="bg-white rounded-2xl p-2 border border-[#775537]/15 shadow-2xs space-y-1.5">
              {quest.participants.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                    m.isCurrentUser
                      ? 'bg-[#FEF7DF] border border-[#FBE29D]'
                      : 'bg-[#FAF8F5] border border-[#775537]/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#FBE29D] border border-[#775537]/25 flex items-center justify-center text-[10px] font-black text-[#775537]">
                      {m.avatarInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#775537]">{m.name}</span>
                        {m.isCurrentUser && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#775537] text-white">
                            {t('common.you', { defaultValue: 'You' })}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-[#775537]/60 block">{m.role || 'Member'}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#775537]">
                    {m.contributedAmount.toLocaleString()} {quest.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <footer className="p-4 border-t border-[#775537]/10 bg-white shrink-0 flex items-center gap-2.5">
          {quest.isJoined ? (
            <>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLeaveConfirm(quest);
                }}
                className="px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer"
              >
                {t('quests.leaveQuestBtn', { defaultValue: 'Leave Quest' })}
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogContribution(quest);
                }}
                className="flex-1 py-3 rounded-2xl bg-[#FBE29D] hover:bg-[#fae19c] active:scale-98 text-[#775537] font-extrabold text-xs border border-[#775537]/25 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>
                  {isStepQuest
                    ? t('quests.logMyStepsBtn', { defaultValue: 'Log My Steps' })
                    : t('quests.logContributionBtn', { defaultValue: 'Log Contribution' })}
                </span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                onJoinQuest(quest.id);
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-[#775537] hover:bg-[#5c4129] active:scale-98 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">group_add</span>
              <span>{t('quests.joinQuestBtn', { defaultValue: 'Join Quest' })}</span>
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};
