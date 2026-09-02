/**
 * quote — leadership pull-quote band (about page).
 * Authoring rows: quote paragraph (em = yellow highlight) · attribution · portrait.
 */
export default function decorate(block) {
  const pic = block.querySelector('picture, img');
  const ps = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const quoteP = ps.find((p) => p.textContent.trim().length > 60);
  const attr = ps.find((p) => p !== quoteP && p.textContent.trim().length > 5);

  const wrap = document.createElement('div');
  wrap.className = 'q-wrap';

  const copy = document.createElement('div');
  copy.className = 'q-copy';
  const mark = document.createElement('span');
  mark.className = 'q-mark';
  mark.textContent = '”';
  copy.append(mark);
  if (quoteP) {
    const q = quoteP.cloneNode(true);
    q.className = 'q-text';
    copy.append(q);
  }
  if (attr) {
    const a = attr.cloneNode(true);
    a.className = 'q-attr';
    copy.append(a);
  }
  wrap.append(copy);

  if (pic) {
    const media = document.createElement('div');
    media.className = 'q-media';
    media.append((pic.closest('picture') || pic).cloneNode(true));
    wrap.append(media);
  }
  block.replaceChildren(wrap);
}
