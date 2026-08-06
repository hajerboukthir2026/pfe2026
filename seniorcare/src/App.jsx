// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";

import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";

import Dashboard from "./pages/admin/Dashboard";
import GererResidents from "./pages/admin/GererResidents";
import GererPersonnel from "./pages/admin/GererPersonnel";
import GererVisites from "./pages/admin/GererVisites";
import GererPlannings from "./pages/admin/GererPlannings";
import Messages from "./pages/admin/Messages";
import Comptes from "./pages/admin/Comptes";

import DossierResident from "./pages/personnel/DossierResident";
import { PlanningPersonnel, PlanningStage } from "./pages/personnel/PlanningPersonnel";

import {
  DemanderVisite,
  PlanningVisitesFamille,
  EnvoyerMessage,
  ConsulterNotes,
  FicheResident,
} from "./pages/famille/FamillePages";

import {
  DEFAULT_ROUTE_BY_ROLE,
  appRoleFromPayload,
} from "./data/initialData";
import {
  fetchProfile as getProfile,
  fetchResidents,
  fetchPersonnel,
  fetchVisites,
  fetchMessages,
  fetchPlannings,
} from "./config/api";

const MENUS = {
  administrateur: [
    { path: "/dashboard", label: "Tableau de bord" },
    { path: "/residents", label: "Résidents" },
    { path: "/personnel", label: "Personnel" },
    { path: "/visites", label: "Visites" },
    { path: "/plannings", label: "Plannings" },
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

function postLoginPathFromToken(token) {
  try {
    const part = token.split(".")[1];
    if (!part) return "/";
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));
    const key = appRoleFromPayload(payload.role);
    return DEFAULT_ROUTE_BY_ROLE[key] || "/";
  } catch {
    return "/";
  }
}

function ProtectedAuth() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    return <Navigate to={postLoginPathFromToken(token)} replace />;
  }
  return <Outlet />;
}

function ProtectedRoute({ user, authReady }) {
  if (!authReady) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-sm"
        style={{ background: "#0a1528", color: "#94a3b8" }}
      >
        Chargement…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function RoleRoute({ user, allowedRoles }) {
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to={DEFAULT_ROUTE_BY_ROLE[user?.role] || "/"} replace />;
  }
  return <Outlet />;
}

function AppRoutes({ user, setUser, sharedState, authReady }) {
  const navigate = useNavigate();
  const {
    residents, setResidents,
    personnel, setPersonnel,
    visites, setVisites,
    messages, setMessages,
    plannings, setPlannings,
  } = sharedState;

  const props = {
    residents, setResidents,
    personnel, setPersonnel,
    visites, setVisites,
    messages, setMessages,
    plannings, setPlannings,
    user,
  };

  const planningPP = plannings.filter((p) => p.type === "personnel");
  const planningStage = plannings.filter((p) => p.type === "stage");

  return (
    <Routes>
      <Route path="/" element={<Home user={user} setUser={setUser} />} />
      <Route element={<ProtectedAuth />}>
        <Route path="/login" element={<AuthPage setUser={setUser} />} />
      </Route>

      <Route element={<ProtectedRoute user={user} authReady={authReady} />}>
        <Route
          path="/"
          element={
            <Layout
              user={user}
              onLogout={() => {
                localStorage.removeItem("token");
                setUser(null);
                navigate("/login", { replace: true });
              }}
              menuItems={MENUS[user?.role] || []}
            />
          }
        >
          <Route element={<RoleRoute user={user} allowedRoles={["administrateur"]} />}>
            <Route path="dashboard" element={<Dashboard {...props} />} />
            <Route path="residents" element={<GererResidents {...props} />} />
            <Route path="personnel" element={<GererPersonnel {...props} />} />
            <Route path="visites" element={<GererVisites {...props} />} />
            <Route path="plannings" element={<GererPlannings {...props} />} />
            <Route path="messages" element={<Messages {...props} />} />
            <Route path="comptes" element={<Comptes />} />
          </Route>

          <Route element={<RoleRoute user={user} allowedRoles={["personnelPermanent", "stagiaire"]} />}>
            <Route path="dossier" element={<DossierResident {...props} />} />
          </Route>

          <Route element={<RoleRoute user={user} allowedRoles={["personnelPermanent"]} />}>
            <Route path="planning" element={<PlanningPersonnel planning={planningPP} />} />
          </Route>

          <Route element={<RoleRoute user={user} allowedRoles={["stagiaire"]} />}>
            <Route path="stageplanning" element={<PlanningStage planning={planningStage} />} />
          </Route>

          <Route element={<RoleRoute user={user} allowedRoles={["famille"]} />}>
            <Route path="demandervisite" element={<DemanderVisite {...props} />} />
            <Route path="planningvisites" element={<PlanningVisitesFamille visites={visites} user={user} />} />
            <Route path="envoyermessage" element={<EnvoyerMessage setMessages={setMessages} user={user} />} />
            <Route path="notes" element={<ConsulterNotes residents={residents} />} />
            <Route path="ficheresident" element={<FicheResident residents={residents} />} />
          </Route>

          <Route
            path="*"
            element={<Navigate to={DEFAULT_ROUTE_BY_ROLE[user?.role] || "/"} replace />}
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [residents, setResidents] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [visites, setVisites] = useState([]);
  const [messages, setMessages] = useState([]);
  const [plannings, setPlannings] = useState([]);

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthReady(true);
        return;
      }
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setAuthReady(true);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (!authReady || !user) {
      setResidents([]);
      setPersonnel([]);
      setVisites([]);
      setMessages([]);
      setPlannings([]);
      return;
    }

    const loadAll = async () => {
      try {
        const role = user.role;
        const residentsData = await fetchResidents().catch(() => []);
        setResidents(residentsData);

        if (role === "administrateur") {
          const [p, v, m, pl] = await Promise.all([
            fetchPersonnel().catch(() => []),
            fetchVisites().catch(() => []),
            fetchMessages().catch(() => []),
            fetchPlannings().catch(() => []),
          ]);
          setPersonnel(p);
          setVisites(v);
          setMessages(m);
          setPlannings(pl);
        } else if (role === "personnelPermanent" || role === "stagiaire") {
          const pl = await fetchPlannings().catch(() => []);
          setPersonnel([]);
          setVisites([]);
          setMessages([]);
          setPlannings(pl);
        } else if (role === "famille") {
          const v = await fetchVisites().catch(() => []);
          setPersonnel([]);
          setVisites(v);
          setMessages([]);
          setPlannings([]);
        }
      } catch {
        setResidents([]);
        setPersonnel([]);
        setVisites([]);
        setMessages([]);
        setPlannings([]);
      }
    };

    loadAll();
  }, [authReady, user]);

  return (
    <AppRoutes
      user={user}
      setUser={setUser}
      authReady={authReady}
      sharedState={{
        residents, setResidents,
        personnel, setPersonnel,
        visites, setVisites,
        messages, setMessages,
        plannings, setPlannings,
      }}
    />
  );
}
