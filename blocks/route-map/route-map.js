/**
 * route-map — Where We Fly facsimile: map snapshot (the live page runs a
 * Mapbox application; the raster is the capture-state replica) + a WORKING
 * route finder fed from /data/routes.json — pick origin + destination,
 * "Find flights" activates and links into the booking flow.
 * Rows: [picture (map snapshot)].
 */
export default function decorate(block) {
  const pic = block.querySelector('picture, img');
  const map = document.createElement('div');
  map.className = 'rm-map';
  if (pic) map.append(pic.closest('picture') || pic);

  const panel = document.createElement('div');
  panel.className = 'rm-panel';
  panel.innerHTML = `
    <label class="rm-label" for="rm-from">Depart</label>
    <select id="rm-from" class="rm-select"><option value="">From</option></select>
    <label class="rm-label" for="rm-to">Arrive</label>
    <select id="rm-to" class="rm-select"><option value="">To</option></select>
    <label class="rm-check"><input type="checkbox"> Nonstop only</label>
    <a class="rm-find rm-disabled" aria-disabled="true">Find flights</a>`;

  const shell = document.createElement('div');
  shell.className = 'rm-shell';
  shell.append(map, panel);
  block.replaceChildren(shell);

  const from = panel.querySelector('#rm-from');
  const to = panel.querySelector('#rm-to');
  const find = panel.querySelector('.rm-find');
  const update = () => {
    const on = from.value && to.value;
    find.classList.toggle('rm-disabled', !on);
    find.setAttribute('aria-disabled', String(!on));
    find.href = on ? 'https://www.southwest.com/air/booking/' : '#';
  };
  from.addEventListener('change', update);
  to.addEventListener('change', update);

  fetch('/data/routes.json').then((r) => r.json()).then((data) => {
    const add = (sel, value, label) => {
      const o = document.createElement('option');
      o.value = value;
      o.textContent = label;
      sel.append(o);
    };
    [...new Map(data.map((r) => [r.fromCode || r.from, r.from])).entries()]
      .sort((a, b) => a[1].localeCompare(b[1]))
      .forEach(([code, name]) => add(from, code, name));
    [...new Set(data.map((r) => r.to))].sort().forEach((d) => add(to, d, d));
  }).catch(() => { /* dataset unavailable */ });
}
