# Frontend - Admin Panel

This is the React + Vite frontend for the Admin/Counsellor panel.

Features included in this scaffold:
- React + Vite
- Material UI for quick layout
- React Router v6 routes
- Axios API wrapper with JWT header interceptor
- Auth service storing token + role
- Protected route component (role-based)
- Basic pages: Login, Dashboard (KPIs), Users list

Quick start

1. Copy `.env.example` to `.env` and update `VITE_API_BASE` if your backend isn't at the default.

2. Install dependencies:

```powershell
cd "client-platform\frontend-admin"
npm install
```

3. Start dev server:

```powershell
npm run dev
```

Next steps
- Add forms and detailed pages (Reports, Payments, Bookings)
- Connect charts (Recharts) and more UI
- Add client-side validation and error handling

