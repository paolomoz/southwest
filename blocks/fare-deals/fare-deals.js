/**
 * fare-deals — dynamic fare listing with embedded business logic (demo: slide 10).
 *
 * Demonstrates the three asks for the AEM Sites 201 session:
 *  1. DYNAMIC CONTENT — fares load from a data endpoint (/data/fares.json,
 *     real Southwest fares harvested from the live site per origin), not from
 *     the authored document. Swap the fetch for the fare-cache API in prod.
 *  2. LOGIN STATE — logged-in members see fares in Rapid Rewards points with
 *     member messaging; anonymous visitors see cash fares + a join prompt.
 *  3. BUSINESS LOGIC IN THE BLOCK — departing-city select re-queries the
 *     dataset; destination-type (All/Domestic/International), passenger
 *     count (price × pax) and max-budget filters compute client-side;
 *     rows sort by price.
 *
 * Authoring (all copy stays author-owned in DA):
 *   row 1: heading  · row 2: intro copy · row 3: legal/disclaimer
 * The filter bar + rows are block chrome fed by the endpoint.
 */
import {
  getUser, onAuthChange, toPoints, formatPoints,
} from '../../scripts/demo-auth.js';

const state = {
  origin: 'ALB', destType: 'All', pax: 1, budget: null, data: null,
};

function fmtDate(d) {
  return d;
}

function render(listEl) {
  const user = getUser();
  const set = state.data[state.origin];
  if (!set) return;
  let fares = [...set.fares];
  if (state.destType === 'Domestic') fares = fares.filter((f) => !f.intl);
  if (state.destType === 'International') fares = fares.filter((f) => f.intl);
  if (state.budget) fares = fares.filter((f) => f.price * state.pax <= state.budget);
  fares.sort((a, b) => a.price - b.price);

  const head = document.createElement('p');
  head.className = 'fd-summary';
  head.textContent = `Most popular flights from ${set.label} — ${fares.length} deals`
    + `${state.destType !== 'All' ? ` · ${state.destType.toLowerCase()}` : ''}`
    + `${state.budget ? ` · under $${state.budget}` : ''}`
    + `${state.pax > 1 ? ` · ${state.pax} passengers` : ''}`;

  const ul = document.createElement('ul');
  ul.className = 'fd-list';
  fares.forEach((f) => {
    const li = document.createElement('li');
    const total = f.price * state.pax;
    const priceHtml = user
      ? `<span class="fd-pts">${formatPoints(toPoints(total))}<em>pts</em></span><span class="fd-cash-alt">or $${total}</span>`
      : `<span class="fd-cash">$${total}</span>`;
    li.innerHTML = `
      <span class="fd-route">to <b>${f.to}</b>${f.intl ? '<span class="fd-intl">International</span>' : ''}</span>
      <span class="fd-meta">departing on ${fmtDate(f.date)} | one-way starting at</span>
      <span class="fd-price">${priceHtml}</span>
      <a class="button primary fd-book" href="https://www.southwest.com/air/booking/">Book now</a>`;
    ul.append(li);
  });

  listEl.replaceChildren(head, ul);
}

export default async function decorate(block) {
  // authored copy (query, never index)
  const heading = block.querySelector('h1, h2, h3');
  const ps = [...block.querySelectorAll('p')];
  const intro = ps.find((p) => !/apply|restrictions/i.test(p.textContent) && p.textContent.trim().length > 40);
  const legal = ps.find((p) => /apply|restrictions/i.test(p.textContent));

  const resp = await fetch('/data/fares.json');
  state.data = await resp.json();

  const shell = document.createElement('div');
  shell.className = 'fd-shell';

  const headWrap = document.createElement('div');
  headWrap.className = 'fd-head';
  if (heading) {
    const h2 = document.createElement('h2');
    const inner = heading.querySelector('h1, h2, h3') || heading;
    [...inner.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
    headWrap.append(h2);
  }
  if (intro) headWrap.append(intro.cloneNode(true));
  shell.append(headWrap);

  // filter bar — the embedded business logic surface
  const bar = document.createElement('form');
  bar.className = 'fd-filters';
  bar.innerHTML = `
    <label><span>Departing city</span>
      <select name="origin">${Object.entries(state.data)
    .map(([code, s]) => `<option value="${code}">${s.label}</option>`).join('')}</select></label>
    <label><span>Passengers</span>
      <select name="pax">${[1, 2, 3, 4, 5, 6].map((n) => `<option>${n}</option>`).join('')}</select></label>
    <label><span>Destination type</span>
      <select name="destType"><option>All</option><option>Domestic</option><option>International</option></select></label>
    <label><span>Max budget (total)</span>
      <span class="fd-budget"><i>$</i><input name="budget" type="number" min="0" step="10" placeholder="Any"></span></label>`;
  shell.append(bar);

  const list = document.createElement('div');
  list.className = 'fd-results';
  shell.append(list);

  if (legal) {
    const p = legal.cloneNode(true);
    p.className = 'fd-legal';
    shell.append(p);
  }

  bar.addEventListener('change', () => {
    state.origin = bar.origin.value;
    state.pax = +bar.pax.value;
    state.destType = bar.destType.value;
    state.budget = bar.budget.value ? +bar.budget.value : null;
    render(list);
  });
  bar.budget.addEventListener('input', () => {
    state.budget = bar.budget.value ? +bar.budget.value : null;
    render(list);
  });

  onAuthChange(() => render(list));
  render(list);

  block.replaceChildren(shell);
}
