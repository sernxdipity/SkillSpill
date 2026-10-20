import React from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, setSavedLanguage } from '../i18n';

interface LanguageModalProps {
  currentLang: string;
  onSelectLang: (lang: string) => void;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ currentLang, onSelectLang, onClose }) => {
  const { t, i18n } = useTranslation();

  const handleChoose = (code: string) => {
    i18n.changeLanguage(code);
    setSavedLanguage(code);
    onSelectLang(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 w-full max-w-xs shadow-2xl border border-[#775537]/20 text-center animate-in fade-in zoom-in-95 duration-150">
        <div className="w-10 h-10 rounded-full bg-[#fae19c]/40 text-[#775537] flex items-center justify-center mx-auto mb-3">
          <span className="material-symbols-outlined text-[22px]">language</span>
        </div>
        <h3 className="text-base font-bold text-[#775537] mb-1">{t('common.selectLanguage')}</h3>
        <p className="text-xs text-[#775537]/70 mb-4">{t('common.chooseLanguageDesc')}</p>
        <div className="space-y-1.5 text-left">
          {SUPPORTED_LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => handleChoose(l.code)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                currentLang.toUpperCase() === l.code
                  ? 'border-[#775537] bg-[#fae19c]/50 text-[#775537]'
                  : 'border-[#775537]/15 hover:bg-stone-50 text-[#775537]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{l.flag}</span>
                <span>{l.name}</span>
              </div>
              {currentLang.toUpperCase() === l.code && (
                <span className="material-symbols-outlined text-[16px] text-[#775537]">check</span>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-full bg-[#f3f3f3] text-xs font-bold text-[#775537] hover:bg-stone-200 transition-colors cursor-pointer"
        >
          {t('common.close')}
        </button>
      </div>
    </div>
  );
};
