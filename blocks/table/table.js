/**
 * table — genuine data table (D10 exception: travel fees, fare rules).
 * Authoring rows map 1:1 to table rows; the first row is the header.
 */
export default function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  [...block.children].forEach((row, i) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell) => {
      const el = document.createElement(i === 0 ? 'th' : 'td');
      if (i === 0) el.setAttribute('scope', 'col');
      el.innerHTML = cell.innerHTML;
      tr.append(el);
    });
    (i === 0 ? thead : tbody).append(tr);
  });
  table.append(thead, tbody);
  block.replaceChildren(table);
}
