import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NEIGHBOURHOOD_MAP } from '../data/initialData';

interface Step1LocationScreenProps {
  postcode: string;
  setPostcode: (val: string) => void;
  neighbourhood: string;
  setNeighbourhood: (val: string) => void;
  onContinue: () => void;
  onBack: () => void;
  currentLang: string;
  onOpenLangModal: () => void;
}

export const Step1LocationScreen: React.FC<Step1LocationScreenProps> = ({
  postcode,
  setPostcode,
  neighbourhood,
  setNeighbourhood,
  onContinue,
  onBack,
  currentLang,
  onOpenLangModal,
}) => {
  const { t } = useTranslation();
  const [localPostcode, setLocalPostcode] = useState(postcode || '');
  const [localNeighbourhood, setLocalNeighbourhood] = useState(neighbourhood || '');

  const availableNeighbourhoods = localPostcode.length === 5
    ? NEIGHBOURHOOD_MAP[localPostcode] || NEIGHBOURHOOD_MAP['default']
    : [];

  const handlePostcodeChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 5);
    setLocalPostcode(cleaned);
    setPostcode(cleaned);

    if (cleaned.length === 5) {
      const list = NEIGHBOURHOOD_MAP[cleaned] || NEIGHBOURHOOD_MAP['default'];
      const defaultNeighbour = list[0] || '';
      setLocalNeighbourhood(defaultNeighbour);
      setNeighbourhood(defaultNeighbour);
    } else {
      setLocalNeighbourhood('');
      setNeighbourhood('');
    }
  };

  const handlePreset = (code: string) => {
    handlePostcodeChange(code);
    const list = NEIGHBOURHOOD_MAP[code] || NEIGHBOURHOOD_MAP['default'];
    if (list.length > 0) {
      setLocalNeighbourhood(list[0]);
      setNeighbourhood(list[0]);
    }
  };

  const handleNeighbourhoodChange = (val: string) => {
    setLocalNeighbourhood(val);
    setNeighbourhood(val);
  };

  const isComplete = localPostcode.length === 5 && localNeighbourhood !== '';

  return (
    <main className="w-full max-w-[390px] min-h-screen md:min-h-[844px] bg-[#F7F6F2] relative flex flex-col justify-between overflow-hidden sm:rounded-[44px] px-6 pt-5 pb-7 md:shadow-2xl border-x md:border border-[#775537]/20 select-none">
      {/* Top Warm Decorative Glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full bg-[#FBE29D]/40 blur-2xl pointer-events-none"></div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* NavigationHeader */}
        <header className="w-full flex items-center justify-between pt-2 pb-3">
          {/* Back Navigation Button */}
          <button
            onClick={onBack}
            aria-label={t('common.back')}
            className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#775537] hover:bg-stone-50 active:scale-95 transition-all cursor-pointer border border-[#775537]/10"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </button>

          {/* Brand Wordmark with Yellow Accent Dot */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBE29D] border border-[#EAC97E] inline-block shadow-xs"></span>
            <span className="text-xl font-bold tracking-tight text-[#775537]">SkillSpill</span>
          </div>

          {/* Language Switcher Pill */}
          <button
            onClick={onOpenLangModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-xs text-[#775537] font-medium text-xs hover:bg-stone-50 active:scale-95 transition-all cursor-pointer border border-[#775537]/10"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">language</span>
            <span className="font-bold">{currentLang}</span>
            <span className="material-symbols-outlined text-[15px] opacity-70">expand_more</span>
          </button>
        </header>

        {/* StepProgress */}
        <section aria-label="Onboarding Progress" className="w-full mt-2 mb-3">
          <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase text-[#775537]/75 mb-1.5 px-0.5">
            <span>{t('common.stepOf', { step: 1, total: 3 })}</span>
            <span className="text-[10px] font-semibold text-[#775537]/60">{t('step1.stepTitle')}</span>
          </div>
          {/* Progress Bar Track */}
          <div className="w-full h-2 bg-[#EBE7DF] rounded-full overflow-hidden p-0.5 flex items-center">
            {/* 33% Active Bar with subtle Butter highlight */}
            <div className="w-1/3 h-full bg-[#775537] rounded-full relative flex items-center justify-end pr-0.5 transition-all duration-300">
              <div className="w-1.5 h-1.5 bg-[#FBE29D] rounded-full"></div>
            </div>
          </div>
        </section>

        {/* StorybookIllustration */}
        <div className="w-full flex items-center justify-center my-1 relative">
          <div className="w-72 h-44 flex items-center justify-center overflow-hidden rounded-2xl">
            <img
              alt="Cute chibi neighbours standing happily in a cozy miniature neighbourhood"
              className="w-full h-full object-contain mix-blend-multiply scale-105 pointer-events-none select-none"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoVQMm_6TwzVnTSVoJat5qwmHCA4yohJ1fKFWxOCH4xwFWeSpjnOC4JRCRtRD8s-texm9juXgAnLsY3Pmub1hxqoWnwyZ2jboBD3xi7YQ35H4d1qSnGMpHw_al5CGS12Jm_UOfFF-Ppcy_Yh7g099g3MyfNmr8f2CGxuWZWha4szqAkjdWFt_5yvw2Y1HLuXy8Un6H8Se4YmrH_n5GhcTkWpl1Rwkc99R5gjYSJqQ6I3-8ameFEEBdt1aZtIPQoVO3ENI"
              loading="eager"
            />
          </div>
        </div>

        {/* TitleAndIntro */}
        <section className="text-center mt-1 mb-5">
          <h1 className="text-[22px] font-extrabold text-[#775537] leading-tight tracking-tight">
            {t('step1.title')}
          </h1>
          <p className="text-[13px] text-[#775537]/80 mt-1 font-medium leading-relaxed">
            {t('step1.subtitle')}
          </p>
        </section>

        {/* FormFields */}
        <form
          className="w-full space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (isComplete) onContinue();
          }}
        >
          {/* Postcode Input Group */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#775537] ml-1" htmlFor="postcode-input">
              {t('step1.postcodeLabel')}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#775537] pointer-events-none">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
              </span>
              <input
                id="postcode-input"
                inputMode="numeric"
                maxLength={5}
                value={localPostcode}
                onChange={(e) => handlePostcodeChange(e.target.value)}
                placeholder={t('step1.postcodePlaceholder')}
                className="w-full rounded-full bg-white border border-[#E2DDD5] pl-11 pr-4 py-3 text-sm text-[#775537] placeholder:text-stone-400 font-medium shadow-xs focus:border-[#775537] focus:ring-1 focus:ring-[#775537] transition-all outline-none"
                type="text"
              />
            </div>
            {/* Quick Suggestion Hint */}
            <div className="flex items-center gap-1.5 ml-2 mt-1">
              <span className="text-[11px] text-[#775537]/60 font-medium">{t('step1.quickSelect')}</span>
              {['50480', '60000', '47301'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handlePreset(code)}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                    localPostcode === code
                      ? 'bg-[#FBE29D] text-[#775537] border border-[#775537]/30'
                      : 'text-[#775537]/85 bg-[#F4EFE6] hover:bg-[#FBE29D]/50'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Neighbourhood Dropdown Group */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#775537] ml-1" htmlFor="neighbourhood-select">
              {t('step1.neighbourhoodLabel')}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#775537] pointer-events-none">
                <span className="material-symbols-outlined text-[18px]">home</span>
              </span>
              <select
                id="neighbourhood-select"
                disabled={localPostcode.length !== 5}
                value={localNeighbourhood}
                onChange={(e) => handleNeighbourhoodChange(e.target.value)}
                className={`w-full rounded-full bg-white border border-[#E2DDD5] pl-11 pr-10 py-3 text-sm text-[#775537] font-medium shadow-xs cursor-pointer appearance-none outline-none transition-all ${
                  localPostcode.length !== 5
                    ? 'bg-[#F2EFEA]/70 cursor-not-allowed text-stone-400'
                    : 'focus:border-[#775537] focus:ring-1 focus:ring-[#775537]'
                }`}
              >
                {localPostcode.length !== 5 ? (
                  <option value="">{t('step1.enterCodeFirst')}</option>
                ) : (
                  <>
                    <option value="" disabled>
                      {t('step1.choosePrompt')}
                    </option>
                    {availableNeighbourhoods.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </>
                )}
              </select>
              <span className="absolute right-4 text-[#775537]/70 pointer-events-none">
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </span>
            </div>
          </div>

          {/* Privacy Assurance Message */}
          <div className="flex items-center justify-center gap-1.5 pt-1 text-center">
            <span className="material-symbols-outlined text-[16px] text-[#775537]/75">verified_user</span>
            <span className="text-[11px] font-medium text-[#775537]/75">
              {t('step1.helperText')}
            </span>
          </div>

          {/* Primary Action CTA Button */}
          <div className="pt-2">
            <button
              onClick={onContinue}
              disabled={!isComplete}
              className={`w-full rounded-full py-3.5 px-6 font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all ${
                isComplete
                  ? 'bg-[#775537] text-white hover:bg-[#5c4129] active:scale-[0.98] cursor-pointer'
                  : 'bg-[#d3c4b9] text-white/80 cursor-not-allowed opacity-75'
              }`}
              type="button"
            >
              <span>{t('step1.continueBtn')}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>

      {/* FooterDecoration */}
      <footer className="w-full flex items-center justify-center gap-2.5 pt-4 opacity-50 text-[#775537]">
        <span className="material-symbols-outlined text-[14px]">park</span>
        <span className="w-1 h-1 rounded-full bg-[#775537] inline-block opacity-60"></span>
        <span className="material-symbols-outlined text-[14px]">eco</span>
      </footer>
    </main>
  );
};
