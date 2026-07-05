import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import DashboardPage from "./pages/Dashboard";

function AppContent() {
  const { user, loading, login, logout } = useAuth();

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

  return <DashboardPage user={user} onLogout={logout} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
