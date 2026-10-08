// Search relevance check (2026-10-08). Paste into the browser console on any WisdomUp page served by `python3 site/serve.py`
// (or load it with a <script>), then read the table it prints. It scores WU.search.run() against tools/search_eval.json:
// P@1 = the first result is a right type (and has the expected connector, when one is given); P@4 = share of the first four
// that are a right type; zero = no product results. Re-run after any change to the engine and keep the numbers going up.
(async function () {
  const set = await (await fetch('/tools/search_eval.json')).json();
  const rows = set.queries.map(c => {
    const r = WU.search.run(c.q), top = r.hits.slice(0, 4);
    const ok = p => c.expect.includes(p.type) && (!c.conn || (p.connectors || []).includes(c.conn));
    return { group: c.group, q: c.q, p1: top[0] && ok(top[0]) ? 1 : 0, p4: top.length ? top.filter(p => c.expect.includes(p.type)).length / 4 : 0, zero: r.hits.length ? 0 : 1, got: top.map(p => p.type).join(', ') };
  });
  const sum = list => ({ n: list.length, 'P@1': +(list.reduce((n, x) => n + x.p1, 0) / list.length * 100).toFixed(1), 'P@4': +(list.reduce((n, x) => n + x.p4, 0) / list.length * 100).toFixed(1), zero: list.reduce((n, x) => n + x.zero, 0) });
  const groups = {};
  rows.forEach(x => { (groups[x.group] = groups[x.group] || []).push(x); });
  const report = { all: sum(rows) };
  Object.entries(groups).forEach(([g, l]) => { report[g] = sum(l); });
  console.table(report);
  console.table(rows.filter(x => !x.p1));
  window.__searchEval = { report, misses: rows.filter(x => !x.p1) };
  return window.__searchEval;
})();
