import { useState } from "react";
import api from "../services/api";

const LoginSPA = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState(null);

  const [mustChangePass, setMustChangePass] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      console.log("¡Login exitoso!", response.data);

      const loggedUser = response.data.user;
      setUser(loggedUser);

      if (loggedUser.mustChangePassword) {
        setMustChangePass(true);
      } else {
        onLoginSuccess(loggedUser);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Credenciales incorrectas");
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    setPassError("");

    if (newPassword !== confirmPassword) {
      setPassError("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      setPassError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      await api.post("/auth/change-password", { newPassword });

      setMustChangePass(false);
      onLoginSuccess({ ...user, mustChangePassword: false });
    } catch (err) {
      setPassError(
        err.response?.data?.message || "Error al actualizar la contraseña",
      );
    }
  };

  if (mustChangePass) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-primary p-4">
        <div className="bg-white w-full max-w-[450px] rounded-2xl p-8 shadow-2xl text-left">
          <h1 className="text-2xl font-bold text-primary mb-2 text-center">
            Actualizar Contraseña
          </h1>
          <p className="text-sm text-accent mb-6 text-center">
            Por seguridad, debes cambiar tu contraseña temporal antes de
            continuar.
          </p>

          {passError && (
            <p className="text-sm text-red-800 bg-red-100 p-3 rounded-lg mb-4 text-center border border-red-200">
              {passError}
            </p>
          )}

          <form
            onSubmit={handlePasswordChangeSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-primary">
                Nueva Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full p-2.5 rounded-lg border border-borderClinik text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-primary">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-2.5 rounded-lg border border-borderClinik text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 p-2.5 rounded-lg bg-secondary text-white text-sm font-bold hover:bg-[#14676f] transition-colors cursor-pointer shadow-md"
            >
              Guardar y Acceder
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-primary p-4">
      <div className="bg-white w-full max-w-[450px] rounded-2xl p-8 shadow-2xl text-left">
        <h1 className="text-2xl font-bold text-primary mb-1 text-center">
          Iniciar Sesión
        </h1>
        <p className="text-sm text-accent mb-6 text-center">
          Ingresa tus credenciales para acceder
        </p>

        {error && (
          <p className="text-sm text-red-800 bg-red-100 p-3 rounded-lg mb-4 text-center border border-red-200">
            {error}
          </p>
        )}

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 p-2.5 border border-borderClinik rounded-lg text-sm font-semibold text-primary hover:bg-gray-50 transition-colors cursor-pointer mb-5"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.8 2.7v2.24h2.91c1.7-1.57 2.69-3.88 2.69-6.57z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.47-.8 5.96-2.23l-2.91-2.24c-.8.54-1.84.87-3.05.87-2.34 0-4.33-1.58-5.03-3.71H.95v2.3A9 9 0 0 0 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.97 10.69A5.409 5.409 0 0 1 3.66 9c0-.59.1-1.17.29-1.69V5.01H.95A8.991 8.991 0 0 0 0 9c0 1.49.36 2.91.95 4.19l3.02-2.5z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.05A8.94 8.94 0 0 0 9 0 8.991 8.991 0 0 0 .95 5.01l3.02 2.52c.7-2.13 2.69-3.71 5.02-3.71z"
            />
          </svg>
          Ingresar con Google
        </button>

        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 text-xs text-accent font-medium">ó</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-primary">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2.5 rounded-lg border border-borderClinik text-sm focus:outline-none focus:border-secondary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-primary">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2.5 rounded-lg border border-borderClinik text-sm focus:outline-none focus:border-secondary"
            />
          </div>

          <div className="flex items-center justify-between text-xs mt-1">
            <label className="flex items-center gap-2 text-primary font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-secondary h-4 w-4 rounded border-borderClinik"
              />
              Recuérdame
            </label>
            <a
              href="#forgot"
              className="text-secondary font-semibold hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            className="w-full mt-2 p-2.5 rounded-lg bg-secondary text-white text-sm font-bold hover:bg-[#14676f] transition-colors cursor-pointer shadow-md"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="text-xs text-center text-accent mt-6">
          ¿No tienes una cuenta?{" "}
          <a
            href="#register"
            className="text-secondary font-bold hover:underline"
          >
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginSPA;
