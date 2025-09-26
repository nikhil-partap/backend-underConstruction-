// src/Router.jsx
import React from "react";
import {Outlet, NavLink} from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-gray-600">
      {/* simple nav — keep it small, you can expand later */}
      <nav className="p-4 flex gap-4">
        <NavLink to="/" end className="text-white">
          Home
        </NavLink>
        <NavLink to="/signup" className="text-white">
          SignUp
        </NavLink>
        <NavLink to="/login" className="text-white">
          Login
        </NavLink>
      </nav>

      {/* Where child routes render */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
