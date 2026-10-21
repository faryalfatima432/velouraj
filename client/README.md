# React + Vite

## API configuration

For local development, run the API on `http://localhost:5000`. Vite proxies
`/api` requests to that server, so `VITE_API_URL` is optional. To use a
different API locally, copy `.env.example` to `.env.local` and set
`VITE_API_URL` to the API origin (without `/api`).

For Vercel, set `VITE_API_URL` in the project's environment variables to
`https://velouraj-backend.vercel.app` (without `/api`), then redeploy. The API
allows `https://velouraj.vercel.app`; if you use a different frontend domain,
set that exact origin as the backend's `CLIENT_URL` and redeploy the API.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
