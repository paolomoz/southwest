/**
 * feature-row — split media/prose card (replica: 'A plan for every type of business.').
 * Schema: stardust/eds-schema/index.json § business-feature.
 * Authoring: image cell + text cell (heading, body, CTA). Media queried
 * `picture, img` (#72); text fields classified, never indexed (#48).
 */
export default async function decorate(block) {
  const media = block.querySelector('picture, img');
  const heading = block.querySelector('h1, h2, h3');
  const ps = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const body = ps.find((p) => !p.querySelector('a') && p.textContent.trim());
  const ctas = ps.filter((p) => p.querySelector('a'));

  const card = document.createElement('div');
  card.className = 'feature-card';

  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'feature-media';
  if (media) {
    const m = media.cloneNode(true);
    const img = m.tagName === 'IMG' ? m : m.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
    }
    mediaWrap.append(m);
  }

  const copy = document.createElement('div');
  copy.className = 'feature-copy';
  if (heading) {
    const h2 = document.createElement('h2');
    const inner = heading.querySelector('h1, h2, h3') || heading;
    [...inner.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
    copy.append(h2);
  }
  ps.filter((p) => !p.querySelector('a')).forEach((p) => copy.append(p.cloneNode(true)));
  [...block.querySelectorAll('ul, ol')].forEach((l) => copy.append(l.cloneNode(true)));
  if (ctas.length) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    ctas.forEach((p) => actions.append(p.cloneNode(true)));
    copy.append(actions);
  }

  card.append(mediaWrap, copy);
  block.replaceChildren(card);
}
