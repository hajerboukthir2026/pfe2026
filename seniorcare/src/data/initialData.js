export const ROLES = ['administrateur', 'personnelPermanent', 'stagiaire', 'famille'];

export const DEMO_ACCOUNTS = [
  { label: 'Admin Système',       role: 'administrateur',     email: 'admin@seniorcare.tn' },
  { label: 'Dr. Mansouri Sonia',  role: 'personnelPermanent', email: 'sonia@seniorcare.tn' },
  { label: 'Ben Salah Amine',     role: 'stagiaire',          email: 'amine@seniorcare.tn' },
  { label: 'Ben Ali Omar',        role: 'famille',            email: 'omar@gmail.com' },
];

export const ROLE_LABELS = {
  administrateur:    'Administrateur',
  personnelPermanent:'Personnel Permanent',
  stagiaire:         'Stagiaire',
  famille:           'Famille',
};

export const INIT_RESIDENTS = [
  { id: 1, nom: 'Ben Ali Karim',      age: 78, chambre: '101', statut: 'actif',   notes: 'Diabétique, surveillance glycémie.',   mesures: [{ date:'2026-03-10', tension:'12/8', poids:'72 kg' }] },
  { id: 2, nom: 'Ferchichi Leila',    age: 82, chambre: '203', statut: 'actif',   notes: 'Insuffisance cardiaque légère.',        mesures: [] },
  { id: 3, nom: 'Trabelsi Mohamed',   age: 75, chambre: '105', statut: 'archivé', notes: '',                                      mesures: [] },
];

export const INIT_PERSONNEL = [
  { id: 1, nom: 'Dr. Mansouri Sonia', role: 'personnelPermanent', specialite: 'Médecin généraliste',  statut: 'actif' },
  { id: 2, nom: 'Ben Salah Amine',    role: 'stagiaire',          specialite: 'Soins infirmiers',     statut: 'actif' },
  { id: 3, nom: 'Jouini Rania',       role: 'personnelPermanent', specialite: 'Kinésithérapeute',     statut: 'actif' },
];

export const INIT_VISITES = [
  { id: 1, famille: 'Ben Ali Omar',     resident: 'Ben Ali Karim',   date: '2026-03-20', heure: '14:00', statut: 'en attente' },
  { id: 2, famille: 'Ferchichi Famille',resident: 'Ferchichi Leila', date: '2026-03-18', heure: '10:00', statut: 'acceptée'  },
];

export const INIT_MESSAGES = [
  { id: 1, de: 'Ben Ali Omar',      contenu: "Pouvez-vous m'informer de l'état de santé de mon père ?", date: '2026-03-15', lu: false },
  { id: 2, de: 'Ferchichi Famille', contenu: 'Demande de rendez-vous médical urgent.',                   date: '2026-03-14', lu: true  },
];

export const INIT_COMPTES = [
  { id: 1, nom: 'Admin Système',      email: 'admin@seniorcare.tn', role: 'administrateur',     statut: 'actif'   },
  { id: 2, nom: 'Dr. Mansouri Sonia', email: 'sonia@seniorcare.tn', role: 'personnelPermanent', statut: 'actif'   },
  { id: 3, nom: 'Ben Salah Amine',    email: 'amine@seniorcare.tn', role: 'stagiaire',           statut: 'actif'   },
  { id: 4, nom: 'Ben Ali Omar',       email: 'omar@gmail.com',      role: 'famille',             statut: 'inactif' },
];

export const INIT_PLANNING_PP = [
  { id: 1, personnel: 'Dr. Mansouri Sonia', jour: 'Lundi',  debut: '08:00', fin: '16:00', service: 'Médical' },
  { id: 2, personnel: 'Jouini Rania',       jour: 'Mardi',  debut: '09:00', fin: '17:00', service: 'Kiné'    },
  { id: 3, personnel: 'Dr. Mansouri Sonia', jour: 'Jeudi',  debut: '08:00', fin: '14:00', service: 'Médical' },
];

export const INIT_PLANNING_STAGE = [
  { id: 1, stagiaire: 'Ben Salah Amine', debut: '2026-02-01', fin: '2026-05-01', service: 'Soins infirmiers', superviseur: 'Dr. Mansouri Sonia' },
];
