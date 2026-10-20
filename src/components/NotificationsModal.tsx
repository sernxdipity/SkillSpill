import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppNotification } from '../types';
import { getTranslatedNotification } from '../utils/translationHelper';

interface NotificationsModalProps {
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onSelectNotification?: (notif: AppNotification) => void;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-[#775537]/20 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#FBE29D] text-[#775537] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#775537]">{t('notifications.title')}</h3>
              <p className="text-[11px] text-[#775537]/70">{t('notifications.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#f3f3f3] text-xs font-bold text-[#775537] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onMarkAllAsRead}
            className="text-[11px] font-bold text-[#775537] hover:underline cursor-pointer"
          >
            {t('notifications.markAllRead')}
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
          {notifications.map((rawN) => {
            const n = getTranslatedNotification(t, rawN);
            return (
              <div
                key={n.id}
                onClick={() => {
                  if (onSelectNotification) onSelectNotification(rawN);
                }}
                className={`p-3 rounded-2xl border text-xs space-y-1 transition-all ${
                  rawN.deedId ? 'cursor-pointer hover:border-[#775537]/40 active:scale-[0.99]' : ''
                } ${
                  !n.read
                    ? 'bg-[#FEF7DF] border-[#FBE29D]'
                    : 'bg-[#FAF8F5] border-[#775537]/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#775537] flex items-center gap-1">
                    {rawN.deedId && (
                      <span className="material-symbols-outlined text-[14px] text-amber-600">
                        volunteer_activism
                      </span>
                    )}
                    {n.title}
                  </span>
                  <span className="text-[10px] text-[#775537]/60">{n.time}</span>
                </div>
                <p className="text-[#50453c] text-[11px] leading-relaxed">{n.message}</p>
                {rawN.deedId && (
                  <span className="text-[10px] font-bold text-amber-800 flex items-center gap-0.5 pt-0.5">
                    <span>View deed & comments</span>
                    <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-[#775537] text-white font-bold text-xs shadow-xs cursor-pointer"
        >
          {t('common.close')}
        </button>
      </div>
    </div>
  );
};
