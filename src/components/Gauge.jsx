import React, { useEffect, useRef, useState } from 'react';

// Semicircle gauge, 0..150 points. Lower is better, so green sits on the left.
const MAX = 150;
const CX = 130, CY = 130, R = 96, SW = 24;

const pt = (angle, r = R) => {
  const a = (Math.PI * (180 - angle)) / 180; // angle 0..180 left -> right
  return [CX + r * Math.cos(a), CY - r * Math.sin(a)];
};
const arc = (a0, a1, r = R) => {
  const [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};
const ang = (v) => (Math.min(MAX, Math.max(0, v)) / MAX) * 180;

const ZONES = [
  { from: 0, to: 50, color: 'var(--c0)' },
  { from: 50, to: 75, color: 'var(--c1)' },
  { from: 75, to: 100, color: 'var(--c2)' },
  { from: 100, to: 150, color: 'var(--c3)' },
];

export function useAnimatedNumber(target, ms = 700) {
  const [val, setVal] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setVal(target); from.current = target; return; }
    const start = performance.now(), a = from.current;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / ms), e = 1 - Math.pow(1 - t, 3);
      const v = a + (target - a) * e;
      setVal(v); from.current = v;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return val;
}

export default function Gauge({ score, range, color, estimate }) {
  const shown = useAnimatedNumber(score);
  const needle = ang(score) - 90; // rotate from pointing straight up
  return (
    <div className="gauge">
      <svg viewBox="0 0 260 172" role="img" aria-label={`Water quality score ${Math.round(score)} out of 150, lower is better`}>
        <path d={arc(0, 180)} fill="none" stroke="var(--line)" strokeWidth={SW + 8} strokeLinecap="round" />
        {ZONES.map((z) => (
          <path key={z.from} d={arc(ang(z.from) + 0.3, ang(z.to) - 0.3)} fill="none" stroke={z.color} strokeWidth={SW} />
        ))}
        {range && (
          <path d={arc(ang(range[0]), ang(range[1]), R + 24)} fill="none" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" opacity=".85" />
        )}
        <g className="needle" style={{ transform: `rotate(${needle}deg)`, transformOrigin: `${CX}px ${CY}px` }}>
          <path d={`M${CX - 7} ${CY} L${CX} ${CY - R - 14} L${CX + 7} ${CY} Z`} fill="var(--ink)" stroke="var(--surface)" strokeWidth="2.5" strokeLinejoin="round" />
        </g>
        <circle cx={CX} cy={CY} r="13" fill={color} stroke="var(--line)" strokeWidth="5" />
        <text x="24" y="166" className="gtick" textAnchor="middle">0</text>
        <text x="236" y="166" className="gtick" textAnchor="middle">150+</text>
      </svg>
      <div className="gauge-num" aria-hidden="true">
        <span className="gauge-score">{Math.round(shown)}</span>
        <span className="gauge-cap">{estimate ? 'estimated score' : 'score'} · lower is better</span>
      </div>
    </div>
  );
}
