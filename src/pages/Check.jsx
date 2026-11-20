import React, { useMemo, useState } from 'react';
import ParamCard from '../components/ParamCard.jsx';
import Result from '../components/Result.jsx';
import { DroppyMini } from '../components/Droppy.jsx';
import { CLASSES, PRESETS, ORDER } from '../params.js';

export default function Check({ engine }) {
  const [vals, setVals] = useState({ DO: 6.5, pH: 7.6, BOD: 2.5, FC: 300 });
  const [useFC, setUseFC] = useState(true);
  const [preset, setPreset] = useState(null);

  const input = useMemo(() => ({ ...vals, FC: useFC ? vals.FC : null }), [vals, useFC]);
  const errs = useMemo(() => engine.validate(input), [engine, input]);
  const res = useMemo(() => engine.predict(input), [engine, input]);
  const errFor = (k) => { const e = errs.find((x) => x.key === k); return e ? e.msg : null; };

  const set = (k) => (v) => { setPreset(null); setVals((s) => ({ ...s, [k]: v })); };
  const apply = (p) => { setPreset(p.id); setVals({ ...p.v }); setUseFC(true); };
  const surprise = () => {
    const t = engine.model.tests.filter((x) => x.in.do <= 15);
    const pick = t[Math.floor(Math.random() * t.length)].in;
    setPreset('real'); setVals({ DO: Number(pick.do.toFixed(1)), pH: Number(pick.ph.toFixed(1)), BOD: Number(pick.bod.toFixed(1)), FC: Math.round(pick.fc) }); setUseFC(true);
  };

  const c = res && res.ok ? CLASSES[res.cls] : null;
  return (
    <div className="page check">
      <header className="hero">
        <h1>How healthy is your water?</h1>
        <p className="lede">Type in your water-test numbers. Droppy turns them into one easy score and tells you what is pulling it down.</p>
        <div className="presets" role="group" aria-label="Try an example">
          <span className="presets-label">Try one:</span>
          {PRESETS.map((p) => (
            <button key={p.id} type="button" className={`chip ${preset === p.id ? 'on' : ''}`} onClick={() => apply(p)}>{p.label}</button>
          ))}
          <button type="button" className={`chip alt ${preset === 'real' ? 'on' : ''}`} onClick={surprise}>A real sample</button>
        </div>
      </header>

      <div className="check-grid">
        <div className="params">
          {ORDER.map((k) => (
            <ParamCard
              key={k} k={k} value={vals[k]} onChange={set(k)}
              median={engine.median(k)} error={errFor(k)}
              optionalOn={useFC} onToggle={setUseFC}
            />
          ))}
        </div>
        <aside className="result-col"><Result res={res} vals={input} engine={engine} errors={errs} /></aside>
      </div>

      {c && (
        <a className="minibar" href="#result" onClick={(e) => { e.preventDefault(); document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
          <DroppyMini cls={res.cls} size={34} />
          <span className="mini-score">{Math.round(res.score)}</span>
          <span className="mini-name">{c.name}{!res.hasFC ? ' (estimate)' : ''}</span>
          <span className="mini-go">See why</span>
        </a>
      )}
    </div>
  );
}
