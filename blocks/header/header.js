import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const ICON_PERSON = '<svg class="ic-person" viewBox="0 0 168 172" aria-hidden="true"><path d="M131.724,50.708c0,29.359-20.657,55.619-46.102,55.619c-25.464,0-46.109-26.26-46.109-55.619C39.513,21.35,60.158,0,85.622,0C111.066,0,131.724,21.35,131.724,50.708z"/><path d="M137.888,105.574c-3.963-1.438-13.046-4.252-13.046-4.252c-15.41,14.241-39.403,26.63-39.403,26.63s-26.526-13.803-40.114-27.55c0,0-10.206,3.423-15.012,5.172C5.301,114.715,0,131.309,0,137.658c0,6.337,0.999,12.146,0.999,12.146s27.907,22.273,84.661,22.273c56.741,0,81.507-22.273,81.507-22.273s1.004-5.809,1.004-12.146C168.171,131.309,162.858,114.715,137.888,105.574z"/></svg>';
const ICON_GLOBE = '<svg class="ic-globe" viewBox="0 0 150 150" aria-hidden="true"><path d="M89.412,1.852c-0.129-0.104-0.24-0.191-0.277-0.229l-0.141,0.158c-4.539-0.863-9.219-1.318-14.009-1.318s-9.47,0.455-14.019,1.318l-0.139-0.158c-0.039,0.037-0.148,0.125-0.27,0.229C26.049,8.588,0,38.963,0,75.441c0,41.402,33.568,74.973,74.985,74.973c41.404,0,74.974-33.57,74.974-74.973C149.959,38.963,123.918,8.588,89.412,1.852zM134.205,50.625h-20.182c-2.75-14.66-7.678-25.734-12.441-33.617C116.232,23.707,127.957,35.744,134.205,50.625zM139.209,75.441c0,4.613-0.502,9.105-1.439,13.451h-22.205c0.426-4.326,0.659-8.914,0.659-13.756c0-4.852-0.233-9.418-0.659-13.752h22.068C138.652,65.914,139.209,70.609,139.209,75.441zM80.359,139.42V99.648h22.662c-4.873,23.137-15.605,35.639-19.355,39.41C82.57,139.207,81.467,139.324,80.359,139.42zM66.306,139.059c-3.76-3.771-14.483-16.273-19.358-39.41h22.653v39.771C68.486,139.324,67.4,139.207,66.306,139.059zM10.76,75.441c0-4.832,0.551-9.527,1.57-14.057h22.067c-0.419,4.334-0.661,8.9-0.661,13.752c0,4.842,0.242,9.43,0.661,13.756H12.191C11.264,84.547,10.76,80.055,10.76,75.441zM44.488,75.137c0-4.889,0.288-9.451,0.753-13.752h24.359v27.508H45.241C44.776,84.592,44.488,80.033,44.488,75.137zM69.601,11.445v39.18H46.947C51.57,29.35,61.09,17.246,66.279,12.021C67.379,11.811,68.486,11.617,69.601,11.445zM80.359,11.445c1.115,0.172,2.211,0.365,3.311,0.576c5.189,5.225,14.709,17.328,19.332,38.604H80.359V11.445zM80.359,61.385h24.35c0.465,4.301,0.752,8.863,0.752,13.752c0,4.896-0.287,9.455-0.752,13.756h-24.35V61.385zM28.188,17.008c-4.764,7.883-9.691,18.957-12.441,33.617H15.564h-0.019C21.792,35.744,33.517,23.707,28.188,17.008zM15.545,99.648h0.201h12.441c2.75,14.658,7.678,25.732,12.441,33.615C33.517,127.176,21.792,115.139,15.545,99.648zM121.582,133.264c4.764-7.883,9.691-18.957,12.441-33.615h0.182C127.957,115.139,116.232,127.176,121.582,133.264z"/></svg>';
const ICON_BELL = '<svg class="ic-bell" viewBox="4 4 24 24" aria-hidden="true"><path d="M16,24.9c-.95,0-2.21,0-3.1,0v0a3.1,3.1,0,0,0,6.2,0v-.06c-1.09,0-1.9.06-3.1.06"/><path d="M23.54,16.21C22.88,9.58,22.37,7,18.08,5.52,16.55,5,17.33,4,16,4s-.56,1-2.1,1.53C9.6,7,9,9.63,8.36,16.24c-.45,4.45-2.44,2.07-2.47,4.85,0,2,4.46,2.35,10.11,2.34s10.09-.35,10.11-2.38c0-2.78-2.11-.26-2.57-4.84"/></svg>';


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
        const btn = document.createElement('a');
        btn.href = a.getAttribute('href');
        btn.className = 'button primary login';
        btn.innerHTML = `${ICON_PERSON}<span>${a.textContent.trim()}</span>`;
        utility.append(btn);
      } else if (/Espa/.test(a.textContent)) {
        const link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.className = 'espanol';
        link.setAttribute('lang', 'es');
        link.innerHTML = `<span>${a.textContent.trim()}</span>${ICON_GLOBE}`;
        utility.append(link);
      } else {
        const link = a.cloneNode(true);
        link.className = 'create-account';
        utility.append(link);
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
