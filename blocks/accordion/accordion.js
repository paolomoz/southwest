/**
 * accordion — collapsible FAQ rows (corporate-travel).
 * Authoring rows: header label cell · panel content cell (default content).
 */
export default function decorate(block) {
  const list = document.createElement('div');
  list.className = 'acc-list';
  [...block.children].forEach((row, i) => {
    const [labelCell, contentCell] = row.children;
    if (!labelCell || !contentCell) return;
    const item = document.createElement('div');
    item.className = 'acc-item';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'acc-head';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', `acc-panel-${i}`);
    btn.innerHTML = `<span>${labelCell.textContent.trim()}</span><span class="acc-chevron" aria-hidden="true">⌄</span>`;
    const panel = document.createElement('div');
    panel.className = 'acc-panel';
    panel.id = `acc-panel-${i}`;
    panel.hidden = true;
    [...contentCell.childNodes].forEach((n) => panel.append(n.cloneNode(true)));
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
      item.classList.toggle('acc-open', !open);
    });
    item.append(btn, panel);
    list.append(item);
  });
  block.replaceChildren(list);
}
