/**
 * credit-cards — 3-up credit-card columns (consumer cards page).
 * One authored row per card. Cell content, in order: h3 card name · card art
 * picture · h4 points headline · sub paragraph · Apply CTA (strong a) ·
 * detail links (em a) · fee paragraph · benefit group headings (h5) with
 * alternating bold-title / body paragraphs authored as a ul (strong lead).
 */
const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#111b40"/><path d="m7 12.5 3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>';

export default function decorate(block) {
  const grid = document.createElement('ul');
  grid.className = 'cc-grid';
  [...block.children].forEach((row) => {
    const cell = row.firstElementChild;
    if (!cell) return;
    const li = document.createElement('li');
    li.className = 'cc-card';
    [...cell.children].forEach((el) => {
      const tag = el.tagName;
      if (tag === 'H3') {
        const h = document.createElement('h3');
        [...el.childNodes].forEach((n) => h.append(n.cloneNode(true)));
        li.append(h);
      } else if (el.querySelector && el.querySelector('picture, img') && !el.closest('ul')) {
        const media = document.createElement('div');
        media.className = 'cc-art';
        media.append((el.querySelector('picture') || el.querySelector('img')).cloneNode(true));
        li.append(media);
      } else if (tag === 'H4') {
        const h = document.createElement('p');
        h.className = 'cc-points';
        h.textContent = el.textContent.trim();
        li.append(h);
      } else if (tag === 'H5') {
        const h = document.createElement('h4');
        h.className = 'cc-group';
        [...el.childNodes].forEach((n) => h.append(n.cloneNode(true)));
        li.append(h);
      } else if (tag === 'UL') {
        const ul = document.createElement('ul');
        ul.className = 'cc-benefits';
        [...el.children].forEach((src) => {
          const item = document.createElement('li');
          const mark = document.createElement('span');
          mark.className = 'cc-check';
          mark.innerHTML = CHECK;
          const copy = document.createElement('div');
          copy.innerHTML = src.innerHTML;
          item.append(mark, copy);
          ul.append(item);
        });
        li.append(ul);
      } else if (el.querySelector && el.querySelector('a')) {
        const a = el.querySelector('a');
        if (el.querySelector('strong')) {
          const cta = document.createElement('a');
          cta.className = 'button primary cc-apply';
          cta.href = a.getAttribute('href');
          cta.textContent = a.textContent.trim();
          li.append(cta);
        } else {
          const p = document.createElement('p');
          p.className = 'cc-links';
          [...el.querySelectorAll('a')].forEach((l, i) => {
            if (i) p.append(' | ');
            p.append(l.cloneNode(true));
          });
          li.append(p);
        }
      } else {
        const p = document.createElement('p');
        p.className = /annual fee/.test(el.textContent) ? 'cc-fee' : 'cc-sub';
        [...el.childNodes].forEach((n) => p.append(n.cloneNode(true)));
        li.append(p);
      }
    });
    grid.append(li);
  });
  block.replaceChildren(grid);
}
