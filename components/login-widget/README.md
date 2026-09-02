# login-widget — shared React login component

The login surface used across Southwest digital platforms, packaged as a
framework-genuine React 18 component. In production this is the artifact a
platform team publishes to the internal npm registry; every host (EDS site,
native web app, kiosk shell) consumes the same component and supplies its own
auth adapter as props.

## Contract (platform-neutral)

The component owns the login **surface** only. Session state lives in the
host's auth layer, injected as props:

```js
mount(container, {
  personas,      // available demo identities (prod: omitted — CIAM handles it)
  getUser,       // () => user | null
  onLogin,       // (id) => void  — host performs the login
  onLogout,      // () => void
  formatPoints,  // (n) => string
  onClose,       // () => void — host removes the island
});
```

On southwest.com the same props would be wired to the CIAM/IMS SDK. In this
EDS demo they come from `/scripts/demo-auth.js` — the shared event bus that the
vanilla `header`, `member-banner`, and `fare-deals` blocks already subscribe to.
React logs you in; vanilla blocks re-render. One contract, two rendering worlds.

## Build

The EDS site itself has no build step; this component is bundled once,
offline, and the self-contained ESM bundle is committed (like consuming a
published package):

```bash
cd components/login-widget
npm install
npm run build     # -> dist/login-widget.bundle.js (React included, ESM)
```

## Loading

The bundle is imported **on first interaction** (`/scripts/login-island.js`),
so first paint carries zero React and the site's Lighthouse profile is
untouched.
