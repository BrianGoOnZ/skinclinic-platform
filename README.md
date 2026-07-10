# Skinclinic

Plataforma web de administración interna para una clínica de belleza, cosmetología y depilación láser. Permite gestionar clientes, colaboradores, servicios y la agenda de citas desde un panel administrativo centralizado.

## Tabla de Contenidos

- [Stack Tecnológico](##-stack-tecnológico)
- [Arquitectura](##-arquitectura)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
- [Variables de Entorno](#-variables-de-entorno)
- [Módulos Funcionales](#-módulos-funcionales)
- [Roles y Permisos](#-roles-y-permisos)
- [Autenticación](#-autenticación)
- [Scripts Disponibles](#-scripts-disponibles)
- [Convenciones de Código](#-convenciones-de-código)
- [Roadmap](#-roadmap)

## Stack Tecnológico

**Frontend**
- React 19 + Vite
- Tailwind CSS 4
- React Icons (`react-icons/lu` - Lucide)
- Axios
- React Big Calendar (módulo de Agenda)

**Backend**
- Node.js + Express 5
- Sequelize ORM
- MySQL 8.0
- JWT (`jsonwebtoken`) con doble token (access + refresh)
- Cookies HTTPOnly (`cookie-parser`)
- Bcrypt para hash de contraseñas
- CORS configurado para el frontend en desarrollo

**Infraestructura**
- Docker & Docker Compose (servicios `db`, `backend`, `frontend`)
- Nodemon para hot-reload en desarrollo

## Arquitectura

Arquitectura cliente-servidor desacoplada:

```
┌─────────────┐        HTTP/REST        ┌─────────────┐        Sequelize        ┌─────────────┐
│  Frontend   │  ───────────────────▶   │   Backend   │  ───────────────────▶   │    MySQL    │
│ React+Vite  │  ◀───────────────────   │  Express    │  ◀───────────────────   │   (Docker)  │
└─────────────┘   Cookies HTTPOnly      └─────────────┘                         └─────────────┘
```

- El frontend consume la API a través de `frontend/src/services/api.js` (Axios con `withCredentials: true`).
- En desarrollo, Vite hace proxy de `/api` hacia el contenedor `backend` (ver `vite.config.js`).
- La base de datos usa nombres de columna físicos en `snake_case`, mapeados explícitamente a camelCase en los modelos de Sequelize.

## Estructura del Proyecto

```
skinclinic-platform/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuración de Sequelize / conexión a MySQL
│   │   ├── controllers/    # Lógica de negocio por módulo
│   │   ├── middlewares/    # Autenticación y autorización (JWT, roles)
│   │   ├── models/         # Modelos Sequelize
│   │   ├── routes/         # Definición de endpoints REST
│   │   └── seeders/        # Scripts de seed (ej. usuario administrador inicial)
│   ├── index.js            # Punto de entrada del servidor
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/          # Vistas principales (Dashboard, Agenda, Clientes, etc.)
│   │   ├── components/     # Componentes reutilizables y modales
│   │   ├── context/        # Contextos de React (AuthContext)
│   │   ├── constants/      # Constantes compartidas (estados de citas, etc.)
│   │   └── services/       # Cliente Axios (api.js)
│   └── Dockerfile
├── init.sql                # Esquema completo de la base de datos (no versionado en git)
├── docker-compose.yml
```

## Requisitos Previos

- [Docker](https://www.docker.com/) y Docker Compose instalados
- Node.js 20+ (solo si deseas correr los servicios fuera de Docker)
- Un archivo `init.sql` válido con el esquema de la base de datos en la raíz del proyecto

## Instalación y Puesta en Marcha

### Con Docker (recomendado)

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd skinclinic-platform

# Levantar todos los servicios (db, backend, frontend)
docker compose up --build
```

Esto levantará:

| Servicio  | Puerto  | Descripción                          |
|-----------|---------|---------------------------------------|
| `db`      | 3306    | MySQL 8.0                             |
| `backend` | 5000    | API REST con Express                  |
| `frontend`| 5173    | Aplicación React servida con Vite     |

La base de datos se inicializa automáticamente con el archivo `init.sql` montado en `/docker-entrypoint-initdb.d/`.

### Sin Docker (desarrollo local)

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

>  Si corres el backend fuera de Docker, deberás tener una instancia de MySQL corriendo localmente y ajustar las variables de entorno correspondientes.

### Crear el administrador inicial

```bash
cd backend
node src/seeders/createAdmin.js
```

## Variables de Entorno

Crea un archivo `.env` dentro de `backend/` con las siguientes variables:

```env
# Base de datos
DB_HOST=db
DB_USER=root
DB_PASSWORD="tu_password"
DB_NAME=clinic_management_db
DB_PORT=3306

# Servidor
PORT=5000
NODE_ENV=development

# JWT
JWT_ACCESS_SECRET=tu_secreto_access_token
JWT_REFRESH_SECRET=tu_secreto_refresh_token
```

En `frontend/`, si necesitas apuntar a una API distinta al proxy por defecto:

```env
VITE_API_URL=http://localhost:5000/api
```

## Módulos Funcionales

- **Autenticación**: login con email/contraseña, cookies HTTPOnly, cambio de contraseña obligatorio en primer acceso.
- **Dashboard**: panel principal con vista diferenciada por rol.
- **Gestión de Colaboradores**: alta, edición, baja lógica y reactivación de empleados (solo Administrador).
- **Directorio de Clientes**: CRUD de clientes con datos de contacto, contacto de emergencia y seguro médico.
- **Agenda**: calendario de citas (`react-big-calendar`) con detección de conflictos de horario por colaborador y opción de forzar reserva (solo Administrador).
- **Catálogo de Servicios**: gestión de servicios por marca (`Marca 1` / `Marca 2`), precios regulares/promocionales e inclusiones.

## Roles y Permisos

El sistema maneja dos roles:

| Rol             | Permisos                                                                 |
|-----------------|---------------------------------------------------------------------------|
| `Administrador` | Acceso total: gestión de colaboradores, clientes, servicios, citas e ingresos |
| `Colaborador`    | Acceso de solo lectura/operación limitada a su propia agenda y consulta de directorio |

La autorización se valida en el backend mediante el middleware `restrictTo(...roles)`.

## Autenticación

- **Access Token**: JWT de corta duración (15 min), almacenado en cookie HTTPOnly.
- **Refresh Token**: JWT de larga duración (8 h), almacenado en cookie HTTPOnly independiente.
- El interceptor de Axios (`frontend/src/services/api.js`) renueva automáticamente el access token ante un `401` llamando a `/auth/refresh`.
- Las contraseñas se almacenan con `bcrypt` (hooks de Sequelize en el modelo `User`).

## Scripts Disponibles

**Backend** (`backend/package.json`)

```bash
npm run dev     # Levanta el servidor con nodemon
```

**Frontend** (`frontend/package.json`)

```bash
npm run dev       # Servidor de desarrollo Vite
npm run build     # Build de producción
npm run preview   # Previsualiza el build
npm run lint      # Linting con ESLint
```

## Convenciones de Código

- Las columnas físicas de la base de datos usan `snake_case` (`customer_id`, `created_at`, `is_active`) y se mapean explícitamente a camelCase en los modelos Sequelize mediante la propiedad `field`.
- No se deben renombrar columnas SQL existentes al modificar modelos.
- Las clases de Tailwind ya definidas deben conservarse para mantener la consistencia visual del Dashboard.
- Los modales viven en `frontend/src/components/` y limpian su estado con `useEffect` al cambiar `isOpen`.
- Código limpio y modular, evitando comentarios redundantes.

## Roadmap

- [ ] Alertas de UI con SweetAlert2 (SWAL)
- [ ] Estado global con Zustand donde aplique
- [ ] Cache con Redis
- [ ] Protección adicional contra CSRF, inyección SQL/código y ataques DDoS
- [ ] Suite de testing con Cypress (E2E) y pruebas unitarias/integración
- [ ] Documentación de API con Swagger
- [ ] Módulo de Ingresos y reportes financieros

---

**Skinclinic** — Sistema interno de gestión clínica.
