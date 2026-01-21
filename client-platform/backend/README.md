# Client Platform Backend (Auth + Dashboard scaffold)

This is a minimal scaffold for the Client Operations Platform backend.

Quick start (Windows PowerShell):

1. Copy `.env.example` to `.env` and fill `MONGO_URI` and `JWT_SECRET`.

Optional (connect to your separate user-website database):
- Set `USER_MONGO_URI` in `.env`. This enables the admin-only External DB browser APIs.

2. Install deps and run:

```powershell
npm install
npm run dev
```

3. Create initial users:

```powershell
node seed.js
```

Default seeded credentials:
- admin@clientdomain.com / AdminPass123!
- counsellor@clientdomain.com / CounselorPass123!

APIs:
- POST /api/auth/login { email, password }
- GET /api/admin/dashboard (requires admin JWT)
- GET /api/counsellor/dashboard (requires counsellor JWT)
- GET /api/external-db/collections (requires admin JWT)
- GET /api/external-db/collections/:collectionName?page=1&limit=25&q=search (requires admin JWT)

Notes:
- This scaffold focuses on authentication, role middleware, and basic dashboard endpoints.
- Next steps: implement remaining models, controllers, UI, and full features.
