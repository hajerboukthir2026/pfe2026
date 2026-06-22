const DB_TO_APP = {
  Administrateur: "administrateur",
  PersonnelPermanent: "personnelPermanent",
  Stagiaire: "stagiaire",
  Famille: "famille",
};

const APP_ROLES = new Set(Object.values(DB_TO_APP));

/** Map MongoDB role values to frontend route keys */

/** Map MongoDB role values to frontend route keys */
function toAppRole(role) {
  if (!role || typeof role !== "string") return "famille";
  if (APP_ROLES.has(role)) return role;
  return DB_TO_APP[role] || "famille";
}

module.exports = { toAppRole, DB_TO_APP, APP_ROLES };


