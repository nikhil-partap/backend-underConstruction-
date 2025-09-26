# Net Ninja — MERN Backend + Vite React Frontend

A simple MERN-style project to find nearby ninjas using MongoDB geospatial queries, with basic authentication and a small React frontend.

### What’s inside

- **Backend**: Express 5, Mongoose 8, JWT, Joi, CORS
- **Database**: MongoDB with geospatial index (2dsphere)
- **Auth**: Signup/Login with validation and JWT
- **Frontend**: Vite + React + React Router

## Project structure

```
net_ninja/
  index.js                     # Express app entry
  database/db.js               # Mongo connection
  models/                      # Mongoose models (ninja, user)
  routes/api.js                # Ninja CRUD + geo search
  routes/AuthRouter.js         # /auth routes (login, signup)
  controllers/                 # Auth controllers
  MiddleWare/AuthValidation.js # Joi validations
  ninja-frontend/              # Vite React app
```

## Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB URI

## Environment

Create a `.env` in the backend root (`net_ninja/`):

```env
PORT=4000
MONGO_URL=mongodb://127.0.0.1:27017/ninjago
JWT_SECRET=replace_this_with_a_strong_secret
```

If `.env` is missing, the backend defaults to `PORT=4000` and `mongodb://127.0.0.1:27017/ninjago`.

## Install & run

### Backend

```bash
cd net_ninja
npm install
npm run dev    # or: npm start
```

Server starts on `http://localhost:4000`.

### Frontend

```bash
cd ninja-frontend
npm install
npm run dev
```

Frontend dev server (Vite) starts and proxies the SPA; open the printed URL.

## API overview

Base URL: `http://localhost:4000/api`

- GET `/ninjas?lng={number}&lat={number}&maxDistance={meters?}&unit=km|m`
  - Geospatial search near `lng,lat` using `$geoNear`
  - `maxDistance` defaults to a large value; `unit` affects `distanceMultiplier`
- POST `/ninjas`
  - Create a ninja (expects JSON matching `models/ninja.js`)
- PUT `/ninjas/:id`
  - Update a ninja by id (validators enabled)
- DELETE `/ninjas/:id`
  - Delete a ninja by id

Quick test:

```bash
curl "http://localhost:4000/api/ninjas?lng=72.8777&lat=19.0760&maxDistance=100000&unit=km"
```

## Auth routes

Base URL: `http://localhost:4000/auth`

- POST `/signup`
  - Body validated via `signupValidation` (Joi)
  - Controller: `controllers/AuthController.js`
- POST `/login`
  - Body validated via `loginValidation`
  - Controller: `controllers/loginController.js`

Response typically includes token or error details depending on controller implementation.

## Data model notes

- `models/ninja.js` defines a schema with `geometry` as GeoJSON Point
- A 2dsphere index is ensured on startup via `Ninja.init()`

## Frontend routes (Vite React)

`ninja-frontend/src/router/Router.jsx` defines:

- `/` Home
- `/result` Results
- `/login` Login

The frontend calls the backend to search ninjas by your location and displays results.

## Scripts

Backend (in repo root):

- `npm run dev` — start with nodemon
- `npm start` — start with node

Frontend (in `ninja-frontend/`):

- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — preview built app

## Troubleshooting

- Ensure MongoDB is running and reachable at `MONGO_URL`
- If geospatial search returns 0 results, verify ninjas exist and that `geometry` is valid GeoJSON with correct `[lng, lat]`
- Check terminal logs for index creation messages ("Indexes ensured") and DB connection status

## License

ISC
