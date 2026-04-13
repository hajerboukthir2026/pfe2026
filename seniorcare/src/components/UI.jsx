// src/components/UI.jsx
import React, { useState } from 'react';

export function Badge({ label, type = 'gold' }) {
  const styles = {
    gold:  'bg-yellow-900/30 text-yellow-400 border border-yellow-600/30',
    green: 'bg-green-900/30  text-green-400  border border-green-600/30',
    red:   'bg-red-900/30    text-red-400    border border-red-600/30',
    blue:  'bg-blue-900/30   text-blue-400   border border-blue-600/30',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles[type] || styles.gold}`}>
      {label}
    </span>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="font-display text-2xl text-white font-semibold">{title}</h2>
        {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="modal-bg" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg text-white font-semibold">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FormField({ label, children }) {
  return (
    <div>
      <label className="sc-label">{label}</label>
      {children}
    </div>
  );
}

export function Alert({ message, type = 'success' }) {
  const styles = {
    success: 'border-green-500/30 bg-green-500/10 text-green-400',
    error:   'border-red-500/30   bg-red-500/10   text-red-400',
    info:    'border-gold/30      bg-gold/10      text-gold',
  };
  return (
    <div className={`mb-4 p-3 rounded-lg border text-sm ${styles[type]}`}>
      {message}
    </div>
  );
}

export function Table({ headers, children, empty }) {
  return (
    <div className="sc-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="table-header">
            {headers.map((h) => (
              <th key={h} className="text-left p-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      {empty && (
        <p className="text-slate-500 text-sm text-center py-8">{empty}</p>
      )}
    </div>
  );
}
