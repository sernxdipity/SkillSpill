import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MainTab, CommunityQuest } from '../types';
import { LogStepsModal } from '../components/LogStepsModal';
import { LeaveQuestConfirmModal } from '../components/LeaveQuestConfirmModal';
import { QuestDetailsModal } from '../components/QuestDetailsModal';
import { MilestoneCelebrationModal } from '../components/MilestoneCelebrationModal';

interface QuestsScreenProps {
  userName: string;
  neighbourhood: string;
  communityQuests: CommunityQuest[];
  onLogContribution: (questId: string, amount: number, consentShare: boolean) => void;
  onToggleJoinQuest: (questId: string, join: boolean) => void;
  onOpenNeighbourhoodModal: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  onShowToast: (msg: string) => void;
  onOpenGoodDeeds?: () => void;
  recentMilestone?: { quest: CommunityQuest; level: 25 | 50 | 75 | 100 } | null;
  onClearRecentMilestone?: () => void;
}

export const QuestsScreen: React.FC<QuestsScreenProps> = ({
  userName,
  neighbourhood,
  communityQuests,
  onLogContribution,
  onToggleJoinQuest,
  onOpenNeighbourhoodModal,
  onOpenNotifications,
  unreadCount,
  activeTab,
  onTabChange,
  onShowToast,
  onOpenGoodDeeds,
  recentMilestone,
  onClearRecentMilestone,
}) => {
  const { t } = useTranslation();

  // Tabs: 'explore' vs 'my_quests'
  const [subTab, setSubTab] = useState<'explore' | 'my_quests'>('explore');

  // Sub-filter under 'my_quests': 'active' vs 'completed'
  const [myQuestsSubFilter, setMyQuestsSubFilter] = useState<'active' | 'completed'>('active');

  // Filter type under explore
  const [filterType, setFilterType] = useState<'all' | 'fitness' | 'green' | 'learning' | 'eco' | 'joined'>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Selected quest for Details Modal
  const [selectedQuest, setSelectedQuest] = useState<CommunityQuest | null>(null);

  // Modal states
  const [loggingQuest, setLoggingQuest] = useState<CommunityQuest | null>(null);
  const [leavingQuest, setLeavingQuest] = useState<CommunityQuest | null>(null);

  // Find the primary featured walking quest (Walk Together!)
  const walkingQuest = communityQuests.find((q) => q.id === 'quest-walk-weekly') || communityQuests[0];

  // Filtered explore quests
  const filteredQuests = communityQuests.filter((q) => {
    if (filterType === 'fitness') return q.category === 'fitness';
    if (filterType === 'green') return q.category === 'green';
    if (filterType === 'learning') return q.category === 'learning';
    if (filterType === 'eco') return q.category === 'eco';
    if (filterType === 'joined') return q.isJoined;
    return true;
  });

  // Filtered my quests
  const joinedQuests = communityQuests.filter((q) => q.isJoined);
  const activeJoinedQuests = joinedQuests.filter((q) => !q.isCompleted);
  const completedJoinedQuests = joinedQuests.filter((q) => q.isCompleted);

  const handleJoinClick = (quest: CommunityQuest, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onToggleJoinQuest(quest.id, true);
  };

  return (
    <div className="w-full max-w-[420px] min-h-screen md:min-h-[852px] bg-[#fcfbf9] text-[#775537] flex flex-col justify-between relative overflow-hidden md:rounded-3xl md:shadow-2xl border-x md:border border-[#775537]/20 select-none pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full bg-[#fcfbf9]/95 backdrop-blur-md px-5 pt-3 pb-3 flex items-center justify-between border-b border-[#775537]/10">
        <div className="flex items-center gap-1.5 cursor-pointer">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FBE29D] border border-[#775537]/30 inline-block shadow-xs" />
          <span className="font-bold text-xl tracking-tight text-[#775537]">SkillSpill</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNeighbourhoodModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#775537]/20 bg-white/70 text-xs font-semibold text-[#775537] shadow-xs cursor-pointer hover:bg-white transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px] text-[#775537]/80">location_on</span>
            <span>{neighbourhood || 'Maple Heights'}</span>
            <span className="material-symbols-outlined text-[15px] text-[#775537]/60">arrow_drop_down</span>
          </button>

          <button
            onClick={onOpenNotifications}
            aria-label={t('notifications.title')}
            className="w-8 h-8 rounded-full border border-[#775537]/20 bg-white/70 flex items-center justify-center text-[#775537] hover:bg-white shadow-xs transition-colors relative cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] border border-white" />
            )}
          </button>
        </div>
      </header>

      {/* Main Quests Stream */}
      <main className="flex-1 w-full px-5 pt-3 space-y-3.5">
        {/* Page Title & Tagline */}
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight text-[#775537]">{t('quests.title')}</h1>
          <p className="text-xs font-medium text-[#775537]/70">
            {t('quests.subtitle', { defaultValue: 'Achieve goals together and celebrate neighbourhood milestones' })}
          </p>
        </div>

        {/* Demo Mode / Single-Source Banner */}
        <div className="px-3 py-1.5 bg-[#FEF7DF]/80 border border-[#FBE29D] rounded-full flex items-center justify-between text-[10px] font-bold text-amber-900 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t('quests.demoNotice', { defaultValue: 'Demo Mode · Simulated Township Data' })}</span>
          </div>
          <span className="text-amber-800/70 font-semibold">Self-Reported Entry</span>
        </div>

        {/* Segmented Pill Switcher: [Explore] vs [My Quests] */}
        <div className="w-full bg-[#eeeeee] p-1 rounded-full flex items-center gap-1 shadow-xs">
          <button
            onClick={() => setSubTab('explore')}
            className={`flex-1 py-2 px-3 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 cursor-pointer ${
              subTab === 'explore'
                ? 'bg-[#775537] text-white shadow-xs'
                : 'text-[#775537]/80 hover:text-[#775537]'
            }`}
            type="button"
          >
            {t('quests.exploreTab')}
          </button>

          <button
            onClick={() => setSubTab('my_quests')}
            className={`flex-1 py-2 px-3 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 cursor-pointer relative ${
              subTab === 'my_quests'
                ? 'bg-[#775537] text-white shadow-xs'
                : 'text-[#775537]/80 hover:text-[#775537]'
            }`}
            type="button"
          >
            <span>{t('quests.myQuestsTab')}</span>
            {joinedQuests.length > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                subTab === 'my_quests' ? 'bg-[#FBE29D] text-[#775537]' : 'bg-[#775537]/20 text-[#775537]'
              }`}>
                {joinedQuests.length}
              </span>
            )}
          </button>
        </div>

        {/* ================= VIEW 1: EXPLORE TAB ================= */}
        {subTab === 'explore' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Quest of the Week Section Header */}
            <div className="flex items-center gap-1 text-[#775537] font-bold text-sm pt-0.5">
              <span>{t('quests.questOfWeek')}</span>
            </div>

            {/* Featured Mission Card: Walking Quest with Single Shared Target (50,000 steps) */}
            {walkingQuest && (
              <div
                onClick={() => setSelectedQuest(walkingQuest)}
                className="w-full bg-[#FCE7A6] rounded-[28px] p-4.5 border border-[#775537]/15 shadow-xs relative overflow-hidden space-y-3 cursor-pointer hover:border-[#775537]/30 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/85 text-[#775537] text-[10px] font-extrabold tracking-wider uppercase border border-[#775537]/15">
                    {t('quests.questOfWeek')}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-white border border-[#775537]/20 flex items-center justify-center text-[#775537] shadow-xs">
                    <span className="material-symbols-outlined text-[20px]">{walkingQuest.icon}</span>
                  </div>
                </div>

                {/* Title & Metadata */}
                <div className="space-y-1">
                  <h3 className="text-[19px] font-black text-[#775537] leading-tight tracking-tight">
                    {walkingQuest.title}
                  </h3>
                  <p className="text-xs text-[#775537]/80 font-medium leading-relaxed">
                    {walkingQuest.description}
                  </p>
                </div>

                {/* Shared Community Progress (50,000 steps consistent) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#775537]">
                    <span>
                      {walkingQuest.currentProgress.toLocaleString()} / {walkingQuest.target.toLocaleString()} {walkingQuest.unit}
                    </span>
                    <span className="font-extrabold text-sm">
                      {Math.min(100, Math.round((walkingQuest.currentProgress / walkingQuest.target) * 100))}%
                    </span>
                  </div>

                  <div className="w-full bg-white/70 rounded-full h-2.5 overflow-hidden border border-[#775537]/10 p-0.5 flex">
                    <div
                      className="bg-[#775537] h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (walkingQuest.currentProgress / walkingQuest.target) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Footer: Neighbours joined & Action Button */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#775537] font-semibold">
                    <span className="material-symbols-outlined text-[16px] text-[#775537]">group</span>
                    <span>{t('quests.participantsJoined', { count: walkingQuest.participantsCount })}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {walkingQuest.isJoined ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSubTab('my_quests');
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-50 text-[#775537] text-xs font-bold border border-[#775537]/20 shadow-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                        type="button"
                      >
                        <span>{t('quests.alreadyJoinedBadge', { defaultValue: 'Joined ✓' })}</span>
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleJoinClick(walkingQuest, e)}
                        className="px-3.5 py-1.5 rounded-full bg-[#775537] hover:bg-[#5c4129] text-white text-xs font-bold shadow-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                        type="button"
                      >
                        <span>{t('quests.joinWeeklyQuest')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Section: More Quests with Category Filters */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#775537]">{t('quests.title')}</h3>
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="px-3 py-1 rounded-full bg-white border border-[#775537]/20 text-xs font-medium text-[#775537] flex items-center gap-1 shadow-xs hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#775537]/70">tune</span>
                  <span className="capitalize">{filterType === 'all' ? t('common.all') : filterType}</span>
                </button>
              </div>

              {/* List of Quest Cards */}
              <div className="space-y-2.5">
                {filteredQuests.map((q) => {
                  const pct = Math.min(100, Math.round((q.currentProgress / q.target) * 100));

                  return (
                    <div
                      key={q.id}
                      onClick={() => setSelectedQuest(q)}
                      className="bg-white rounded-2xl p-3.5 border border-[#775537]/15 shadow-xs hover:border-[#775537]/35 transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className="w-11 h-11 rounded-2xl border border-[#775537]/15 flex items-center justify-center text-[#775537] shrink-0 shadow-2xs"
                          style={{ backgroundColor: q.iconBg || '#FEF3D6' }}
                        >
                          <span className="material-symbols-outlined text-[20px]">{q.icon}</span>
                        </div>

                        <div className="min-w-0 space-y-0.5 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-[#775537] truncate">{q.title}</h4>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                q.isJoined
                                  ? 'bg-[#C0DDDA]/70 text-[#2f4947]'
                                  : q.tagColor || 'bg-[#eeeeee] text-[#775537]/80'
                              }`}
                            >
                              {q.isJoined ? `✓ ${t('quests.alreadyJoinedBadge')}` : t(q.categoryLabelKey, { defaultValue: q.category })}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-[#775537]/70">
                            <span className="material-symbols-outlined text-[13px]">schedule</span>
                            <span>{q.timeStr}</span>
                          </div>

                          {/* Mini Progress Bar */}
                          <div className="flex items-center gap-2 pt-0.5">
                            <div className="w-24 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-[#775537] h-full rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-[#775537]/70 font-semibold">
                              {q.currentProgress.toLocaleString()} / {q.target.toLocaleString()} {q.unit} ({pct}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="material-symbols-outlined text-[#775537]/50 text-[18px] group-hover:translate-x-0.5 transition-transform shrink-0">
                        chevron_right
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 2: MY QUESTS TAB ================= */}
        {subTab === 'my_quests' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Sub-filter: Active vs Completed */}
            <div className="flex items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => setMyQuestsSubFilter('active')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  myQuestsSubFilter === 'active'
                    ? 'bg-[#775537] text-white shadow-xs'
                    : 'bg-white border border-[#775537]/15 text-[#775537]/80 hover:bg-[#FAF8F5]'
                }`}
              >
                {t('quests.activeQuests', { defaultValue: 'Active Quests' })} ({activeJoinedQuests.length})
              </button>

              <button
                type="button"
                onClick={() => setMyQuestsSubFilter('completed')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  myQuestsSubFilter === 'completed'
                    ? 'bg-[#775537] text-white shadow-xs'
                    : 'bg-white border border-[#775537]/15 text-[#775537]/80 hover:bg-[#FAF8F5]'
                }`}
              >
                {t('quests.completedQuests', { defaultValue: 'Completed Quests' })} ({completedJoinedQuests.length})
              </button>
            </div>

            {/* Empty State if no quests */}
            {myQuestsSubFilter === 'active' && activeJoinedQuests.length === 0 && (
              <div className="py-12 px-4 text-center bg-white rounded-3xl border border-[#775537]/15 space-y-3 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-[#FEF7DF] border border-[#FBE29D] flex items-center justify-center mx-auto text-[#775537]">
                  <span className="material-symbols-outlined text-3xl">emoji_events</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-[#775537]">
                    {t('quests.noActiveQuests', { defaultValue: 'No active quests joined yet' })}
                  </h3>
                  <p className="text-xs text-[#775537]/70">
                    {t('quests.noActiveQuestsDesc', { defaultValue: 'Explore available quests and team up with your neighbours!' })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubTab('explore')}
                  className="px-4 py-2 rounded-full bg-[#FBE29D] hover:bg-[#fae19c] text-xs font-bold text-[#775537] border border-[#775537]/20 shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  {t('quests.exploreTab', { defaultValue: 'Explore Quests' })} →
                </button>
              </div>
            )}

            {myQuestsSubFilter === 'completed' && completedJoinedQuests.length === 0 && (
              <div className="py-12 px-4 text-center bg-white rounded-3xl border border-[#775537]/15 space-y-3 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-[#FEF7DF] border border-[#FBE29D] flex items-center justify-center mx-auto text-[#775537]">
                  <span className="material-symbols-outlined text-3xl">military_tech</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-[#775537]">
                    {t('quests.noCompletedQuests', { defaultValue: 'No completed quests yet' })}
                  </h3>
                  <p className="text-xs text-[#775537]/70">
                    {t('quests.noCompletedQuestsDesc', { defaultValue: 'Keep going! Team achievements will appear here when completed.' })}
                  </p>
                </div>
              </div>
            )}

            {/* ACTIVE QUESTS LIST IN MY QUESTS */}
            {myQuestsSubFilter === 'active' &&
              activeJoinedQuests.map((q) => {
                const pct = Math.min(100, Math.round((q.currentProgress / q.target) * 100));
                const isStepQuest = q.unit === 'steps';
                const remaining = Math.max(0, q.target - q.currentProgress);

                return (
                  <div key={q.id} className="space-y-4">
                    {/* Chibi Walking Team Illustration Card (only for walk or if has illustration) */}
                    {q.illustrationUrl && (
                      <div className="w-full bg-[#FAF8F5] rounded-3xl p-3 border border-[#775537]/15 shadow-xs flex flex-col items-center justify-center overflow-hidden">
                        <div className="w-full h-44 overflow-hidden rounded-2xl flex items-center justify-center bg-white/70">
                          <img
                            alt={`${q.title} illustration`}
                            className="w-full h-full object-cover rounded-xl select-none pointer-events-none"
                            src={q.illustrationUrl}
                            loading="eager"
                          />
                        </div>
                      </div>
                    )}

                    {/* Quest Details & Progress Card */}
                    <div className="w-full bg-white rounded-3xl p-4.5 border border-[#775537]/15 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-9 h-9 rounded-2xl border border-[#775537]/20 flex items-center justify-center text-[#775537]"
                            style={{ backgroundColor: q.iconBg || '#FBE29D' }}
                          >
                            <span className="material-symbols-outlined text-[19px]">{q.icon}</span>
                          </div>
                          <div>
                            <span className="text-sm font-bold text-[#775537] block leading-tight">{q.title}</span>
                            <span className="text-[10px] text-[#775537]/60 font-semibold">
                              {t('quests.durationDays', { current: q.currentDay, total: q.totalDurationDays })} ·{' '}
                              {t('quests.daysRemaining', { days: q.daysRemaining })}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setLeavingQuest(q)}
                          className="px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-200 transition-colors cursor-pointer"
                        >
                          {t('quests.leaveQuestBtn', { defaultValue: 'Leave' })}
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#775537]/80 font-medium leading-relaxed">
                        {q.description}
                      </p>

                      {/* Big Unified Community Stat */}
                      <div className="pt-1">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-[#775537] tracking-tight">
                              {q.currentProgress.toLocaleString()}
                            </span>
                            <span className="text-xs font-semibold text-[#775537]/60">
                              / {q.target.toLocaleString()} {q.unit}
                            </span>
                          </div>
                          <span className="text-sm font-black text-[#775537]">{pct}%</span>
                        </div>

                        {/* Progress bar capped at 100% */}
                        <div className="w-full bg-[#EAE7E1] rounded-full h-3 overflow-hidden mt-2 flex p-0.5">
                          <div
                            className="bg-[#C0DDDA] h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        {/* Remaining stat */}
                        <p className="text-xs text-[#775537]/75 font-medium mt-1.5 flex items-center justify-between">
                          <span>
                            {remaining > 0
                              ? `Just ${remaining.toLocaleString()} more ${q.unit} to goal!`
                              : 'Goal reached! Amazing community effort! 🎉'}
                          </span>
                          <span className="text-[11px] font-semibold text-[#775537]/60">
                            {t('quests.participantsCount', { count: q.participantsCount })}
                          </span>
                        </p>
                      </div>

                      {/* Milestone Progress Indicators (25%, 50%, 75%, 100%) */}
                      <div className="pt-2 border-t border-[#775537]/10">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#775537]/70 block mb-1.5">
                          Township Milestones
                        </span>
                        <div className="grid grid-cols-4 gap-1.5 text-center">
                          {[25, 50, 75, 100].map((level) => {
                            const reached = pct >= level;
                            return (
                              <div
                                key={level}
                                className={`p-1.5 rounded-xl border transition-all ${
                                  reached
                                    ? 'bg-[#FEF7DF] border-[#FBE29D] text-amber-900 font-extrabold shadow-2xs'
                                    : 'bg-[#FAF8F5] border-[#775537]/10 text-[#775537]/40 font-semibold'
                                }`}
                              >
                                <span className="text-[11px] block">{level === 100 ? '🏆' : level >= 75 ? '🥇' : level >= 50 ? '🥈' : '🥉'}</span>
                                <span className="text-[10px] block">{level}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action: Log Steps Button (Replaces the fixed +500 button) */}
                      <div className="pt-2 border-t border-[#775537]/10 flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-[#775537]/60 uppercase tracking-wider block">
                            {t('quests.yourContribution')}:
                          </span>
                          <span className="text-xs font-black text-[#775537] bg-[#FEF7DF] px-2 py-0.5 rounded-md border border-[#FBE29D]">
                            {q.userContribution.toLocaleString()} {q.unit}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setLoggingQuest(q)}
                          className="px-4 py-2 rounded-full bg-[#FBE29D] hover:bg-[#fae19c] text-[#775537] text-xs font-black border border-[#775537]/25 shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">add_circle</span>
                          <span>
                            {isStepQuest
                              ? t('quests.logMyStepsBtn', { defaultValue: 'Log My Steps' })
                              : t('quests.logContributionBtn', { defaultValue: 'Log Contribution' })}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Walking Team / Team Contributors Section */}
                    <div className="space-y-2.5 pt-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#775537]">
                          {isStepQuest ? t('quests.walkingTeam') : t('quests.teamContributors')}
                        </h3>
                        <span className="text-[10px] font-semibold text-[#775537]/60">
                          {q.participants.length} contributors listed
                        </span>
                      </div>

                      <div className="bg-white rounded-3xl p-3 border border-[#775537]/15 shadow-xs space-y-2">
                        {q.participants.map((m) => (
                          <div
                            key={m.id}
                            className={`flex items-center justify-between p-2.5 rounded-2xl text-xs transition-colors ${
                              m.isCurrentUser
                                ? 'bg-[#FEF7DF] border border-[#FBE29D]'
                                : 'bg-[#FAF8F5] border border-[#775537]/10'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#FBE29D] border border-[#775537]/25 flex items-center justify-center text-[10px] font-black text-[#775537]">
                                {m.avatarInitials || m.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-[#775537]">{m.name}</span>
                                  {m.isCurrentUser && (
                                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#775537] text-white">
                                      {t('common.you', { defaultValue: 'You' })}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-[#775537]/60 block">{m.role || 'Member'}</span>
                              </div>
                            </div>
                            <span className="font-mono font-bold text-[#775537]">
                              {m.contributedAmount.toLocaleString()} {q.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* COMPLETED QUESTS LIST */}
            {myQuestsSubFilter === 'completed' &&
              completedJoinedQuests.map((q) => (
                <div
                  key={q.id}
                  className="bg-white rounded-3xl p-4.5 border border-[#775537]/15 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-300">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                      </div>
                      <h3 className="text-sm font-black text-[#775537]">{q.title}</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black border border-emerald-200">
                      Completed 100%
                    </span>
                  </div>

                  <p className="text-xs text-[#775537]/80">{q.description}</p>

                  <div className="p-3 bg-[#FEF7DF] border border-[#FBE29D] rounded-2xl flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#FBE29D] flex items-center justify-center text-amber-800">
                      <span className="material-symbols-outlined text-[20px]">{q.rewardBadgeIcon}</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-black text-amber-950 block">
                        Badge Earned: {q.rewardBadgeTitle}
                      </span>
                      <span className="text-[10px] text-amber-900/70 font-semibold block">
                        Your total contribution: {q.userContribution.toLocaleString()} {q.unit}
                      </span>
                    </div>
                  </div>

                  {onOpenGoodDeeds && (
                    <button
                      type="button"
                      onClick={onOpenGoodDeeds}
                      className="w-full py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4F2EE] border border-[#775537]/15 text-xs font-bold text-[#775537] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-amber-700">volunteer_activism</span>
                      <span>{t('goodDeeds.title', { defaultValue: 'View in Community Good Deeds' })}</span>
                    </button>
                  )}
                </div>
              ))}
          </div>
        )}
      </main>

      {/* Docked Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 max-w-[420px] mx-auto bg-white/95 backdrop-blur-md border-t border-[#775537]/10 py-2 px-6 flex justify-around items-center z-40">
        <button
          onClick={() => onTabChange('home')}
          className="flex flex-col items-center gap-0.5 py-1 px-3 text-[#775537]/60 hover:text-[#775537] transition-colors cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">home</span>
          <span className="text-[11px] font-semibold">{t('tabs.home')}</span>
        </button>

        <button
          onClick={() => onTabChange('activities')}
          className="flex flex-col items-center gap-0.5 py-1 px-3 text-[#775537]/60 hover:text-[#775537] transition-colors cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">groups</span>
          <span className="text-[11px] font-semibold">{t('tabs.activities')}</span>
        </button>

        <button
          onClick={() => onTabChange('quests')}
          className="flex flex-col items-center gap-0.5 py-1 px-4 bg-[#FBE29D] border border-[#775537]/30 rounded-full text-[#775537] shadow-xs active:scale-95 transition-transform cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[24px] fill-1 text-[#775537]">emoji_events</span>
          <span className="text-[11px] font-bold text-[#775537]">{t('tabs.quests')}</span>
        </button>

        <button
          onClick={() => onTabChange('profile')}
          className="flex flex-col items-center gap-0.5 py-1 px-3 text-[#775537]/60 hover:text-[#775537] transition-colors cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">person</span>
          <span className="text-[11px] font-semibold">{t('tabs.profile')}</span>
        </button>
      </nav>

      {/* Quest Details Modal */}
      {selectedQuest && (
        <QuestDetailsModal
          quest={selectedQuest}
          userName={userName}
          onJoinQuest={(id) => onToggleJoinQuest(id, true)}
          onOpenLeaveConfirm={(q) => setLeavingQuest(q)}
          onOpenLogContribution={(q) => setLoggingQuest(q)}
          onClose={() => setSelectedQuest(null)}
        />
      )}

      {/* Log Steps / Contribution Modal */}
      {loggingQuest && (
        <LogStepsModal
          quest={loggingQuest}
          userName={userName}
          onLogContribution={onLogContribution}
          onClose={() => setLoggingQuest(null)}
        />
      )}

      {/* Leave Quest Confirmation Modal */}
      {leavingQuest && (
        <LeaveQuestConfirmModal
          quest={leavingQuest}
          onConfirmLeave={() => onToggleJoinQuest(leavingQuest.id, false)}
          onClose={() => setLeavingQuest(null)}
        />
      )}

      {/* Milestone Celebration Modal */}
      {recentMilestone && (
        <MilestoneCelebrationModal
          quest={recentMilestone.quest}
          milestoneLevel={recentMilestone.level}
          onClose={() => onClearRecentMilestone?.()}
          onViewGoodDeeds={onOpenGoodDeeds}
        />
      )}

      {/* Category Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs shadow-2xl border border-[#775537]/20 space-y-3 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#775537]">{t('quests.filterAll')}</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-7 h-7 rounded-full bg-[#f3f3f3] text-xs font-bold cursor-pointer"
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              {[
                { id: 'all', label: t('quests.filterAll') },
                { id: 'fitness', label: t('quests.filterFitness', { defaultValue: 'Fitness' }) },
                { id: 'green', label: t('quests.filterGreen') },
                { id: 'learning', label: t('quests.filterLearning', { defaultValue: 'Learning' }) },
                { id: 'eco', label: t('quests.filterEco') },
                { id: 'joined', label: t('quests.filterJoined') },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setFilterType(f.id as any);
                    setShowFilterModal(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border font-semibold cursor-pointer ${
                    filterType === f.id
                      ? 'bg-[#FBE29D]/60 border-[#775537] text-[#775537]'
                      : 'bg-white border-[#775537]/15 text-[#775537]'
                  }`}
                  type="button"
                >
                  <span>{f.label}</span>
                  {filterType === f.id && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
