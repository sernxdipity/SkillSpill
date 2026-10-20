import React from 'react';
import { useTranslation } from 'react-i18next';
import { HelpRequest, MainTab, FamilyGroup, GoodDeed, CommunityQuest, CommunityGroup } from '../types';
import { getTranslatedHelpRequest } from '../utils/translationHelper';
import { CommunityGoodDeedsSection } from '../components/CommunityGoodDeedsSection';
import { CommunityGroupsPreviewSection } from '../components/CommunityGroupsPreviewSection';

interface HomeScreenProps {
  userName: string;
  neighbourhood: string;
  credits: number;
  familyGroup: FamilyGroup | null;
  urgentRequests: HelpRequest[];
  onOpenNotifications: () => void;
  unreadCount: number;
  onOpenNeighbourhoodModal: () => void;
  onTabChange: (tab: MainTab) => void;
  onSelectHelpRequest: (req: HelpRequest) => void;
  deeds: GoodDeed[];
  celebratedDeedIds: Set<string>;
  commentsCountMap: Record<string, number>;
  onOpenGoodDeeds: () => void;
  onHideDeed: (deedId: string) => void;
  onCelebrateDeed: (deedId: string) => void;
  onOpenComments: (deed: GoodDeed) => void;
  activeQuest?: CommunityQuest;
  groups: CommunityGroup[];
  selectedInterests: string[];
  onOpenAllGroups: () => void;
  onOpenGroupDetails: (group: CommunityGroup) => void;
  onToggleJoinGroup: (groupId: string, join: boolean) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userName,
  neighbourhood,
  credits,
  familyGroup,
  urgentRequests,
  onOpenNotifications,
  unreadCount,
  onOpenNeighbourhoodModal,
  onTabChange,
  onSelectHelpRequest,
  deeds,
  celebratedDeedIds,
  commentsCountMap,
  onOpenGoodDeeds,
  onHideDeed,
  onCelebrateDeed,
  onOpenComments,
  activeQuest,
  groups,
  selectedInterests,
  onOpenAllGroups,
  onOpenGroupDetails,
  onToggleJoinGroup,
}) => {
  const { t } = useTranslation();
  const displayNeighbourhood = neighbourhood || 'Maple Heights';

  return (
    <div className="w-full max-w-[420px] min-h-screen md:min-h-[852px] bg-[#fcfbf9] text-[#775537] flex flex-col justify-between relative overflow-hidden md:rounded-3xl md:shadow-2xl border-x md:border border-[#775537]/20 select-none pb-20">
      {/* Fixed Top Header */}
      <header className="sticky top-0 z-30 w-full bg-[#fcfbf9]/95 backdrop-blur-md px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#775537]/10">
        <div className="flex items-center gap-1.5 cursor-pointer">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FBE29D] border border-[#775537]/30 inline-block shadow-xs"></span>
          <span className="font-bold text-xl tracking-tight text-[#775537]">SkillSpill</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNeighbourhoodModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#775537]/20 bg-white/70 text-xs font-semibold text-[#775537] shadow-xs cursor-pointer hover:bg-white transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px] text-[#775537]/80">location_on</span>
            <span>{displayNeighbourhood}</span>
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
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FBE29D] border border-[#775537]"></span>
            )}
          </button>
        </div>
      </header>

      {/* Main Home Stream */}
      <main className="flex-1 w-full px-5 pt-3 space-y-4">
        {/* Warm Personal Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#775537]/70 block">
              {t('home.goodDay', { neighbourhood: displayNeighbourhood })}
            </span>
            <h1 className="text-2xl font-black text-[#775537] tracking-tight">
              {t('home.greeting', { name: userName })}
            </h1>
          </div>
          <button
            onClick={() => onTabChange('profile')}
            className="w-11 h-11 rounded-full bg-[#FBE29D]/60 border border-[#775537]/20 flex items-center justify-center text-[#775537] shadow-xs cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined fill text-2xl">person</span>
          </button>
        </div>

        {/* Neighborhood Hero Card */}
        <div className="w-full bg-gradient-to-br from-[#FEF7DF] via-[#FAF6F0] to-[#E8F4F2] p-4 rounded-3xl border-2 border-[#775537]/15 shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="space-y-1 z-10 max-w-[210px]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#775537]/70 block">
                {t('home.hubTag')}
              </span>
              <h2 className="text-base font-extrabold text-[#775537] leading-snug">
                {t('home.heroTitle')}
              </h2>
              <p className="text-xs text-[#50453c] mt-0.5 leading-relaxed">
                {t('home.heroDesc')}
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-[#C0DDDA]/70 border border-[#775537]/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl text-[#775537] fill">cottage</span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-3.5 pt-3 border-t border-[#775537]/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#775537]">
              <span className="material-symbols-outlined text-[16px] text-[#775537]">groups</span>
              <span className="font-bold">142 {t('common.members').toLowerCase()}</span>
            </div>
            <span className="text-[#775537]/40">·</span>
            <div className="flex items-center gap-1.5 text-[#775537]">
              <span className="material-symbols-outlined text-[16px] text-[#775537]">volunteer_activism</span>
              <span className="font-bold">18 {t('tabs.activities').toLowerCase()}</span>
            </div>
          </div>
        </div>

        {/* Quick Action Bento Grid */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <button
            onClick={() => onTabChange('activities')}
            className="p-3 rounded-2xl bg-white border border-[#775537]/15 shadow-xs flex flex-col items-center justify-center text-center gap-1 hover:bg-[#FBE29D]/20 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FBE29D] text-[#775537] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">add</span>
            </div>
            <span className="text-[11px] font-bold text-[#775537] mt-0.5">{t('home.askHelp')}</span>
          </button>

          <button
            onClick={() => onTabChange('activities')}
            className="p-3 rounded-2xl bg-white border border-[#775537]/15 shadow-xs flex flex-col items-center justify-center text-center gap-1 hover:bg-[#C0DDDA]/20 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#C0DDDA] text-[#775537] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <span className="text-[11px] font-bold text-[#775537] mt-0.5">{t('home.workshopsLabel')}</span>
          </button>

          <button
            onClick={() => onTabChange('profile')}
            className="p-3 rounded-2xl bg-white border border-[#775537]/15 shadow-xs flex flex-col items-center justify-center text-center gap-1 hover:bg-[#FAF8F5] active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F4F2EE] text-[#775537] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px] fill">account_balance_wallet</span>
            </div>
            <span className="text-[11px] font-bold text-[#775537] mt-0.5">{credits} {t('common.credits')}</span>
          </button>
        </div>

        {/* Your Community Preview Section */}
        <CommunityGroupsPreviewSection
          groups={groups}
          selectedInterests={selectedInterests}
          neighbourhood={displayNeighbourhood}
          onSeeAll={onOpenAllGroups}
          onOpenGroup={onOpenGroupDetails}
          onToggleJoin={onToggleJoinGroup}
        />

        {/* Urgent Neighbourhood Needs */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#775537] flex items-center gap-1.5">
              <span>{t('home.urgentHeading')}</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </h3>
            <button
              onClick={() => onTabChange('activities')}
              className="text-xs font-bold text-[#775537] hover:underline cursor-pointer"
            >
              {t('home.seeAll')}
            </button>
          </div>

          <div className="space-y-2.5">
            {urgentRequests.map((rawReq) => {
              const req = getTranslatedHelpRequest(t, rawReq);
              return (
                <div
                  key={req.id}
                  onClick={() => {
                    onTabChange('activities');
                    onSelectHelpRequest(req);
                  }}
                  className="bg-white rounded-2xl p-3.5 border border-[#775537]/15 shadow-xs hover:border-[#775537]/35 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FBE29D] border border-[#775537]/20 flex items-center justify-center text-[#775537] shrink-0">
                      <span className="material-symbols-outlined text-[20px]">{req.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#775537]">{req.title}</h4>
                      <p className="text-[11px] text-[#775537]/70">{req.requester} · {req.timeStr}</p>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-[#FBE29D]/60 border border-[#775537]/25 text-[11px] font-bold text-[#775537]">
                    {req.credits} {t('common.credits')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Community Quest Spotlight */}
        <div className="bg-[#FEF7DF] rounded-3xl p-4 border border-[#FBE29D] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FBE29D] border border-[#775537]/20 flex items-center justify-center text-[#775537]">
                <span className="material-symbols-outlined text-[18px]">directions_walk</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#775537]/70 block">{t('home.activeBadge')}</span>
                <h4 className="text-xs font-black text-[#775537]">{t('quests.featuredTitle')}</h4>
              </div>
            </div>
            <button
              onClick={() => onTabChange('quests')}
              className="px-3 py-1 rounded-full bg-white hover:bg-stone-50 border border-[#775537]/20 text-[11px] font-bold text-[#775537] shadow-xs transition-colors cursor-pointer"
            >
              {t('home.viewQuests')} →
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#775537]/80">
                {(activeQuest?.currentProgress || 12500).toLocaleString()} / {(activeQuest?.target || 50000).toLocaleString()} steps
              </span>
              <span className="font-bold text-[#775537]">
                {Math.min(100, Math.round(((activeQuest?.currentProgress || 12500) / (activeQuest?.target || 50000)) * 100))}%
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-[#775537]/10 p-0.5 flex">
              <div
                className="bg-[#775537] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, ((activeQuest?.currentProgress || 12500) / (activeQuest?.target || 50000)) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-0.5 border-t border-[#775537]/10">
            <div className="flex items-center gap-1.5 text-[#775537]/80 truncate mr-2">
              <span className="material-symbols-outlined text-[14px] shrink-0">groups</span>
              <span className="truncate">
                Walking Team:{' '}
                <strong className="text-[#775537]">
                  {activeQuest?.participants
                    ? activeQuest.participants.map((p) => p.name).slice(0, 3).join(', ')
                    : userName}
                </strong>
                {activeQuest?.participants && activeQuest.participants.length > 3
                  ? ` & ${activeQuest.participants.length - 3} more`
                  : ''}
              </span>
            </div>
            <span className="font-bold text-amber-800 bg-[#fae19c]/60 px-2 py-0.5 rounded-full text-[10px] shrink-0">
              {t('quests.durationDays', {
                current: activeQuest?.currentDay || 4,
                total: activeQuest?.totalDurationDays || 7,
              })}
            </span>
          </div>
        </div>

        {/* Community Good Deeds Feed Section */}
        <CommunityGoodDeedsSection
          deeds={deeds}
          celebratedDeedIds={celebratedDeedIds}
          commentsCountMap={commentsCountMap}
          onSeeAll={onOpenGoodDeeds}
          onHideDeed={onHideDeed}
          onCelebrateDeed={onCelebrateDeed}
          onOpenComments={onOpenComments}
          currentUserName={userName}
        />
      </main>

      {/* Docked Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 max-w-[420px] mx-auto bg-white/95 backdrop-blur-md border-t border-[#775537]/10 py-2 px-6 flex justify-around items-center z-40">
        <button
          onClick={() => onTabChange('home')}
          className="flex flex-col items-center gap-0.5 py-1 px-4 bg-[#FBE29D] border border-[#775537]/30 rounded-full text-[#775537] shadow-xs active:scale-95 transition-transform cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[24px] fill-1 text-[#775537]">home</span>
          <span className="text-[11px] font-bold text-[#775537]">{t('tabs.home')}</span>
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
          className="flex flex-col items-center gap-0.5 py-1 px-3 text-[#775537]/60 hover:text-[#775537] transition-colors cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">emoji_events</span>
          <span className="text-[11px] font-semibold">{t('tabs.quests')}</span>
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
    </div>
  );
};
