/**
 * tier-detail — tier qualification panel: white stats card + grey perk list
 * (rapid-rewards tiers). Authoring rows: tier name · stats list (ul:
 * "20 flights" / "35,000 points") · caption · perks list (ul, items may
 * lead with an icon image).
 */
export default function decorate(block) {
  const rows = [...block.children];
  const heading = block.querySelector('h1, h2, h3, h4, strong');
  const lists = [...block.querySelectorAll('ul')];
  const stats = lists[0];
  const perks = lists[1] || lists[0];
  const caption = [...block.querySelectorAll('p')].find((p) => !p.querySelector('a, picture, img, strong') && p.textContent.trim().length > 30);

  const shell = document.createElement('div');
  shell.className = 'td-shell';
  if (heading) {
    const slug = heading.textContent.trim().toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
    if (slug) block.classList.add(slug);
  }

  const left = document.createElement('div');
  left.className = 'td-stats';
  if (heading) {
    const h3 = document.createElement('h3');
    [...heading.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
    left.append(h3);
  }
  if (stats && stats !== perks) {
    const statRow = document.createElement('div');
    statRow.className = 'td-numbers';
    [...stats.querySelectorAll('li')].forEach((li) => {
      const m = li.textContent.trim().match(/^([\d,]+)\s+(.*)$/);
      const cell = document.createElement('div');
      cell.className = 'td-num';
      cell.innerHTML = m ? `<b>${m[1]}</b><span>${m[2]}</span>` : `<span>${li.textContent.trim()}</span>`;
      statRow.append(cell);
    });
    left.append(statRow);
  }
  if (caption) {
    const c = caption.cloneNode(true);
    c.className = 'td-caption';
    left.append(c);
  }

  const right = document.createElement('div');
  right.className = 'td-perks';
  const ul = document.createElement('ul');
  if (perks) {
    [...perks.querySelectorAll('li')].forEach((li) => {
      const item = document.createElement('li');
      const icon = li.querySelector('picture, img');
      if (icon) {
        const w = document.createElement('span');
        w.className = 'td-icon';
        w.append((icon.closest('picture') || icon).cloneNode(true));
        item.append(w);
      }
      const t = document.createElement('span');
      t.className = 'td-perk-text';
      t.innerHTML = li.innerHTML.replace(/<picture[\s\S]*?<\/picture>|<img[^>]*>/g, '');
      item.append(t);
      ul.append(item);
    });
  }
  right.append(ul);

  shell.append(left, right);
  rows.forEach((r) => r.remove());
  block.append(shell);
}
