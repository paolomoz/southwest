/**
 * theme-cards — Getaways "Vacation themes" scroller.
 * Rows after optional [h2]: [picture · h3 · body p · See more link].
 */
export default function decorate(block) {
  const rows = [...block.children];
  const heading = block.querySelector('h1, h2');
  const track = document.createElement('ul');
  track.className = 'tc-track';
  rows.forEach((row) => {
    const pic = row.querySelector('picture, img');
    if (!pic) return;
    const h = row.querySelector('h3, h4, strong');
    const a = [...row.querySelectorAll('a')].pop();
    const body = [...row.querySelectorAll('p')].find((p) => !p.querySelector('picture,img,a,strong') && p.textContent.trim().length > 20);
    const li = document.createElement('li');
    li.className = 'tc-card';
    const m = document.createElement('div');
    m.className = 'tc-media';
    m.append((pic.closest('picture') || pic).cloneNode(true));
    li.append(m);
    if (h) {
      const h3 = document.createElement('h3');
      h3.textContent = h.textContent.trim();
      li.append(h3);
    }
    const p = document.createElement('p');
    if (body) p.append(body.textContent.trim(), ' ');
    if (a) {
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent.trim() || 'See more';
      p.append(link);
    }
    li.append(p);
    track.append(li);
  });

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'tc-next';
  next.setAttribute('aria-label', 'More themes');
  next.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#304cb2" stroke-width="2.4"><path d="m9 5 7 7-7 7"/></svg>';
  next.addEventListener('click', () => {
    const max = track.scrollWidth - track.clientWidth - 4;
    track.scrollTo({ left: track.scrollLeft >= max ? 0 : track.scrollLeft + track.clientWidth, behavior: 'smooth' });
  });

  const shell = document.createElement('div');
  shell.className = 'tc-shell';
  shell.append(track, next);
  block.replaceChildren();
  if (heading) block.append(heading);
  block.append(shell);
}
