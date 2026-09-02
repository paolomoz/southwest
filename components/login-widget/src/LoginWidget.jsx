import React, { useEffect, useRef, useState } from 'react';

/**
 * LoginWidget — shared login surface (React 18).
 * Owns the picker/account UI only; session state belongs to the host,
 * injected via props (see README: platform-neutral contract).
 */
export default function LoginWidget({
  personas = [],
  getUser,
  onLogin,
  onLogout,
  formatPoints,
  onClose,
}) {
  const [user, setUser] = useState(() => getUser());
  const panelRef = useRef(null);

  // close on outside click / Escape
  useEffect(() => {
    const onDoc = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const login = (id) => {
    onLogin(id);
    setUser(getUser());
    onClose();
  };

  const logout = () => {
    onLogout();
    setUser(null);
    onClose();
  };

  return (
    <div className="lw-panel" ref={panelRef} role="dialog" aria-label="Log in">
      <div className="lw-head">
        <span className="lw-brand">Rapid Rewards<sup>®</sup></span>
        <button type="button" className="lw-close" aria-label="Close" onClick={onClose}>×</button>
      </div>
      {user ? (
        <div className="lw-account">
          <span className="lw-avatar">{user.initials}</span>
          <div className="lw-who">
            <b>{user.name}</b>
            <span>{user.tier} · {formatPoints(user.points)} pts</span>
          </div>
          <button type="button" className="lw-cta lw-logout" onClick={logout}>Log out</button>
        </div>
      ) : (
        <>
          <p className="lw-hint">Choose a demo member to log in:</p>
          <ul className="lw-personas">
            {personas.map((p) => (
              <li key={p.id}>
                <button type="button" className="lw-persona" onClick={() => login(p.id)}>
                  <span className="lw-avatar">{p.initials}</span>
                  <span className="lw-who">
                    <b>{p.name}</b>
                    <span>{p.tier} · {formatPoints(p.points)} pts</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="lw-note">Shared React component · mounted by an EDS block, loaded on first click</p>
    </div>
  );
}
