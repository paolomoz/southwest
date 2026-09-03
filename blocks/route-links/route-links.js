/**
 * route-links — "More Southwest flights" rail on /en/flights pages.
 * Authored links stay server-rendered (SEO); decorate lays them into
 * 3 columns and wires the VIEW MORE reveal (first 15 shown, rest hidden).
 * Rows: [h2] · [ul of links].
 */
export default function decorate(block) {
  const heading = block.querySelector('h1,h2,h3');
  const links = [...block.querySelectorAll('a')];

  const list = document.createElement('ul');
  list.className = 'rl-list';
  links.forEach((a, i) => {
    const li = document.createElement('li');
    if (i >= 15) li.hidden = true;
    li.append(a);
    list.append(li);
  });

  block.replaceChildren();
  if (heading) block.append(heading);
  block.append(list);

  if (links.length > 15) {
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'rl-more';
    more.textContent = 'VIEW MORE';
    more.addEventListener('click', () => {
      const hidden = [...list.querySelectorAll('li[hidden]')];
      if (hidden.length) {
        hidden.forEach((li) => { li.hidden = false; });
        more.textContent = 'VIEW LESS';
      } else {
        [...list.children].forEach((li, i) => { li.hidden = i >= 15; });
        more.textContent = 'VIEW MORE';
      }
    });
    block.append(more);
  }
}
