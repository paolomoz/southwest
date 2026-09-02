/**
 * breadcrumb — page-path navigation (inner pages).
 * Authoring: one cell with links; the trailing plain text is the current page.
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div') || block;
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  const ol = document.createElement('ol');
  cell.querySelectorAll('a').forEach((a) => {
    const li = document.createElement('li');
    li.append(a.cloneNode(true));
    ol.append(li);
  });
  const text = cell.textContent.trim();
  const linkText = [...cell.querySelectorAll('a')].map((a) => a.textContent.trim()).join(' ');
  const current = text.replace(linkText, '').replace(/^[\s/·>]+|[\s/·>]+$/g, '').trim();
  if (current) {
    const li = document.createElement('li');
    li.setAttribute('aria-current', 'page');
    li.textContent = current;
    ol.append(li);
  }
  nav.append(ol);
  block.replaceChildren(nav);
}
