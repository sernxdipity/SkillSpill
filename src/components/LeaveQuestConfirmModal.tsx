import React from 'react';
import { useTranslation } from 'react-i18next';
import { CommunityQuest } from '../types';

interface LeaveQuestConfirmModalProps {
  quest: CommunityQuest;
  onConfirmLeave: () => void;
  onClose: () => void;
}

export const LeaveQuestConfirmModal: React.FC<LeaveQuestConfirmModalProps> = ({
  quest,
  onConfirmLeave,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl p-5 max-w-[360px] w-full border border-[#775537]/20 shadow-2xl text-[#775537] space-y-4 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-quest-title"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[22px]">logout</span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 id="leave-quest-title" className="text-sm font-black text-[#775537]">
              {t('quests.confirmLeaveTitle', { defaultValue: 'Leave this Quest?' })}
            </h4>
            <p className="text-xs font-semibold text-[#775537]/80 mt-1 leading-snug">
              {t('quests.confirmLeaveDesc', {
                title: quest.title,
                defaultValue: `Are you sure you want to leave "${quest.title}"? Your recorded contributions will remain in the community total.`,
              })}
            </p>
          </div>
        </div>

        <div className="p-3 bg-[#FAF8F5] border border-[#775537]/10 rounded-2xl text-xs space-y-1">
          <div className="flex items-center justify-between font-bold">
            <span>{quest.title}</span>
            <span>{quest.userContribution.toLocaleString()} {quest.unit} contributed</span>
          </div>
          <p className="text-[10px] text-[#775537]/60">
            {t('quests.durationDays', { current: quest.currentDay, total: quest.totalDurationDays })} ·{' '}
            {t('quests.daysRemaining', { days: quest.daysRemaining })}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#F4F2EE] hover:bg-[#eae8e3] text-xs font-bold text-[#775537] transition-colors cursor-pointer"
          >
            {t('quests.cancelBtn', { defaultValue: 'Cancel' })}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmLeave();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-xs font-bold text-white transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[15px]">logout</span>
            <span>{t('quests.confirmLeaveBtn', { defaultValue: 'Yes, Leave Quest' })}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
