import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import ClinicalRecordPage from "./pages/ClinicalRecordPage";

function AppContent() {
  const { user, loading, login, logout } = useAuth();
  const [attendingAppointmentId, setAttendingAppointmentId] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-primary">
        <p className="text-white text-sm font-semibold">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={login} />;
  }

  if (attendingAppointmentId) {
    return (
      <ClinicalRecordPage
        appointmentId={attendingAppointmentId}
        currentUser={user}
        onExit={() => setAttendingAppointmentId(null)}
      />
    );
  }

  return (
    <DashboardPage
      user={user}
      onLogout={logout}
      onAttendAppointment={setAttendingAppointmentId}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
