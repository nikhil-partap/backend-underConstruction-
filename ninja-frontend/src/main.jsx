// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Router layout
import RootLayout from "./router/Router.jsx";

// Pages / route components
import DefaultFirstPage from "./components/NinjaFinding/Find.jsx";
import App from './App.jsx'
import NinjaResults from "./components/NinjaResults.jsx";
import Login from "./components/LoginPage/Login.jsx";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<App /> } />
      <Route path="result" element={<NinjaResults />} />
      <Route path="login" element={<Login />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
