<div align="center">
  <img src="logo-512.png" alt="TaskForge logo" width="88" />

  # TaskForge

  TaskForge is a modern team task and project management platform that empowers teams to organize projects, assign collaborators, track task progress, and stay aligned through role-based project membership, a visual Kanban board, secure token-based authentication, and a fully documented REST API.
</div>

<br/>

<div align="center">
  <img src="https://github.com/user-attachments/assets/09989800-f7ac-41b7-af1a-5d9ec2567c39" alt="Login screen" width="270" />
  <img src="https://github.com/user-attachments/assets/b63d3f79-5834-4ef2-93b6-e02f2b5d6475" alt="Project dashboard" width="270" />
  <img src="https://github.com/user-attachments/assets/500420b9-5dd4-43fc-9301-314519e6a19f" alt="Kanban task board" width="270" />
</div>
<br/>

<div align="center">

![PHP](https://img.shields.io/badge/PHP-8.2-777BB4?style=flat-square&logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)

</div>

---

## Live demo

- **App:** https://task-forge-wheat-one.vercel.app
- **API:** https://taskforge-api-maev.onrender.com

> The backend runs on Render's free tier, which spins down after inactivity — the first request after idle time may take 30–50 seconds to respond.

---

## Why this project

TaskForge was built as a small, production-shaped project management tool rather than a toy demo. The goal wasn't to add every possible feature, but to build the core workflow — projects, tasks, ownership, and collaboration — the way it would actually be built at a real company: a documented REST API, an authenticated single-page frontend, automated tests, CI on every push, and two independently deployed services.

---

## What's included (v1)

- **Authentication** — register, login, logout via Laravel Sanctum token auth
- **Projects** — create, view, update, delete, scoped to what you own or belong to
- **Tasks** — create, update, delete, with status, description, due date, and assignee
- **Kanban board** — three status columns (To do / In progress / Done) with live status updates
- **Team collaboration** — project owners can invite members by email, view them, and remove them
- **Authorization** — ownership and membership enforced server-side via Laravel Policies, not just hidden in the UI
- **Responsive design** — full mobile support, including a collapsible sidebar drawer and a stacked board layout on small screens
- **Automated tests** — feature tests covering auth, project ownership, and task authorization
- **CI/CD** — GitHub Actions runs backend and frontend checks on every push; both services auto-deploy on merge to `main`

---

## Planned for v2

- Task comments and activity history
- Email notifications for assignments and due dates
- File attachments on tasks
- Drag-and-drop status changes on the board
- Role-based permissions beyond owner/member (e.g. admin, viewer)
- Real-time updates via WebSockets instead of manual refresh

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Laravel 12 (PHP 8.2), Sanctum |
| Frontend | React 19, Vite, React Router, Tailwind CSS 4 |
| Database | PostgreSQL |
| Deployment | Render (Docker, backend) + Vercel (frontend) |
| CI | GitHub Actions |

---

## Architecture

TaskForge is a monorepo with a decoupled backend and frontend, communicating entirely over a REST API:

taskforge/
├── api/ Laravel REST API (Sanctum auth, Postgres, Docker deploy → Render)
└── web/ React SPA (Vite, Tailwind, deploy → Vercel)


The backend has no server-rendered views — it exists purely to serve JSON. The frontend holds its auth token in local storage and attaches it to every request via an Axios interceptor. Authorization (who can view/edit/delete a project or task) is enforced in Laravel Policy classes on the server, not just hidden in the UI, so the rules hold even if someone calls the API directly.

---

## Getting started locally

### Prerequisites

- PHP 8.2+, Composer
- Node.js 20+
- PostgreSQL

### Backend

```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
# set DB_CONNECTION=pgsql and your database credentials in .env
php artisan migrate
php artisan serve
```

### Frontend

```bash
cd web
npm install
# create .env with: VITE_API_URL=http://127.0.0.1:8000
npm run dev
```

### Running tests

```bash
cd api
php artisan test
```

---

## API overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Create an account |
| POST | `/api/login` | Authenticate, receive a token |
| POST | `/api/logout` | Revoke the current token |
| GET | `/api/me` | Get the authenticated user |
| GET/POST | `/api/projects` | List / create projects |
| GET/PUT/DELETE | `/api/projects/{id}` | View / update / delete a project |
| POST | `/api/projects/{id}/members` | Invite a member by email |
| DELETE | `/api/projects/{id}/members/{userId}` | Remove a member |
| GET/POST | `/api/projects/{id}/tasks` | List / create tasks |
| PUT/DELETE | `/api/projects/{id}/tasks/{taskId}` | Update / delete a task |

All routes except register/login require a `Bearer` token in the `Authorization` header.

---

## License

Open source under the [MIT License](LICENSE) — free to use, modify, and build on.


