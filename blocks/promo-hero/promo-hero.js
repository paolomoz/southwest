/**
 * promo-hero — full-bleed program hero (photo + scrim + copy + CTA).
 * Template-slotted (#95): fixed composition matched to the live original;
 * the heart-brightwork motif and darkening scrim are fixed chrome (CSS).
 *
 * Authoring rows: hero picture · heading + lede · CTA paragraph.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const picture = block.querySelector('picture, img');
  const heading = block.querySelector('h1, h2');
  const lede = [...block.querySelectorAll('p')].find(
    (p) => !p.querySelector('a, picture, img') && p.textContent.trim().length > 10,
  );
  const cta = block.querySelector('a.button, p.button-wrapper a, p a');

  const photo = document.createElement('div');
  photo.className = 'ph-photo';
  if (picture) {
    const pic = picture.closest('picture') || picture;
    photo.append(pic.cloneNode(true));
  }

  const copy = document.createElement('div');
  copy.className = 'ph-copy';
  const inner = document.createElement('div');
  inner.className = 'ph-inner';
  if (heading) inner.append(heading.cloneNode(true));
  if (lede) {
    const p = lede.cloneNode(true);
    p.className = 'ph-lede';
    inner.append(p);
  }
  if (cta) {
    const a = cta.cloneNode(true);
    a.classList.add('button', 'primary');
    inner.append(a);
  }
  copy.append(inner);

  rows.forEach((r) => r.remove());
  block.append(photo, copy);
}
