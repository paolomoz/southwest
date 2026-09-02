/**
 * teaser-cards — grey caps-title cards with photos (about page: history/promises/people).
 * Authoring rows: caps title paragraph · body · optional link · picture.
 */
export default function decorate(block) {
  const grid = document.createElement('ul');
  grid.className = 'tc-grid';
  [...block.children].forEach((row) => {
    const pic = row.querySelector('picture, img');
    const a = row.querySelector('a');
    const ps = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img, a'));
    const title = ps.find((p) => p.textContent.trim().length < 40);
    const body = ps.find((p) => p !== title);
    const li = document.createElement('li');
    const card = document.createElement(a ? 'a' : 'div');
    card.className = 'tc-card';
    if (a) card.href = a.getAttribute('href');
    const panel = document.createElement('div');
    panel.className = 'tc-panel';
    if (title) {
      const t = document.createElement('span');
      t.className = 'tc-title';
      t.textContent = title.textContent.trim();
      panel.append(t);
    }
    if (body) {
      const bp = body.cloneNode(true);
      bp.className = 'tc-body';
      panel.append(bp);
    }
    const chev = document.createElement('span');
    chev.className = 'tc-chevron';
    chev.textContent = '›';
    panel.append(chev);
    card.append(panel);
    if (pic) {
      const media = document.createElement('div');
      media.className = 'tc-media';
      media.append((pic.closest('picture') || pic).cloneNode(true));
      card.append(media);
    }
    li.append(card);
    grid.append(li);
  });
  block.replaceChildren(grid);
}
