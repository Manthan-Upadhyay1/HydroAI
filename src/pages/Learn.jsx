import React from 'react';
import { CLASSES } from '../params.js';

const ITEMS = [
  {
    key: 'DO', title: 'Oxygen in the water', tech: 'Dissolved oxygen, DO', unit: 'mg/L', healthy: '5 or more',
    what: 'The amount of oxygen mixed into the water. Fish, insects and the tiny helpers that clean water all breathe it.',
    why: 'When it drops, fish leave or die and the water starts to smell. It is the first number most people check.',
    scale: { from: 0, to: 15, good: [5, 15] },
  },
  {
    key: 'pH', title: 'Sour or soapy', tech: 'Potential of hydrogen, pH', unit: 'pH', healthy: '6.5 to 8.5',
    what: 'A 0 to 14 scale. Low numbers are acidic (sour like lemon), high numbers are alkaline (slippery like soap), 7 is neutral.',
    why: 'Water life is picky. Far from neutral, fish struggle and metals can dissolve into the water.',
    scale: { from: 0, to: 14, good: [6.5, 8.5] },
  },
  {
    key: 'BOD', title: 'Waste that eats oxygen', tech: 'Biochemical oxygen demand, BOD', unit: 'mg/L', healthy: '3 or less',
    what: 'How much oxygen germs use up while breaking down waste in the water over five days.',
    why: 'High BOD means a lot of sewage or food waste. That waste will steal oxygen from the fish.',
    scale: { from: 0, to: 20, good: [0, 3] },
  },
  {
    key: 'FC', title: 'Germs from sewage', tech: 'Fecal coliform bacteria', unit: 'MPN per 100 mL', healthy: '2,500 or less (bathing limit)',
    what: 'A count of bacteria that live in the guts of people and animals. They are a warning sign for sewage.',
    why: 'Where these bacteria are high, other disease-causing germs can be present too.',
    scale: { from: 0, to: 10000, good: [0, 2500] },
  },
];

function Scale({ s }) {
  const span = s.to - s.from;
  const a = ((s.good[0] - s.from) / span) * 100, b = ((s.good[1] - s.from) / span) * 100;
  return (
    <div className="mini-scale" aria-hidden="true">
      <div className="mini-track"><div className="mini-good" style={{ left: `${a}%`, width: `${b - a}%` }} /></div>
      <div className="mini-ends"><span>{s.from}</span><span>healthy zone</span><span>{s.to.toLocaleString('en-IN')}+</span></div>
    </div>
  );
}

export default function Learn() {
  return (
    <div className="page learn">
      <header className="hero">
        <h1>What do these numbers mean?</h1>
        <p className="lede">Four quick measurements tell a surprising amount about a river, pond or drain. Here is what each one is.</p>
      </header>

      <div className="learn-grid">
        {ITEMS.map((it) => (
          <article className="card sticker" key={it.key}>
            <h2>{it.title}</h2>
            <p className="tech">{it.tech}</p>
            <dl>
              <dt>What it is</dt><dd>{it.what}</dd>
              <dt>Why it matters</dt><dd>{it.why}</dd>
              <dt>Healthy value</dt><dd><b>{it.healthy}</b> {it.unit}</dd>
            </dl>
            <Scale s={it.scale} />
          </article>
        ))}
      </div>

      <section className="how sticker">
        <h2>How the score is made</h2>
        <ol className="steps">
          <li><b>Compare.</b> Each measurement is compared with its healthy limit from India's Central Pollution Control Board (CPCB).</li>
          <li><b>Weigh.</b> Oxygen and germs count a little more than pH and waste.</li>
          <li><b>Blend.</b> The four results are averaged into one number. <b>Lower is better.</b></li>
          <li><b>Sort.</b> The number lands in one of four groups.</li>
        </ol>
        <div className="legend">
          {[['0 to 50', 0], ['50 to 75', 1], ['75 to 100', 2], ['over 100', 3]].map(([r, i]) => (
            <div className="legend-item" key={i}>
              <span className="dot" style={{ background: CLASSES[i].color }} />
              <b>{CLASSES[i].name}</b>
              <span className="muted">{r}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
