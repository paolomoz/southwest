import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * header — southwest.com www chrome (replica).
 * Template-slotted (#95): fixed chrome DOM; authored /nav fills three slots:
 *   section 1 (brand): logo link
 *   section 2 (sections): primary nav link list
 *   section 3 (tools): points note + Log in (primary CTA) + Create account + Español
 * Live parity: no hamburger — the nav wraps visible at mobile (replica of
 * southwest.com's own mobile chrome). Search + notification glyphs are fixed
 * chrome (non-navigational on live).
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const [brandSec, linksSec, toolsSec] = sections;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Primary');

  // utility row (tools slot)
  const utility = document.createElement('div');
  utility.className = 'utility-row';
  if (toolsSec) {
    const ps = [...toolsSec.querySelectorAll('p')];
    ps.forEach((p) => {
      const a = p.querySelector('a');
      if (!a) {
        const note = document.createElement('span');
        note.className = 'points-note';
        note.textContent = p.textContent.trim();
        utility.append(note);
      } else if (a.classList.contains('button') || p.querySelector('strong')) {
        const btn = a.cloneNode(true);
        btn.className = 'button primary login';
        utility.append(btn);
      } else {
        utility.append(a.cloneNode(true));
      }
    });
  }

  // nav row: brand + links
  const navRow = document.createElement('div');
  navRow.className = 'nav-row';

  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const brandLink = brandSec ? brandSec.querySelector('a') : null;
  if (brandLink) {
    const a = document.createElement('a');
    a.href = brandLink.getAttribute('href') || '/';
    a.setAttribute('aria-label', 'Southwest Airlines home');
    const img = brandSec.querySelector('img');
    if (img) {
      const logo = img.cloneNode(true);
      logo.setAttribute('width', '223');
      logo.setAttribute('height', '34');
      logo.setAttribute('loading', 'eager');
      a.append(logo);
    }
    brand.append(a);
  }

  const links = document.createElement('div');
  links.className = 'nav-sections';
  const ul = document.createElement('ul');
  if (linksSec) {
    linksSec.querySelectorAll('li').forEach((li) => {
      const a = li.querySelector(':scope > a, :scope > p > a'); // #98 pipeline wraps in <p>
      if (!a) return;
      const item = document.createElement('li');
      item.append(a.cloneNode(true));
      ul.append(item);
    });
  }
  // fixed chrome glyphs (non-navigational on live)
  const glyphs = document.createElement('li');
  glyphs.className = 'nav-glyphs';
  glyphs.innerHTML = `
    <button type="button" aria-label="Notifications"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 16v-5a6 6 0 1 0-12 0v5l-1.5 2h15ZM10 20a2 2 0 0 0 4 0"/></svg></button>
    <button type="button" aria-label="Search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></button>`;
  ul.append(glyphs);
  links.append(ul);

  navRow.append(brand, links);
  nav.append(utility, navRow);

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  block.textContent = '';
  block.append(wrapper);
}
