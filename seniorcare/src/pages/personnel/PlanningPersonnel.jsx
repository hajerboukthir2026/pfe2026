// src/pages/personnel/PlanningPersonnel.jsx
import React from 'react';
import { SectionHeader, Badge, Table } from '../../components/UI';

export function PlanningPersonnel({ planning }) {
  return (
    <div>
      <SectionHeader title="Planning personnel" subtitle="Plannings des personnels permanents" />
      <Table headers={['Personnel', 'Jour', 'Début', 'Fin', 'Service']}>
        {planning.map((p) => (
          <tr key={p.id} className="table-row">
            <td className="p-4 text-white font-medium">{p.personnel}</td>
            <td className="p-4 text-slate-300">{p.jour}</td>
            <td className="p-4 text-slate-300">{p.debut}</td>
            <td className="p-4 text-slate-300">{p.fin}</td>
            <td className="p-4"><Badge label={p.service} /></td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

export function PlanningStage({ planning }) {
  return (
    <div>
      <SectionHeader title="Planning de stage" subtitle="Détails de votre stage" />
      {planning.map((p) => (
        <div key={p.id} className="sc-card p-6 mb-4">
          <div className="grid grid-cols-2 gap-5">
            {[
              ['Stagiaire',   p.stagiaire],
              ['Service',     p.service],
              ['Date début',  p.debut],
              ['Date fin',    p.fin],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                <p className="text-white font-medium text-sm">{val}</p>
              </div>
            ))}
            <div className="col-span-2">
              <p className="text-xs text-slate-500 mb-0.5">Superviseur</p>
              <p className="text-white font-medium text-sm">{p.superviseur}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
