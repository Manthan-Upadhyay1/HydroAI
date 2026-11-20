import React from 'react';
import Droppy from './Droppy.jsx';
import Gauge from './Gauge.jsx';
import { CLASSES, PARAMS, ORDER, TIPS, fmt } from '../params.js';

export default function Result({ res, vals, engine, errors }) {
  if (!res || !res.ok) {
    return (
      <div className="result sticker" aria-live="polite">
        <div className="result-mascot"><Droppy cls={3} size={150} label="Droppy is confused" /></div>
        <h2 className="verdict">Droppy is confused</h2>
        <p className="muted">Fix the highlighted numbers and Droppy will have an answer.</p>
        {errors && errors.length > 0 && (
          <ul className="err-list">{errors.map((e) => <li key={e.key}><b>{PARAMS[e.key].name}:</b> {e.msg}</li>)}</ul>
        )}
      </div>
    );
  }

  const c = CLASSES[res.cls];
  const parts = ORDER.filter((k) => res.parts[k] != null).map((k) => ({ k, v: res.parts[k] }));
  const worst = [...parts].sort((a, b) => b.v - a.v)[0];
  const total = parts.reduce((a, p) => a + p.v, 0) || 1;
  const maxPart = Math.max(...parts.map((p) => p.v), 1);

  return (
    <div className="result sticker" aria-live="polite" id="result">
      <div className="result-top">
        <div className="result-mascot"><Droppy cls={res.cls} size={170} /></div>
        <div className="result-main">
          <span className="badge" style={{ background: c.color }}>{c.name}</span>
          <h2 className="verdict">{c.verdict}</h2>
          <p className="muted official">Official class: {c.official}</p>
        </div>
      </div>

      <Gauge score={res.score} range={res.range} color={c.color} estimate={!res.hasFC} />

      {res.hasFC ? (
        <p className="note">
          Exact score from all four measurements. {Math.abs(res.ann - res.formula) < 1.5
            ? "Droppy's neural network lands on the same number."
            : `Droppy's neural network says ${Math.round(res.ann)}, close to the exact ${Math.round(res.formula)}.`}
        </p>
      ) : (
        <div className="note estimate">
          <b>This is an estimate.</b> Without a bacteria result, Droppy predicts the full score from oxygen, pH and waste. In testing on new locations the real score landed between <b>{Math.round(res.range[0])}</b> and <b>{Math.round(res.range[1])}</b> about 8 times out of 10 (the dark arc on the gauge).
          Using only the three measurements as they are would give {Math.round(res.formula)}.
        </div>
      )}

      <h3 className="sec">What is moving the score</h3>
      <ul className="bars">
        {parts.map(({ k, v }) => (
          <li key={k} className={worst && worst.k === k && v > 8 ? 'top' : ''}>
            <span className="bar-name">{PARAMS[k].name}</span>
            <span className="bar-track"><span className="bar-fill" style={{ width: `${(v / maxPart) * 100}%` }} /></span>
            <span className="bar-val">{v.toFixed(0)} pts</span>
          </li>
        ))}
      </ul>
      {worst && worst.v > 8 && <p className="tip"><b>Biggest culprit:</b> {TIPS[worst.k]}</p>}
      {worst && worst.v <= 8 && <p className="tip">Every measurement is close to its healthy value. Nice.</p>}
      <p className="muted small">Points add up to the score ({Math.round(total)}). Lower is better.</p>

      <h3 className="sec">How you compare</h3>
      <ul className="compare">
        {ORDER.filter((k) => vals[k] != null).map((k) => {
          const pct = engine.betterThan(k, vals[k]);
          return (
            <li key={k}>
              <span>{PARAMS[k].name}</span>
              <span className="pct"><b>{pct}%</b> of Indian samples are worse</span>
            </li>
          );
        })}
      </ul>

      <details className="more">
        <summary>Show Droppy's thinking</summary>
        <div className="probs">
          <p className="muted small">How sure the neural network is about each category:</p>
          {CLASSES.map((cl, i) => (
            <div className="prob" key={cl.id}>
              <span>{cl.name}</span>
              <span className="bar-track"><span className="bar-fill" style={{ width: `${Math.round(res.probs[i] * 100)}%`, background: cl.color }} /></span>
              <span className="bar-val">{Math.round(res.probs[i] * 100)}%</span>
            </div>
          ))}
        </div>
        <p className="muted small">
          Score = weighted average of how far each measurement is from its healthy limit (oxygen {fmt(5)} mg/L, pH 6.5 to 8.5, waste 3 mg/L, germs 2,500 per 100 mL). Weights: oxygen 0.17, germs 0.16, pH 0.11, waste 0.11.
        </p>
      </details>

      <p className="disclaimer">Droppy is a learning tool built on India's CPCB monitoring data. It is not a lab test. Use a certified laboratory before deciding whether any water is safe to drink.</p>
    </div>
  );
}
