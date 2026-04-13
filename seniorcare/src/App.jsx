// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import GererResidents from "./pages/admin/GererResidents";
import GererPersonnel from "./pages/admin/GererPersonnel";
import GererVisites from "./pages/admin/GererVisites";
import Messages from "./pages/admin/Messages";
import Comptes from "./pages/admin/Comptes";

// Personnel pages
import DossierResident from "./pages/personnel/DossierResident";
import { PlanningPersonnel, PlanningStage } from "./pages/personnel/PlanningPersonnel";

// Famille pages
import {
  DemanderVisite,
  PlanningVisitesFamille,
  EnvoyerMessage,
  ConsulterNotes,
  FicheResident,
} from "./pages/famille/FamillePages";

// Data
import {
  INIT_RESIDENTS,
  INIT_PERSONNEL,
  INIT_VISITES,
  INIT_MESSAGES,
  INIT_COMPTES,
  INIT_PLANNING_PP,
  INIT_PLANNING_STAGE,
} from "./data/initialData";
import axios from "axios";

// ── Menu definitions ──────────────────────
const MENUS = {
  administrateur: [
    { path: "/dashboard", label: "Tableau de bord" },
    { path: "/residents", label: "Résidents" },
    { path: "/personnel", label: "Personnel" },
    { path: "/visites", label: "Visites" },
    { path: "/messages", label: "Messages famille" },
    { path: "/comptes", label: "Comptes utilisateurs" },
  ],
  personnelPermanent: [
    { path: "/dossier", label: "Dossier résident" },
    { path: "/planning", label: "Planning personnel" },
  ],
  stagiaire: [
    { path: "/dossier", label: "Dossier résident" },
    { path: "/stageplanning", label: "Planning de stage" },
  ],
  famille: [
    { path: "/demandervisite", label: "Demander une visite" },
    { path: "/planningvisites", label: "Planning visites" },
    { path: "/envoyermessage", label: "Envoyer message" },
    { path: "/notes", label: "Consulter notes" },
    { path: "/ficheresident", label: "Fiche résident" },
  ],
};

const DEFAULT_ROUTE = {
  administrateur: "/dashboard",
  personnelPermanent: "/dossier",
  stagiaire: "/dossier",
  famille: "/demandervisite",
};

// ── Protected Route ──────────────────────
function ProtectedAuth() {
  const [auth,setAuth] = useState(false);
   useEffect(() => {
    const data = localStorage.getItem("token");
    if (data) {
      try {
        setAuth(true);
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);
  return auth ? <Navigate to={"/"} replace={true} /> : <Outlet />
}
function ProtectedRoute({ user }) {
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function RoleRoute({ user, allowedRoles }) {
  console.log("first")
  console.log(user)
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

// ── Main Routes ─────────────────────────
function AppRoutes({ user, setUser, sharedState }) {
  const {
    residents, setResidents,
    personnel, setPersonnel,
    visites, setVisites,
    messages, setMessages,
    comptes, setComptes,
  } = sharedState;

  const props = {
    residents, setResidents,
    personnel, setPersonnel,
    visites, setVisites,
    messages, setMessages,
    comptes, setComptes,
    user,
  };

  return (
    <Routes>
  {/* Public routes */}
  <Route path="/" element={<Home user={user} />} />
  <Route element={<ProtectedAuth />}>
    <Route path="/login" element={<AuthPage />} />
  </Route>

  {/* Protected */}
  <Route element={<ProtectedRoute user={user} />}>
    <Route
      path="/"
      element={
        <Layout
          user={user}
          onLogout={() => {
            localStorage.removeItem("auth");
            setUser(null);
          }}
          menuItems={MENUS[user?.role] || []}
        />
      }
    >
      {/* Admin */}
      <Route element={<RoleRoute user={user} allowedRoles={["administrateur"]} />}>
        <Route path="dashboard" element={<Dashboard {...props} />} />
        <Route path="residents" element={<GererResidents {...props} />} />
        <Route path="personnel" element={<GererPersonnel {...props} />} />
        <Route path="visites" element={<GererVisites {...props} />} />
        <Route path="messages" element={<Messages {...props} />} />
        <Route path="comptes" element={<Comptes {...props} />} />
      </Route>

      {/* Personnel */}
      <Route element={<RoleRoute user={user} allowedRoles={["personnelPermanent", "stagiaire"]} />}>
        <Route path="dossier" element={<DossierResident {...props} />} />
      </Route>

      <Route element={<RoleRoute user={user} allowedRoles={["personnelPermanent"]} />}>
        <Route path="planning" element={<PlanningPersonnel planning={INIT_PLANNING_PP} />} />
      </Route>

      <Route element={<RoleRoute user={user} allowedRoles={["stagiaire"]} />}>
        <Route path="stageplanning" element={<PlanningStage planning={INIT_PLANNING_STAGE} />} />
      </Route>

      {/* Famille */}
      <Route element={<RoleRoute user={user} allowedRoles={["famille"]} />}>
        <Route path="demandervisite" element={<DemanderVisite {...props} />} />
        <Route path="planningvisites" element={<PlanningVisitesFamille visites={visites} user={user} />} />
        <Route path="envoyermessage" element={<EnvoyerMessage setMessages={setMessages} user={user} />} />
        <Route path="notes" element={<ConsulterNotes residents={residents} />} />
        <Route path="ficheresident" element={<FicheResident residents={residents} />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to={DEFAULT_ROUTE[user?.role]} replace />} />
    </Route>
  </Route>

  {/* fallback global */}
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
  );
}

// ── App Root ────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);

  const [residents, setResidents] = useState(INIT_RESIDENTS);
  const [personnel, setPersonnel] = useState(INIT_PERSONNEL);
  const [visites, setVisites] = useState(INIT_VISITES);
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [comptes, setComptes] = useState(INIT_COMPTES);

 useEffect(() => {
    const fetchProfile = async () => {
      const data = localStorage.getItem("token");

      if (data) {
        try {
          
         

          const res = await axios.get(
            "http://localhost:5000/api/v1/auth/profile",
            {
              headers: {
                Authorization: `Bearer ${data}`,
              },
            }
          );
          setUser(res.data);

        } catch (error) {
          console.log("ERROR:", error.response?.data || error.message);
        }
      }
    };

    fetchProfile();
  }, []);

  return (
    <AppRoutes
      user={user}
      setUser={setUser}
      sharedState={{
        residents, setResidents,
        personnel, setPersonnel,
        visites, setVisites,
        messages, setMessages,
        comptes, setComptes,
      }}
    />
  );
}