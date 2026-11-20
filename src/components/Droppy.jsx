import React from 'react';

// Droppy, the water-drop mascot. Mood and tint follow the water-quality class (0..3).
const BODY = ['#34B8F0', '#B7C65A', '#D69A4E', '#8A6F7E'];

function Eyes({ mood }) {
  if (mood === 3) {
    // dizzy X eyes
    return (
      <g stroke="var(--line)" strokeWidth="5" strokeLinecap="round">
        <path d="M68 140 L88 160 M88 140 L68 160" />
        <path d="M112 140 L132 160 M132 140 L112 160" />
      </g>
    );
  }
  const dy = mood === 2 ? 2 : 0;
  return (
    <g className="droppy-eyes">
      <circle cx="78" cy="150" r="13" fill="#fff" stroke="var(--line)" strokeWidth="4" />
      <circle cx="122" cy="150" r="13" fill="#fff" stroke="var(--line)" strokeWidth="4" />
      <circle cx="80" cy={151 + dy} r="6" fill="#0C2B3D" />
      <circle cx="124" cy={151 + dy} r="6" fill="#0C2B3D" />
      <circle cx="82" cy={148 + dy} r="2" fill="#fff" />
      <circle cx="126" cy={148 + dy} r="2" fill="#fff" />
    </g>
  );
}

function Mouth({ mood }) {
  const common = { fill: 'none', stroke: 'var(--line)', strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (mood === 0)
    return (
      <g>
        <path d="M78 178 Q100 206 122 178 Z" fill="#0C2B3D" stroke="var(--line)" strokeWidth="5" strokeLinejoin="round" />
        <path d="M90 190 Q100 200 110 190 Q100 186 90 190Z" fill="#FF6A5C" />
      </g>
    );
  if (mood === 1) return <path d="M84 188 Q100 192 116 186" {...common} />;
  if (mood === 2) return <path d="M82 194 Q100 174 118 194" {...common} />;
  return <path d="M76 190 q6 -9 12 0 t12 0 t12 0 t12 0" {...common} />;
}

export default function Droppy({ cls = 0, size = 220, label }) {
  const mood = cls;
  return (
    <svg
      className={`droppy mood-${mood}`}
      viewBox="0 0 200 240"
      width={size}
      height={(size * 240) / 200}
      role="img"
      aria-label={label || ['Droppy is happy', 'Droppy is unsure', 'Droppy is worried', 'Droppy feels sick'][mood]}
    >
      <ellipse className="droppy-shadow" cx="100" cy="228" rx="52" ry="8" fill="var(--shadow)" opacity=".25" />
      <g className="droppy-body">
        <path
          d="M100 14 C100 14 30 104 30 156 a70 70 0 0 0 140 0 C170 104 100 14 100 14Z"
          style={{ fill: BODY[mood], transition: 'fill .6s ease' }}
          stroke="var(--line)"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path d="M58 150 C58 130 66 114 80 98" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" opacity=".55" />
        <circle cx="62" cy="172" r="4" fill="#fff" opacity=".55" />
        {mood === 0 && (
          <g fill="#FF6A5C" opacity=".55">
            <ellipse cx="58" cy="176" rx="10" ry="6" />
            <ellipse cx="142" cy="176" rx="10" ry="6" />
          </g>
        )}
        {mood === 2 && (
          <g stroke="var(--line)" strokeWidth="5" strokeLinecap="round">
            <path d="M64 128 L90 134" />
            <path d="M136 128 L110 134" />
          </g>
        )}
        <Eyes mood={mood} />
        <Mouth mood={mood} />
      </g>
      {mood === 0 && (
        <g className="droppy-sparkles" fill="var(--sun)" stroke="var(--line)" strokeWidth="2.5" strokeLinejoin="round">
          <path className="sp sp1" d="M168 62 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" />
          <path className="sp sp2" d="M28 92 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
          <path className="sp sp3" d="M150 30 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" />
        </g>
      )}
      {mood === 2 && (
        <path className="droppy-sweat" d="M156 112 C156 112 148 124 148 130 a8 8 0 0 0 16 0 C164 124 156 112 156 112Z" fill="#9BE0FF" stroke="var(--line)" strokeWidth="3" />
      )}
      {mood === 3 && (
        <g className="droppy-flies" fill="none" stroke="var(--line)" strokeWidth="3" strokeLinecap="round">
          <path d="M30 70 q6 -8 12 0 t12 0" />
          <path d="M146 54 q6 -8 12 0 t12 0" />
        </g>
      )}
    </svg>
  );
}

// small round Droppy head for the logo and the mobile mini bar
export function DroppyMini({ cls = 0, size = 40 }) {
  return (
    <svg viewBox="20 40 160 190" width={size} height={size * 1.18} aria-hidden="true">
      <path d="M100 14 C100 14 30 104 30 156 a70 70 0 0 0 140 0 C170 104 100 14 100 14Z" style={{ fill: BODY[cls], transition: 'fill .6s ease' }} stroke="var(--line)" strokeWidth="9" strokeLinejoin="round" />
      <circle cx="78" cy="150" r="11" fill="#fff" stroke="var(--line)" strokeWidth="5" />
      <circle cx="122" cy="150" r="11" fill="#fff" stroke="var(--line)" strokeWidth="5" />
      <circle cx="80" cy="152" r="5" fill="#0C2B3D" />
      <circle cx="124" cy="152" r="5" fill="#0C2B3D" />
      {cls === 0 && <path d="M80 180 Q100 204 120 180 Z" fill="#0C2B3D" stroke="var(--line)" strokeWidth="6" strokeLinejoin="round" />}
      {cls === 1 && <path d="M84 188 Q100 192 116 186" fill="none" stroke="var(--line)" strokeWidth="7" strokeLinecap="round" />}
      {cls >= 2 && <path d="M82 194 Q100 174 118 194" fill="none" stroke="var(--line)" strokeWidth="7" strokeLinecap="round" />}
    </svg>
  );
}
