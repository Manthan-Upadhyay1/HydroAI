import React, { useMemo, useState } from 'react';
import { CLASSES } from '../params.js';

const METRICS = {
  median: { label: 'Median score', note: 'Lower is better', get: (s) => s.median_wqi, max: 150, fmt: (v) => v.toFixed(0), asc: true },
  good: { label: 'Fresh and healthy', note: 'Share of samples scoring 50 or less', get: (s) => s.good_share * 100, max: 100, fmt: (v) => `${v.toFixed(0)}%`, asc: false },
  unfit: { label: 'Not fit for use', note: 'Share of samples scoring over 100', get: (s) => s.unfit_share * 100, max: 100, fmt: (v) => `${v.toFixed(0)}%`, asc: true },
};

export default function India({ engine }) {
  const { states, class_share: share, dataset } = engine.model;
  const [metric, setMetric] = useState('median');
  const [q, setQ] = useState('');
  const m = METRICS[metric];

  const rows = useMemo(() => {
    const r = states.filter((s) => s.State.toLowerCase().includes(q.trim().toLowerCase()));
    return r.sort((a, b) => (m.asc ? m.get(a) - m.get(b) : m.get(b) - m.get(a)));
  }, [states, q, m]);

  const colorFor = (s) => {
    if (metric === 'median') return CLASSES[engine.classify(s.median_wqi)].color;
    return metric === 'good' ? 'var(--c0)' : 'var(--c3)';
  };

  return (
    <div className="page india">
      <header className="hero">
        <h1>How does India's water look?</h1>
        <p className="lede">
          Droppy learned from government monitoring records collected in {dataset.years[0] === dataset.years[1] ? dataset.years[0] : `${dataset.years[0]} to ${dataset.years[1]}`}:
          {' '}{dataset.scored_records.toLocaleString('en-IN')} samples from {dataset.stations.toLocaleString('en-IN')} stations in {dataset.states} states and territories.
          {' '}{dataset.full_records.toLocaleString('en-IN')} of them also include a bacteria result, and only those get a score on this page.
        </p>
      </header>

      <section className="sticker panel">
        <h2>Overall mix</h2>
        <p className="muted small">Samples with all four measurements, sorted into Droppy's four groups.</p>
        <div className="stack" role="img" aria-label="Share of samples in each class">
          {CLASSES.map((c, i) => (
            <div key={c.id} className="stack-seg" style={{ flexBasis: `${(share[c.official] || 0) * 100}%`, background: c.color }}>
              {(share[c.official] || 0) > 0.07 ? `${Math.round((share[c.official] || 0) * 100)}%` : ''}
            </div>
          ))}
        </div>
        <div className="legend">
          {CLASSES.map((c) => (
            <div className="legend-item" key={c.id}>
              <span className="dot" style={{ background: c.color }} /><b>{c.name}</b>
              <span className="muted">{Math.round((share[c.official] || 0) * 100)}%</span>
            </div>
          ))}
        </div>
      </section>

      <section className="sticker panel">
        <div className="panel-head">
          <h2>State league table</h2>
          <div className="seg" role="group" aria-label="Rank states by">
            {Object.entries(METRICS).map(([k, v]) => (
              <button key={k} type="button" className={`chip small ${metric === k ? 'on' : ''}`} onClick={() => setMetric(k)}>{v.label}</button>
            ))}
          </div>
        </div>
        <p className="muted small">{m.note}. Only states with at least 30 complete samples are shown.</p>
        <label className="search" htmlFor="state-search">
          <span className="sr">Search states</span>
          <input id="state-search" type="search" placeholder="Search a state" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <ol className="league">
          {rows.map((s, i) => (
            <li key={s.State}>
              <span className="rank">{i + 1}</span>
              <span className="st-name">{s.State}<small>{s.n.toLocaleString('en-IN')} samples</small></span>
              <span className="bar-track"><span className="bar-fill" style={{ width: `${Math.max(2, (m.get(s) / m.max) * 100)}%`, background: colorFor(s) }} /></span>
              <span className="bar-val">{m.fmt(m.get(s))}</span>
            </li>
          ))}
          {rows.length === 0 && <li className="muted">No state matches that search.</li>}
        </ol>
        <p className="muted small">
          Scores need all four measurements, so a state with few complete samples can look better or worse than it really is. Samples come from monitoring points, which are often placed at known pollution hot spots.
        </p>
      </section>
    </div>
  );
}
