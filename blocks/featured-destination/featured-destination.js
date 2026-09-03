/**
 * featured-destination — Getaways photo band with white content card
 * ("Explore our featured destination: Cancun").
 * Rows: [picture (band bg)] · [kicker p · h2 · body p · link].
 */
export default function decorate(block) {
  const section = block.closest('.section');
  const img = block.querySelector('picture img, img');
  if (img) {
    section.style.backgroundImage = `url(${img.currentSrc || img.src})`;
    (img.closest('p, div') || img).remove();
  }
  const card = document.createElement('div');
  card.className = 'fd-card';
  [...block.querySelectorAll('p, h2, h3')].forEach((el) => {
    if (!el.textContent.trim()) return;
    if (el.querySelector('a')) {
      const a = el.querySelector('a');
      const b = document.createElement('a');
      b.className = 'fd-cta';
      b.href = a.getAttribute('href');
      b.textContent = a.textContent.trim();
      card.append(b);
    } else {
      card.append(el);
    }
  });
  block.replaceChildren(card);
}
