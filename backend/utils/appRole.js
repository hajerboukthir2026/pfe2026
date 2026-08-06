const DB_TO_APP = {
  Administrateur: "administrateur",
  PersonnelPermanent: "personnelPermanent",
  Stagiaire: "stagiaire",
  Famille: "famille",
};

const APP_TO_DB = Object.fromEntries(
  Object.entries(DB_TO_APP).map(([db, app]) => [app, db])
);

const APP_ROLES = new Set(Object.values(DB_TO_APP));

function toAppRole(role) {
  if (!role || typeof role !== "string") return "famille";
  if (APP_ROLES.has(role)) return role;
  return DB_TO_APP[role] || "famille";
}

function fromAppRole(role) {
  if (!role || typeof role !== "string") return "Famille";
  if (APP_TO_DB[role]) return APP_TO_DB[role];
  if (DB_TO_APP[role]) return role;
  return "Famille";
}

module.exports = { toAppRole, fromAppRole, DB_TO_APP, APP_TO_DB, APP_ROLES };


