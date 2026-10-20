import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GoodDeed, DeedComment } from '../types';
import { getTranslatedGoodDeedMessage, getTranslatedGoodDeedTime } from '../utils/translationHelper';

interface DeedCommentsSheetProps {
  deed: GoodDeed;
  comments: DeedComment[];
  currentUserId: string;
  currentUserName: string;
  onAddComment: (deedId: string, message: string) => void;
  onEditComment: (commentId: string, newMessage: string) => void;
  onDeleteComment: (commentId: string) => void;
  onReportComment: (commentId: string) => void;
  onClose: () => void;
}

export const DeedCommentsSheet: React.FC<DeedCommentsSheetProps> = ({
  deed,
  comments,
  currentUserId,
  currentUserName,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onReportComment,
  onClose,
}) => {
  const { t } = useTranslation();
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [commentPendingDelete, setCommentPendingDelete] = useState<DeedComment | null>(null);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState<string | null>(null);

  const deedComments = comments
    .filter((c) => c.deedId === deed.id)
    .sort((a, b) => a.createdAt - b.createdAt);

  const deedMessage = getTranslatedGoodDeedMessage(t, deed);
  const deedTimeStr = getTranslatedGoodDeedTime(t, deed.timeKey);

  const quickSuggestions = [
    t('goodDeeds.suggestions.wellDone', { defaultValue: 'Well done! 🎉' }),
    t('goodDeeds.suggestions.thankYou', { defaultValue: 'Thank you for helping! ❤️' }),
    t('goodDeeds.suggestions.amazing', { defaultValue: "You're amazing! 🌟" }),
    t('goodDeeds.suggestions.keepItUp', { defaultValue: 'Keep it up! 🙌' }),
    t('goodDeeds.suggestions.proud', { defaultValue: 'Proud of our community! 🏡' }),
  ];

  const handleSuggestionClick = (msg: string) => {
    setCommentText((prev) => {
      if (!prev.trim()) return msg;
      return `${prev} ${msg}`.slice(0, 300);
    });
    setErrorMessage(null);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) {
      setErrorMessage(t('goodDeeds.emptyCommentError'));
      return;
    }
    if (trimmed.length > 300) {
      setErrorMessage(t('goodDeeds.commentTooLongError'));
      return;
    }

    onAddComment(deed.id, trimmed);
    setCommentText('');
    setErrorMessage(null);
  };

  const handleStartEdit = (comment: DeedComment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.message);
  };

  const handleSaveEdit = (commentId: string) => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    onEditComment(commentId, trimmed.slice(0, 300));
    setEditingCommentId(null);
    setEditText('');
  };

  const handleConfirmDelete = () => {
    if (!commentPendingDelete) return;
    const targetId = commentPendingDelete.id;
    setCommentPendingDelete(null);
    onDeleteComment(targetId);
    setDeleteSuccessMessage(
      t('goodDeeds.commentDeletedSuccess', { defaultValue: 'Comment deleted successfully.' })
    );
    setTimeout(() => {
      setDeleteSuccessMessage(null);
    }, 3200);
  };

  const formatCommentTime = (timestamp: number) => {
    const diffMs = Date.now() - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return t('goodDeeds.time.just_now', { defaultValue: 'Just now' });
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return t('goodDeeds.time.yesterday', { defaultValue: 'Yesterday' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Container */}
      <div className="bg-[#fcfbf9] text-[#775537] rounded-t-3xl sm:rounded-3xl w-full max-w-[430px] max-h-[88vh] flex flex-col shadow-2xl border-t sm:border border-[#775537]/20 overflow-hidden animate-in slide-in-from-bottom-6 sm:fade-in duration-200">
        {/* Drag handle on mobile */}
        <div className="sm:hidden w-12 h-1 bg-[#775537]/20 rounded-full mx-auto mt-2 mb-1" />

        {/* Header */}
        <header className="px-5 py-3.5 border-b border-[#775537]/10 flex items-center justify-between bg-white/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#775537]">
              chat_bubble
            </span>
            <h3 className="text-sm font-black text-[#775537]">
              {t('goodDeeds.commentsTitle')} ({deedComments.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F4F2EE] hover:bg-[#eae8e3] text-[#775537] flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
            type="button"
            aria-label={t('common.close')}
          >
            ✕
          </button>
        </header>

        {/* Deed Preview Context */}
        <div className="px-4 py-3 bg-[#FEF7DF]/70 border-b border-[#FBE29D]/60 flex items-start gap-3 shrink-0">
          <div
            className="w-8 h-8 rounded-xl border border-[#775537]/20 flex items-center justify-center text-[#775537] shrink-0"
            style={{ backgroundColor: deed.iconBg || '#FEF3D6' }}
          >
            <span className="material-symbols-outlined text-[17px]">{deed.icon}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#775537] line-clamp-2 leading-snug">
              {deedMessage}
            </p>
            <span className="text-[10px] font-semibold text-[#775537]/60 block mt-0.5">
              {deedTimeStr}
            </span>
          </div>
        </div>

        {/* In-sheet Success Notification Banner */}
        {deleteSuccessMessage && (
          <div className="mx-4 mt-3 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in slide-in-from-top-1 duration-200 shrink-0">
            <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">check_circle</span>
            <span className="flex-1">{deleteSuccessMessage}</span>
          </div>
        )}

        {/* Scrollable Comments List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {deedComments.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF7DF] border border-[#FBE29D] flex items-center justify-center mx-auto text-amber-700">
                <span className="material-symbols-outlined text-2xl">sms</span>
              </div>
              <p className="text-xs font-bold text-[#775537]">
                {t('goodDeeds.noCommentsYet')}
              </p>
              <p className="text-[11px] text-[#775537]/60">
                Tap one of the quick suggestions below to send encouragement!
              </p>
            </div>
          ) : (
            deedComments.map((comment) => {
              const isOwn =
                Boolean(currentUserId && comment.authorId === currentUserId) ||
                comment.isCurrentUser === true ||
                Boolean(
                  comment.authorName &&
                    currentUserName &&
                    comment.authorName.trim().toLowerCase() === currentUserName.trim().toLowerCase()
                );

              return (
                <div
                  key={comment.id}
                  className={`p-3 rounded-2xl border transition-all text-xs ${
                    comment.reported
                      ? 'bg-amber-50/70 border-amber-200 opacity-75'
                      : 'bg-white border-[#775537]/15 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#FBE29D] border border-[#775537]/25 flex items-center justify-center text-[10px] font-black text-[#775537]">
                        {comment.authorInitials || comment.authorName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-[#775537]">
                            {comment.authorName}
                          </span>
                          {isOwn && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#FBE29D]/60 text-[#775537] border border-[#775537]/20">
                              {t('common.you', { defaultValue: 'You' })}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#775537]/60">
                          {formatCommentTime(comment.createdAt)}
                          {comment.updatedAt && (
                            <span className="ml-1 italic text-[9px] text-[#775537]/50">
                              ({t('goodDeeds.editedBadge')})
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Actions: Edit/Delete if own, Report if others */}
                    <div className="flex items-center gap-1.5">
                      {isOwn ? (
                        <>
                          <button
                            onClick={() => handleStartEdit(comment)}
                            className="text-[10px] font-bold text-[#775537]/70 hover:text-[#775537] hover:underline cursor-pointer"
                            type="button"
                          >
                            {t('goodDeeds.editComment')}
                          </button>
                          <span className="text-[#775537]/30 text-[10px]">·</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCommentPendingDelete(comment);
                            }}
                            className="text-[10px] font-bold text-red-600/80 hover:text-red-700 hover:underline cursor-pointer"
                            type="button"
                          >
                            {t('goodDeeds.deleteComment')}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onReportComment(comment.id)}
                          className={`text-[10px] font-medium transition-colors cursor-pointer flex items-center gap-0.5 ${
                            comment.reported
                              ? 'text-amber-700 font-bold'
                              : 'text-[#775537]/50 hover:text-[#775537]'
                          }`}
                          title={t('goodDeeds.reportComment')}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {comment.reported ? 'flag_circle' : 'flag'}
                          </span>
                          <span>
                            {comment.reported
                              ? t('goodDeeds.reportedComment')
                              : t('goodDeeds.reportComment')}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Message or Inline Edit */}
                  {editingCommentId === comment.id ? (
                    <div className="mt-2 space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value.slice(0, 300))}
                        rows={2}
                        className="w-full bg-[#FAF8F5] border border-[#775537]/25 rounded-xl p-2 text-xs text-[#775537] focus:outline-hidden focus:border-[#775537]"
                      />
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-[#775537]/60">
                          {editText.length}/300
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingCommentId(null)}
                            className="px-2.5 py-1 rounded-lg bg-[#F4F2EE] font-bold hover:bg-[#eae8e3]"
                            type="button"
                          >
                            {t('goodDeeds.cancelEdit')}
                          </button>
                          <button
                            onClick={() => handleSaveEdit(comment.id)}
                            className="px-2.5 py-1 rounded-lg bg-[#775537] text-white font-bold hover:bg-[#604229]"
                            type="button"
                          >
                            {t('goodDeeds.saveEdit')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-[#50453c] leading-relaxed break-words font-medium pl-9">
                      {comment.message}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Quick Encouragement Suggestions Bar */}
        <div className="px-4 py-2 border-t border-[#775537]/10 bg-white/70">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#775537]/70">
              {t('goodDeeds.quickSuggestionsTitle')}
            </span>
            <span className="text-[10px] font-semibold text-[#775537]/50">
              {commentText.length}/300
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {quickSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-2.5 py-1 rounded-full bg-[#FEF7DF] hover:bg-[#FBE29D] border border-[#FBE29D] text-[11px] font-bold text-[#775537] whitespace-nowrap active:scale-95 transition-all shadow-2xs cursor-pointer shrink-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <footer className="p-3.5 border-t border-[#775537]/10 bg-white shrink-0">
          <form onSubmit={handlePostSubmit} className="space-y-1.5">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value.slice(0, 300));
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder={t('goodDeeds.writeCommentPlaceholder')}
                className="flex-1 bg-[#FAF8F5] border border-[#775537]/20 rounded-2xl py-2 px-3 text-xs text-[#775537] placeholder-[#775537]/50 focus:outline-hidden focus:border-[#775537] focus:ring-1 focus:ring-[#775537]"
              />

              <button
                type="submit"
                disabled={!commentText.trim()}
                className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer shrink-0 ${
                  commentText.trim()
                    ? 'bg-[#775537] text-white hover:bg-[#604229] active:scale-95'
                    : 'bg-[#775537]/20 text-[#775537]/40 cursor-not-allowed'
                }`}
              >
                <span>{t('goodDeeds.postComment')}</span>
                <span className="material-symbols-outlined text-[15px]">send</span>
              </button>
            </div>

            {errorMessage && (
              <p className="text-[10px] font-bold text-red-600 px-1">
                {errorMessage}
              </p>
            )}
          </form>
        </footer>
      </div>

      {/* Delete Confirmation Dialog */}
      {commentPendingDelete && (
        <div
          className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-comment-title"
          onClick={() => setCommentPendingDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-5 max-w-[360px] w-full border border-[#775537]/20 shadow-2xl text-[#775537] space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[22px]">delete_forever</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 id="delete-comment-title" className="text-sm font-black text-[#775537]">
                  {t('goodDeeds.deleteCommentTitle', { defaultValue: 'Delete Comment' })}
                </h4>
                <p className="text-xs font-semibold text-[#775537]/80 mt-1 leading-snug">
                  {t('goodDeeds.confirmDelete', { defaultValue: 'Are you sure you want to delete this comment?' })}
                </p>
              </div>
            </div>

            {/* Comment Preview */}
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#775537]/10 text-xs italic text-[#775537]/80 line-clamp-3">
              "{commentPendingDelete.message}"
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setCommentPendingDelete(null)}
                className="px-4 py-2 rounded-xl bg-[#F4F2EE] hover:bg-[#eae8e3] text-xs font-bold text-[#775537] transition-colors cursor-pointer"
              >
                {t('goodDeeds.deleteCancel', { defaultValue: t('common.cancel', { defaultValue: 'Cancel' }) })}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-xs font-bold text-white transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px]">delete</span>
                <span>
                  {t('goodDeeds.deleteConfirm', {
                    defaultValue: t('goodDeeds.deleteComment', { defaultValue: 'Delete' }),
                  })}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
