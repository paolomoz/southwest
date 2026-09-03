/**
 * partner-links — icon category columns with Learn-more links
 * (rapid-rewards partner earn categories).
 * Authoring rows: icon image · label · link.
 */
export default function decorate(block) {
  const row = document.createElement('ul');
  row.className = 'pl-row';
  [...block.children].forEach((r) => {
    const pic = r.querySelector('picture, img');
    const a = r.querySelector('a');
    const texts = [...r.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img, a'));
    const li = document.createElement('li');
    if (pic) {
      const m = document.createElement('span');
      m.className = 'pl-icon';
      m.append((pic.closest('picture') || pic).cloneNode(true));
      li.append(m);
    }
    if (texts[0]) {
      const t = document.createElement('span');
      t.className = 'pl-label';
      t.textContent = texts[0].textContent.trim();
      li.append(t);
    }
    if (a) {
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.className = 'pl-link';
      link.textContent = a.textContent.trim();
      li.append(link);
    }
    row.append(li);
  });
  block.replaceChildren(row);
}
