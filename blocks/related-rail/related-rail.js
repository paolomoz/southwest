/**
 * related-rail — "Related Information" chevron-link rail (travel-advisory).
 * Rows: [h2/h3 heading] · [ul of links].
 */
export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3');
  const links = [...block.querySelectorAll('a')];
  const list = document.createElement('ul');
  list.className = 'rr-links';
  links.forEach((a) => {
    const li = document.createElement('li');
    a.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>');
    li.append(a);
    list.append(li);
  });
  block.replaceChildren();
  if (heading) block.append(heading);
  block.append(list);
}
