import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NEIGHBOURHOOD_MAP } from '../data/initialData';

interface NeighbourhoodModalProps {
  currentNeighbourhood: string;
  onSelectNeighbourhood: (name: string) => void;
  onClose: () => void;
}

export const NeighbourhoodModal: React.FC<NeighbourhoodModalProps> = ({
  currentNeighbourhood,
  onSelectNeighbourhood,
  onClose,
}) => {
  const { t } = useTranslation();
  const allNeighbourhoods = Array.from(
    new Set(Object.values(NEIGHBOURHOOD_MAP).flat())
  );

  const [search, setSearch] = useState('');

  const filtered = allNeighbourhoods.filter((n) =>
    n.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-[#775537]/20 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#FBE29D] text-[#775537] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">location_on</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#775537]">{t('neighbourhoodModal.title')}</h3>
              <p className="text-[11px] text-[#775537]/70">{t('neighbourhoodModal.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#f3f3f3] text-xs font-bold text-[#775537] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#775537]/50">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('neighbourhoodModal.searchPlaceholder')}
            className="w-full bg-[#FAF8F5] border border-[#775537]/20 rounded-xl pl-9 pr-3 py-2 text-xs text-[#775537] outline-none"
          />
        </div>

        <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 text-xs">
          {filtered.map((item) => (
            <button
              key={item}
              onClick={() => {
                onSelectNeighbourhood(item);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border font-semibold transition-all cursor-pointer ${
                currentNeighbourhood === item
                  ? 'bg-[#FBE29D]/50 border-[#775537] text-[#775537]'
                  : 'bg-white border-[#775537]/10 hover:bg-[#FAF8F5] text-[#775537]'
              }`}
            >
              <span>{item}</span>
              {currentNeighbourhood === item && (
                <span className="material-symbols-outlined text-[16px] text-[#775537]">check</span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-[#775537] text-white font-bold text-xs shadow-xs cursor-pointer"
        >
          {t('common.cancel')}
        </button>
      </div>
    </div>
  );
};
