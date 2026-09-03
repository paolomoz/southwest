/**
 * route-fares — data-driven fare grid for /en/flights route pages.
 * DEMO BEATS:
 *  1. DYNAMIC CONTENT — cards render from /data/routes.json (real fares
 *     harvested from the live site), not from the authored document. The
 *     authored page carries only the heading + destination key; ~115 route
 *     pages share this one block + one dataset.
 *  2. BUSINESS LOGIC IN THE BLOCK — origin text filter and one-way budget
 *     filter run client-side, same as the vendor (airTRFX) widget.
 * Rows: [h2] · [destination key, e.g. "Orlando, FL"] · [fine-print p].
 * Variant `wide`: horizontal 2-col cards + "View more" reveal.
 */
const BOOK = 'https://www.southwest.com/air/booking/';

function label(r) {
  const from = r.fromCode ? `${r.from} (${r.fromCode})` : r.from;
  const to = r.toCode ? `${r.to.split(',')[0]} (${r.toCode})` : r.to;
  return { from, to };
}

function card(r, wide) {
  const li = document.createElement('li');
  li.className = 'rf-card';
  li.dataset.from = r.from.toLowerCase();
  li.dataset.price = r.price;
  const { from, to } = label(r);
  const seen = r.seen ? `<p class="rf-seen">Seen: ${r.seen}</p>` : '';
  const priceBox = `
    <div class="rf-price">
      <span class="rf-from">From</span>
      <span class="rf-amt">$${r.price}*</span>
      ${seen}
      ${wide ? '' : '<p class="rf-fare-type">One-way / Basic</p>'}
    </div>`;
  li.innerHTML = wide
    ? `<div class="rf-copy"><h3>${from} to<br>${to}</h3><p class="rf-depart">Depart: ${r.date}</p><p class="rf-fare-type">One-way / Basic</p></div>
       ${priceBox}<a class="rf-book" href="${BOOK}">Book now</a>`
    : `<div class="rf-copy"><h3>${from} to<br>${to}</h3><p class="rf-depart">Depart: ${r.date}</p></div>
       ${priceBox}<a class="rf-book" href="${BOOK}">Book now</a>`;
  return li;
}

export default function decorate(block) {
  const wide = block.classList.contains('wide');
  const rows = [...block.children];
  const heading = block.querySelector('h1,h2,h3');
  const fine = [...block.querySelectorAll('p')].find((p) => p.textContent.trim().length > 80);
  const dest = rows.map((r) => r.textContent.trim())
    .find((t) => t && t !== (heading && heading.textContent.trim())
      && t !== (fine && fine.textContent.trim()));

  const filters = document.createElement('div');
  filters.className = 'rf-filters';
  filters.innerHTML = `
    <div class="rf-filter"><span class="rf-label">FROM</span>
      <div class="rf-inputbox rf-ico-plane"><input type="text" placeholder="Input origin" aria-label="Filter by origin"></div></div>
    <div class="rf-filter"><span class="rf-label">TO</span>
      <div class="rf-inputbox rf-to"><span>${dest || ''}</span><button type="button" aria-label="Clear destination">✕</button></div></div>
    <div class="rf-filter"><span class="rf-label">BUDGET (ONE-WAY)</span>
      <div class="rf-inputbox rf-budget"><span class="rf-dollar">$</span><input type="number" min="0" placeholder="Input max budget" aria-label="Maximum one-way budget"></div></div>
    <div class="rf-filter"><span class="rf-label">FARE TYPE</span>
      <div class="rf-inputbox"><select aria-label="Fare type"><option selected></option><option>Basic</option></select></div></div>`;

  const grid = document.createElement('ul');
  grid.className = 'rf-grid';

  const more = document.createElement('button');
  more.type = 'button';
  more.className = 'rf-more';
  more.textContent = 'View more';
  more.hidden = true;

  block.replaceChildren();
  if (heading) block.append(heading);
  block.append(filters, grid);
  if (wide) block.append(more);
  if (fine && !wide) block.append(fine);

  const state = { origin: '', budget: 0, shown: wide ? 6 : 20 };
  let all = [];

  const render = () => {
    let list = all;
    if (state.origin) list = list.filter((r) => r.from.toLowerCase().includes(state.origin));
    if (state.budget > 0) list = list.filter((r) => r.price <= state.budget);
    grid.replaceChildren(...list.slice(0, state.shown).map((r) => card(r, wide)));
    more.hidden = !wide || list.length <= state.shown;
    if (!list.length) {
      const empty = document.createElement('li');
      empty.className = 'rf-empty';
      empty.textContent = 'No fares match your filters.';
      grid.append(empty);
    }
  };

  filters.querySelector('.rf-ico-plane input').addEventListener('input', (e) => {
    state.origin = e.target.value.trim().toLowerCase();
    render();
  });
  filters.querySelector('.rf-budget input').addEventListener('input', (e) => {
    state.budget = Number(e.target.value) || 0;
    render();
  });
  more.addEventListener('click', () => {
    state.shown += 6;
    render();
  });

  fetch('/data/routes.json')
    .then((res) => res.json())
    .then((data) => {
      // one card per origin (cheapest fare), matching the live widget
      const byOrigin = new Map();
      data.filter((r) => r.to === dest).forEach((r) => {
        const k = r.fromCode || r.from;
        if (!byOrigin.has(k) || byOrigin.get(k).price > r.price) byOrigin.set(k, r);
      });
      all = [...byOrigin.values()].sort((a, b) => a.price - b.price);
      render();
    })
    .catch(() => { /* dataset unavailable: grid stays empty */ });
}
