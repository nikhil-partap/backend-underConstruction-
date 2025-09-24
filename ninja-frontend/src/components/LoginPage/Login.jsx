import React, {useState} from "react";
import {useMediaQuery} from "../hooks/useMediaQuery";
import {Link, NavLink, useNavigate} from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isMobile = useMediaQuery("(max-width: 767px)");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      //  login API endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      // Handle successful login (store token, redirect, etc.)
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-green-900 via-blue-900 to-gray-600">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Glass morphism card */}
          <div className="relative rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
            {/* Back button */}
            <div className="absolute top-4 left-4">
              <NavLink
                to="/"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200 backdrop-blur-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </NavLink>
            </div>

            {/* Ninja emoji animation */}
            <div className="mb-6 text-center">
              <div className="inline-block text-6xl animate-bounce">🥷</div>
            </div>

            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold text-white bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Welcome Back, Ninja!
              </h1>
              <p className="text-sm text-purple-200">
                Sign in to access your ninja dashboard
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email field */}
              <div className="relative">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-purple-200">
                    ✉️ Email Address
                  </span>
                  <input
                    type="email"
                    placeholder="ninja@dojo.com"
                    className="w-full rounded-2xl border-0 bg-white/20 px-4 py-3 text-white placeholder:text-purple-300 backdrop-blur-sm transition-all duration-300 focus:bg-white/30 focus:ring-2 focus:ring-purple-400 focus:ring-offset-0"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
              </div>

              {/* Password field */}
              <div className="relative">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-purple-200">
                    🔒 Password
                  </span>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your secret ninja password"
                      className="w-full rounded-2xl border-0 bg-white/20 px-4 py-3 pr-12 text-white placeholder:text-purple-300 backdrop-blur-sm transition-all duration-300 focus:bg-white/30 focus:ring-2 focus:ring-purple-400 focus:ring-offset-0"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </label>
              </div>

              {/* Forgot password link */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-purple-300 hover:text-white transition-colors"
                >
                  Forgot your ninja secrets? 🤔
                </Link>
              </div>

              {/* Error display */}
              {error && (
                <div className="rounded-2xl bg-red-500/20 border border-red-400/50 p-4 backdrop-blur-sm animate-fadeIn">
                  <p className="text-center text-sm text-red-200 flex items-center justify-center">
                    <span className="mr-2">⚠️</span>
                    {error}
                  </p>
                </div>
              )}

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full overflow-hidden rounded-2xl px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-purple-500/25"
                }`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Entering the dojo...
                    </>
                  ) : (
                    <>🚀 Enter the Dojo</>
                  )}
                </span>
                {!loading && (
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
                )}
              </button>

              {/* Social login options */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/10 text-purple-200 backdrop-blur-sm rounded-full">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium transition-all duration-200 backdrop-blur-sm"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium transition-all duration-200 backdrop-blur-sm"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                  Twitter
                </button>
              </div>
            </form>

            {/* Sign up link */}
            <div className="mt-8 text-center">
              <p className="text-purple-200">
                New to the dojo?{" "}
                <NavLink
                  to="/signup"
                  className="text-white font-semibold hover:text-purple-300 transition-colors"
                >
                  Join the ninja clan! 🥋
                </NavLink>
              </p>
            </div>

            {/* Footer tip */}
            <div className="mt-6 text-center">
              <p className="text-xs text-purple-300 flex items-center justify-center">
                <span className="mr-1">🔐</span>
                Your ninja secrets are safe with us
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="mt-8 text-center">
            <div className="inline-flex space-x-2 text-2xl animate-pulse"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
