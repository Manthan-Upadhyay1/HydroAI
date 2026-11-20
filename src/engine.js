// HydroAI prediction engine. Runs the exported ANN weights and the WQI formula in plain JavaScript,
// so the app needs no server. The same file is used by the unit test against Python predictions.

export function createEngine(model) {
  const { std, weights: W, qcap, valid } = model;
  const clip = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  // ---- WQI formula (identical to hydroai_wqi.py) ----
  function subIndices(v) {
    const q = {};
    if (v.DO != null) q.DO = clip((100 * (std.DO_ideal - v.DO)) / (std.DO_ideal - std.DO), 0, qcap);
    if (v.pH != null) q.pH = clip((100 * Math.abs(v.pH - std.pH_ideal)) / (std.pH_hi - std.pH_ideal), 0, qcap);
    if (v.BOD != null) q.BOD = clip((100 * v.BOD) / std.BOD, 0, qcap);
    if (v.FC != null) q.FC = clip((100 * v.FC) / std.FC, 0, qcap);
    return q;
  }

  function wqiFormula(v) {
    const q = subIndices(v);
    const keys = Object.keys(q);
    const tw = keys.reduce((a, k) => a + W[k], 0);
    return keys.reduce((a, k) => a + q[k] * W[k], 0) / tw;
  }

  // how many WQI points each measurement adds (they sum to the score)
  function contributions(v) {
    const q = subIndices(v);
    const keys = Object.keys(q);
    const tw = keys.reduce((a, k) => a + W[k], 0);
    const out = {};
    keys.forEach((k) => (out[k] = (q[k] * W[k]) / tw));
    return out;
  }

  // 0 = Good or better, 1 = Poor, 2 = Very Poor, 3 = Unfit
  const classify = (w) => (w <= 50 ? 0 : w <= 75 ? 1 : w <= 100 ? 2 : 3);

  // ---- neural network ----
  function dense(layer, x) {
    const { W: Wt, b, act } = layer;
    const out = new Array(b.length);
    for (let j = 0; j < b.length; j++) {
      let s = b[j];
      for (let i = 0; i < x.length; i++) s += x[i] * Wt[i][j];
      out[j] = act === 'relu' ? Math.max(0, s) : s;
    }
    if (act === 'softmax') {
      const m = Math.max(...out);
      const e = out.map((z) => Math.exp(z - m));
      const t = e.reduce((a, c) => a + c, 0);
      return e.map((z) => z / t);
    }
    return out;
  }
  const forward = (layers, x) => layers.reduce((h, l) => dense(l, h), x);
  const preprocess = (pipe, v) =>
    pipe.order.map((k, i) => ((pipe.log[i] ? Math.log1p(v[k]) : v[k]) - pipe.mean[i]) / pipe.scale[i]);

  function validate(v) {
    const errors = [];
    for (const k of ['DO', 'pH', 'BOD', 'FC']) {
      if (v[k] == null) {
        if (k !== 'FC') errors.push({ key: k, msg: 'Droppy needs this number.' });
        continue;
      }
      if (!Number.isFinite(v[k])) {
        errors.push({ key: k, msg: 'That is not a number.' });
        continue;
      }
      const [lo, hi] = valid[k];
      if (v[k] < lo || v[k] > hi) errors.push({ key: k, msg: `Droppy can only read values from ${lo} to ${hi}.` });
    }
    return errors;
  }

  const [q10, q90] = model.summary.estimate.range;

  function predict(v) {
    const errors = validate(v);
    if (errors.length) return { ok: false, errors };
    const hasFC = v.FC != null;
    const pipe = hasFC ? model.full : model.nofc;
    const x = preprocess(pipe, v);
    const ann = forward(pipe.reg, x)[0] * 100;
    const probs = forward(pipe.clf, x);
    const formula = wqiFormula(v);
    const score = hasFC ? formula : Math.max(0, ann);
    return {
      ok: true,
      hasFC,
      score,
      cls: classify(score),
      formula,
      formulaCls: classify(formula),
      ann,
      probs,
      probCls: probs.indexOf(Math.max(...probs)),
      range: hasFC ? null : [Math.max(0, ann + q10), ann + q90],
      parts: contributions(v),
    };
  }

  // ---- "better than X % of Indian samples" from exported quantiles ----
  function cdf(key, x) {
    const q = model.quantiles[key];
    if (x <= q[0]) return 0;
    if (x >= q[100]) return 1;
    let i = 0;
    while (i < 99 && q[i + 1] <= x) i++;
    const span = q[i + 1] - q[i] || 1;
    return (i + (x - q[i]) / span) / 100;
  }
  function betterThan(key, x) {
    if (key === 'DO') return Math.round(100 * cdf('DO', x));
    if (key === 'BOD' || key === 'FC') return Math.round(100 * (1 - cdf(key, x)));
    const d = Math.abs(x - 7);
    const farther = 1 - cdf('pH', 7 + d) + cdf('pH', 7 - d);
    return Math.round(100 * (1 - farther));
  }
  const median = (key) => model.quantiles[key][50];

  return { predict, wqiFormula, subIndices, contributions, classify, validate, betterThan, median, model };
}
