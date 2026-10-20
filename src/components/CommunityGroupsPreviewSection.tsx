import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CommunityGroup } from '../types';

interface CommunityGroupsPreviewSectionProps {
  groups: CommunityGroup[];
  selectedInterests: string[];
  neighbourhood: string;
  onSeeAll: () => void;
  onOpenGroup: (group: CommunityGroup) => void;
  onToggleJoin: (groupId: string, join: boolean) => void;
}

export const CommunityGroupsPreviewSection: React.FC<CommunityGroupsPreviewSectionProps> = ({
  groups,
  selectedInterests,
  neighbourhood,
  onSeeAll,
  onOpenGroup,
  onToggleJoin,
}) => {
  const { t } = useTranslation();

  // Rule-based personalization:
  // 1. Prioritize groups matching resident's selected onboarding interests
  // 2. Prioritize groups in the same township / neighbourhood
  // 3. Fall back to popular available community groups (by membersCount)
  const featuredGroups = useMemo(() => {
    if (!groups || groups.length === 0) return [];

    const scored = [...groups].map((g) => {
      let score = 0;
      // Match neighbourhood / township
      if (g.neighbourhood.toLowerCase() === neighbourhood.toLowerCase()) {
        score += 3;
      }
      // Match resident's selected interests
      if (g.interestId && selectedInterests.includes(g.interestId)) {
        score += 4;
      }
      // Joined status slight priority so user sees their groups
      if (g.isJoined) {
        score += 1;
      }
      return { group: g, score };
    });

    scored.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // Popularity fallback
      return b.group.membersCount - a.group.membersCount;
    });

    // Take top 4-5 groups for horizontal swipe
    return scored.slice(0, 5).map((s) => s.group);
  }, [groups, selectedInterests, neighbourhood]);

  return (
    <section aria-labelledby="your-community-heading" className="w-full space-y-2.5 pt-1">
      {/* Section Header */}
      <div className="flex items-start justify-between gap-2 px-0.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h3
              id="your-community-heading"
              className="text-sm font-extrabold text-[#775537] tracking-tight flex items-center gap-1.5"
            >
              <span>{t('groups.sectionTitle', { defaultValue: 'Your Community' })}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBE29D] border border-[#775537]/30"></span>
            </h3>
          </div>
          <p className="text-[11px] text-[#775537]/75 font-medium leading-snug">
            {t('groups.sectionSubtitle', { defaultValue: 'Find your people, right around the corner.' })}
          </p>
        </div>

        <button
          onClick={onSeeAll}
          type="button"
          className="text-xs font-bold text-[#775537] hover:underline cursor-pointer shrink-0 py-0.5 px-1 active:scale-95 transition-transform"
        >
          {t('groups.seeAll', { defaultValue: 'See All' })} →
        </button>
      </div>

      {/* Horizontal Carousel (approx 1.5 cards visible on mobile for intuitive swipe cue) */}
      {featuredGroups.length === 0 ? (
        <div className="bg-white rounded-2xl p-4 text-center border border-[#775537]/15 shadow-xs">
          <p className="text-xs text-[#775537]/70 font-medium">
            {t('groups.empty', { defaultValue: 'No community groups found in your neighbourhood yet.' })}
          </p>
        </div>
      ) : (
        <div className="relative -mx-5 px-5">
          <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 snap-x snap-mandatory scroll-smooth no-scrollbar">
            {featuredGroups.map((group) => {
              return (
                <article
                  key={group.id}
                  onClick={() => onOpenGroup(group)}
                  className="w-[245px] shrink-0 snap-start bg-white rounded-2xl border border-[#775537]/15 shadow-xs hover:border-[#775537]/35 transition-all cursor-pointer flex flex-col justify-between overflow-hidden group active:scale-[0.99]"
                >
                  {/* Top Image Banner */}
                  <div className="relative h-24 w-full bg-[#F4F2EE] overflow-hidden">
                    <img
                      src={group.imageUrl}
                      alt={group.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10"></div>

                    {/* Category Tag Overlay */}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-[#775537] border border-[#775537]/20 shadow-xs">
                        {t(`categories.${group.category}`, { defaultValue: group.category })}
                      </span>
                    </div>

                    {/* Joined Indicator Ribbon */}
                    {group.isJoined && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#C0DDDA] text-[#244240] text-[10px] font-extrabold flex items-center gap-1 shadow-xs border border-[#775537]/20">
                          <span className="material-symbols-outlined text-[12px] font-black">check</span>
                          <span>{t('groups.joined', { defaultValue: 'Joined' })}</span>
                        </span>
                      </div>
                    )}

                    {/* Members Count Overlaid on Bottom of Image */}
                    <div className="absolute bottom-1.5 left-2.5 flex items-center gap-1 text-white text-[11px] font-semibold drop-shadow-xs">
                      <span className="material-symbols-outlined text-[14px]">groups</span>
                      <span>
                        {t('groups.members', { count: group.membersCount, defaultValue: `${group.membersCount} members` })}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-3 flex-1 flex flex-col justify-between gap-2.5">
                    <div>
                      <h4 className="text-xs font-black text-[#775537] leading-snug line-clamp-1 group-hover:text-[#5c3e23]">
                        {group.name}
                      </h4>

                      {/* Optional Short Upcoming Activity Indicator */}
                      {group.upcomingActivity ? (
                        <div className="mt-1.5 flex items-center gap-1.5 text-[10.5px] text-[#775537]/80 bg-[#FEF7DF] px-2 py-1 rounded-xl border border-[#FBE29D]/60 truncate">
                          <span className="material-symbols-outlined text-[13px] text-[#775537] shrink-0">event</span>
                          <span className="truncate">
                            <strong className="font-bold">{group.upcomingActivity.title}</strong> · {group.upcomingActivity.dateStr}
                          </span>
                        </div>
                      ) : (
                        <p className="mt-1 text-[11px] text-[#775537]/70 line-clamp-1 leading-normal">
                          {group.description}
                        </p>
                      )}
                    </div>

                    {/* Compact Card Action Area */}
                    <div className="pt-1 border-t border-[#775537]/10 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenGroup(group);
                        }}
                        className="text-[11px] font-bold text-[#775537] hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        <span>{t('groups.viewGroup', { defaultValue: 'View Group' })}</span>
                        <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                      </button>

                      {group.isJoined ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleJoin(group.id, false);
                          }}
                          className="px-2.5 py-1 rounded-full bg-[#F4F2EE] hover:bg-[#EAE6DF] text-[#775537] text-[10px] font-bold border border-[#775537]/15 transition-all cursor-pointer active:scale-95"
                          title={t('groups.leaveGroup', { defaultValue: 'Leave Group' })}
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
                          className="px-3 py-1 rounded-full bg-[#FBE29D] hover:bg-[#fae19c] text-[#775537] text-[10.5px] font-extrabold border border-[#775537]/25 shadow-xs transition-all cursor-pointer active:scale-95"
                        >
                          {t('groups.joinGroup', { defaultValue: 'Join Group' })}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
