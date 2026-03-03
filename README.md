# English FlashCards

Aplicación web de tarjetas de vocabulario B2 en inglés con 110 palabras, pronunciación nativa con Web Speech API, autenticación de usuarios, y persistencia de progreso por usuario en Redis.

## Arquitectura

```
Browser → nginx (:3000)
              ├── /          → archivos estáticos (React SPA)
              └── /api/*     → Express API (:4000) → Redis (:6379)
```

**3 servicios Docker:**
- **frontend** — nginx sirve la SPA y hace proxy de `/api/` al backend
- **api** — Express + TypeScript, autenticación JWT, bcrypt para passwords
- **redis** — almacena usuarios y progreso, con persistencia AOF

## Requisitos

- Docker >= 20.10
- Docker Compose >= 2.0

## Levantar con Docker Compose

```bash
cd FlashCards

# Construir y levantar
docker compose up --build -d

# Abrir en el navegador
open http://localhost:3000
```

La app estará disponible en **http://localhost:3000**.

## Variables de entorno

| Variable      | Default                     | Descripción                          |
|---------------|-----------------------------|--------------------------------------|
| `JWT_SECRET`  | `super-secret-change-me`    | Secreto para firmar tokens JWT       |
| `REDIS_URL`   | `redis://redis:6379`        | URL de conexión a Redis              |
| `PORT`        | `4000`                      | Puerto del backend API               |

Para producción, configura `JWT_SECRET` con un valor seguro:

```bash
JWT_SECRET=$(openssl rand -hex 32) docker compose up --build -d
```

## Comandos Docker útiles

```bash
# Construir las imágenes
docker compose build

# Levantar en segundo plano
docker compose up -d

# Ver logs de todos los servicios
docker compose logs -f

# Ver logs solo del backend
docker compose logs -f api

# Detener
docker compose down

# Detener y borrar datos de Redis
docker compose down -v

# Reconstruir desde cero (sin cache)
docker compose build --no-cache
```

## Desarrollo local (sin Docker)

```bash
# Terminal 1 — Redis (necesitas tenerlo instalado o usar Docker)
docker run -d -p 6379:6379 redis:7-alpine

# Terminal 2 — Backend API
cd server
npm install
npm run dev

# Terminal 3 — Frontend (con proxy a API)
npm install
npm run dev
# Abrir http://localhost:5173
```

## Funcionalidades

- **Autenticación** — Registro y login con bcrypt + JWT
- **Progreso por usuario** — Cada usuario tiene su propio progreso almacenado en Redis
- **110 palabras B2** — Phrasal verbs, adjetivos, verbos, sustantivos, adverbios
- **Tarjetas con flip** — Animación 3D al tocar/clic
- **Pronunciación nativa** — Botón de audio con Web Speech API (voz en-US/en-GB)
- **Past & Past Participle** — Conjugación con pronunciación IPA y audio para verbos
- **6 ejemplos por tarjeta** — Cada ejemplo con botón de audio individual
- **Modo Repaso** — Filtra solo tarjetas marcadas como "Aprendiendo"
- **Quiz Conocidas** — Repasa las tarjetas conocidas más antiguas
- **Filtro por categoría** — Phrasal Verb, Adjective, Verb, Noun, Adverb, Noun/Verb
- **Shuffle** — Orden aleatorio de tarjetas
- **Vista lista** — Ver todas las 110 palabras en grilla

## Estructura del proyecto

```
server/                          # Backend API
  src/
    config.ts                    # Variables de entorno
    index.ts                     # Express entry point
    middleware/
      auth.ts                    # JWT verification middleware
    repositories/
      interfaces.ts              # IUserRepository, IProgressRepository
      redis/
        client.ts                # ioredis singleton
        userRepository.ts        # Redis: user CRUD
        progressRepository.ts    # Redis: per-user progress
    routes/
      auth.ts                    # /api/auth (register, login, me)
      progress.ts                # /api/progress (get, save)
    services/
      auth.ts                    # bcrypt + JWT utilities
  Dockerfile

src/                             # Frontend React SPA
  contexts/
    AuthContext.tsx               # Auth state, login/register/logout
  services/
    api.ts                       # Fetch wrapper con JWT header
  hooks/
    useServerProgress.ts         # Progreso sincronizado con API
  components/
    AuthPage.tsx                 # Login / Register form
    FlashCard.tsx                # Tarjeta con flip
    CardList.tsx                 # Vista de lista/grilla
    CategoryFilter.tsx           # Filtros por categoría
    ProgressBar.tsx              # Barra de progreso
    Controls.tsx                 # Botones de navegación
    ReviewBanner.tsx             # Banner modo repaso
    AudioButton.tsx              # Botón de pronunciación
  data/
    types.ts                     # Tipos TypeScript (Word, Category)
    phrasal-verbs.ts             # 28 phrasal verbs
    adjectives.ts                # 15 adjetivos
    verbs.ts                     # 20 verbos
    nouns.ts                     # 15 sustantivos
    adverbs.ts                   # 10 adverbios
    misc.ts                      # 22 palabras mixtas
    index.ts                     # Agregador de datos
  App.tsx                        # Componente principal
  main.tsx                       # Entry point
  index.css                      # Estilos globales

docker-compose.yml               # 3 servicios: redis, api, frontend
nginx.conf                       # Proxy /api/ → backend
Dockerfile                       # Frontend build (nginx)
```

## Seguridad

- Contraseñas hasheadas con **bcrypt** (salt rounds = 10)
- Tokens **JWT** firmados con secreto configurable (expiran en 7 días)
- Rutas `/api/progress` protegidas por middleware de autenticación
- Redis **no expuesto externamente** (solo red interna de Docker)
