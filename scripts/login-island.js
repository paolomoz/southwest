/**
 * login-island — host-side adapter for the shared React login widget.
 * The bundle (React included) is fetched on FIRST interaction only, so first
 * paint carries zero React. Any block can call openLoginWidget(anchorEl);
 * the widget gets the site's auth layer (demo-auth bus) as props — the same
 * contract a CIAM/IMS adapter would fill on the production platform.
 */
import { loadCSS } from './aem.js';
import {
  PERSONAS, getUser, login, logout, formatPoints,
} from './demo-auth.js';

let widget; // module namespace, cached after first load
let host; // floating container, reused

async function ensureWidget() {
  if (!widget) {
    await loadCSS(`${window.hlx?.codeBasePath || ''}/styles/login-widget.css`);
    widget = await import('../components/login-widget/dist/login-widget.bundle.js');
  }
  return widget;
}

export function closeLoginWidget() {
  if (widget && host) {
    widget.unmount(host);
    host.remove();
    host = null;
  }
}

export async function openLoginWidget(anchorEl) {
  const w = await ensureWidget();
  if (host) { closeLoginWidget(); return; } // toggle
  host = document.createElement('div');
  host.className = 'login-island';
  const r = anchorEl.getBoundingClientRect();
  host.style.top = `${r.bottom + window.scrollY + 8}px`;
  host.style.left = `${Math.max(16, Math.min(r.right + window.scrollX - 320, window.innerWidth - 336))}px`;
  document.body.append(host);
  w.mount(host, {
    personas: PERSONAS,
    getUser,
    onLogin: login,
    onLogout: logout,
    formatPoints,
    onClose: closeLoginWidget,
  });
}
