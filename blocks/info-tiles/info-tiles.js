/**
 * info-tiles — light-blue icon tiles with outline CTAs (rapid-rewards partners).
 * Authoring rows: icon image · title (bold) · body · CTA link.
 */
export default function decorate(block) {
  const grid = document.createElement('ul');
  grid.className = 'it-grid';
  [...block.children].forEach((row) => {
    const pic = row.querySelector('picture, img');
    const strong = row.querySelector('strong, h3, h4');
    const a = [...row.querySelectorAll('a')].pop();
    const bodies = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img, a, strong'));

    const li = document.createElement('li');
    const icon = document.createElement('div');
    icon.className = 'it-icon';
    if (pic) icon.append((pic.closest('picture') || pic).cloneNode(true));
    const copy = document.createElement('div');
    copy.className = 'it-copy';
    if (strong) {
      const h3 = document.createElement('h3');
      [...strong.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
      copy.append(h3);
    }
    bodies.forEach((p) => copy.append(p.cloneNode(true)));
    if (a) {
      const cta = document.createElement('a');
      cta.className = 'it-cta';
      cta.href = a.getAttribute('href');
      cta.textContent = a.textContent.trim();
      copy.append(cta);
    }
    li.append(icon, copy);
    grid.append(li);
  });
  block.replaceChildren(grid);
}
