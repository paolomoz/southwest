/**
 * tabs — vertical tab list + content panel (about page: purpose/promises/values…).
 * Authoring rows: tab label cell · panel content cell (default content: h3/p/ul/picture).
 * Interactive parity with live: click switches the visible panel; first tab active.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const shell = document.createElement('div');
  shell.className = 'tabs-shell';
  const list = document.createElement('div');
  list.className = 'tabs-list';
  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-orientation', 'vertical');
  const panels = document.createElement('div');
  panels.className = 'tabs-panels';

  rows.forEach((row, i) => {
    const [labelCell, contentCell] = row.children;
    if (!labelCell || !contentCell) return;
    const id = `tab-${i}`;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.role = 'tab';
    btn.id = `${id}-tab`;
    btn.setAttribute('aria-controls', `${id}-panel`);
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.textContent = labelCell.textContent.trim();
    list.append(btn);

    const panel = document.createElement('div');
    panel.role = 'tabpanel';
    panel.id = `${id}-panel`;
    panel.setAttribute('aria-labelledby', `${id}-tab`);
    if (i !== 0) panel.hidden = true;
    [...contentCell.childNodes].forEach((n) => panel.append(n.cloneNode(true)));
    panels.append(panel);
  });

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[role="tab"]');
    if (!btn) return;
    list.querySelectorAll('[role="tab"]').forEach((b) => b.setAttribute('aria-selected', b === btn ? 'true' : 'false'));
    panels.querySelectorAll('[role="tabpanel"]').forEach((p) => { p.hidden = p.id !== btn.getAttribute('aria-controls'); });
  });

  shell.append(list, panels);
  block.replaceChildren(shell);
}
