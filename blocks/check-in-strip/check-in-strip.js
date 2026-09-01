/**
 * check-in-strip — transactional quick links (replica of southwest.com home strip).
 * Schema: stardust/eds-schema/index.json § check-in-strip.
 * Authoring: one cell holding three links (Check in / Flight status / Manage trip).
 * Fixed chrome: navy strip, per-link circular glyphs, pipe separators (CSS).
 */

const ICONS = {
  'check in': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 5-5.5"/></svg>',
  'flight status': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  'manage trip': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M8 9h8M8 15h5"/></svg>',
};

export default async function decorate(block) {
  const links = [...block.querySelectorAll('a')];
  const ul = document.createElement('ul');
  links.forEach((a) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    const key = Object.keys(ICONS).find((k) => a.textContent.trim().toLowerCase().startsWith(k));
    link.innerHTML = (key ? ICONS[key] : '') + a.textContent.trim();
    li.append(link);
    ul.append(li);
  });
  block.replaceChildren(ul);
}
