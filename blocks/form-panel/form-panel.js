/**
 * form-panel — transactional entry facsimile (check-in, flight status, …).
 * Static demo surface: fields render, the submit button links to the live
 * transactional flow (the honest integration boundary for the demo).
 * Authoring rows: panel heading · intro · field list (ul) · CTA link.
 */
export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3');
  const ps = [...block.querySelectorAll('p')];
  const intro = ps.find((p) => !p.querySelector('a') && p.textContent.trim().length > 20);
  const list = block.querySelector('ul');
  const cta = block.querySelector('a');

  const panel = document.createElement('div');
  panel.className = 'fp-panel';
  const card = document.createElement('form');
  card.className = 'fp-card';
  card.addEventListener('submit', (e) => e.preventDefault());

  if (heading) {
    const h2 = document.createElement('h2');
    [...heading.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
    card.append(h2);
  }
  if (intro) {
    const p = intro.cloneNode(true);
    p.className = 'fp-intro';
    card.append(p);
  }
  const req = document.createElement('p');
  req.className = 'fp-required';
  req.innerHTML = '<span>*</span> Required';
  card.append(req);

  if (list) {
    [...list.querySelectorAll('li')].forEach((li, i) => {
      const label = document.createElement('label');
      const cap = document.createElement('span');
      cap.className = 'fp-label';
      cap.innerHTML = `${li.textContent.trim()} <b>*</b>`;
      const input = document.createElement('input');
      input.type = 'text';
      input.name = `field-${i}`;
      label.append(cap, input);
      card.append(label);
    });
  }
  if (cta) {
    const btn = document.createElement('a');
    btn.className = 'button primary fp-submit';
    btn.href = cta.getAttribute('href');
    btn.textContent = cta.textContent.trim();
    card.append(btn);
  }
  panel.append(card);
  block.replaceChildren(panel);
}
