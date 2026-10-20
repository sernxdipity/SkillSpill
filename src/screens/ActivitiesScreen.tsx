import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpRequest, Workshop, MainTab } from '../types';
import { getTranslatedHelpRequest, getTranslatedWorkshop } from '../utils/translationHelper';

interface ActivitiesScreenProps {
  userName: string;
  neighbourhood: string;
  onOpenNeighbourhoodModal: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  helpRequests: HelpRequest[];
  onAddHelpRequest: (req: Omit<HelpRequest, 'id' | 'status'>) => void;
  onAcceptHelpRequest: (id: string) => void;
  workshops: Workshop[];
  onToggleJoinWorkshop: (id: string) => void;
  onAddWorkshop: (ws: Omit<Workshop, 'id' | 'isUserJoined'>) => void;
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
}

export const ActivitiesScreen: React.FC<ActivitiesScreenProps> = ({
  userName,
  neighbourhood,
  onOpenNeighbourhoodModal,
  onOpenNotifications,
  unreadCount,
  helpRequests,
  onAddHelpRequest,
  onAcceptHelpRequest,
  workshops,
  onToggleJoinWorkshop,
  onAddWorkshop,
  activeTab,
  onTabChange,
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'help' | 'skills'>('help');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedHelp, setSelectedHelp] = useState<HelpRequest | null>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [showPostHelpModal, setShowPostHelpModal] = useState(false);
  const [showHostWorkshopModal, setShowHostWorkshopModal] = useState(false);

  // Translate requests and workshops dynamically based on active language
  const translatedHelpRequests = helpRequests.map((h) => getTranslatedHelpRequest(t, h));
  const translatedWorkshops = workshops.map((w) => getTranslatedWorkshop(t, w));

  // Filter help requests
  const filteredHelp = translatedHelpRequests.filter((h) => {
    const originalReq = helpRequests.find((orig) => orig.id === h.id);
    const origCategory = originalReq ? originalReq.category : h.category;
    const matchesSearch =
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || origCategory === categoryFilter || h.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filter workshops
  const filteredWorkshops = translatedWorkshops.filter((w) => {
    const originalWs = workshops.find((orig) => orig.id === w.id);
    const origCategory = originalWs ? originalWs.category : w.category;
    const matchesSearch =
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || origCategory === categoryFilter || w.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Form states for posting help
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Shopping');
  const [newTime, setNewTime] = useState('Today · 5 PM');
  const [newCredits, setNewCredits] = useState(20);
  const [newDesc, setNewDesc] = useState('');

  // Form states for hosting workshop
  const [wsTitle, setWsTitle] = useState('');
  const [wsCategory, setWsCategory] = useState('Gardening');
  const [wsTime, setWsTime] = useState('Saturday · 3 PM');
  const [wsMax, setWsMax] = useState(6);
  const [wsDesc, setWsDesc] = useState('');

  const handlePostHelpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let icon = 'volunteer_activism';
    if (newCategory === 'Shopping') icon = 'shopping_basket';
    else if (newCategory === 'Gardening') icon = 'potted_plant';
    else if (newCategory === 'Technology') icon = 'smartphone';
    else if (newCategory === 'Cooking') icon = 'skillet';

    const initials = (userName || 'AT')
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    onAddHelpRequest({
      title: newTitle.trim(),
      category: newCategory,
      timeStr: newTime.trim() || 'Flexible time',
      requester: userName || 'You',
      requesterInitials: initials,
      credits: newCredits,
      icon,
      description: newDesc.trim() || 'Community neighbor request.',
    });

    setNewTitle('');
    setNewDesc('');
    setShowPostHelpModal(false);
  };

  const handleHostWorkshopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsTitle.trim()) return;

    let icon = 'school';
    if (wsCategory === 'Gardening') icon = 'psychiatry';
    else if (wsCategory === 'Arts & Crafts') icon = 'palette';
    else if (wsCategory === 'Cooking') icon = 'skillet';

    onAddWorkshop({
      title: wsTitle.trim(),
      category: wsCategory,
      timeStr: wsTime.trim() || 'Weekend · 10 AM',
      host: userName || 'You',
      joined: 1,
      max: wsMax,
      status: 'Waiting for Participants',
      icon,
      description: wsDesc.trim() || 'Fun and informative neighbor workshop.',
    });

    setWsTitle('');
    setWsDesc('');
    setShowHostWorkshopModal(false);
  };

  return (
    <div className="w-full max-w-[420px] min-h-screen md:min-h-[852px] bg-[#fcfbf9] text-[#775537] flex flex-col justify-between relative overflow-hidden md:rounded-3xl md:shadow-2xl border-x md:border border-[#775537]/20 select-none pb-20">
      {/* Fixed Top Header */}
      <header className="sticky top-0 z-30 w-full bg-[#fcfbf9]/95 backdrop-blur-md px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#775537]/10">
        {/* SkillSpill Wordmark with Butter Yellow Dot */}
        <div className="flex items-center gap-1.5 cursor-pointer">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FBE29D] border border-[#775537]/30 inline-block shadow-xs"></span>
          <span className="font-bold text-xl tracking-tight text-[#775537]">SkillSpill</span>
        </div>

        {/* Right Controls: Location Dropdown Pill & Bell */}
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
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FBE29D] border border-[#775537]"></span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-5 pt-3 space-y-4">
        {/* Page Heading */}
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight text-[#775537]">{t('tabs.activities')}</h1>
          <p className="text-xs font-medium text-[#775537]/70">Find a little way to connect!</p>
        </div>

        {/* Help / Skills Mode Switch (Segmented Control) */}
        <div className="w-full bg-[#775537]/10 p-1 rounded-full flex items-center gap-1">
          {/* Help Mode Tab */}
          <button
            onClick={() => setMode('help')}
            className={`flex-1 py-2 px-3 rounded-full flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-200 cursor-pointer ${
              mode === 'help'
                ? 'text-[#775537] bg-[#FBE29D] shadow-xs font-bold'
                : 'text-[#775537]/70 hover:text-[#775537]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[19px]">volunteer_activism</span>
            <span>{t('activities.helpTab')}</span>
          </button>

          {/* Skills Mode Tab */}
          <button
            onClick={() => setMode('skills')}
            className={`flex-1 py-2 px-3 rounded-full flex items-center justify-center gap-2 font-medium text-sm transition-all duration-200 cursor-pointer ${
              mode === 'skills'
                ? 'text-[#775537] bg-[#C0DDDA] shadow-xs font-bold'
                : 'text-[#775537]/70 hover:text-[#775537]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[19px]">school</span>
            <span>{t('activities.skillsTab')}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#775537]/50 text-[20px]">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('activities.searchPlaceholder')}
            className="w-full bg-white border border-[#775537]/20 rounded-full py-2.5 pl-10 pr-4 text-xs font-medium text-[#775537] placeholder:text-[#775537]/50 focus:outline-none focus:border-[#775537] focus:ring-1 focus:ring-[#775537] shadow-xs transition-all"
            type="text"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#775537]/50 hover:text-[#775537]"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex-1 relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-white border border-[#775537]/20 rounded-full py-2 pl-3.5 pr-8 text-[#775537] font-medium shadow-xs appearance-none outline-none cursor-pointer"
            >
              <option value="All">{t('common.all')}</option>
              <option value="Shopping">{t('categories.Shopping')}</option>
              <option value="Gardening">{t('categories.Gardening')}</option>
              <option value="Technology">{t('categories.Technology')}</option>
              <option value="Cooking">{t('categories.Cooking')}</option>
              <option value="Arts & Crafts">{t('categories.Arts & Crafts')}</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-[#775537]/60 pointer-events-none">
              expand_more
            </span>
          </div>

          <button
            onClick={() => setCategoryFilter('All')}
            className={`bg-white border rounded-full py-2 px-3.5 flex items-center gap-1.5 font-medium shadow-xs transition-colors cursor-pointer ${
              categoryFilter !== 'All'
                ? 'border-[#775537] bg-[#FBE29D]/50 text-[#775537]'
                : 'border-[#775537]/20 text-[#775537] hover:bg-[#FAF8F5]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#775537]/70">tune</span>
            <span>{categoryFilter !== 'All' ? t('common.cancel') : t('common.all')}</span>
          </button>
        </div>

        {/* ================= HELP MODE VIEW ================= */}
        {mode === 'help' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* Section Title & Counter */}
            <div className="flex items-center justify-between pt-1">
              <h2 className="text-base font-bold text-[#775537]">{t('activities.urgentHelpTitle')}</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FBE29D]/60 border border-[#775537]/20 text-[#775537]">
                {filteredHelp.length}
              </span>
            </div>

            {filteredHelp.length === 0 ? (
              <div className="bg-white/80 rounded-3xl p-6 text-center border-2 border-[#775537]/15">
                <span className="material-symbols-outlined text-4xl text-[#775537]/40 mb-2">sentiment_satisfied</span>
                <p className="text-sm font-bold text-[#775537]">{t('activities.emptyHelp')}</p>
              </div>
            ) : (
              filteredHelp.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedHelp(req)}
                  className="bg-white/80 rounded-[24px] p-4 border-2 border-[#775537]/15 shadow-xs hover:border-[#775537]/35 transition-all cursor-pointer group active:scale-[0.99]"
                >
                  {/* Top Section */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#FBE29D] border border-[#775537]/20 flex items-center justify-center shrink-0 text-[#775537] shadow-xs">
                        <span className="material-symbols-outlined text-[22px]">{req.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-[#775537] leading-snug">{req.title}</h3>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-[#775537]/70">
                          <span className="material-symbols-outlined text-[13px]">schedule</span>
                          <span>{req.timeStr}</span>
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#775537]/50 text-[18px] mt-1.5 group-hover:translate-x-0.5 transition-transform">
                      chevron_right
                    </span>
                  </div>

                  <div className="my-3 border-t border-[#775537]/10"></div>

                  {/* Bottom Section */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#F1F1F1] border border-[#775537]/25 flex items-center justify-center text-[10px] font-bold text-[#775537]">
                        {req.requesterInitials}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-[#775537]/60">{t('activities.requesterLabel')}</span>
                        <span className="font-semibold text-[#775537]">{req.requester}</span>
                      </div>
                    </div>

                    {/* Credit Reward Pill */}
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FBE29D]/60 border border-[#775537]/25 font-bold text-[#775537] text-xs">
                      <span className="material-symbols-outlined text-[14px]">monetization_on</span>
                      <span>{req.credits} {t('common.credits')}</span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Primary Action: Post a Help Request Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowPostHelpModal(true)}
                className="w-full py-3.5 px-4 rounded-full bg-[#775537] text-white font-medium text-sm tracking-wide shadow-xs hover:bg-[#65462c] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>{t('activities.askForHelpBtn')}</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= SKILLS MODE VIEW ================= */}
        {mode === 'skills' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* Section Title & Counter */}
            <div className="flex items-center justify-between pt-1">
              <h2 className="text-base font-bold text-[#775537]">{t('activities.upcomingWorkshopsTitle')}</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#C0DDDA]/60 border border-[#775537]/20 text-[#775537]">
                {filteredWorkshops.length}
              </span>
            </div>

            {filteredWorkshops.map((ws) => (
              <div
                key={ws.id}
                onClick={() => setSelectedWorkshop(ws)}
                className="bg-white/80 rounded-[24px] p-4 border-2 border-[#775537]/15 shadow-xs hover:border-[#775537]/35 transition-all cursor-pointer group active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#C0DDDA] border border-[#775537]/20 flex items-center justify-center shrink-0 text-[#775537] shadow-xs">
                      <span className="material-symbols-outlined text-[22px]">{ws.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#775537] leading-snug">{ws.title}</h3>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-[#775537]/70">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        <span>{ws.timeStr}</span>
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#775537]/50 text-[18px] mt-1.5 group-hover:translate-x-0.5 transition-transform">
                    chevron_right
                  </span>
                </div>

                <div className="my-3 border-t border-[#775537]/10"></div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#775537]">
                    <span
                      className={`material-symbols-outlined text-[15px] ${
                        ws.joined >= ws.max ? 'text-emerald-600' : 'text-[#775537]/60'
                      }`}
                    >
                      group
                    </span>
                    <span className="font-medium">
                      {ws.joined} / {ws.max} {t('common.members').toLowerCase()}
                    </span>
                  </div>

                  {ws.isUserJoined ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FBE29D]/80 border border-[#775537]/30 text-[#775537] text-[11px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span>
                      <span>{t('activities.joinedWorkshopBadge')}</span>
                    </span>
                  ) : ws.status === 'Confirmed' || ws.status === t('common.confirmed') ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C0DDDA]/70 border border-[#775537]/30 text-[#775537] text-[11px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span>
                      <span>{t('common.confirmed')}</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 border border-[#775537]/20 text-[#775537]/70 text-[11px] font-semibold">
                      {t('common.waitingParticipants')}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Primary Action: Host a Workshop Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowHostWorkshopModal(true)}
                className="w-full py-3.5 px-4 rounded-full bg-[#775537] text-white font-medium text-sm tracking-wide shadow-xs hover:bg-[#65462c] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>{t('activities.hostWorkshopBtn')}</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 max-w-[420px] mx-auto bg-white/95 backdrop-blur-md border-t border-[#775537]/10 py-2 px-6 flex justify-around items-center z-40">
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#775537] font-bold'
              : 'text-[#775537]/60 hover:text-[#775537]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">home</span>
          <span className="text-[11px] font-semibold">{t('tabs.home')}</span>
        </button>

        <button
          onClick={() => onTabChange('activities')}
          className="flex flex-col items-center gap-0.5 py-1 px-4 bg-[#FBE29D] border border-[#775537]/30 rounded-full text-[#775537] shadow-xs active:scale-95 transition-transform cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[24px] fill-1 text-[#775537]">groups</span>
          <span className="text-[11px] font-bold text-[#775537]">{t('tabs.activities')}</span>
        </button>

        <button
          onClick={() => onTabChange('quests')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors cursor-pointer ${
            activeTab === 'quests'
              ? 'text-[#775537] font-bold'
              : 'text-[#775537]/60 hover:text-[#775537]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">emoji_events</span>
          <span className="text-[11px] font-semibold">{t('tabs.quests')}</span>
        </button>

        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'text-[#775537] font-bold'
              : 'text-[#775537]/60 hover:text-[#775537]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[24px]">person</span>
          <span className="text-[11px] font-semibold">{t('tabs.profile')}</span>
        </button>
      </nav>

      {/* Help Request Detail Modal */}
      {selectedHelp && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[#775537]/20 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FBE29D] flex items-center justify-center text-[#775537] border border-[#775537]/20">
                  <span className="material-symbols-outlined text-2xl">{selectedHelp.icon}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#775537]">{selectedHelp.title}</h3>
                  <p className="text-xs text-[#775537]/70">{selectedHelp.timeStr}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedHelp(null)}
                className="w-8 h-8 rounded-full bg-[#f3f3f3] flex items-center justify-center text-[#775537] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#50453c] leading-relaxed bg-[#FAF8F5] p-3 rounded-2xl border border-[#775537]/10">
              {selectedHelp.description}
            </p>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-[#F1F1F1] text-[10px] font-bold flex items-center justify-center border border-[#775537]/20">
                  {selectedHelp.requesterInitials}
                </span>
                <span className="font-semibold text-[#775537]">{selectedHelp.requester}</span>
              </div>
              <div className="px-3 py-1 bg-[#FBE29D]/70 border border-[#775537]/30 text-[#775537] rounded-full font-bold">
                +{selectedHelp.credits} {t('common.credits')}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  onAcceptHelpRequest(selectedHelp.id);
                  setSelectedHelp(null);
                }}
                className="w-full py-3.5 rounded-full bg-[#775537] text-white font-bold text-sm hover:bg-[#604229] active:scale-98 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">handshake</span>
                <span>{t('common.offerHelp')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workshop Detail Modal */}
      {selectedWorkshop && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[#775537]/20 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#C0DDDA] flex items-center justify-center text-[#775537] border border-[#775537]/20">
                  <span className="material-symbols-outlined text-2xl">{selectedWorkshop.icon}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#775537]">{selectedWorkshop.title}</h3>
                  <p className="text-xs text-[#775537]/70">
                    {t('activities.hostLabel')}: {selectedWorkshop.host}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWorkshop(null)}
                className="w-8 h-8 rounded-full bg-[#f3f3f3] flex items-center justify-center text-[#775537] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#50453c] leading-relaxed bg-[#FAF8F5] p-3 rounded-2xl border border-[#775537]/10">
              {selectedWorkshop.description}
            </p>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-1.5 text-[#775537] font-semibold">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>{selectedWorkshop.timeStr}</span>
              </div>
              <span className="px-3 py-1 bg-[#C0DDDA]/70 border border-[#775537]/30 text-[#775537] rounded-full font-bold">
                {selectedWorkshop.joined} / {selectedWorkshop.max} {t('common.members').toLowerCase()}
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  onToggleJoinWorkshop(selectedWorkshop.id);
                  setSelectedWorkshop(null);
                }}
                className={`w-full py-3.5 rounded-full font-bold text-sm active:scale-98 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                  selectedWorkshop.isUserJoined
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    : 'bg-[#775537] text-white hover:bg-[#604229]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {selectedWorkshop.isUserJoined ? 'logout' : 'check_circle'}
                </span>
                <span>
                  {selectedWorkshop.isUserJoined ? t('activities.leaveThisWorkshop') : t('activities.joinThisWorkshop')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Help Request Modal */}
      {showPostHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[#775537]/20 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FBE29D] text-[#775537] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </div>
                <h3 className="text-base font-bold text-[#775537]">{t('activities.postHelpModalTitle')}</h3>
              </div>
              <button
                onClick={() => setShowPostHelpModal(false)}
                className="w-7 h-7 rounded-full bg-[#f3f3f3] flex items-center justify-center text-[#775537] text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostHelpSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#775537] mb-1">{t('activities.requestTitleLabel')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('activities.requestTitlePlaceholder')}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#775537]/20 rounded-xl px-3 py-2 text-[#775537] focus:outline-none focus:border-[#775537]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#775537] mb-1">{t('activities.categoryLabel')}</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#775537]/20 rounded-xl px-3 py-2 text-[#775537] outline-none"
                  >
                    <option value="Shopping">{t('categories.Shopping')}</option>
                    <option value="Gardening">{t('categories.Gardening')}</option>
                    <option value="Technology">{t('categories.Technology')}</option>
                    <option value="Cooking">{t('categories.Cooking')}</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#775537] mb-1">{t('activities.creditsOfferLabel')}</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={newCredits}
                    onChange={(e) => setNewCredits(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-[#775537]/20 rounded-xl px-3 py-2 text-[#775537] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#775537] mb-1">{t('activities.timeLabel')}</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder={t('activities.timePlaceholder')}
                  className="w-full bg-[#FAF8F5] border border-[#775537]/20 rounded-xl px-3 py-2 text-[#775537] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#775537] mb-1">{t('activities.descLabel')}</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder={t('activities.descPlaceholder')}
                  className="w-full bg-[#FAF8F5] border border-[#775537]/20 rounded-xl px-3 py-2 text-[#775537] outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostHelpModal(false)}
                  className="flex-1 py-3 rounded-full bg-[#f3f3f3] text-[#775537] font-bold cursor-pointer"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#775537] text-white font-bold hover:bg-[#5f4024] shadow-xs cursor-pointer"
                >
                  {t('activities.postSubmitBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Host Workshop Modal */}
      {showHostWorkshopModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[#775537]/20 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#C0DDDA] text-[#775537] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">school</span>
                </div>
                <h3 className="text-base font-bold text-[#775537]">{t('activities.hostModalTitle')}</h3>
              </div>
              <button
                onClick={() => setShowHostWorkshopModal(false)}
                className="w-7 h-7 rounded-full bg-[#f3f3f3] flex items-center justify-center text-[#775537] text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleHostWorkshopSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#775537] mb-1">{t('activities.wsTitleLabel')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('activities.wsTitlePlaceholder')}
                  value={wsTitle}
                  onChange={(e) => setWsTitle(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#775537]/20 rounded-xl px-3 py-2 text-[#775537] focus:outline-none focus:border-[#775537]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#775537] mb-1">{t('activities.categoryLabel')}</label>
                  <select
                    value={wsCategory}
                    onChange={(e) => setWsCategory(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#775537]/20 rounded-xl px-3 py-2 text-[#775537] outline-none"
                  >
                    <option value="Cooking">{t('categories.Cooking')}</option>
                    <option value="Gardening">{t('categories.Gardening')}</option>
                    <option value="Arts & Crafts">{t('categories.Arts & Crafts')}</option>
                    <option value="Technology">{t('categories.Technology')}</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#775537] mb-1">{t('activities.maxParticipantsLabel')}</label>
                  <input
                    type="number"
                    min={2}
                    max={20}
                    value={wsMax}
                    onChange={(e) => setWsMax(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-[#775537]/20 rounded-xl px-3 py-2 text-[#775537] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#775537] mb-1">{t('activities.timeLabel')}</label>
                <input
                  type="text"
                  value={wsTime}
                  onChange={(e) => setWsTime(e.target.value)}
                  placeholder={t('activities.timePlaceholder')}
                  className="w-full bg-[#FAF8F5] border border-[#775537]/20 rounded-xl px-3 py-2 text-[#775537] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#775537] mb-1">{t('activities.descLabel')}</label>
                <textarea
                  rows={3}
                  value={wsDesc}
                  onChange={(e) => setWsDesc(e.target.value)}
                  placeholder={t('activities.descPlaceholder')}
                  className="w-full bg-[#FAF8F5] border border-[#775537]/20 rounded-xl px-3 py-2 text-[#775537] outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowHostWorkshopModal(false)}
                  className="flex-1 py-3 rounded-full bg-[#f3f3f3] text-[#775537] font-bold cursor-pointer"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#775537] text-white font-bold hover:bg-[#5f4024] shadow-xs cursor-pointer"
                >
                  {t('activities.createWsSubmitBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
