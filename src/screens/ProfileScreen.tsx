import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FamilyGroup, Badge, Transaction, MainTab } from '../types';
import { getTranslatedBadge, getTranslatedTransaction } from '../utils/translationHelper';

interface ProfileScreenProps {
  userName: string;
  setUserName: (name: string) => void;
  neighbourhood: string;
  setNeighbourhood: (n: string) => void;
  credits: number;
  familyGroup: FamilyGroup | null;
  badges: Badge[];
  transactions: Transaction[];
  onOpenNotifications: () => void;
  onLogout: () => void;
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  onOpenLangModal: () => void;
  currentLang: string;
  feedSharingOptIn?: boolean;
  onToggleFeedSharing?: (enabled: boolean) => void;
  onOpenGoodDeeds?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userName,
  setUserName,
  neighbourhood,
  setNeighbourhood,
  credits,
  familyGroup,
  badges,
  transactions,
  onOpenNotifications,
  onLogout,
  activeTab,
  onTabChange,
  onOpenLangModal,
  currentLang,
  feedSharingOptIn = true,
  onToggleFeedSharing,
  onOpenGoodDeeds,
}) => {
  const { t } = useTranslation();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editNeighbourhood, setEditNeighbourhood] = useState(neighbourhood);

  React.useEffect(() => {
    setEditName(userName);
  }, [userName]);

  React.useEffect(() => {
    setEditNeighbourhood(neighbourhood);
  }, [neighbourhood]);

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [showFamilyMembersModal, setShowFamilyMembersModal] = useState(false);
  const [showActivityHistoryModal, setShowActivityHistoryModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [copyCodeSuccess, setCopyCodeSuccess] = useState(false);

  const handleCopyCode = async () => {
    if (familyGroup?.code) {
      try {
        await navigator.clipboard.writeText(familyGroup.code);
        setCopyCodeSuccess(true);
        setTimeout(() => setCopyCodeSuccess(false), 2000);
      } catch {
        setCopyCodeSuccess(true);
        setTimeout(() => setCopyCodeSuccess(false), 2000);
      }
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim()) setUserName(editName.trim());
    if (editNeighbourhood.trim()) setNeighbourhood(editNeighbourhood.trim());
    setShowEditProfile(false);
  };

  const translatedBadges = badges.map((b) => getTranslatedBadge(t, b));
  const translatedTransactions = transactions.map((tx) => getTranslatedTransaction(t, tx));

  const getLangDisplayName = (code: string) => {
    switch (code.toUpperCase()) {
      case 'EN':
        return 'English (US)';
      case 'BM':
        return 'Bahasa Melayu';
      case 'ZH':
        return '中文 (简体)';
      case 'TA':
        return 'தமிழ்';
      default:
        return code;
    }
  };

  return (
    <div className="w-full max-w-[420px] min-h-screen md:min-h-[852px] bg-[#F7F5F0] text-[#775537] flex flex-col justify-between relative overflow-hidden md:rounded-3xl md:shadow-2xl border-x md:border border-[#775537]/20 select-none pb-20">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 bg-[#F7F5F0]/90 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-[#775537]/10">
        {/* Left Brand Wordmark */}
        <div className="flex items-center space-x-2">
          <span className="inline-block w-3 h-3 rounded-full bg-[#FBE29D] border border-[#775537]/40 shadow-xs"></span>
          <span className="font-extrabold text-[22px] text-[#775537] tracking-tight">SkillSpill</span>
        </div>

        {/* Right Controls: Notification Bell */}
        <button
          onClick={onOpenNotifications}
          aria-label={t('notifications.title')}
          className="relative w-10 h-10 rounded-full bg-white border border-[#775537]/15 flex items-center justify-center text-[#775537] hover:bg-[#F4F2EE] transition-transform active:scale-95 shadow-xs cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[21px]">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ba1a1a] border border-white"></span>
        </button>
      </header>

      {/* Scrollable Profile Content */}
      <main className="flex-1 px-4 pt-4 space-y-4 max-w-md mx-auto w-full">
        {/* 1. My Profile Heading & Summary Card */}
        <section className="space-y-2.5">
          <h1 className="text-[26px] font-extrabold text-[#775537] tracking-tight">{t('profile.title')}</h1>

          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-4 border border-[#775537]/10 shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="relative w-14 h-14 rounded-full bg-[#FBE29D]/60 border border-[#775537]/20 flex items-center justify-center text-[#775537] shadow-inner shrink-0">
                <span className="material-symbols-outlined fill text-[30px] text-[#775537]/85">person</span>
              </div>
              <div>
                <h2 className="text-[19px] font-extrabold text-[#775537] leading-snug">{userName}</h2>
                <div className="flex items-center text-xs font-semibold text-[#775537]/75 mt-0.5">
                  <span className="material-symbols-outlined text-[15px] text-[#775537]/80 mr-1">location_on</span>
                  <span>{neighbourhood || 'Maple Heights'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setEditName(userName);
                setEditNeighbourhood(neighbourhood);
                setShowEditProfile(true);
              }}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#F4F2EE] hover:bg-[#775537]/10 transition-colors text-xs font-bold text-[#775537] active:scale-95 border border-[#775537]/15 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">edit</span>
              <span>{t('profile.editProfile')}</span>
            </button>
          </div>
        </section>

        {/* 2. Credit Wallet Card */}
        <section>
          <button
            onClick={() => setShowWalletModal(true)}
            className="w-full text-left bg-[#C0DDDA]/65 hover:bg-[#C0DDDA]/80 border border-[#775537]/15 rounded-3xl p-4 shadow-xs transition-all active:scale-[0.99] group cursor-pointer"
            type="button"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#775537]/15 flex items-center justify-center text-[#775537] shadow-xs shrink-0">
                  <span className="material-symbols-outlined fill text-2xl">account_balance_wallet</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#775537]/80 uppercase tracking-wider block">
                    {t('profile.creditsBalance')}
                  </span>
                  <div className="flex items-baseline space-x-1 mt-0.5">
                    <span className="text-2xl font-extrabold text-[#775537] leading-tight">{credits}</span>
                    <span className="text-sm font-bold text-[#775537]">{t('common.credits')}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#775537]/75 block mt-0.5">
                    {t('profile.sharedFamilyWallet')}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-[#775537]/60 group-hover:translate-x-0.5 transition-transform text-[20px]">
                  chevron_right
                </span>
              </div>
            </div>
          </button>
        </section>

        {/* 3. My Badges */}
        <section>
          <div className="bg-white rounded-3xl p-4 border border-[#775537]/10 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FBE29D]/70 flex items-center justify-center text-[#775537] border border-[#775537]/15">
                  <span className="material-symbols-outlined fill text-[18px]">military_tech</span>
                </div>
                <h3 className="text-[16px] font-bold text-[#775537]">{t('profile.myBadges')}</h3>
              </div>
              <button
                onClick={() => setShowBadgesModal(true)}
                className="text-xs font-extrabold text-[#775537] hover:underline flex items-center space-x-1 cursor-pointer"
                type="button"
              >
                <span>{t('profile.viewAll')}</span>
                <span className="text-sm">→</span>
              </button>
            </div>

            {/* Monthly Badge Preview Card */}
            <div
              onClick={() => setShowBadgesModal(true)}
              className="bg-[#FEF7DF] rounded-2xl p-3.5 border border-[#FBE29D] flex items-center space-x-3.5 cursor-pointer hover:brightness-98 transition-all"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#FBE29D] border border-[#775537]/20 flex items-center justify-center text-[#775537] shadow-xs shrink-0">
                <span className="material-symbols-outlined fill text-[22px] text-[#775537]">workspace_premium</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-[#775537] truncate">
                    {translatedBadges[0]?.title || 'October Community Champion'}
                  </h4>
                </div>
                <p className="text-[11px] font-semibold text-[#775537]/75 mt-0.5">2 / 4 quests completed</p>
                <div className="w-full bg-white/90 rounded-full h-2.5 overflow-hidden mt-2 border border-[#775537]/15 p-0.5">
                  <div className="bg-[#775537] h-full rounded-full transition-all duration-500 w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Family Group */}
        <section>
          <div className="bg-white rounded-3xl p-4 border border-[#775537]/10 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#F4F2EE] flex items-center justify-center text-[#775537] border border-[#775537]/15">
                  <span className="material-symbols-outlined fill text-[20px]">groups</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#775537]/60 block">
                    {t('profile.familyGroupTitle')}
                  </span>
                  <h3 className="text-[16px] font-extrabold text-[#775537]">
                    {familyGroup?.name || 'The Happy Family'}
                  </h3>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#F4F2EE] text-[11px] font-bold text-[#775537] border border-[#775537]/15">
                {t('profile.membersCount', { count: familyGroup?.members?.length || 3 })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-0.5">
              <button
                onClick={handleCopyCode}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-full bg-[#F4F2EE] hover:bg-[#775537]/10 text-xs font-bold text-[#775537] transition-colors active:scale-95 border border-[#775537]/15 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copyCodeSuccess ? 'check' : 'content_copy'}
                </span>
                <span>{copyCodeSuccess ? t('common.copied') : t('common.copyCode')}</span>
              </button>
              <button
                onClick={() => setShowFamilyMembersModal(true)}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-full bg-[#F4F2EE] hover:bg-[#775537]/10 text-xs font-bold text-[#775537] transition-colors active:scale-95 border border-[#775537]/15 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">group</span>
                <span>{t('profile.viewMembers')}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 5. My Activity Navigation */}
        <section className="space-y-1.5 pt-1">
          <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-[#775537]/70 px-2">
            {t('profile.myActivity')}
          </h3>
          <div className="bg-white rounded-3xl border border-[#775537]/10 shadow-xs divide-y divide-[#775537]/10 overflow-hidden">
            <button
              onClick={() => onTabChange('activities')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#F4F2EE]/50 transition-colors text-left group active:bg-[#F4F2EE] cursor-pointer"
              type="button"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#F4F2EE] flex items-center justify-center text-[#775537] border border-[#775537]/15">
                  <span className="material-symbols-outlined text-[19px]">volunteer_activism</span>
                </div>
                <span className="text-sm font-bold text-[#775537]">{t('profile.myHelpRequests')}</span>
              </div>
              <span className="material-symbols-outlined text-[19px] text-[#775537]/45 group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </button>

            <button
              onClick={() => onTabChange('activities')}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#F4F2EE]/50 transition-colors text-left group active:bg-[#F4F2EE] cursor-pointer"
              type="button"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#F4F2EE] flex items-center justify-center text-[#775537] border border-[#775537]/15">
                  <span className="material-symbols-outlined text-[19px]">school</span>
                </div>
                <span className="text-sm font-bold text-[#775537]">{t('profile.myWorkshops')}</span>
              </div>
              <span className="material-symbols-outlined text-[19px] text-[#775537]/45 group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </button>

            <button
              onClick={() => setShowActivityHistoryModal(true)}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#F4F2EE]/50 transition-colors text-left group active:bg-[#F4F2EE] cursor-pointer"
              type="button"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#F4F2EE] flex items-center justify-center text-[#775537] border border-[#775537]/15">
                  <span className="material-symbols-outlined text-[19px]">history</span>
                </div>
                <span className="text-sm font-bold text-[#775537]">{t('profile.activityHistory')}</span>
              </div>
              <span className="material-symbols-outlined text-[19px] text-[#775537]/45 group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </button>

            {onOpenGoodDeeds && (
              <button
                onClick={onOpenGoodDeeds}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#F4F2EE]/50 transition-colors text-left group active:bg-[#F4F2EE] cursor-pointer"
                type="button"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FEF7DF] border border-[#FBE29D] flex items-center justify-center text-amber-700">
                    <span className="material-symbols-outlined text-[19px] fill">volunteer_activism</span>
                  </div>
                  <span className="text-sm font-bold text-[#775537]">{t('goodDeeds.title')}</span>
                </div>
                <span className="material-symbols-outlined text-[19px] text-[#775537]/45 group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </button>
            )}
          </div>
        </section>

        {/* 6. Settings */}
        <section className="space-y-1.5 pt-1">
          <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-[#775537]/70 px-2">
            {t('profile.settings')}
          </h3>
          <div className="bg-white rounded-3xl border border-[#775537]/10 shadow-xs divide-y divide-[#775537]/10 overflow-hidden">
            <button
              onClick={onOpenLangModal}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#F4F2EE]/50 transition-colors text-left group active:bg-[#F4F2EE] cursor-pointer"
              type="button"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#F4F2EE] flex items-center justify-center text-[#775537] border border-[#775537]/15">
                  <span className="material-symbols-outlined text-[19px]">language</span>
                </div>
                <span className="text-sm font-bold text-[#775537]">{t('profile.language')}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-semibold text-[#775537]/70">
                  {getLangDisplayName(currentLang)}
                </span>
                <span className="material-symbols-outlined text-[19px] text-[#775537]/45 group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </div>
            </button>

            <button
              onClick={onOpenNotifications}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#F4F2EE]/50 transition-colors text-left group active:bg-[#F4F2EE] cursor-pointer"
              type="button"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#F4F2EE] flex items-center justify-center text-[#775537] border border-[#775537]/15">
                  <span className="material-symbols-outlined text-[19px]">notifications_active</span>
                </div>
                <span className="text-sm font-bold text-[#775537]">{t('profile.notifications')}</span>
              </div>
              <span className="material-symbols-outlined text-[19px] text-[#775537]/45 group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </button>

            {/* Community Feed Sharing Privacy Setting */}
            {onToggleFeedSharing && (
              <div className="w-full px-4 py-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-3.5 pr-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FEF7DF] flex items-center justify-center text-amber-700 border border-[#FBE29D]">
                    <span className="material-symbols-outlined text-[19px]">verified_user</span>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#775537] block">
                      {t('goodDeeds.privacyTitle')}
                    </span>
                    <span className="text-[11px] text-[#775537]/65 block leading-tight mt-0.5">
                      {feedSharingOptIn ? t('goodDeeds.optInActive') : t('goodDeeds.optInPaused')}
                    </span>
                  </div>
                </div>

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
            )}
          </div>
        </section>

        {/* 7. Log Out Row */}
        <section className="pt-1">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-white border border-[#775537]/10 rounded-2xl p-3.5 shadow-xs hover:bg-red-50/50 transition-colors flex items-center justify-between active:scale-[0.99] text-left cursor-pointer"
            type="button"
          >
            <div className="flex items-center space-x-3.5 text-[#ba1a1a]">
              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-[#ba1a1a] border border-red-200">
                <span className="material-symbols-outlined text-[19px]">logout</span>
              </div>
              <span className="text-sm font-bold text-[#ba1a1a]">{t('profile.logout')}</span>
            </div>
            <span className="material-symbols-outlined text-[19px] text-[#775537]/40">chevron_right</span>
          </button>
        </section>
      </main>

      {/* Docked Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 max-w-[420px] mx-auto bg-white/95 backdrop-blur-md border-t border-[#775537]/10 py-2 px-6 flex justify-around items-center shadow-xs z-40">
        <button
          onClick={() => onTabChange('home')}
          className="flex flex-col items-center justify-center text-[#775537]/70 hover:text-[#775537] px-3 py-1 transition-transform active:scale-95 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">home</span>
          <span className="text-[11px] font-bold mt-0.5">{t('tabs.home')}</span>
        </button>

        <button
          onClick={() => onTabChange('activities')}
          className="flex flex-col items-center justify-center text-[#775537]/70 hover:text-[#775537] px-3 py-1 transition-transform active:scale-95 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">groups</span>
          <span className="text-[11px] font-bold mt-0.5">{t('tabs.activities')}</span>
        </button>

        <button
          onClick={() => onTabChange('quests')}
          className="flex flex-col items-center justify-center text-[#775537]/70 hover:text-[#775537] px-3 py-1 transition-transform active:scale-95 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">emoji_events</span>
          <span className="text-[11px] font-bold mt-0.5">{t('tabs.quests')}</span>
        </button>

        <button
          onClick={() => onTabChange('profile')}
          className="flex flex-col items-center justify-center bg-[#FBE29D] text-[#775537] rounded-full px-5 py-1.5 border border-[#775537]/20 shadow-xs transition-transform active:scale-95 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[22px] fill">person</span>
          <span className="text-[11px] font-extrabold mt-0.5">{t('tabs.profile')}</span>
        </button>
      </nav>

      {/* Edit Profile Dialog Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[#775537]/20 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#775537]">{t('profile.editProfile')}</h3>
              <button
                onClick={() => setShowEditProfile(false)}
                className="w-7 h-7 rounded-full bg-[#f3f3f3] text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#775537] mb-1">{t('profile.editNameLabel')}</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#775537]/20 rounded-xl px-3 py-2 text-[#775537]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#775537] mb-1">{t('profile.editNeighbourhoodLabel')}</label>
                <input
                  type="text"
                  required
                  value={editNeighbourhood}
                  onChange={(e) => setEditNeighbourhood(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#775537]/20 rounded-xl px-3 py-2 text-[#775537]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 py-2.5 rounded-full bg-[#f3f3f3] text-[#775537] font-bold cursor-pointer"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#775537] text-white font-bold cursor-pointer"
                >
                  {t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credit Wallet History Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[#775537]/20 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#C0DDDA] flex items-center justify-center text-[#775537]">
                  <span className="material-symbols-outlined text-[20px] fill">account_balance_wallet</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#775537]">{t('profile.sharedFamilyWallet')}</h3>
                  <p className="text-[11px] text-[#775537]/70">Pool shared by {familyGroup?.name || 'Your Family'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowWalletModal(false)}
                className="w-7 h-7 rounded-full bg-[#f3f3f3] text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#775537]/15 text-center">
              <span className="text-[11px] font-bold text-[#775537]/70 uppercase tracking-wider block">
                {t('profile.creditsBalance')}
              </span>
              <span className="text-3xl font-extrabold text-[#775537] mt-0.5 block">{credits} {t('common.credits')}</span>
              <span className="text-[11px] text-emerald-700 font-semibold block mt-1">+45 earned this week</span>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#775537] px-1">{t('profile.transactionsTitle')}</h4>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {translatedTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#fbf9f6] border border-[#775537]/10 text-xs">
                    <div>
                      <p className="font-bold text-[#775537]">{tx.title}</p>
                      <p className="text-[10px] text-[#775537]/60">{tx.member} · {tx.date}</p>
                    </div>
                    <span
                      className={`font-mono font-bold ${
                        tx.type === 'earn' ? 'text-emerald-700' : 'text-[#ba1a1a]'
                      }`}
                    >
                      {tx.type === 'earn' ? `+${tx.amount}` : `-${tx.amount}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowWalletModal(false)}
              className="w-full py-2.5 rounded-full bg-[#775537] text-white text-xs font-bold cursor-pointer"
            >
              {t('common.done')}
            </button>
          </div>
        </div>
      )}

      {/* Badges Modal */}
      {showBadgesModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[#775537]/20 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FBE29D] text-[#775537] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px] fill">military_tech</span>
                </div>
                <h3 className="text-base font-bold text-[#775537]">{t('profile.allBadgesTitle')}</h3>
              </div>
              <button
                onClick={() => setShowBadgesModal(false)}
                className="w-7 h-7 rounded-full bg-[#f3f3f3] text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1">
              {translatedBadges.map((b) => (
                <div
                  key={b.id}
                  className={`p-3 rounded-2xl border flex items-center gap-3 ${
                    b.isUnlocked
                      ? 'bg-[#FEF7DF] border-[#FBE29D]'
                      : 'bg-stone-50 border-stone-200 opacity-60'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      b.isUnlocked
                        ? 'bg-[#FBE29D] text-[#775537] border-[#775537]/20'
                        : 'bg-stone-200 text-stone-500 border-stone-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] fill">{b.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="text-xs font-bold text-[#775537] truncate">{b.title}</h4>
                    <p className="text-[10px] text-[#775537]/75 mt-0.5">{b.description}</p>
                    {b.dateUnlocked && (
                      <span className="text-[9px] text-[#775537]/60 block mt-0.5">Unlocked on {b.dateUnlocked}</span>
                    )}
                  </div>
                  {b.isUnlocked && (
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowBadgesModal(false)}
              className="w-full py-2.5 rounded-full bg-[#775537] text-white text-xs font-bold cursor-pointer"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      )}

      {/* Family Members Modal */}
      {showFamilyMembersModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[#775537]/20 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#C0DDDA] text-[#775537] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px] fill">group</span>
                </div>
                <h3 className="text-base font-bold text-[#775537]">{familyGroup?.name || 'The Happy Family'}</h3>
              </div>
              <button
                onClick={() => setShowFamilyMembersModal(false)}
                className="w-7 h-7 rounded-full bg-[#f3f3f3] text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#775537]/15 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#775537]/60 block">{t('familyReady.invitationCodeLabel')}</span>
                <span className="font-mono text-base font-extrabold text-[#775537]">{familyGroup?.code || 'FAM-4826'}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-full bg-white border border-[#775537]/20 font-bold text-[#775537] text-xs active:scale-95 cursor-pointer"
              >
                {copyCodeSuccess ? t('common.copied') : t('common.copyCode')}
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#775537] px-1">{t('profile.familyMembersTitle')}</h4>
              {familyGroup?.members?.map((mem) => (
                <div key={mem.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#775537]/15">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#FBE29D] text-[#775537] text-xs font-extrabold flex items-center justify-center border border-[#775537]/20">
                      {mem.avatarInitials}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#775537] flex items-center gap-1.5">
                        <span>{mem.name}</span>
                        {mem.isCurrentUser && <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full font-semibold">You</span>}
                      </p>
                      <p className="text-[10px] text-[#775537]/60">{mem.role}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#775537]">
                    {mem.creditsEarned} {t('common.credits')}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowFamilyMembersModal(false)}
              className="w-full py-2.5 rounded-full bg-[#775537] text-white text-xs font-bold cursor-pointer"
            >
              {t('common.done')}
            </button>
          </div>
        </div>
      )}

      {/* Activity History Modal */}
      {showActivityHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[#775537]/20 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F4F2EE] text-[#775537] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">history</span>
                </div>
                <h3 className="text-base font-bold text-[#775537]">{t('profile.activityHistory')}</h3>
              </div>
              <button
                onClick={() => setShowActivityHistoryModal(false)}
                className="w-7 h-7 rounded-full bg-[#f3f3f3] text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {translatedTransactions.map((tx) => (
                <div key={tx.id} className="p-3 rounded-2xl bg-[#fbf9f6] border border-[#775537]/10 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#775537]">{tx.title}</span>
                    <span className={`font-bold ${tx.type === 'earn' ? 'text-emerald-700' : 'text-[#ba1a1a]'}`}>
                      {tx.type === 'earn' ? `+${tx.amount} ${t('common.credits')}` : `-${tx.amount} ${t('common.credits')}`}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#775537]/50 block">{tx.member} · {tx.date}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowActivityHistoryModal(false)}
              className="w-full py-2.5 rounded-full bg-[#775537] text-white text-xs font-bold cursor-pointer"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      )}

      {/* Log Out Confirmation Dialog Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 w-full max-w-[320px] shadow-2xl border border-[#775537]/20 space-y-4 text-center transform scale-100 transition-transform">
            <div className="w-12 h-12 rounded-full bg-red-100 text-[#ba1a1a] flex items-center justify-center mx-auto border border-red-200">
              <span className="material-symbols-outlined text-2xl">logout</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-[18px] font-extrabold text-[#775537]">{t('profile.logoutConfirmTitle')}</h3>
              <p className="text-xs text-[#775537]/70 font-medium leading-relaxed">
                {t('profile.logoutConfirmDesc')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="py-2.5 px-4 rounded-full bg-[#F4F2EE] hover:bg-[#775537]/10 text-xs font-bold text-[#775537] transition-colors active:scale-95 border border-[#775537]/15 cursor-pointer"
                type="button"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
                className="py-2.5 px-4 rounded-full bg-[#775537] hover:bg-[#5c4129] text-xs font-bold text-white transition-colors active:scale-95 shadow-xs cursor-pointer"
                type="button"
              >
                {t('profile.logoutConfirmBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
