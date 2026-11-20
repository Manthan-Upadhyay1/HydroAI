import React from 'react';

const pct = (x) => `${(x * 100).toFixed(1)}%`;
const yrs = (y) => (y[0] === y[1] ? `${y[0]}` : `${y[0]} to ${y[1]}`);

export default function About({ engine }) {
  const { summary: s, dataset: d } = engine.model;
  const t = s.temporal || {};
  const tkeys = Object.keys(t);
  return (
    <div className="page about">
      <header className="hero">
        <h1>How Droppy works</h1>
        <p className="lede">HydroAI is a capstone project that learns water-quality scores from India's official monitoring data.</p>
      </header>

      <section className="sticker panel">
        <h2>The short version</h2>
        <ol className="steps">
          <li><b>Data.</b> {d.scored_records.toLocaleString('en-IN')} usable station-date records from CPCB and the National Water Data Portal, collected in {yrs(d.years)}.</li>
          <li><b>Cleaning.</b> Impossible values such as a pH of 78 were removed. Extreme but possible pollution values were kept.</li>
          <li><b>Score.</b> A weighted index based on CPCB limits turns four measurements into one number.</li>
          <li><b>Learning.</b> A small neural network learns the score, and runs right here in your browser. Nothing you type is sent anywhere.</li>
        </ol>
      </section>

      <section className="sticker panel">
        <h2>How good is it?</h2>
        <p className="muted small">All numbers come from locations the model never saw during training.</p>
        <div className="stats">
          <div className="stat">
            <span className="stat-n">{s.full.R2.toFixed(3)}</span>
            <span className="stat-l">R² with all four measurements</span>
            <span className="stat-d">Class right {pct(s.full.accuracy)} of the time. Typical error about {s.full.MAE.toFixed(1)} points.</span>
          </div>
          <div className="stat">
            <span className="stat-n">{s.estimate.R2.toFixed(2)}</span>
            <span className="stat-l">R² without a bacteria test</span>
            <span className="stat-d">Class right {pct(s.estimate.accuracy)} of the time. Typical error about {s.estimate.MAE.toFixed(1)} points.</span>
          </div>
        </div>
        <div className="callout">
          <b>Read the first number carefully.</b> With all four measurements, the score is itself a formula of those measurements, so the network is copying a formula, and a near-perfect result is expected.
          The second number is the real test: the network has to guess the part of the score that comes from bacteria it never sees.
          For comparison, always guessing the average scores an R² of about {Math.abs(s.estimate.benchmark_mean_R2) < 0.005 ? '0' : s.estimate.benchmark_mean_R2.toFixed(2)}, and using the three-measurement formula directly gets the class right only {pct(s.estimate.benchmark_formula_accuracy)} of the time.
        </div>
        {tkeys.length > 0 && (
          <p className="muted small">
            Seasonal check: trained on January to August 2021 and tested on September to December 2021, the network keeps an R² of {t[tkeys[0]].ANN.R2.toFixed(2)} with all four measurements and {t[tkeys[1]] ? t[tkeys[1]].ANN.R2.toFixed(2) : 'n/a'} without bacteria.
          </p>
        )}
      </section>

      <section className="sticker panel">
        <h2>Good to know</h2>
        <ul className="plain">
          <li><b>Not a lab test.</b> Droppy describes patterns in monitoring data. It cannot certify that water is safe to drink.</li>
          <li><b>One year of data.</b> Almost all measurements are from 2021, so Droppy says nothing about trends over several years.</li>
          <li><b>Only four measurements.</b> Metals, pesticides, turbidity and temperature are not included.</li>
          <li><b>Standards.</b> Oxygen 5 mg/L, pH 6.5 to 8.5 and waste 3 mg/L follow CPCB's best-use classes. Germs use CPCB's bathing limit of 2,500 per 100 mL (500 is the desirable level).</li>
          <li><b>Surface water.</b> Training data comes from rivers, lakes, drains and some groundwater points across India. Results for other places may differ.</li>
          <li><b>Values outside range.</b> Droppy refuses numbers it was not trained on, for example a pH above 14.</li>
        </ul>
      </section>

      <section className="sticker panel">
        <h2>Sources</h2>
        <ul className="plain">
          <li><a href="https://nwdp.nwic.gov.in/" target="_blank" rel="noreferrer">National Water Data Portal</a></li>
          <li><a href="https://cpcb.nic.in/nwmp-data/" target="_blank" rel="noreferrer">CPCB National Water Monitoring Programme</a></li>
          <li><a href="https://cpcb.nic.in/water-quality-criteria/" target="_blank" rel="noreferrer">CPCB water quality criteria</a></li>
        </ul>
      </section>
    </div>
  );
}
