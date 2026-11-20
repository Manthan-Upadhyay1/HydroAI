// Plain-language description of each measurement and how its slider behaves.

export const ORDER = ['DO', 'pH', 'BOD', 'FC'];

export const PARAMS = {
  DO: {
    key: 'DO',
    name: 'Oxygen in the water',
    tech: 'Dissolved oxygen (DO)',
    unit: 'mg/L',
    scale: 'lin', min: 0, max: 15, dec: 1,
    good: [5, Infinity],
    goodNote: '5 or more is healthy',
    hint: (v) =>
      v < 2 ? 'Fish are gasping for air' : v < 4 ? 'Tough going for fish' : v < 5 ? 'Just under the healthy line'
      : v <= 9 ? 'Fish are comfortable' : 'Lots of oxygen in here',
  },
  pH: {
    key: 'pH',
    name: 'Sour or soapy (pH)',
    tech: 'Potential of hydrogen (pH)',
    unit: 'pH',
    scale: 'lin', min: 0, max: 14, dec: 1,
    good: [6.5, 8.5],
    goodNote: '6.5 to 8.5 is healthy',
    hint: (v) =>
      v < 5 ? 'Very sour (acidic)' : v < 6.5 ? 'A little sour (acidic)' : v <= 8.5 ? 'Nicely balanced'
      : v <= 10 ? 'A little soapy (alkaline)' : 'Very soapy (alkaline)',
  },
  BOD: {
    key: 'BOD',
    name: 'Waste that eats oxygen',
    tech: 'Biochemical oxygen demand (BOD)',
    unit: 'mg/L',
    scale: 'log', min: 0.1, max: 1000, dec: 1,
    good: [0, 3],
    goodNote: '3 or less is healthy',
    hint: (v) =>
      v <= 2 ? 'Hardly any waste' : v <= 3 ? 'Inside the limit' : v <= 10 ? 'Waste is eating the oxygen' : 'Heavy waste load',
  },
  FC: {
    key: 'FC',
    name: 'Germs from sewage',
    tech: 'Fecal coliform bacteria',
    unit: 'MPN/100 mL',
    scale: 'log', min: 1, max: 100000000, dec: 0,
    good: [0, 2500],
    goodNote: '2,500 or less is the bathing limit',
    hint: (v) =>
      v <= 500 ? 'Very few germs' : v <= 2500 ? 'Inside the bathing limit' : v <= 100000 ? 'Plenty of sewage germs' : 'Sewage-level germs',
  },
};

// slider position (0..1) <-> value
export function toT(p, v) {
  const x = Math.min(p.max, Math.max(p.min, v));
  return p.scale === 'log'
    ? (Math.log10(x) - Math.log10(p.min)) / (Math.log10(p.max) - Math.log10(p.min))
    : (x - p.min) / (p.max - p.min);
}
export function fromT(p, t) {
  if (p.scale === 'log') {
    const v = Math.pow(10, Math.log10(p.min) + t * (Math.log10(p.max) - Math.log10(p.min)));
    return Number(v.toPrecision(2));
  }
  const v = p.min + t * (p.max - p.min);
  return Number(v.toFixed(p.dec));
}

export function fmt(v, key) {
  if (v == null || Number.isNaN(v)) return '';
  if (key === 'FC') return Math.round(v).toLocaleString('en-IN');
  if (v >= 100) return Math.round(v).toLocaleString('en-IN');
  return String(Number(v.toFixed(2)));
}

export const CLASSES = [
  { id: 0, official: 'Good or better', name: 'Fresh and healthy', color: 'var(--c0)', verdict: 'Looking good. Droppy is splashing around.' },
  { id: 1, official: 'Poor', name: 'Needs some care', color: 'var(--c1)', verdict: 'Not terrible, not great. A few things are off.' },
  { id: 2, official: 'Very Poor', name: 'Pretty polluted', color: 'var(--c2)', verdict: 'Ouch. This water is struggling.' },
  { id: 3, official: 'Unfit', name: 'Not fit for use', color: 'var(--c3)', verdict: 'Yikes. This water is in bad shape.' },
];

export const PRESETS = [
  { id: 'mountain', label: 'Mountain stream', v: { DO: 9.2, pH: 7.6, BOD: 1.0, FC: 20 } },
  { id: 'pond', label: 'Village pond', v: { DO: 4.8, pH: 7.9, BOD: 4.5, FC: 3500 } },
  { id: 'drain', label: 'City drain', v: { DO: 1.5, pH: 7.1, BOD: 55, FC: 400000 } },
  { id: 'acid', label: 'Acidic spill', v: { DO: 6.0, pH: 4.2, BOD: 3, FC: 120 } },
];

export const TIPS = {
  DO: 'Oxygen is the weak spot. Fish and other water life need about 5 mg/L or more. Low oxygen often comes from sewage or food waste, warm still water, or too many algae.',
  pH: 'The pH is far from neutral. Healthy rivers and lakes mostly sit between 6.5 and 8.5. Industrial discharge, mine runoff or heavy algae can push it out of range.',
  BOD: 'A lot of organic waste is using up the oxygen. This usually comes from sewage, food processing or animal waste washing in.',
  FC: 'Fecal bacteria are high, which points to sewage or animal waste getting into the water.',
};
