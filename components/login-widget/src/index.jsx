import React from 'react';
import { createRoot } from 'react-dom/client';
import LoginWidget from './LoginWidget.jsx';

const roots = new WeakMap();

/** Mount the widget into a host-provided container. Host supplies the auth adapter. */
export function mount(container, props) {
  let root = roots.get(container);
  if (!root) {
    root = createRoot(container);
    roots.set(container, root);
  }
  root.render(<LoginWidget {...props} />);
  return root;
}

/** Unmount and release the island. */
export function unmount(container) {
  const root = roots.get(container);
  if (root) {
    root.unmount();
    roots.delete(container);
  }
}
