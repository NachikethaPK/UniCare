# UniCare

## Run frontend

`cd frontend && npm install && npm run dev`

Copy `frontend/.env.example` to `frontend/.env` before production deployment.

## Run backend

`cd server && npm install && npm run dev`

Copy `server/.env.example` to `server/.env`, then provide MongoDB Atlas credentials and a JWT secret.

## Production

Build the frontend with `cd frontend && npm run build`. Deploy `frontend/dist` to a static host and deploy `server` to a Node host. Set `VITE_API_URL`, `MONGODB_URI`, and `JWT_SECRET` in the respective deployment environments.
