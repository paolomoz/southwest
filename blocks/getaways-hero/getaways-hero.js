/**
 * getaways-hero — Getaways hero bands.
 * Default (hub promo): photo bg, cyan chip, centered navy H1 + rich sub copy.
 * Variant `banner`: the authored image renders IN-FLOW (band height = the
 * image's own aspect ratio at every viewport width — each page's hero asset
 * carries its own crop), title/sub overlaid left.
 * Rows: [picture] · [chip em (optional)] · [h1 + ps].
 */
export default function decorate(block) {
  const banner = block.classList.contains('banner');
  const pic = block.querySelector('picture') || block.querySelector('img');

  const inner = document.createElement('div');
  inner.className = 'gh-inner';
  const chip = block.querySelector('em');
  if (chip && !banner) {
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

  if (banner) {
    const bg = document.createElement('div');
    bg.className = 'gh-bg';
    if (pic) {
      const img = pic.querySelector ? pic.querySelector('img') : pic;
      if (img) img.setAttribute('loading', 'eager');
      bg.append(pic);
    }
    const overlay = document.createElement('div');
    overlay.className = 'gh-overlay';
    overlay.append(inner);
    block.replaceChildren(bg, overlay);
  } else {
    const section = block.closest('.section');
    const img = pic && (pic.querySelector ? pic.querySelector('img') : pic);
    if (img) section.style.backgroundImage = `url(${img.currentSrc || img.src})`;
    block.replaceChildren(inner);
  }
}
