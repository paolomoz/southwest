/**
 * member-banner — login-state personalization block (demo: slide 10).
 * Anonymous: authored acquisition band (join/log in CTAs — copy authored in DA).
 * Logged in: personalized member band (name, tier, points balance, member perk line).
 * Subscribes to the demo auth bus; in production the same decorate() would read
 * the CIAM/IMS profile — the block contract is identical.
 *
 * Authoring rows: heading · body · CTA paragraph (anonymous variant copy).
 */
import {
  getUser, onAuthChange, formatPoints, PERSONAS, login, logout,
} from '../../scripts/demo-auth.js';

function renderAnon(inner, authored) {
  inner.className = 'mb-inner anon';
  inner.innerHTML = '';
  if (authored.heading) {
    const h2 = document.createElement('h2');
    const src = authored.heading.querySelector('h1, h2, h3') || authored.heading;
    [...src.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
    inner.append(h2);
  }
  if (authored.body) inner.append(authored.body.cloneNode(true));
  const actions = document.createElement('div');
  actions.className = 'actions';
  if (authored.cta) [...authored.cta.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
  const demoLogin = document.createElement('button');
  demoLogin.type = 'button';
  demoLogin.className = 'button secondary mb-login';
  demoLogin.textContent = 'Log in';
  demoLogin.addEventListener('click', () => login(PERSONAS[0].id));
  actions.append(demoLogin);
  inner.append(actions);
}

function renderMember(inner, user) {
  inner.className = 'mb-inner member';
  inner.innerHTML = `
    <span class="mb-avatar">${user.initials}</span>
    <div class="mb-copy">
      <h2>Welcome back, ${user.name}!</h2>
      <p class="mb-tier"><b>${user.tier}</b> · <span class="mb-points">${formatPoints(user.points)}</span> Rapid Rewards&#174; points</p>
      <p class="mb-perk">Member deals below are shown in points — your points never expire and there are no blackout dates.</p>
    </div>
    <div class="actions">
      <a class="button primary" href="https://www.southwest.com/loyalty/myaccount/">My account</a>
      <button type="button" class="button secondary mb-logout">Log out</button>
    </div>`;
  inner.querySelector('.mb-logout').addEventListener('click', () => logout());
}

export default async function decorate(block) {
  const authored = {
    heading: block.querySelector('h1, h2, h3'),
    body: [...block.querySelectorAll('p')].find((p) => !p.querySelector('a') && p.textContent.trim().length > 20),
    cta: [...block.querySelectorAll('p')].find((p) => p.querySelector('a')),
  };
  const inner = document.createElement('div');
  const paint = (user) => (user ? renderMember(inner, user) : renderAnon(inner, authored));
  paint(getUser());
  onAuthChange(paint);
  block.replaceChildren(inner);
}
