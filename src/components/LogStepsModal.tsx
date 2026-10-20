import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CommunityQuest } from '../types';

interface LogStepsModalProps {
  quest: CommunityQuest;
  userName: string;
  onLogContribution: (questId: string, amount: number, consentShare: boolean) => void;
  onClose: () => void;
}

export const LogStepsModal: React.FC<LogStepsModalProps> = ({
  quest,
  userName,
  onLogContribution,
  onClose,
}) => {
  const { t } = useTranslation();
  const [stepInput, setStepInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isReviewStep, setIsReviewStep] = useState<boolean>(false);
  const [consentShare, setConsentShare] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isStepQuest = quest.unit === 'steps';
  const presets = isStepQuest ? [500, 1000, 2500, 5000] : [1, 2, 3, 5];

  const handlePresetClick = (val: number) => {
    setStepInput(val.toString());
    setError(null);
  };

  const handleValidateAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = stepInput.trim();
    if (!trimmed) {
      setError(t('quests.validationPositiveInt', { defaultValue: 'Please enter a valid whole number greater than 0.' }));
      return;
    }

    const num = Number(trimmed);
    if (!Number.isInteger(num) || num <= 0 || isNaN(num)) {
      setError(t('quests.validationPositiveInt', { defaultValue: 'Please enter a valid whole number greater than 0.' }));
      return;
    }

    if (num > (isStepQuest ? 50000 : 100)) {
      setError(t('quests.validationMaxSteps', { defaultValue: 'Single entry cannot exceed limit.' }));
      return;
    }

    setError(null);
    setIsReviewStep(true);
  };

  const parsedAmount = Math.max(0, parseInt(stepInput.trim(), 10) || 0);
  const newPersonalTotal = quest.userContribution + parsedAmount;
  const newCommunityTotal = quest.currentProgress + parsedAmount;
  const newPercentage = Math.min(100, Math.round((newCommunityTotal / quest.target) * 100));

  const handleConfirmSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    onLogContribution(quest.id, parsedAmount, consentShare);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div
        className="bg-[#fcfbf9] text-[#775537] rounded-t-3xl sm:rounded-3xl w-full max-w-[430px] max-h-[90vh] flex flex-col shadow-2xl border-t sm:border border-[#775537]/20 overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="log-steps-modal-title"
      >
        {/* Handle for mobile */}
        <div className="sm:hidden w-12 h-1 bg-[#775537]/20 rounded-full mx-auto mt-2 mb-1" />

        {/* Modal Header */}
        <header className="px-5 py-3.5 border-b border-[#775537]/10 flex items-center justify-between bg-white/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FBE29D] border border-[#775537]/20 flex items-center justify-center text-[#775537]">
              <span className="material-symbols-outlined text-[19px]">{quest.icon}</span>
            </div>
            <div>
              <h3 id="log-steps-modal-title" className="text-sm font-black text-[#775537] leading-tight">
                {isReviewStep
                  ? t('quests.reviewStepSummary', { defaultValue: 'Review Your Contribution' })
                  : isStepQuest
                  ? t('quests.logMyStepsBtn', { defaultValue: 'Log My Steps' })
                  : t('quests.logContributionBtn', { defaultValue: 'Log Contribution' })}
              </h3>
              <p className="text-[10px] text-[#775537]/60 font-semibold">{quest.title}</p>
            </div>
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Demo Mode / Self-Reported Label */}
          <div className="p-3 bg-[#FEF7DF] border border-[#FBE29D] rounded-2xl flex items-start gap-2.5 shadow-2xs">
            <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0 mt-0.5">
              assignment
            </span>
            <div className="space-y-0.5">
              <span className="font-extrabold text-[11px] text-amber-900 block uppercase tracking-wider">
                {t('quests.selfReportedNotice', { defaultValue: 'Self-reported manual entry (Demo Mode)' })}
              </span>
              <p className="text-[11px] text-amber-950/80 leading-relaxed">
                {t('quests.selfReportedDisclaimer', {
                  defaultValue: 'Steps and contributions are self-reported in demo mode. No fitness tracker hardware required.',
                })}
              </p>
            </div>
          </div>

          {!isReviewStep ? (
            /* STEP 1: INPUT STEP */
            <form onSubmit={handleValidateAndProceed} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="steps-input" className="block text-xs font-bold text-[#775537]">
                  {isStepQuest
                    ? t('quests.enterStepsLabel', { defaultValue: 'Steps Completed Today' })
                    : t('quests.logContributionBtn', { defaultValue: 'Amount to Contribute' })}
                </label>

                <div className="relative">
                  <input
                    id="steps-input"
                    type="number"
                    min="1"
                    step="1"
                    value={stepInput}
                    onChange={(e) => {
                      setStepInput(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder={isStepQuest ? 'e.g. 1500' : 'e.g. 2'}
                    className="w-full bg-white border border-[#775537]/25 rounded-2xl py-3 px-4 text-sm font-bold text-[#775537] placeholder-[#775537]/40 focus:outline-hidden focus:border-[#775537] focus:ring-1 focus:ring-[#775537] shadow-2xs"
                    autoFocus
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-bold text-[#775537]/50 pointer-events-none">
                    {quest.unit}
                  </span>
                </div>

                {error && (
                  <p className="text-[11px] font-bold text-red-600 px-1 flex items-center gap-1 animate-in fade-in">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    <span>{error}</span>
                  </p>
                )}
              </div>

              {/* Presets */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-[#775537]/70 block">
                  {t('quests.quickPresets', { defaultValue: 'Quick Add:' })}
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {presets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handlePresetClick(val)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        stepInput === val.toString()
                          ? 'bg-[#775537] text-white border-[#775537]'
                          : 'bg-white hover:bg-[#FBE29D]/30 border-[#775537]/20 text-[#775537]'
                      }`}
                    >
                      +{val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Status Reference Card */}
              <div className="p-3 bg-[#FAF8F5] border border-[#775537]/10 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#775537]/70 font-semibold">{t('quests.yourContribution')}:</span>
                  <span className="font-bold text-[#775537]">{quest.userContribution.toLocaleString()} {quest.unit}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#775537]/70 font-semibold">{t('quests.communityTarget')}:</span>
                  <span className="font-bold text-[#775537]">
                    {quest.currentProgress.toLocaleString()} / {quest.target.toLocaleString()} {quest.unit}
                  </span>
                </div>
              </div>

              {/* Submit to review */}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#FBE29D] hover:bg-[#fae19c] active:scale-98 text-[#775537] font-extrabold text-xs border border-[#775537]/25 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{t('quests.reviewStepSummary', { defaultValue: 'Review Contribution' })}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </form>
          ) : (
            /* STEP 2: CONFIRMATION REVIEW */
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-white rounded-2xl p-4 border border-[#775537]/20 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#775537]/10">
                  <span className="text-xs font-bold text-[#775537]/70">
                    {t('quests.stepsToAdd', { defaultValue: 'Steps to log' })}:
                  </span>
                  <span className="text-base font-black text-[#775537] bg-[#FEF7DF] px-2.5 py-0.5 rounded-lg border border-[#FBE29D]">
                    +{parsedAmount.toLocaleString()} {quest.unit}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#775537]/70">
                    {t('quests.newPersonalTotal', { defaultValue: 'Your new contribution' })}:
                  </span>
                  <span className="font-bold text-[#775537]">
                    {quest.userContribution.toLocaleString()} →{' '}
                    <strong className="text-emerald-800 font-black">{newPersonalTotal.toLocaleString()}</strong> {quest.unit}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#775537]/70">
                    {t('quests.newCommunityTotal', { defaultValue: 'New community progress' })}:
                  </span>
                  <span className="font-bold text-[#775537]">
                    {newCommunityTotal.toLocaleString()} / {quest.target.toLocaleString()} ({newPercentage}%)
                  </span>
                </div>

                {/* Progress bar preview */}
                <div className="w-full bg-[#EAE7E1] rounded-full h-2 overflow-hidden mt-1 flex p-0.5">
                  <div
                    className="bg-[#775537] h-full rounded-full transition-all duration-300"
                    style={{ width: `${newPercentage}%` }}
                  />
                </div>
              </div>

              {/* Consent checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FAF8F5] border border-[#775537]/10 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentShare}
                  onChange={(e) => setConsentShare(e.target.checked)}
                  className="mt-0.5 rounded text-[#775537] focus:ring-[#775537] cursor-pointer"
                />
                <span className="text-[11px] font-semibold text-[#775537] leading-relaxed">
                  {t('quests.shareConsentLabel', {
                    defaultValue: 'Share team progress celebration to Community Good Deeds feed',
                  })}
                </span>
              </label>

              {/* Action buttons */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsReviewStep(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-2xl bg-[#F4F2EE] hover:bg-[#eae8e3] text-xs font-bold text-[#775537] transition-colors cursor-pointer text-center"
                >
                  {t('quests.backToEdit', { defaultValue: 'Back' })}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                  className="flex-2 py-3 rounded-2xl bg-[#775537] hover:bg-[#5c4129] active:scale-98 text-xs font-bold text-white transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{t('quests.loggingSteps', { defaultValue: 'Recording steps...' })}</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>{t('quests.confirmAndLogBtn', { defaultValue: 'Confirm & Record Steps' })}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
