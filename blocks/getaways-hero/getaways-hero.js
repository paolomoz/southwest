/**
 * getaways-hero — Getaways hero bands.
 * Default (hub promo): photo bg, cyan chip, centered navy H1 + rich sub copy.
 * Variant `banner`: photo bg, big white left-aligned title (+ optional sub).
 * Rows: [picture] · [chip em (optional)] · [h1 + ps].
 */
export default function decorate(block) {
  const section = block.closest('.section');
  const img = block.querySelector('picture img, img');
  if (img) section.style.backgroundImage = `url(${img.currentSrc || img.src})`;

  const inner = document.createElement('div');
  inner.className = 'gh-inner';
  const chip = block.querySelector('em');
  if (chip && !block.classList.contains('banner')) {
    const c = document.createElement('span');
    c.className = 'gh-chip';
    c.textContent = chip.textContent.trim();
    inner.append(c);
    chip.closest('p, div').remove();
  }
  [...block.querySelectorAll('h1, h2, p')].forEach((el) => {
    if (el.querySelector('picture, img') || !el.textContent.trim()) return;
    inner.append(el);
  });
  block.replaceChildren(inner);
}
