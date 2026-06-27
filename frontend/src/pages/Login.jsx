import { useState } from "react";
import api from "../services/api";
import "../styles/Login.css";

const LoginSPA = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      console.log("¡Login exitoso!", response.data);
      setUser(response.data.user);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.response?.data?.message || "Credenciales incorrectas");
    }
  };

  if (isLoggedIn) {
    return (
      <div
        style={{
          padding: "30px",
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        <h2 style={{ color: "#20828A" }}>
          ¡Bienvenido al Panel de Skinclinic!
        </h2>
        <p>
          Sesión activa como: <strong>{user?.name || email}</strong>
        </p>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="submit-btn"
          style={{ maxWidth: "200px", margin: "20px auto" }}
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <h1>Iniciar Sesión</h1>
        <p className="subtitle">Ingresa tus credenciales para acceder</p>

        {error && (
          <p
            style={{
              color: "#721c24",
              fontSize: "14px",
              backgroundColor: "#f8d7da",
              padding: "10px",
              borderRadius: "8px",
              margin: "0 0 15px 0",
            }}
          >
            {error}
          </p>
        )}

        {/* Botón de Google */}
        <button type="button" className="google-btn">
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

        {/* Separador ó */}
        <div className="separator">
          <div className="line"></div>
          <span>ó</span>
          <div className="line"></div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="options-row">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Recuérdame
            </label>
            <a href="#forgot" className="forgot-link">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button type="submit" className="submit-btn">
            Iniciar Sesión
          </button>
        </form>

        <p className="register-footer">
          ¿No tienes una cuenta? <a href="#register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default LoginSPA;
