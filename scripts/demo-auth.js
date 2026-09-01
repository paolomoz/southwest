/**
 * demo-auth — shared login-state module for the AEM Sites 201 demo.
 * Demonstrates client-side personalization in EDS: a lightweight profile
 * store (localStorage) + a CustomEvent bus any block can subscribe to.
 * In production this would be an IMS/CIAM token check — the block pattern
 * is identical: read state, render variant, subscribe to changes.
 */

const KEY = 'sw-demo-user';

export const PERSONAS = [
  {
    id: 'alex', name: 'Alex', tier: 'A-List Preferred', points: 48232, initials: 'AT',
  },
  {
    id: 'jordan', name: 'Jordan', tier: 'Rapid Rewards Member', points: 6150, initials: 'JR',
  },
];

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function login(personaId) {
  const persona = PERSONAS.find((p) => p.id === personaId);
  if (!persona) return;
  localStorage.setItem(KEY, JSON.stringify(persona));
  document.dispatchEvent(new CustomEvent('sw-auth', { detail: { user: persona } }));
}

export function logout() {
  localStorage.removeItem(KEY);
  document.dispatchEvent(new CustomEvent('sw-auth', { detail: { user: null } }));
}

export function onAuthChange(fn) {
  document.addEventListener('sw-auth', (e) => fn(e.detail.user));
}

export function formatPoints(n) {
  return n.toLocaleString('en-US');
}

/** demo conversion: dollars → Rapid Rewards points (approx public redemption rate) */
export function toPoints(usd) {
  return Math.round((usd / 0.014) / 10) * 10;
}
