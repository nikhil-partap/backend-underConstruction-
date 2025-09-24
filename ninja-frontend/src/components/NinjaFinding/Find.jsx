import React, {useState} from "react";
import {Link, NavLink} from "react-router-dom";

export default function DefaultFirstpage() {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleGetCoords = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(String(pos.coords.latitude));
        setLng(String(pos.coords.longitude));
        setLocationLoading(false);
      },
      () => {
        alert("Location permission denied");
        setLocationLoading(false);
      }
    );
  };

  const handleSearch = async () => {
    if (!lat || !lng) {
      setError("Please enter both latitude and longitude.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const url = `/api/ninjas/?lat=${encodeURIComponent(
        lat
      )}&lng=${encodeURIComponent(lng)}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with ${res.status}`);
      }

      const data = await res.json();
      setResult({
        item: data.data?.[0] ?? null,
        unit: data.unit ?? "m",
      });
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const canSearch = lat !== "" && lng !== "";

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
            {/* Ninja emoji animation */}
            <div className="mb-6 text-center">
              <div className="inline-block text-6xl animate-bounce ">🥷</div>
            </div>

            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-white bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Find the Closest Ninja
              </h1>
              <p className="text-sm text-purple-200">
                Enter coordinates or use your device location
              </p>
            </div>

            {/* Input fields */}
            <div className="space-y-4 mb-6">
              {/* Latitude */}
              <div className="relative">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-purple-200">
                    📍 Latitude
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 28.6139"
                    className="w-full rounded-2xl border-0 bg-white/20 px-4 py-3 text-white placeholder:text-purple-300 backdrop-blur-sm transition-all duration-300 focus:bg-white/30 focus:ring-2 focus:ring-purple-400 focus:ring-offset-0"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                  />
                </label>
              </div>

              {/* Longitude */}
              <div className="relative">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-purple-200">
                    🌐 Longitude
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 77.2090"
                    className="w-full rounded-2xl border-0 bg-white/20 px-4 py-3 text-white placeholder:text-purple-300 backdrop-blur-sm transition-all duration-300 focus:bg-white/30 focus:ring-2 focus:ring-purple-400 focus:ring-offset-0"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                  />
                </label>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 mb-6">
              <button
                disabled={!canSearch || loading}
                onClick={handleSearch}
                className={`group relative w-full overflow-hidden rounded-2xl px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  canSearch && !loading
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-purple-500/25"
                    : "bg-gray-600 cursor-not-allowed opacity-50"
                }`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Searching for ninja...
                    </>
                  ) : (
                    <>🔍 Search for Ninja</>
                  )}
                </span>
                {!loading && canSearch && (
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
                )}
              </button>
              <button
                onClick={handleGetCoords}
                disabled={locationLoading}
                className="group w-full rounded-2xl border-2 border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/50 transform hover:scale-105"
              >
                <span className="flex items-center justify-center">
                  {locationLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Getting location...
                    </>
                  ) : (
                    <>📱 Get My Location</>
                  )}
                </span>
              </button>
              <NavLink to="/result"> to the NinjaResults</NavLink>
            </div>

            {/* Error display */}
            {error && (
              <div className="mb-4 rounded-2xl bg-red-500/20 border border-red-400/50 p-4 backdrop-blur-sm animate-fadeIn">
                <p className="text-center text-sm text-red-200 flex items-center justify-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            {/* Result display */}
            {result && result.item && (
              <div className="mb-4 rounded-2xl bg-green-500/20 border border-green-400/50 p-6 backdrop-blur-sm animate-fadeIn">
                <div className="text-center">
                  <div className="mb-3 text-3xl">🎯</div>
                  <h3 className="mb-2 text-lg font-bold text-green-200">
                    Ninja Found!
                  </h3>
                  <div className="space-y-2 text-sm text-green-100">
                    <div className="flex items-center justify-center">
                      <span className="mr-2">👤</span>
                      <span className="font-semibold">{result.item.name}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="mr-2">📏</span>
                      <span>
                        {result.item.distance} {result.unit} away
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="mr-2">🏆</span>
                      <span>{result.item.rank}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="mr-2">
                        {result.item.availability ? "✅" : "❌"}
                      </span>
                      <span>
                        {result.item.availability ? "Available" : "Busy"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result && !result.item && (
              <div className="mb-4 rounded-2xl bg-yellow-500/20 border border-yellow-400/50 p-4 backdrop-blur-sm animate-fadeIn">
                <p className="text-center text-sm text-yellow-200 flex items-center justify-center">
                  <span className="mr-2">🤷‍♂️</span>
                  No ninjas found in your area
                </p>
              </div>
            )}

            {/* Footer tip */}
            <div className="text-center">
              <p className="text-xs text-purple-300 flex items-center justify-center">
                <span className="mr-1">💡</span>
                Allow location permission for quick autofill
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="mt-8 text-center">
            <div className="inline-flex space-x-2 text-2xl animate-pulse"></div>
          </div>
        </div>
      </div>

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
  );
}
