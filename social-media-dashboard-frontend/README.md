# Frontend Notes

The main project documentation lives in the root [README](../README.md).

This folder contains the React application for:

- authentication
- dashboard metrics
- post management
- analytics
- scheduling

Useful commands:

```powershell
npm install
npm run dev
npm run build
npm run preview
```

Local defaults:

- frontend: `http://localhost:3000`
- backend: `http://localhost:5000`

The frontend uses Vite and proxies `/api` to the backend in development.

Supported API env vars:

- `VITE_API_URL`
- `REACT_APP_API_URL`
