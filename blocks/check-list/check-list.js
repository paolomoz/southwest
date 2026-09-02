/**
 * check-list — checkmark benefit list (rapid-rewards flagship).
 * Authoring rows: bold title cell · body cell (may be empty).
 */
const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="m7 12.5 3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>';

export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'cl-list';
  [...block.children].forEach((row) => {
    const [titleCell, bodyCell] = row.children;
    if (!titleCell) return;
    const li = document.createElement('li');
    const mark = document.createElement('span');
    mark.className = 'cl-mark';
    mark.innerHTML = CHECK;
    const copy = document.createElement('div');
    copy.className = 'cl-copy';
    const t = document.createElement('h3');
    [...(titleCell.querySelector('h1,h2,h3,h4,p') || titleCell).childNodes].forEach((n) => t.append(n.cloneNode(true)));
    copy.append(t);
    if (bodyCell && bodyCell.textContent.trim()) {
      [...bodyCell.querySelectorAll('p')].forEach((p) => copy.append(p.cloneNode(true)));
      if (!bodyCell.querySelector('p')) {
        const p = document.createElement('p');
        p.textContent = bodyCell.textContent.trim();
        copy.append(p);
      }
    }
    li.append(mark, copy);
    list.append(li);
  });
  block.replaceChildren(list);
}
