/**
 * split-band — midnight intro panel + stacked action rows
 * (corporate-travel "A plan for every type of business").
 * Row 1: heading + body (left panel). Rows 2+: title · body · CTA link.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const shell = document.createElement('div');
  shell.className = 'sb-shell';

  const intro = document.createElement('div');
  intro.className = 'sb-intro';
  if (rows[0]) [...rows[0].querySelectorAll('h1,h2,h3,p')].forEach((n) => intro.append(n.cloneNode(true)));

  const list = document.createElement('div');
  list.className = 'sb-rows';
  rows.slice(1).forEach((row) => {
    const heading = row.querySelector('h1,h2,h3,h4,strong');
    const a = [...row.querySelectorAll('a')].pop();
    const body = [...row.querySelectorAll('p')].find((p) => !p.querySelector('a,strong'));
    const item = document.createElement('div');
    item.className = 'sb-row';
    const chev = document.createElement('span');
    chev.className = 'sb-chevron';
    chev.textContent = '⌄';
    const copy = document.createElement('div');
    copy.className = 'sb-copy';
    if (heading) {
      const h3 = document.createElement('h3');
      [...heading.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
      copy.append(h3);
    }
    if (body) copy.append(body.cloneNode(true));
    item.append(chev, copy);
    if (a) {
      const cta = document.createElement('a');
      cta.className = 'sb-cta';
      cta.href = a.getAttribute('href');
      cta.textContent = a.textContent.trim();
      item.append(cta);
    }
    list.append(item);
  });

  shell.append(intro, list);
  block.replaceChildren(shell);
}
