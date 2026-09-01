/**
 * cta-band — inset promo band (replica: 'Bundle and save!' Getaways band).
 * Schema: stardust/eds-schema/index.json § getaways-band.
 * Decode tier: TEMPLATE-SLOTTED for the price composition; authored slots
 * collected by classification (#48/#62), tolerant of DA single-cell flattening:
 *   eyebrow  → first short link-free text run (rendered as white pill)
 *   heading  → h2/h3
 *   body     → sentence-length link-free <p> after the heading
 *   prices   → rows whose text starts with 'Up to' (amount + description)
 *   CTA      → link-bearing <p> (buttonized upstream)
 *   legal    → trailing small-print (contains 'apply' / '**')
 * Variant: 'getaways' adds the cyan pictograms (reserved-color module).
 */

const PICTOS = `
<div class="trip-pictos" aria-hidden="true">
  <svg viewBox="0 0 24 24"><path d="M21.5 4.5c-1.2-1.2-3.3-.9-4.7.4l-3 2.8-8.6-2.5-2 1.9 7 3.9-3.1 2.9-2.5-.3-1.4 1.4 3.2 1.7 1.7 3.2 1.4-1.4-.3-2.5 2.9-3.1 3.9 7 1.9-2-2.5-8.6 2.8-3c1.3-1.4 1.6-3.5.4-4.7Z"/></svg>
  <span class="plus">+</span>
  <svg viewBox="0 0 24 24"><path d="M3 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17h2v-11h3a1 1 0 0 1 1 1v10h1v2H2v-2h1Zm3-15h2v2H6V6Zm4 0h2v2h-2V6ZM6 10h2v2H6v-2Zm4 0h2v2h-2v-2Zm-4 4h2v2H6v-2Zm4 0h2v2h-2v-2Z"/></svg>
  <span class="plus">+</span>
  <svg viewBox="0 0 24 24"><path d="M4.5 11 6 6.7A2 2 0 0 1 7.9 5.3h8.2A2 2 0 0 1 18 6.7L19.5 11a2.5 2.5 0 0 1 2 2.4v3.6a1 1 0 0 1-1 1h-.5v1.5a1.5 1.5 0 0 1-3 0V18h-10v1.5a1.5 1.5 0 0 1-3 0V18H3.5a1 1 0 0 1-1-1v-3.6a2.5 2.5 0 0 1 2-2.4Zm2-.5h11L16.3 7H7.7L6.5 10.5ZM6 15.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Zm12 0a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"/></svg>
</div>`;

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = cell.textContent.trim();
      out.push(p);
    }
  });
  return out.length ? out : [...block.children];
}

export default async function decorate(block) {
  const nodes = collectNodes(block);
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const ctaP = nodes.find((n) => n.querySelector && n.querySelector('a.button, strong a, em a'));
  const prices = nodes.filter((n) => /^Up to/i.test(n.textContent.trim()));
  const legal = nodes.find((n) => /apply|blkouts|\*\*/i.test(n.textContent) && n !== ctaP && (n.textContent.length > 80));
  const texts = nodes.filter((n) => !/^H[1-6]$/.test(n.tagName) && n !== ctaP && n !== legal
    && !prices.includes(n) && n.textContent.trim() && !(n.querySelector && n.querySelector('a')));
  // eyebrow buffered before heading (#76): short first text; body = the longer one
  const eyebrow = texts.find((t) => t.textContent.trim().length < 60);
  const body = texts.find((t) => t !== eyebrow);

  const inner = document.createElement('div');
  inner.className = 'band-inner';

  if (eyebrow) {
    const chip = document.createElement('span');
    chip.className = 'eyebrow-chip';
    chip.textContent = eyebrow.textContent.trim();
    inner.append(chip);
  }
  if (heading) {
    const h2 = document.createElement('h2');
    [...heading.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
    inner.append(h2);
  }
  if (body) {
    const p = document.createElement('p');
    p.className = 'band-lede';
    [...body.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    inner.append(p);
  }

  const grid = document.createElement('div');
  grid.className = 'band-grid';
  if (prices.length) {
    const callouts = document.createElement('div');
    callouts.className = 'price-callouts';
    prices.forEach((pNode, i) => {
      if (i > 0) {
        const div = document.createElement('div');
        div.className = 'price-divider';
        div.textContent = 'or';
        callouts.append(div);
      }
      // pattern: "Up to $250 off select domestic vacation packages**"
      const m = pNode.textContent.trim().match(/^Up to\s+(\$\d+)\s+(.*)$/i);
      const callout = document.createElement('div');
      callout.className = 'price-callout';
      callout.innerHTML = m
        ? `<div class="upto">Up to</div><div class="amount">${m[1]}</div><p class="desc">${m[2]}</p>`
        : `<p>${pNode.textContent.trim()}</p>`;
      callouts.append(callout);
    });
    grid.append(callouts);
  }
  if (block.classList.contains('getaways')) {
    const pictoWrap = document.createElement('div');
    pictoWrap.innerHTML = PICTOS;
    grid.append(pictoWrap.firstElementChild);
  }
  if (ctaP) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    [...ctaP.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    grid.append(actions);
  }
  inner.append(grid);

  if (legal) {
    const p = document.createElement('p');
    p.className = 'band-legal';
    [...legal.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    inner.append(p);
  }

  block.replaceChildren(inner);
}
