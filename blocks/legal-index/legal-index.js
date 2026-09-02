/**
 * legal-index — terms/legal page furniture: sidebar doc nav + numbered anchor
 * index (privacy policy & data options).
 * Authoring rows: row1 = sidebar link list · row2 = "Index" heading text + anchor list.
 * Anchor hrefs target the page's own h2 ids (EDS auto-ids from heading text).
 */
export default function decorate(block) {
  const rows = [...block.children];
  const shell = document.createElement('div');
  shell.className = 'li-shell';

  const side = document.createElement('nav');
  side.className = 'li-side';
  side.setAttribute('aria-label', 'Legal documents');
  const sideList = document.createElement('ul');
  if (rows[0]) {
    rows[0].querySelectorAll('a').forEach((a) => {
      const li = document.createElement('li');
      const link = a.cloneNode(true);
      if (new URL(link.href, window.location.href).pathname.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '')) {
        link.classList.add('li-current');
        link.setAttribute('aria-current', 'page');
      }
      li.append(link);
      sideList.append(li);
    });
  }
  side.append(sideList);

  const index = document.createElement('div');
  index.className = 'li-index';
  const head = document.createElement('h2');
  head.textContent = 'Index';
  const ol = document.createElement('ol');
  if (rows[1]) {
    rows[1].querySelectorAll('a').forEach((a) => {
      const li = document.createElement('li');
      li.append(a.cloneNode(true));
      ol.append(li);
    });
  }
  index.append(head, ol);

  shell.append(side, index);
  block.replaceChildren(shell);
}
