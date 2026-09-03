/**
 * weather-strip — 7-day destination weather (route pages; snapshot data).
 * Rows: [h2] · 7× [day | condition | temp | date] · [powered-by p].
 */
const CLOUD = '<svg viewBox="0 0 48 36" width="56" height="42" fill="none" stroke="#304cb2" stroke-width="2"><path d="M37 16a9 9 0 0 0-17.5-2.8A7.5 7.5 0 0 0 11 27h25a5.5 5.5 0 0 0 1-11z"/><path d="M17 31v3M24 31v4M31 31v3" stroke-linecap="round"/></svg>';

export default function decorate(block) {
  const rows = [...block.children];
  const heading = block.querySelector('h1,h2,h3');
  const dayRows = rows.filter((r) => r.children.length >= 4);
  const powered = [...block.querySelectorAll('p')].find((p) => /powered by/i.test(p.textContent));

  const head = document.createElement('div');
  head.className = 'ws-head';
  if (heading) head.append(heading);
  const unit = document.createElement('div');
  unit.className = 'ws-unit';
  unit.innerHTML = '<span>WEATHER UNIT:</span><select aria-label="Weather unit"><option selected>Fahrenheit</option><option>Celsius</option></select>';
  head.append(unit);

  const strip = document.createElement('ul');
  strip.className = 'ws-strip';
  dayRows.forEach((r) => {
    const [day, cond, temp, date] = [...r.children].map((c) => c.textContent.trim());
    const li = document.createElement('li');
    li.className = 'ws-day';
    li.innerHTML = `<div class="ws-icon">${CLOUD}</div>
      <p class="ws-name">${day}</p><p class="ws-cond">${cond}</p>
      <p class="ws-temp">${temp}</p><p class="ws-date">${date}</p>`;
    strip.append(li);
  });

  block.replaceChildren(head, strip);
  if (powered) {
    powered.className = 'ws-powered';
    block.append(powered);
  }
}
