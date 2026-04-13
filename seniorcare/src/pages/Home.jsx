// src/pages/LandingPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    icon: '◉',
    title: 'Gestion des résidents',
    desc: 'Dossiers complets, mesures médicales, notes de suivi centralisés en un seul endroit.',
  },
  {
    icon: '◈',
    title: 'Suivi du personnel',
    desc: 'Plannings, fiches de poste et gestion des stagiaires simplifiés pour l\'équipe soignante.',
  },
  {
    icon: '◎',
    title: 'Espace famille',
    desc: 'Les familles restent connectées : demandes de visite, messages et suivi en temps réel.',
  },
  {
    icon: '◇',
    title: 'Sécurité & rôles',
    desc: 'Accès différenciés selon le profil — administrateur, personnel ou famille.',
  },
];

const STATS = [
  { val: '200+', label: 'Résidents suivis' },
  { val: '50+',  label: 'Professionnels de santé' },
  { val: '98%',  label: 'Satisfaction famille' },
  { val: '24/7', label: 'Disponibilité' },
];

export default function Home({ user }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll); };
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (!e.target.closest('#user-menu-wrap')) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <div style={{ background: '#0a1528', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#e2e8f0', overflowX: 'hidden' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '0 40px',
        height: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.3s',
        background: scrolled ? 'rgba(10,21,40,0.95)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg,#c9a84c,#dfc278)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#0f1f3d', fontSize: 16 }}>SC</span>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: '#fff' }}>SeniorCare</span>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {user ? (
            <div id="user-menu-wrap" style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(prev => !prev)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '6px 14px 6px 8px', borderRadius: 10,
                  border: '1px solid rgba(201,168,76,0.3)',
                  background: menuOpen ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.07)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = menuOpen ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.07)'}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#c9a84c,#dfc278)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, color: '#0f1f3d', fontSize: 13, flexShrink: 0,
                }}>
                  {user.prenom[0].toUpperCase()}{user.nom[0].toUpperCase()}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.2 }}>
                    {user.prenom} {user.nom}
                  </p>
                  <p style={{ color: '#c9a84c', fontSize: 11, margin: 0, lineHeight: 1.2 }}>{user.role}</p>
                </div>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#94a3b8" strokeWidth="2"
                  style={{ transition: 'transform 0.2s', transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {menuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  width: 210, background: '#0f1f3d',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: 12, overflow: 'hidden', zIndex: 100,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                }}>
                  {/* Header info */}
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                    <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: 0 }}>
                      {user.prenom} {user.nom}
                    </p>
                    <p style={{ color: '#64748b', fontSize: 11, margin: '4px 0 0' }}>{user.email}</p>
                  </div>

                  {/* Menu items */}
                  {[
                    {
                      label: 'Tableau de bord',
                      icon: (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                        </svg>
                      ),
                      action: () => navigate('/dashboard'),
                    },
                    {
                      label: 'Paramètres',
                      icon: (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2">
                          <circle cx="12" cy="8" r="4"/>
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                        </svg>
                      ),
                      action: () => navigate('/parametres'),
                    },
                  ].map(item => (
                    <div
                      key={item.label}
                      onClick={() => { item.action(); setMenuOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '11px 16px', cursor: 'pointer',
                        color: '#cbd5e1', fontSize: 13, transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.07)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {item.icon}
                      {item.label}
                    </div>
                  ))}

                  {/* Déconnecter */}
                  <div style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
                    <div
                      onClick={() => {
                        localStorage.removeItem('token');
                        setMenuOpen(false);
                        navigate('/login');
                        window.location.reload(); 
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '11px 16px', cursor: 'pointer',
                        color: '#f87171', fontSize: 13, transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.07)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Déconnecter
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '8px 22px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                border: '1px solid rgba(201,168,76,0.4)', color: '#c9a84c',
                background: 'transparent', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Se connecter
            </button>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '30%', left: '10%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '20%', right: '8%',
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div style={{
          position: 'relative', maxWidth: 800,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 20,
            border: '1px solid rgba(201,168,76,0.3)',
            background: 'rgba(201,168,76,0.08)',
            marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            <span style={{ fontSize: 13, color: '#c9a84c', letterSpacing: '0.05em' }}>Plateforme de gestion certifiée</span>
          </div>
          

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(40px, 7vw, 72px)',
            fontWeight: 700, lineHeight: 1.1, color: '#fff',
            marginBottom: 24, letterSpacing: '-0.02em',
          }}>
            Prendre soin,{' '}
            <span style={{
              backgroundImage: 'linear-gradient(135deg, #c9a84c, #dfc278)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              avec excellence
            </span>
          </h1>

          <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 560, margin: '0 auto 44px', lineHeight: 1.7 }}>
            SeniorCare centralise la gestion de votre maison de retraite — résidents, personnel, familles — dans une interface moderne et sécurisée.
          </p>

         <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
  <button
    onClick={() => navigate('/login')}
    style={{
      padding: '14px 36px',
      borderRadius: 10,
      fontSize: 15,
      fontWeight: 600,
      background: 'linear-gradient(135deg,#c9a84c,#dfc278)',
      color: '#0f1f3d',
      border: 'none',
      cursor: 'pointer',
    }}
  >
    Accéder à la plateforme
  </button>

  <a
    href="#features"
    style={{
      padding: '14px 36px',
      borderRadius: 10,
      fontSize: 15,
      fontWeight: 500,
      border: '1px solid rgba(255,255,255,0.12)',
      color: '#cbd5e1',
      textDecoration: 'none',
    }}
  >
    Découvrir
  </a>
</div>
</div>
      </section>

      {/* ── STATS ── */}
      <section style={{
        padding: '60px 40px',
        borderTop: '1px solid rgba(201,168,76,0.1)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 32, textAlign: 'center',
        }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 42, fontWeight: 700,
                backgroundImage: 'linear-gradient(135deg,#c9a84c,#dfc278)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                lineHeight: 1,
              }}>{s.val}</p>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: 8 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '100px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ color: '#c9a84c', fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            Fonctionnalités
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#fff', lineHeight: 1.2,
          }}>
            Tout ce dont vous avez besoin
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: 16, padding: 28,
                transition: 'all 0.25s', cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)';
                e.currentTarget.style.background = 'rgba(201,168,76,0.05)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.12)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, color: '#c9a84c', marginBottom: 18,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROLES SECTION ── */}
      <section style={{
        padding: '80px 40px',
        background: 'rgba(201,168,76,0.03)',
        borderTop: '1px solid rgba(201,168,76,0.08)',
        borderBottom: '1px solid rgba(201,168,76,0.08)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#c9a84c', fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            Accès par rôle
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 700, color: '#fff',
            marginBottom: 48, lineHeight: 1.2,
          }}>
            Une plateforme pour chaque acteur
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {[
              { role: 'Administrateur', desc: 'Gestion complète de l\'établissement', color: '#c9a84c' },
              { role: 'Personnel Permanent', desc: 'Dossiers et planning médical', color: '#60a5fa' },
              { role: 'Stagiaire', desc: 'Accès encadré et planning de stage', color: '#a78bfa' },
              { role: 'Famille', desc: 'Suivi et communication avec l\'équipe', color: '#4ade80' },
            ].map((r) => (
              <div key={r.role} style={{
                padding: '24px 20px', borderRadius: 12,
                border: `1px solid ${r.color}22`,
                background: `${r.color}08`,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${r.color}44`; e.currentTarget.style.background = `${r.color}12`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${r.color}22`; e.currentTarget.style.background = `${r.color}08`; }}
              >
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: r.color, margin: '0 auto 14px',
                }} />
                <p style={{ fontWeight: 600, color: '#fff', fontSize: 14, marginBottom: 8 }}>{r.role}</p>
                <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.5 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#fff',
            marginBottom: 20, lineHeight: 1.2,
          }}>
            Prêt à commencer ?
          </h2>
          <p style={{ color: '#64748b', fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            Rejoignez SeniorCare et offrez à vos résidents le meilleur suivi possible.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '15px 44px', borderRadius: 10, fontSize: 15, fontWeight: 600,
              background: 'linear-gradient(135deg,#c9a84c,#dfc278)',
              color: '#0f1f3d', border: 'none', cursor: 'pointer',
              transition: 'all 0.2s', boxShadow: '0 0 40px rgba(201,168,76,0.18)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 48px rgba(201,168,76,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(201,168,76,0.18)'; }}
          >
            Accéder à la plateforme
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: '28px 40px',
        borderTop: '1px solid rgba(201,168,76,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'linear-gradient(135deg,#c9a84c,#dfc278)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#0f1f3d', fontSize: 11 }}>SC</span>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#475569', fontSize: 14 }}>SeniorCare</span>
        </div>
        <p style={{ color: '#334155', fontSize: 12 }}>© 2026 SeniorCare. Tous droits réservés.</p>
      </footer>
    </div>
  );
}