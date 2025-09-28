// src/main.jsx
import React from "react";
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
// import ReactDOM from "react-dom/client";

// Router layout
import RootLayout from "./router/Router.jsx";
import App from "./App.jsx";
import Login from "./components/LoginPage/Login.jsx";
import Signup from "./components/signup/SignUp.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ResultsPage from "./components/ResultsPage.jsx";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<App />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="result" element={<ResultsPage />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
