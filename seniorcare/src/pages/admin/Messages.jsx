// src/pages/admin/Messages.jsx
import React from 'react';
import { SectionHeader, Badge } from '../../components/UI';

export default function Messages({ messages, setMessages }) {
  const markRead = (id) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, lu: true } : m)));

  return (
    <div>
      <SectionHeader title="Messages famille" subtitle="Messages reçus des familles des résidents" />
      {messages.length === 0 ? (
        <p className="text-slate-500 text-sm">Aucun message reçu.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="sc-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-medium text-sm">{m.de}</p>
                    {!m.lu && <Badge label="Non lu" type="green" />}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{m.contenu}</p>
                  <p className="text-slate-500 text-xs mt-2">{m.date}</p>
                </div>
                {!m.lu && (
                  <button className="btn-outline text-xs shrink-0" onClick={() => markRead(m.id)}>
                    Marquer lu
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
