/**
 * tier-cards — 3-up tier summary cards with colored header bars
 * (rapid-rewards tiers: A-List / A-List Preferred / Companion Pass).
 * Authoring rows: tier name · body paragraphs · CTA link.
 */
export default function decorate(block) {
  const grid = document.createElement('ul');
  grid.className = 'tc3-grid';
  [...block.children].forEach((row, i) => {
    const heading = row.querySelector('h1, h2, h3, h4, strong');
    const a = [...row.querySelectorAll('a')].pop();
    const ps = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('a, strong'));
    const li = document.createElement('li');
    li.className = `tc3-card tc3-${i}`;
    const bar = document.createElement('div');
    bar.className = 'tc3-bar';
    bar.textContent = heading ? heading.textContent.trim() : '';
    const body = document.createElement('div');
    body.className = 'tc3-body';
    ps.forEach((p) => body.append(p.cloneNode(true)));
    if (a) {
      const cta = document.createElement('a');
      cta.className = 'button primary tc3-cta';
      cta.href = a.getAttribute('href');
      cta.textContent = a.textContent.trim();
      body.append(cta);
    }
    li.append(bar, body);
    grid.append(li);
  });
  block.replaceChildren(grid);
}
