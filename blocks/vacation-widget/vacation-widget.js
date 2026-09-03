/**
 * vacation-widget — Getaways booking bar facsimile (static; "Find a vacation"
 * links to the live Getaways flow). Dates roll like live (+14/+18 days).
 * Authoring: single row, destination display value (optional).
 */
const BOOK = 'https://www.southwest.com/vacations/';

function fmt(d) {
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}
function longFmt(d) {
  return d.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: '2-digit', year: 'numeric',
  }).replace(/(\w+) (\w+ \d+), (\d+)/, '$1, $2, $3');
}

export default function decorate(block) {
  const dest = block.textContent.trim();
  const dep = new Date(); dep.setDate(dep.getDate() + 14);
  const ret = new Date(); ret.setDate(ret.getDate() + 18);
  block.innerHTML = `
    <div class="vw-card">
      <div class="vw-top">
        <div class="vw-tabs" role="tablist">
          <button type="button" role="tab" aria-selected="true" class="vw-active">Flight + Hotel</button>
          <button type="button" role="tab" aria-selected="false">Flight + Hotel + Car</button>
          <button type="button" role="tab" aria-selected="false">Flight + Car</button>
        </div>
        <button type="button" class="vw-travelers">1 Room, 2 Travelers <span class="vw-caret"></span></button>
        <a class="vw-promo" href="${BOOK}">Use Promo Code</a>
      </div>
      <div class="vw-bar">
        <div class="vw-field"><span class="vw-label">From</span><input type="text" aria-label="From"></div>
        <div class="vw-field"><span class="vw-label">To</span><input type="text" aria-label="To" value="${dest}"></div>
        <div class="vw-field vw-date"><span class="vw-label">Depart</span>
          <div class="vw-datebox">${fmt(dep)}<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#01a0c0" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 9.5h18M8 3v4M16 3v4"/></svg></div>
          <span class="vw-under">${longFmt(dep)}</span></div>
        <div class="vw-field vw-date"><span class="vw-label">Return</span>
          <div class="vw-datebox">${fmt(ret)}<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#01a0c0" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 9.5h18M8 3v4M16 3v4"/></svg></div>
          <span class="vw-under">${longFmt(ret)}</span></div>
        <a class="vw-submit" href="${BOOK}">Find a vacation</a>
      </div>
    </div>`;

  const tabs = block.querySelectorAll('.vw-tabs button');
  tabs.forEach((t) => t.addEventListener('click', () => {
    tabs.forEach((x) => { x.classList.toggle('vw-active', x === t); x.setAttribute('aria-selected', String(x === t)); });
  }));
}
