/**
 * check-in-strip — transactional quick links (replica of southwest.com home strip).
 * Schema: stardust/eds-schema/index.json § check-in-strip.
 * Authoring: one cell holding three links (Check in / Flight status / Manage trip).
 * Fixed chrome: navy strip, per-link circular glyphs, pipe separators (CSS).
 */

const ICONS = {
  'check in': '<svg viewBox="1 4 36 36.5"><polygon points="25.6,16.4 17.5,24.5 14.1,21.2 11.3,24 17.5,30.2 28.6,19.3"/><path d="M18.9,36.2c-7.6,0-13.7-6.1-13.7-13.7S11.3,8.8,18.9,8.8S32.6,15,32.6,22.5C32.6,30.1,26.5,36.2,18.9,36.2 M18.9,4.9c-9.7,0-17.6,7.9-17.6,17.6s7.9,17.6,17.6,17.6s17.6-7.9,17.6-17.6S28.7,4.9,18.9,4.9"/></svg>',
  'flight status': '<svg viewBox="0 0 36 36"><path d="M17.6,31.3c-7.6,0-13.7-6.1-13.7-13.7c0-7.6,6.1-13.7,13.7-13.7c7.6,0,13.7,6.2,13.7,13.7C31.3,25.2,25.2,31.3,17.6,31.3 M17.6,0C7.9,0,0,7.9,0,17.6c0,9.7,7.9,17.6,17.6,17.6c9.7,0,17.6-7.9,17.6-17.6C35.2,7.9,27.4,0,17.6,0"/><polygon points="25.3,21.2 19.7,16.4 19.7,7.7 15.6,7.7 15.6,18.3 22.7,24.4"/></svg>',
  'manage trip': '<svg viewBox="0 0 36 36"><polygon points="25.5,20.8 25.5,20.8 14.4,20.8 14.4,16.8 7.9,22.6 14.4,28.4 14.4,24.7 25.5,24.7"/><polygon points="9.3,15.4 9.3,15.4 20.4,15.4 20.4,19.4 26.8,13.5 20.4,7.7 20.4,11.5 9.3,11.5 9.3,11.5"/><path d="M17.6,31.3c-7.6,0-13.7-6.1-13.7-13.7S10,3.9,17.6,3.9s13.7,6.2,13.7,13.7C31.3,25.2,25.2,31.3,17.6,31.3 M17.6,0C7.9,0,0,7.9,0,17.6s7.9,17.6,17.6,17.6s17.6-7.9,17.6-17.6S27.4,0,17.6,0"/></svg>',
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
