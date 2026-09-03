/**
 * airport-details — airport spec panel (route pages).
 * Row 1: [h2]. Row 2: [picture | spec ul ("Label: value") | stats ul
 * ("<strong>119†</strong> Cities with weekly flights…")]. Row 3: [footnote ps].
 */
const WIFI = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ffbf27" stroke-width="2" stroke-linecap="round"><path d="M2.5 9.5a14 14 0 0 1 19 0M5.5 13a9.5 9.5 0 0 1 13 0M8.5 16.5a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1.4" fill="#ffbf27" stroke="none"/></svg>';

export default function decorate(block) {
  const rows = [...block.children];
  const heading = block.querySelector('h1,h2,h3');
  const panelRow = rows.find((r) => r.querySelector('picture'));
  const shell = document.createElement('div');
  shell.className = 'ad-shell';

  if (panelRow) {
    const [picCell, specCell, statsCell] = [...panelRow.children];
    const media = document.createElement('div');
    media.className = 'ad-media';
    const pic = picCell && picCell.querySelector('picture');
    if (pic) media.append(pic);

    const specs = document.createElement('div');
    specs.className = 'ad-specs';
    if (specCell) {
      [...specCell.querySelectorAll('li')].forEach((li) => {
        const t = li.textContent.trim();
        const row = document.createElement('div');
        if (/^Airport-provided/i.test(t)) {
          row.className = 'ad-wifi';
          row.innerHTML = `${WIFI}<span>${t}</span>`;
        } else {
          const [label, ...rest] = t.split(':');
          row.className = 'ad-spec';
          row.innerHTML = `<span class="ad-label">${label}:</span><span class="ad-value">${rest.join(':').trim()}</span>`;
        }
        specs.append(row);
      });
    }

    const stats = document.createElement('div');
    stats.className = 'ad-stats';
    if (statsCell) {
      [...statsCell.querySelectorAll('li')].forEach((li) => {
        const num = li.querySelector('strong');
        const row = document.createElement('div');
        row.className = 'ad-stat';
        const label = document.createElement('span');
        label.className = 'ad-stat-label';
        label.textContent = li.textContent.replace(num ? num.textContent : '', '').trim();
        const val = document.createElement('span');
        val.className = 'ad-stat-num';
        if (num) {
          const m = num.textContent.trim().match(/^(\d+)(.*)$/);
          val.innerHTML = m ? `${m[1]}<sup>${m[2]}</sup>` : num.textContent;
        }
        row.append(label, val);
        stats.append(row);
      });
    }
    shell.append(media, specs, stats);
  }

  const notes = rows[rows.length - 1] !== panelRow
    ? [...rows[rows.length - 1].querySelectorAll('p')] : [];

  block.replaceChildren();
  if (heading) block.append(heading);
  block.append(shell);
  notes.forEach((p) => {
    p.className = 'ad-note';
    block.append(p);
  });
}
