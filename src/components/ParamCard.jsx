import React, { useEffect, useState } from 'react';
import { PARAMS, toT, fromT, fmt } from '../params.js';

const ICONS = {
  DO: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="16" cy="30" r="9" fill="#fff" stroke="var(--line)" strokeWidth="3" />
      <circle cx="32" cy="18" r="6" fill="#fff" stroke="var(--line)" strokeWidth="3" />
      <circle cx="35" cy="34" r="4" fill="#fff" stroke="var(--line)" strokeWidth="3" />
      <path d="M12 27 a5 5 0 0 1 4 -3" stroke="var(--sky)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  ),
  pH: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="14" y="5" width="20" height="38" rx="5" fill="#fff" stroke="var(--line)" strokeWidth="3" />
      <rect x="18" y="9" width="12" height="6" fill="#FF6A5C" /><rect x="18" y="15" width="12" height="6" fill="#FFC83D" />
      <rect x="18" y="21" width="12" height="6" fill="#2DBE7E" /><rect x="18" y="27" width="12" height="6" fill="#25AEE8" />
      <rect x="18" y="33" width="12" height="6" fill="#8A6BE8" />
    </svg>
  ),
  BOD: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M17 6h14v12l9 20a4 4 0 0 1-4 6H12a4 4 0 0 1-4-6l9-20Z" fill="#fff" stroke="var(--line)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M13 32h22l4 8a2 2 0 0 1-2 3H11a2 2 0 0 1-2-3Z" fill="#C9A66B" stroke="var(--line)" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  ),
  FC: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="12" fill="#9BD66B" stroke="var(--line)" strokeWidth="3" />
      <g stroke="var(--line)" strokeWidth="3" strokeLinecap="round">
        <path d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M37 11l-4 4M15 33l-4 4" />
      </g>
      <circle cx="20" cy="22" r="2.5" fill="var(--line)" /><circle cx="28" cy="22" r="2.5" fill="var(--line)" />
      <path d="M20 29q4 3 8 0" fill="none" stroke="var(--line)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
};

export default function ParamCard({ k, value, onChange, median, error, optionalOn, onToggle, impact }) {
  const p = PARAMS[k];
  const disabled = k === 'FC' && !optionalOn;
  const [text, setText] = useState(fmt(value, k));
  useEffect(() => { if (value != null && Number(text) !== value) setText(fmt(value, k).replace(/,/g, '')); /* eslint-disable-next-line */ }, [value]);

  const t = value == null || !Number.isFinite(value) ? 0 : toT(p, value);
  const lo = p.good[0] === 0 ? 0 : toT(p, p.good[0]);
  const hi = Number.isFinite(p.good[1]) ? toT(p, p.good[1]) : 1;
  const medT = median != null ? toT(p, median) : null;
  const inGood = value != null && value >= p.good[0] && value <= p.good[1];

  const onType = (e) => {
    const raw = e.target.value.replace(/,/g, '');
    setText(e.target.value);
    if (raw === '' || raw === '-' || raw === '.') return onChange(null);
    const n = Number(raw);
    onChange(Number.isFinite(n) ? n : NaN);
  };

  return (
    <section className={`param sticker ${disabled ? 'is-off' : ''} ${error ? 'has-error' : ''}`} aria-labelledby={`lbl-${k}`}>
      <div className="param-top">
        <div className="param-icon">{ICONS[k]}</div>
        <div className="param-title">
          <h3 id={`lbl-${k}`}>{p.name}</h3>
          <p className="tech">{p.tech}</p>
        </div>
        {k === 'FC' && (
          <label className="switch" htmlFor="fc-toggle">
            <input id="fc-toggle" type="checkbox" checked={optionalOn} onChange={(e) => onToggle(e.target.checked)} />
            <span className="switch-track"><span className="switch-dot" /></span>
            <span className="switch-label">{optionalOn ? 'I have this' : 'Skip it'}</span>
          </label>
        )}
      </div>

      {disabled ? (
        <p className="skip-note">No bacteria test? No problem. Droppy will estimate the score and show a likely range. Add the result for an exact score.</p>
      ) : (
        <>
          <div className="param-input">
            <input
              id={`num-${k}`}
              className="num"
              inputMode="decimal"
              aria-label={`${p.tech} in ${p.unit}`}
              value={text}
              onChange={onType}
              aria-invalid={!!error}
            />
            <span className="unit">{p.unit}</span>
            <span className={`hint ${inGood ? 'ok' : 'meh'}`}>{value != null && Number.isFinite(value) ? p.hint(value) : ''}</span>
          </div>
          <div className="slider-wrap" style={{ '--lo': `${lo * 100}%`, '--hi': `${hi * 100}%` }}>
            <input
              id={`rng-${k}`}
              className="slider"
              type="range"
              min="0" max="1000" step="1"
              aria-label={`${p.name} slider`}
              value={Math.round(t * 1000)}
              onChange={(e) => { const v = fromT(p, Number(e.target.value) / 1000); onChange(v); setText(String(v)); }}
            />
            {medT != null && (
              <span className="median" style={{ left: `calc(${medT * 100}% )` }} title={`Typical Indian sample: ${fmt(median, k)} ${p.unit}`}>
                <i />
              </span>
            )}
          </div>
          <div className="param-foot">
            <span>{p.goodNote}</span>
            <span className="median-key"><i /> typical in India</span>
          </div>
        </>
      )}
      {error && <p className="err" role="alert">{error}</p>}
    </section>
  );
}
