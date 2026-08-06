export const ROLES = ['administrateur', 'personnelPermanent', 'stagiaire', 'famille'];

export const ROLE_LABELS = {
  administrateur: 'Administrateur',
  personnelPermanent: 'Personnel Permanent',
  stagiaire: 'Stagiaire',
  famille: 'Famille',
};

/** Première page après connexion selon le rôle (clés frontend) */
export const DEFAULT_ROUTE_BY_ROLE = {
  administrateur: '/dashboard',
  personnelPermanent: '/dossier',
  stagiaire: '/dossier',
  famille: '/demandervisite',
};

/** Lien principal depuis la page d'accueil selon le rôle */
export const HOME_LINK_BY_ROLE = {
  administrateur: { label: 'Tableau de bord', path: '/dashboard' },
  personnelPermanent: { label: 'Dossier résident', path: '/dossier' },
  stagiaire: { label: 'Dossier résident', path: '/dossier' },
  famille: { label: 'Demander une visite', path: '/demandervisite' },
};

const LEGACY_DB_ROLE = {
  Administrateur: 'administrateur',
  PersonnelPermanent: 'personnelPermanent',
  Stagiaire: 'stagiaire',
  Famille: 'famille',
};

/** JWT ou anciennes valeurs → clé utilisée par le router */
export function appRoleFromPayload(role) {
  if (!role || typeof role !== 'string') return 'famille';
  if (DEFAULT_ROUTE_BY_ROLE[role]) return role;
  return LEGACY_DB_ROLE[role] || 'famille';
}
