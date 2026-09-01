/**
 * sub-nav — program band + section navigation (Rapid Rewards chrome on
 * partner-offer pages). Replica of southwest.com's rapid-rewards band.
 *
 * Authoring rows: band title · link list (ul).
 */
export default function decorate(block) {
  const rows = [...block.children];
  const title = block.querySelector('h1, h2, h3, p');
  const list = block.querySelector('ul');

  const band = document.createElement('div');
  band.className = 'sn-band';
  const inner = document.createElement('div');
  inner.className = 'sn-inner';
  const h2 = document.createElement('h2');
  if (title) [...title.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
  inner.append(h2);
  band.append(inner);

  const nav = document.createElement('nav');
  nav.className = 'sn-links';
  nav.setAttribute('aria-label', h2.textContent.trim() || 'Section');
  const ul = document.createElement('ul');
  if (list) {
    list.querySelectorAll('li').forEach((li) => {
      const a = li.querySelector(':scope > a, :scope > p > a');
      if (!a) return;
      const item = document.createElement('li');
      item.append(a.cloneNode(true));
      ul.append(item);
    });
  }
  nav.append(ul);

  rows.forEach((r) => r.remove());
  block.append(band, nav);
}
