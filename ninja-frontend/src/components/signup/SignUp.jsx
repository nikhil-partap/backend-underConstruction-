// src/components/signup/SignUp.jsx
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [formData, setFormData] = useState({name: "", email: "", password: ""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {name, email, password} = formData;
    if (!name || !email || !password) {
      const msg = "name, email and password are required";
      // setError(msg)  // for inline error msg dont use both the toast and setError together it will give same error in two different places
      toast.error(msg);
      return;
    }

    setLoading(true);

    setError("");
    // makeing payload available to catch block
    let payload = {};

    try {
      const res = await fetch("/auth/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData),
      });

      // Defensive parse — try JSON, fallback to text
      try {
        payload = await res.json();
      } catch {
        // not JSON — try text
        try {
          const text = await res.text();
          payload = {message: text};
        } catch {
          payload = {};
        }
      }

      if (!res.ok) {
        const serverMsg =
          payload?.error?.details?.[0]?.message || // Joi shape
          payload?.error?.[0]?.message || // legacy shape
          payload?.message ||
          "Signup failed";

        // toast.error(errorMsg); // ✅ Show in toast (i am already giving the error in the catch block no need to give the error here or else it will be repeated two time)

        throw new Error(serverMsg);
      }

      // Success path
      if (payload.token) {
        localStorage.setItem("token", payload.token);
        // backend returns payload.user?.name — prefer that if present
        localStorage.setItem(
          "loggedInUser",
          payload.user?.name || payload.name || ""
        );
      }

      toast.success(payload.message || "Signup successful!");

      // give user a brief moment to see the toast
      setTimeout(() => {
        navigate("/dashboard"); // change to /result if you prefer
      }, 800);

      // all the error in the catch block
    } catch (err) {
      const msg =
        payload?.error?.details?.[0]?.message ||
        payload?.error?.[0]?.message ||
        payload?.message ||
        err?.message ||
        "Signup failed. Please try again.";
      // setError(msg); // optional inline error
      toast.error(msg);

      // console.log("signup error", { msg, err, payload });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative min-h-screen w-full bg-gradient-to-br from-green-900 via-blue-900 to-gray-600">
        {/* Floating blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Card */}
        <div className="relative flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="relative rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl overflow-hidden">
              <div className="p-8">
                {/* Header */}
                <div className="mb-6 text-center">
                  <div className="inline-block text-6xl">⚔️</div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Join the Brotherhood
                </h2>
                <p className="text-center text-purple-200 text-sm mb-8">
                  Sign up to start your ninja journey
                </p>

                {/* Inline error (optional) */}
                {error && (
                  <div className="mb-4 rounded-2xl bg-red-500/20 border border-red-400/50 p-4 backdrop-blur-sm">
                    <p className="text-center text-sm text-red-200">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm text-purple-200 mb-1">
                      🧑 Name
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full rounded-2xl border-0 bg-white/20 px-4 py-3 text-white placeholder:text-purple-300 backdrop-blur-sm transition-all duration-300 focus:bg-white/30 focus:ring-2 focus:ring-purple-400"
                      // required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm text-purple-200 mb-1">
                      📧 Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full rounded-2xl border-0 bg-white/20 px-4 py-3 text-white placeholder:text-purple-300 backdrop-blur-sm transition-all duration-300 focus:bg-white/30 focus:ring-2 focus:ring-purple-400"
                      // required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm text-purple-200 mb-1">
                      🔑 Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border-0 bg-white/20 px-4 py-3 text-white placeholder:text-purple-300 backdrop-blur-sm transition-all duration-300 focus:bg-white/30 focus:ring-2 focus:ring-purple-400"
                      // required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full group relative overflow-hidden rounded-2xl px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 transform hover:scale-105 ${
                      loading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600"
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Signing up...
                      </div>
                    ) : (
                      "⚔️ Sign Up"
                    )}
                  </button>
                </form>

                {/* Footer */}
                <p className="text-center text-purple-200 text-sm mt-6">
                  Already a ninja?{" "}
                  <a
                    href="/login"
                    className="text-blue-400 hover:underline hover:text-blue-300 transition"
                  >
                    Login
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Animations */}
        <style jsx>{`
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

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
