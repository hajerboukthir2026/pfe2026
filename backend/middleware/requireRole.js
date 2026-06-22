/**
 * Vérifie que l'utilisateur connecté a l'un des rôles autorisés.
 * À placer APRÈS AuthToken (req.user doit exister).
 *
 * @param  {...string} allowedRoles - ex: 'administrateur', 'famille'
 */
module.exports =
  (...allowedRoles) =>
  (req, res, next) => {
    const role = req.user?.role;

    if (!role) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        message: "Accès refusé : vous n'avez pas les droits pour cette action",
      });
    }

    next();
  };
