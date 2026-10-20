import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CommunityGroup } from '../types';

interface GroupDetailsModalProps {
  group: CommunityGroup;
  currentUserName: string;
  onToggleJoin: (groupId: string, join: boolean) => void;
  onPostMessage: (groupId: string, message: string) => void;
  onRsvpActivity: (groupId: string, activityId: string) => void;
  onClose: () => void;
}

export const GroupDetailsModal: React.FC<GroupDetailsModalProps> = ({
  group,
  currentUserName,
  onToggleJoin,
  onPostMessage,
  onRsvpActivity,
  onClose,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'about' | 'activities' | 'discussion'>('about');
  const [newMessage, setNewMessage] = useState('');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onPostMessage(group.id, newMessage.trim());
    setNewMessage('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="group-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-[420px] max-h-[90vh] bg-[#fcfbf9] text-[#775537] rounded-3xl border border-[#775537]/20 shadow-2xl flex flex-col overflow-hidden relative">
        {/* Cover Image Header */}
        <div className="relative h-44 w-full bg-[#f4f2ee] shrink-0">
          <img
            src={group.imageUrl}
            alt={group.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label={t('common.close')}
            type="button"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-[#775537] flex items-center justify-center shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer z-10"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>

          {/* Category & Location Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-[11px] font-bold text-[#775537] shadow-xs">
              {t(`categories.${group.category}`, { defaultValue: group.category })}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-[10px] font-semibold text-white flex items-center gap-1 border border-white/20">
              <span className="material-symbols-outlined text-[12px]">location_on</span>
              <span>{group.neighbourhood}</span>
            </span>
          </div>

          {/* Title and Join Status */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 text-white">
            <div className="space-y-0.5 max-w-[240px]">
              <h2 id="group-title" className="text-lg font-black leading-tight drop-shadow-md">
                {group.name}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-white/90 drop-shadow-xs">
                <span className="material-symbols-outlined text-[15px]">groups</span>
                <span className="font-bold">
                  {t('groups.members', { count: group.membersCount, defaultValue: `${group.membersCount} members` })}
                </span>
                {group.meetingFrequency && (
                  <>
                    <span>·</span>
                    <span className="truncate">{group.meetingFrequency}</span>
                  </>
                )}
              </div>
            </div>

            {/* Quick Join/Joined Button */}
            {group.isJoined ? (
              <button
                type="button"
                onClick={() => onToggleJoin(group.id, false)}
                className="px-3 py-1.5 rounded-full bg-[#C0DDDA] text-[#1c3836] text-xs font-bold shadow-md border border-[#775537]/25 flex items-center gap-1 active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">check</span>
                <span>{t('groups.joined', { defaultValue: 'Joined' })}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onToggleJoin(group.id, true)}
                className="px-3.5 py-1.5 rounded-full bg-[#FBE29D] text-[#775537] text-xs font-extrabold shadow-md border border-[#775537]/30 flex items-center gap-1 active:scale-95 hover:bg-[#fae19c] transition-all shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">group_add</span>
                <span>{t('groups.joinGroup', { defaultValue: 'Join Group' })}</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#775537]/10 bg-white/80 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-2.5 text-xs font-bold text-center transition-all cursor-pointer border-b-2 ${
              activeTab === 'about'
                ? 'border-[#775537] text-[#775537] bg-[#FEF7DF]/50'
                : 'border-transparent text-[#775537]/60 hover:text-[#775537]'
            }`}
          >
            {t('groups.aboutGroup', { defaultValue: 'About' })}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('activities')}
            className={`flex-1 py-2.5 text-xs font-bold text-center transition-all cursor-pointer border-b-2 flex items-center justify-center gap-1 ${
              activeTab === 'activities'
                ? 'border-[#775537] text-[#775537] bg-[#FEF7DF]/50'
                : 'border-transparent text-[#775537]/60 hover:text-[#775537]'
            }`}
          >
            <span>{t('groups.groupActivities', { defaultValue: 'Events' })}</span>
            {group.activities && group.activities.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#FBE29D] text-[10px] flex items-center justify-center font-bold">
                {group.activities.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('discussion')}
            className={`flex-1 py-2.5 text-xs font-bold text-center transition-all cursor-pointer border-b-2 flex items-center justify-center gap-1 ${
              activeTab === 'discussion'
                ? 'border-[#775537] text-[#775537] bg-[#FEF7DF]/50'
                : 'border-transparent text-[#775537]/60 hover:text-[#775537]'
            }`}
          >
            <span>{t('groups.groupDiscussions', { defaultValue: 'Discussions' })}</span>
            {group.discussions && group.discussions.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#C0DDDA] text-[10px] flex items-center justify-center font-bold">
                {group.discussions.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'about' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Description */}
              <div className="bg-white rounded-2xl p-3.5 border border-[#775537]/15 shadow-xs space-y-1.5">
                <h4 className="text-xs font-bold text-[#775537] uppercase tracking-wider">
                  {t('groups.aboutGroup', { defaultValue: 'About this Community Circle' })}
                </h4>
                <p className="text-xs text-[#50453c] leading-relaxed">
                  {group.description}
                </p>
              </div>

              {/* Group Snapshot Details */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#FAF8F5] rounded-xl p-2.5 border border-[#775537]/10 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FBE29D]/70 text-[#775537] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">groups</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#775537]/60 block uppercase">
                      {t('common.members', { defaultValue: 'Members' })}
                    </span>
                    <span className="text-xs font-bold text-[#775537]">
                      {group.membersCount} {t('common.members').toLowerCase()}
                    </span>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] rounded-xl p-2.5 border border-[#775537]/10 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#C0DDDA]/70 text-[#775537] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#775537]/60 block uppercase">
                      {t('common.schedule', { defaultValue: 'Frequency' })}
                    </span>
                    <span className="text-xs font-bold text-[#775537] truncate block max-w-[100px]">
                      {group.meetingFrequency || 'Regular'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Community Guidelines */}
              {group.rules && group.rules.length > 0 && (
                <div className="bg-[#FEF7DF]/60 rounded-2xl p-3.5 border border-[#FBE29D] shadow-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-[#775537]">
                    <span className="material-symbols-outlined text-[16px] text-[#775537]">verified_user</span>
                    <h4 className="text-xs font-bold">{t('groups.rulesTitle', { defaultValue: 'Circle Guidelines' })}</h4>
                  </div>
                  <ul className="space-y-1.5 pl-1">
                    {group.rules.map((rule, idx) => (
                      <li key={idx} className="text-[11px] text-[#50453c] flex items-start gap-1.5 leading-snug">
                        <span className="text-[#775537] font-bold">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-[#775537]">
                  {t('groups.upcomingEventsTitle', { defaultValue: 'Upcoming Circle Gatherings' })}
                </h4>
                <span className="text-[11px] text-[#775537]/70">
                  {group.activities?.length || 0} {t('common.events', { defaultValue: 'events' })}
                </span>
              </div>

              {(!group.activities || group.activities.length === 0) ? (
                <div className="p-6 text-center bg-white rounded-2xl border border-[#775537]/15">
                  <span className="material-symbols-outlined text-3xl text-[#775537]/40 block mb-1">event_busy</span>
                  <p className="text-xs text-[#775537]/70 font-medium">
                    {t('groups.noActivities', { defaultValue: 'No upcoming gatherings scheduled yet.' })}
                  </p>
                </div>
              ) : (
                group.activities.map((act) => (
                  <div
                    key={act.id}
                    className="bg-white rounded-2xl p-3.5 border border-[#775537]/15 shadow-xs flex items-center justify-between gap-3 hover:border-[#775537]/35 transition-all"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-[#FEF7DF] border border-[#FBE29D] text-[10px] font-extrabold text-[#775537]">
                          {act.dateStr}
                        </span>
                        <span className="text-[11px] font-semibold text-[#775537]/75">
                          {act.timeStr}
                        </span>
                      </div>
                      <h5 className="text-xs font-extrabold text-[#775537] leading-snug">
                        {act.title}
                      </h5>
                      {act.location && (
                        <div className="flex items-center gap-1 text-[10.5px] text-[#775537]/70">
                          <span className="material-symbols-outlined text-[13px]">pin_drop</span>
                          <span>{act.location}</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onRsvpActivity(group.id, act.id)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all active:scale-95 cursor-pointer shrink-0 ${
                        act.isAttending
                          ? 'bg-[#C0DDDA] text-[#1c3836] border-[#775537]/25 shadow-xs'
                          : 'bg-[#FBE29D] text-[#775537] border-[#775537]/30 hover:bg-[#fae19c]'
                      }`}
                    >
                      {act.isAttending
                        ? t('groups.attending', { defaultValue: 'Going ✓' })
                        : t('groups.rsvp', { defaultValue: 'RSVP' })}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'discussion' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {/* Message Input */}
              <form onSubmit={handlePostSubmit} className="space-y-2 bg-white rounded-2xl p-3 border border-[#775537]/15 shadow-xs">
                <label htmlFor="group-message-input" className="text-[11px] font-bold text-[#775537] block">
                  {t('groups.startDiscussion', { defaultValue: 'Share a note with this circle' })}
                </label>
                <div className="flex gap-2">
                  <input
                    id="group-message-input"
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('groups.discussionPlaceholder', { defaultValue: 'Say hello to your fellow group members...' })}
                    maxLength={200}
                    className="flex-1 bg-[#FAF8F5] border border-[#775537]/20 rounded-xl px-3 py-1.5 text-xs text-[#775537] placeholder-[#775537]/50 focus:outline-hidden focus:ring-1 focus:ring-[#775537]"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-3 py-1.5 rounded-xl bg-[#775537] disabled:opacity-50 text-white text-xs font-bold hover:bg-[#62452c] transition-all cursor-pointer active:scale-95 shrink-0"
                  >
                    {t('common.send', { defaultValue: 'Post' })}
                  </button>
                </div>
              </form>

              {/* Message List */}
              <div className="space-y-2.5">
                {(!group.discussions || group.discussions.length === 0) ? (
                  <div className="p-6 text-center bg-white rounded-2xl border border-[#775537]/15">
                    <span className="material-symbols-outlined text-3xl text-[#775537]/40 block mb-1">chat_bubble_outline</span>
                    <p className="text-xs text-[#775537]/70 font-medium">
                      {t('groups.noDiscussions', { defaultValue: 'No messages yet. Be the first to say hello!' })}
                    </p>
                  </div>
                ) : (
                  group.discussions.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-white rounded-2xl p-3 border border-[#775537]/15 shadow-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#FBE29D] border border-[#775537]/20 flex items-center justify-center text-[11px] font-bold text-[#775537]">
                            {msg.authorInitials}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#775537] block leading-none">
                              {msg.authorName}
                            </span>
                            <span className="text-[10px] text-[#775537]/60">
                              {msg.timeAgoStr}
                            </span>
                          </div>
                        </div>

                        {msg.likes !== undefined && (
                          <div className="flex items-center gap-1 text-[11px] text-[#775537]/80">
                            <span className="material-symbols-outlined text-[13px] text-rose-500 fill-1">favorite</span>
                            <span>{msg.likes}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-[#50453c] leading-relaxed pl-9">
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="p-3 bg-white/95 border-t border-[#775537]/10 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-[#775537]/70 font-medium truncate">
            {group.isJoined
              ? t('groups.joinedStatusHint', { defaultValue: 'You are an active member of this circle' })
              : t('groups.joinPromptHint', { defaultValue: 'Join to receive event alerts & chat with neighbours' })}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#F4F2EE] text-[#775537] border border-[#775537]/20 text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0"
          >
            {t('common.done', { defaultValue: 'Done' })}
          </button>
        </div>
      </div>
    </div>
  );
};
