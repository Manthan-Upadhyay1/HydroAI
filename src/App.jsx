import React, { useEffect, useMemo, useState } from 'react';
import model from './hydroai_model.json';
import { createEngine } from './engine.js';
import Check from './pages/Check.jsx';
import Learn from './pages/Learn.jsx';
import India from './pages/India.jsx';
import About from './pages/About.jsx';
import { DroppyMini } from './components/Droppy.jsx';

const TABS = [
  { id: 'check', label: 'Check water' },
  { id: 'learn', label: 'Learn' },
  { id: 'india', label: 'India' },
  { id: 'about', label: 'About' },
];
const fromHash = () => {
  const h = (window.location.hash || '').replace('#', '');
  return TABS.some((t) => t.id === h) ? h : 'check';
};

export default function App() {
  const engine = useMemo(() => createEngine(model), []);
  const [tab, setTab] = useState(fromHash());
  useEffect(() => {
    const on = () => setTab(fromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const go = (id) => { window.location.hash = id; setTab(id); window.scrollTo({ top: 0 }); };

  return (
    <>
      <div className="bubbles" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} className={`b b${i + 1}`} />)}</div>
      <header className="topbar">
        <div className="topbar-in">
          <a className="brand" href="#check" onClick={(e) => { e.preventDefault(); go('check'); }}>
            <DroppyMini cls={0} size={30} />
            <span>HydroAI</span>
          </a>
          <nav className="tabs" aria-label="Pages">
            {TABS.map((t) => (
              <button key={t.id} type="button" className={`tab ${tab === t.id ? 'on' : ''}`} aria-current={tab === t.id ? 'page' : undefined} onClick={() => go(t.id)}>{t.label}</button>
            ))}
          </nav>
        </div>
      </header>
      <main className="wrap">
        {tab === 'check' && <Check engine={engine} />}
        {tab === 'learn' && <Learn />}
        {tab === 'india' && <India engine={engine} />}
        {tab === 'about' && <About engine={engine} />}
      </main>
      <footer className="foot">
        <p>HydroAI capstone project. Built on CPCB and National Water Data Portal monitoring data. Not a substitute for laboratory testing.</p>
      </footer>
    </>
  );
}
