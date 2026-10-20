import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CommunityGroup } from '../types';

interface CommunityGroupsModalProps {
  groups: CommunityGroup[];
  neighbourhood: string;
  selectedInterests: string[];
  currentUserName: string;
  onOpenGroupDetails: (group: CommunityGroup) => void;
  onToggleJoin: (groupId: string, join: boolean) => void;
  onCreateGroup: (newGroup: Omit<CommunityGroup, 'id' | 'membersCount' | 'isJoined'>) => void;
  onClose: () => void;
}

export const CommunityGroupsModal: React.FC<CommunityGroupsModalProps> = ({
  groups,
  neighbourhood,
  selectedInterests,
  currentUserName,
  onOpenGroupDetails,
  onToggleJoin,
  onCreateGroup,
  onClose,
}) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'explore' | 'my_groups'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state for creating a new group
  const [createName, setCreateName] = useState('');
  const [createCategory, setCreateCategory] = useState('Gardening');
  const [createDesc, setCreateDesc] = useState('');
  const [createFrequency, setCreateFrequency] = useState('Weekly on Weekends');

  const categories = ['All', 'Gardening', 'Cooking & Baking', 'Sports & Fitness', 'Arts & Crafts', 'Technology', 'Community Help'];

  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      // Tab filter
      if (tab === 'my_groups' && !g.isJoined) return false;

      // Category filter
      if (selectedCategory !== 'All' && g.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = g.name.toLowerCase().includes(query);
        const matchesCategory = g.category.toLowerCase().includes(query);
        const matchesDesc = g.description.toLowerCase().includes(query);
        const matchesNeighbourhood = g.neighbourhood.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesDesc && !matchesNeighbourhood) {
          return false;
        }
      }

      return true;
    });
  }, [groups, tab, selectedCategory, searchQuery]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;

    let interestId = 'community';
    let defaultImg = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80';

    if (createCategory.includes('Garden')) {
      interestId = 'gardening';
      defaultImg = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80';
    } else if (createCategory.includes('Cook')) {
      interestId = 'cooking';
      defaultImg = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80';
    } else if (createCategory.includes('Fitness') || createCategory.includes('Sport')) {
      interestId = 'fitness';
      defaultImg = 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80';
    } else if (createCategory.includes('Craft') || createCategory.includes('Art')) {
      interestId = 'arts';
      defaultImg = 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=600&q=80';
    } else if (createCategory.includes('Tech')) {
      interestId = 'tech';
      defaultImg = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80';
    }

    onCreateGroup({
      name: createName.trim(),
      category: createCategory,
      interestId,
      neighbourhood: neighbourhood || 'Maple Heights',
      imageUrl: defaultImg,
      description: createDesc.trim() || 'A welcoming local group founded by neighbours for neighbours.',
      meetingFrequency: createFrequency,
      rules: [
        'Be respectful and kind to all neighbours.',
        'Support one another and share skills generously.',
      ],
      discussions: [
        {
          id: `disc-${Date.now()}`,
          authorId: `user-${currentUserName.toLowerCase().replace(/\s+/g, '-')}`,
          authorName: currentUserName,
          authorInitials: currentUserName
            .split(' ')
            .map((p) => p[0])
            .join('')
            .toUpperCase()
            .slice(0, 2),
          avatarIcon: 'person',
          message: 'Welcome everyone to our new community group! Feel free to say hi and introduce yourself.',
          timestamp: Date.now(),
          timeAgoStr: 'Just now',
          likes: 1,
        },
      ],
    });

    setCreateName('');
    setCreateDesc('');
    setShowCreateModal(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="community-groups-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-[420px] h-[92vh] max-h-[852px] bg-[#fcfbf9] text-[#775537] rounded-3xl border border-[#775537]/20 shadow-2xl flex flex-col overflow-hidden relative">
        {/* Fixed Header */}
        <header className="px-5 pt-4 pb-3 bg-white/95 backdrop-blur-md border-b border-[#775537]/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#FBE29D] border border-[#775537]/20 flex items-center justify-center text-[#775537] shadow-xs">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
            <div>
              <h2 id="community-groups-title" className="text-base font-black text-[#775537] tracking-tight">
                {t('groups.pageTitle', { defaultValue: 'Community Groups' })}
              </h2>
              <p className="text-[11px] text-[#775537]/75 font-semibold">
                {neighbourhood} · {groups.length} {t('common.circles', { defaultValue: 'circles' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowCreateModal(true)}
              type="button"
              className="px-2.5 py-1.5 rounded-full bg-[#FBE29D] hover:bg-[#fae19c] text-[#775537] text-xs font-bold border border-[#775537]/25 shadow-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              <span>{t('groups.createGroup', { defaultValue: 'Create' })}</span>
            </button>

            <button
              onClick={onClose}
              aria-label={t('common.close')}
              type="button"
              className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#775537]/20 text-[#775537] flex items-center justify-center hover:bg-[#F4F2EE] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </header>

        {/* Search & Tabs Controls */}
        <div className="p-3.5 pb-2 bg-[#FAF8F5] border-b border-[#775537]/10 space-y-2.5 shrink-0">
          {/* Search Bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#775537]/50">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('groups.searchPlaceholder', { defaultValue: 'Search groups or interests...' })}
              className="w-full bg-white border border-[#775537]/20 rounded-full pl-9 pr-8 py-2 text-xs text-[#775537] placeholder-[#775537]/50 focus:outline-hidden focus:ring-1 focus:ring-[#775537]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[#775537]/50 hover:text-[#775537]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Explore vs My Groups Tabs */}
          <div className="flex bg-[#EFECE6] p-1 rounded-2xl border border-[#775537]/10">
            <button
              type="button"
              onClick={() => setTab('explore')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === 'explore'
                  ? 'bg-white text-[#775537] shadow-xs'
                  : 'text-[#775537]/65 hover:text-[#775537]'
              }`}
            >
              {t('groups.filterDiscover', { defaultValue: 'Explore All' })} ({groups.length})
            </button>
            <button
              type="button"
              onClick={() => setTab('my_groups')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tab === 'my_groups'
                  ? 'bg-white text-[#775537] shadow-xs'
                  : 'text-[#775537]/65 hover:text-[#775537]'
              }`}
            >
              {t('groups.filterMy', { defaultValue: 'My Circles' })} ({groups.filter((g) => g.isJoined).length})
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#775537] text-white shadow-xs'
                    : 'bg-white border border-[#775537]/15 text-[#775537]/80 hover:bg-[#FBE29D]/30'
                }`}
              >
                {t(`categories.${cat}`, { defaultValue: cat })}
              </button>
            ))}
          </div>
        </div>

        {/* Group Listings */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {filteredGroups.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#775537]/15 shadow-xs my-4 space-y-2">
              <span className="material-symbols-outlined text-4xl text-[#775537]/40 block">diversity_3</span>
              <h4 className="text-sm font-extrabold text-[#775537]">
                {t('groups.empty', { defaultValue: 'No community groups found' })}
              </h4>
              <p className="text-xs text-[#775537]/70 max-w-[240px] mx-auto leading-relaxed">
                {t('groups.emptyDesc', { defaultValue: 'Check back later or start a new group for your neighbourhood!' })}
              </p>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="mt-2 px-4 py-2 rounded-full bg-[#FBE29D] text-[#775537] text-xs font-bold border border-[#775537]/25 shadow-xs"
              >
                {t('groups.createGroup', { defaultValue: 'Start a Circle' })}
              </button>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => onOpenGroupDetails(group)}
                className="bg-white rounded-2xl border border-[#775537]/15 shadow-xs hover:border-[#775537]/35 transition-all overflow-hidden flex flex-col group cursor-pointer active:scale-[0.99]"
              >
                <div className="relative h-28 w-full bg-[#f4f2ee] overflow-hidden">
                  <img
                    src={group.imageUrl}
                    alt={group.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>

                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-[#775537] border border-[#775537]/20 shadow-xs">
                      {t(`categories.${group.category}`, { defaultValue: group.category })}
                    </span>
                  </div>

                  {group.isJoined && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#C0DDDA] text-[#1c3836] text-[10px] font-extrabold flex items-center gap-1 shadow-xs border border-[#775537]/20">
                        <span className="material-symbols-outlined text-[13px] font-black">check</span>
                        <span>{t('groups.joined', { defaultValue: 'Joined' })}</span>
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-2 left-3 flex items-center gap-2 text-white text-xs font-semibold drop-shadow-xs">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">groups</span>
                      <span>
                        {t('groups.members', { count: group.membersCount, defaultValue: `${group.membersCount} members` })}
                      </span>
                    </div>
                    <span>·</span>
                    <span className="truncate">{group.neighbourhood}</span>
                  </div>
                </div>

                <div className="p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-extrabold text-[#775537] leading-snug group-hover:text-[#5c3e23]">
                      {group.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#50453c] leading-relaxed line-clamp-2">
                    {group.description}
                  </p>

                  {group.upcomingActivity && (
                    <div className="flex items-center gap-1.5 text-xs text-[#775537] bg-[#FEF7DF] p-2 rounded-xl border border-[#FBE29D]">
                      <span className="material-symbols-outlined text-[15px] text-[#775537]">event</span>
                      <span className="truncate">
                        <strong className="font-bold">{group.upcomingActivity.title}</strong> · {group.upcomingActivity.dateStr}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#775537]/10 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenGroupDetails(group);
                      }}
                      className="text-xs font-bold text-[#775537] hover:underline flex items-center gap-1"
                    >
                      <span>{t('groups.viewGroup', { defaultValue: 'View Circle' })}</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>

                    {group.isJoined ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleJoin(group.id, false);
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#F4F2EE] hover:bg-[#EAE6DF] text-[#775537] text-xs font-bold border border-[#775537]/20 transition-all cursor-pointer active:scale-95"
                      >
                        {t('groups.joined', { defaultValue: 'Joined' })} ✓
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleJoin(group.id, true);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-[#FBE29D] hover:bg-[#fae19c] text-[#775537] text-xs font-extrabold border border-[#775537]/30 shadow-xs transition-all cursor-pointer active:scale-95"
                      >
                        {t('groups.joinGroup', { defaultValue: 'Join Circle' })}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Group Sub-Modal */}
        {showCreateModal && (
          <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full bg-[#FCFBF9] rounded-3xl border border-[#775537]/20 shadow-2xl p-5 space-y-3.5 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#775537]/10 pb-2.5">
                <h3 className="text-sm font-extrabold text-[#775537] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">group_add</span>
                  <span>{t('groups.createTitle', { defaultValue: 'Start a Community Circle' })}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-7 h-7 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#775537]"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label htmlFor="group-name" className="font-bold text-[#775537] block">
                    {t('groups.nameLabel', { defaultValue: 'Circle Name' })} *
                  </label>
                  <input
                    id="group-name"
                    type="text"
                    required
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="e.g. Balcony Herb Enthusiasts"
                    className="w-full bg-white border border-[#775537]/20 rounded-xl px-3 py-2 text-xs text-[#775537] focus:outline-hidden focus:ring-1 focus:ring-[#775537]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="group-cat" className="font-bold text-[#775537] block">
                    {t('groups.categoryLabel', { defaultValue: 'Interest Category' })}
                  </label>
                  <select
                    id="group-cat"
                    value={createCategory}
                    onChange={(e) => setCreateCategory(e.target.value)}
                    className="w-full bg-white border border-[#775537]/20 rounded-xl px-3 py-2 text-xs text-[#775537] focus:outline-hidden focus:ring-1 focus:ring-[#775537]"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="group-freq" className="font-bold text-[#775537] block">
                    {t('groups.frequencyLabel', { defaultValue: 'Meeting Frequency' })}
                  </label>
                  <input
                    id="group-freq"
                    type="text"
                    value={createFrequency}
                    onChange={(e) => setCreateFrequency(e.target.value)}
                    placeholder="e.g. Weekly on Weekends"
                    className="w-full bg-white border border-[#775537]/20 rounded-xl px-3 py-2 text-xs text-[#775537] focus:outline-hidden focus:ring-1 focus:ring-[#775537]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="group-desc" className="font-bold text-[#775537] block">
                    {t('groups.descriptionLabel', { defaultValue: 'Short Description' })}
                  </label>
                  <textarea
                    id="group-desc"
                    rows={2}
                    value={createDesc}
                    onChange={(e) => setCreateDesc(e.target.value)}
                    placeholder="What is this circle about and what activities will you do together?"
                    className="w-full bg-white border border-[#775537]/20 rounded-xl px-3 py-2 text-xs text-[#775537] focus:outline-hidden focus:ring-1 focus:ring-[#775537]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-full bg-[#FAF8F5] text-[#775537] border border-[#775537]/20 font-bold"
                  >
                    {t('common.cancel', { defaultValue: 'Cancel' })}
                  </button>
                  <button
                    type="submit"
                    disabled={!createName.trim()}
                    className="px-5 py-2 rounded-full bg-[#775537] disabled:opacity-50 text-white font-extrabold shadow-xs hover:bg-[#62452c]"
                  >
                    {t('groups.createConfirm', { defaultValue: 'Create Circle' })}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
