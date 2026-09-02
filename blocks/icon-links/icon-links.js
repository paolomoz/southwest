/**
 * icon-links — grouped icon shortcut band (about page: resources / social).
 * Authoring rows: group heading · link items (picture + link per cell).
 */
export default function decorate(block) {
  const groups = document.createElement('div');
  groups.className = 'il-groups';
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const group = document.createElement('div');
    group.className = 'il-group';
    const headCell = cells.find((c) => c.querySelector('h2, h3') || (!c.querySelector('a') && c.textContent.trim().length < 40));
    if (headCell) {
      const h = document.createElement('h2');
      h.textContent = headCell.textContent.trim();
      group.append(h);
    }
    const items = document.createElement('ul');
    cells.filter((c) => c !== headCell).forEach((c) => {
      c.querySelectorAll('a').forEach((a) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = a.getAttribute('href');
        const holder = a.closest('li, p, div') || c;
        const pic = holder.querySelector('picture, img');
        if (pic) link.append((pic.closest('picture') || pic).cloneNode(true));
        const label = document.createElement('span');
        label.textContent = a.textContent.trim();
        link.append(label);
        li.append(link);
        items.append(li);
      });
    });
    group.append(items);
    groups.append(group);
  });
  block.replaceChildren(groups);
}
