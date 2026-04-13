// src/components/Layout.jsx
import React, { useState } from 'react';
import { ROLE_LABELS } from '../data/initialData';

export default function Layout({ user, onLogout, menuItems, activeSection, setActiveSection, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen text-slate-200">
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 flex flex-col shrink-0`}
        style={{ background: '#0a1528', borderRight: '1px solid rgba(201,168,76,0.12)' }}
      >
        {/* Logo */}
        <div
          className="p-4 flex items-center gap-3 border-b shrink-0"
          style={{ borderColor: 'rgba(201,168,76,0.12)' }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#c9a84c,#dfc278)' }}
          >
            <span className="text-navy font-display font-bold text-sm">SC</span>
          </div>
          {sidebarOpen && (
            <span className="font-display font-bold text-white text-lg whitespace-nowrap">SeniorCare</span>
          )}
        </div>

        {/* User info */}
        {sidebarOpen && (
          <div
            className="px-4 py-3 border-b shrink-0"
            style={{ borderColor: 'rgba(201,168,76,0.12)' }}
          >
            <p className="text-xs text-slate-500">{ROLE_LABELS[user.role]}</p>
            <p className="text-sm text-white font-medium truncate">{user.label}</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t shrink-0" style={{ borderColor: 'rgba(201,168,76,0.12)' }}>
          <button
            onClick={onLogout}
            className="sidebar-item"
            style={{ color: '#f87171' }}
          >
            <span className="shrink-0 text-base">✕</span>
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Header */}
        <header
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: 'rgba(201,168,76,0.1)', background: 'rgba(10,21,40,0.8)', backdropFilter: 'blur(6px)' }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-gold transition-colors text-xl"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 hidden sm:block">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-navy font-bold text-sm"
              style={{ background: 'linear-gradient(135deg,#c9a84c,#dfc278)' }}
            >
              {user?.nom?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
