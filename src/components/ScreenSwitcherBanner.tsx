import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Screen, MainTab } from '../types';

interface ScreenSwitcherBannerProps {
  currentScreen: Screen;
  currentTab: MainTab;
  onSelectScreen: (screen: Screen, tab?: MainTab) => void;
}

export const ScreenSwitcherBanner: React.FC<ScreenSwitcherBannerProps> = ({
  currentScreen,
  currentTab,
  onSelectScreen,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const screens: { id: Screen; tab?: MainTab; labelKey?: string; defaultLabel: string; tag: string }[] = [
    { id: 'welcome', labelKey: 'welcome.getStarted', defaultLabel: 'Welcome', tag: 'Welcome' },
    { id: 'login', labelKey: 'login.logInBtn', defaultLabel: 'Log In', tag: 'Auth' },
    { id: 'signup', labelKey: 'signup.signUpBtn', defaultLabel: 'Sign Up', tag: 'Auth' },
    { id: 'step1_location', labelKey: 'step1.stepTitle', defaultLabel: 'Step 1: Location', tag: 'Step 1' },
    { id: 'step2_interests', labelKey: 'step2.stepTitle', defaultLabel: 'Step 2: Interests', tag: 'Step 2' },
    { id: 'step3_family', labelKey: 'step3.stepTitle', defaultLabel: 'Step 3: Family', tag: 'Step 3' },
    { id: 'create_family', labelKey: 'createFamily.title', defaultLabel: 'Create Family', tag: 'Step 4' },
    { id: 'family_ready', labelKey: 'familyReady.title', defaultLabel: 'Family Ready', tag: 'Step 5' },
    { id: 'all_set', labelKey: 'allSet.title', defaultLabel: 'All Set!', tag: 'Ready' },
    { id: 'main_app', tab: 'activities', labelKey: 'tabs.activities', defaultLabel: 'Activities (Main)', tag: 'App' },
    { id: 'main_app', tab: 'profile', labelKey: 'tabs.profile', defaultLabel: 'Profile (Main)', tag: 'App' },
    { id: 'main_app', tab: 'home', labelKey: 'tabs.home', defaultLabel: 'Home Feed', tag: 'App' },
    { id: 'main_app', tab: 'quests', labelKey: 'tabs.quests', defaultLabel: 'Weekly Quests', tag: 'App' },
    { id: 'community_groups', labelKey: 'groups.pageTitle', defaultLabel: 'Community Groups', tag: 'Groups' },
  ];

  return (
    <aside aria-label="Screen Preview Navigator" className="w-full max-w-[420px] mx-auto mb-2 px-2 print:hidden">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#775537]/20 p-2 shadow-xs text-xs">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-[#775537] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#FBE29D] border border-[#775537]/40"></span>
            <span>{t('common.screenNavigator')}</span>
            <span className="text-[10px] bg-[#FAF6F0] px-1.5 py-0.5 rounded-full text-[#775537]/75 font-semibold">
              {currentScreen === 'main_app' ? `App (${t(`tabs.${currentTab}`, { defaultValue: currentTab })})` : currentScreen}
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11px] font-bold text-[#775537] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>{isExpanded ? t('common.hide') : t('common.jumpToScreen')}</span>
            <span className="material-symbols-outlined text-[16px]">
              {isExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        {isExpanded && (
          <div className="mt-2.5 pt-2 border-t border-[#775537]/10 grid grid-cols-2 gap-1.5 animate-in fade-in duration-150">
            {screens.map((s, idx) => {
              const isCurrent =
                currentScreen === s.id && (s.tab === undefined || currentTab === s.tab);
              const label = s.labelKey ? t(s.labelKey, { defaultValue: s.defaultLabel }) : s.defaultLabel;

              return (
                <button
                  key={`${s.id}-${s.tab || idx}`}
                  onClick={() => {
                    onSelectScreen(s.id, s.tab);
                    setIsExpanded(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#FBE29D] font-bold text-[#775537] border border-[#775537]/30'
                      : 'bg-[#FAF8F5] text-[#775537]/80 hover:bg-[#FBE29D]/30 border border-transparent'
                  }`}
                >
                  <span className="truncate text-[11px]">{label}</span>
                  <span className="text-[9px] text-[#775537]/60 font-mono shrink-0 ml-1">
                    {s.tag}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
