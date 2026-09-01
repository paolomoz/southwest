import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL_ICONS = {
  facebook: '<svg viewBox="0 0 24 24"><path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5.5v3.5H8V21h3.5v-7.5h2.7l.55-3.5H11.5V7.8c0-.72.58-1.3 1.3-1.3H15Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24"><path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm4 5.4A3.6 3.6 0 1 0 15.6 12 3.6 3.6 0 0 0 12 8.4Zm5.2-1.7a.9.9 0 1 0 .9.9.9.9 0 0 0-.9-.9Z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24"><path d="M21.5 8s-.2-1.4-.8-2c-.7-.8-1.6-.8-2-.9C15.9 4.9 12 4.9 12 4.9s-3.9 0-6.7.2c-.4.1-1.3.1-2 .9-.6.6-.8 2-.8 2S2.3 9.6 2.3 11.3v1.4C2.3 14.4 2.5 16 2.5 16s.2 1.4.8 2c.7.8 1.7.8 2.1.9 1.6.2 6.6.2 6.6.2s3.9 0 6.7-.2c.4-.1 1.3-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.3v-1.4C21.7 9.6 21.5 8 21.5 8ZM10 14.6V9.4l5.2 2.6Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24"><path d="M6.5 8.8v11H3.2v-11ZM4.9 3.7a1.9 1.9 0 1 1-1.9 1.9 1.9 1.9 0 0 1 1.9-1.9ZM20.8 13.6v6.2h-3.3v-5.7c0-1.4-.5-2.4-1.8-2.4a1.9 1.9 0 0 0-1.8 1.3 2.4 2.4 0 0 0-.1.9v5.9H10.5s.05-9.6 0-10.6h3.3v1.5a3.3 3.3 0 0 1 3-1.7c2.2 0 3.9 1.4 3.9 4.6Z"/></svg>',
  pinterest: '<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-3.3 17.4 8.6 8.6 0 0 1 0-2.6l1.1-4.6a3.3 3.3 0 0 1-.3-1.4c0-1.3.8-2.3 1.7-2.3a1.2 1.2 0 0 1 1.2 1.3c0 .8-.5 2-.8 3.1a1.4 1.4 0 0 0 1.4 1.7c1.7 0 3-1.8 3-4.4a3.8 3.8 0 0 0-4-3.9 4.2 4.2 0 0 0-4.4 4.2 3.7 3.7 0 0 0 .7 2.2.3.3 0 0 1 .1.3l-.3 1.1c0 .2-.2.2-.4.1a5.3 5.3 0 0 1-2.4-4.6c0-3.4 2.5-6.6 7.1-6.6a6.3 6.3 0 0 1 6.6 6.2c0 3.7-2.3 6.7-5.6 6.7a2.9 2.9 0 0 1-2.5-1.2l-.7 2.6a12 12 0 0 1-1.3 2.9A9 9 0 1 0 12 3Z"/></svg>',
};

/**
 * footer — southwest.com www chrome (replica).
 * Authored /footer sections:
 *   1. help band (Need help / Subscribe / Connect with us / Mobile Apps) — one <li> per cell
 *   2. mega columns — h2 + ul per column
 *   3. legal — external-link legend, copyright line, sub-brand logos
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const [bandSec, colsSec, legalSec] = sections;

  const footer = document.createElement('div');
  footer.className = 'footer-inner';

  // help band
  if (bandSec) {
    const band = document.createElement('div');
    band.className = 'email-band';
    const cells = [...bandSec.querySelectorAll('li')];
    cells.forEach((li, i) => {
      const cell = document.createElement('div');
      cell.className = ['help-cell', 'subscribe-cell', 'social-cell', 'apps-cell'][i] || 'band-cell';
      if (cell.className === 'social-cell') {
        const label = document.createElement('span');
        label.className = 'cell-label';
        label.textContent = 'Connect with us';
        const row = document.createElement('div');
        row.className = 'social-row';
        li.querySelectorAll('a').forEach((a) => {
          const key = Object.keys(SOCIAL_ICONS).find((k) => a.textContent.toLowerCase().includes(k));
          const link = document.createElement('a');
          link.href = a.href;
          link.setAttribute('aria-label', a.textContent.trim());
          link.innerHTML = key ? SOCIAL_ICONS[key] : a.textContent;
          row.append(link);
        });
        cell.append(label, row);
      } else {
        [...li.childNodes].forEach((n) => cell.append(n.cloneNode(true)));
      }
      band.append(cell);
    });
    footer.append(band);
  }

  // mega columns
  if (colsSec) {
    const cols = document.createElement('div');
    cols.className = 'footer-cols';
    let current = null;
    [...colsSec.querySelectorAll('h2, ul')].forEach((el) => {
      if (el.tagName === 'H2') {
        current = document.createElement('nav');
        const h = document.createElement('h2');
        [...el.childNodes].forEach((n) => h.append(n.cloneNode(true)));
        current.append(h);
        cols.append(current);
      } else if (current) {
        current.append(el.cloneNode(true));
      }
    });
    footer.append(cols);
  }

  // legal
  if (legalSec) {
    const legal = document.createElement('div');
    legal.className = 'footer-legal';
    const ps = [...legalSec.querySelectorAll('p')];
    ps.forEach((p, i) => {
      const el = p.cloneNode(true);
      el.className = ['legend', 'copyright', 'sub-brands'][i] || '';
      legal.append(el);
    });
    footer.append(legal);
  }

  block.textContent = '';
  block.append(footer);
}
