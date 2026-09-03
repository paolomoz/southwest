/**
 * read-more — "Read more +" toggle (route pages). Reveals every section
 * carrying the `rm-hidden` section style (collapsed editorial prose,
 * matching the live page's read-more behavior).
 */
export default function decorate(block) {
  const text = block.textContent.trim() || 'Read more +';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'rm-btn';
  btn.textContent = text;
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('main .section.rm-hidden').forEach((s) => {
      s.classList.toggle('rm-open', !open);
    });
    btn.setAttribute('aria-expanded', String(!open));
    btn.textContent = open ? text : 'Read less –';
  });
  block.replaceChildren(btn);
}
