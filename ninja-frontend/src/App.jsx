import React, {useState} from "react";
import {useMediaQuery} from "./components/hooks/useMediaQuery";
import {Link, NavLink} from "react-router-dom";

// Separate component for displaying ninja results
const NinjaResults = ({ninjas, unit}) => {
  const getRankEmoji = (rank) => {
    const rankMap = {
      "black belt": "🥋",
      "red belt": "🔴",
      "blue belt": "🔵", 
      "yellow belt": "🟡",
      "green belt": "🟢",
      "pink belt": "🩷",
      "white belt": "⚪",
      "brown belt": "🟤",
      "purple belt": "🟣",
      "orange belt": "🟠",
    };
    return rankMap[rank?.toLowerCase()] || "🥋";
  };

  const formatDistance = (distance, unit) => {
    if (unit === "km") {
      return `${(distance / 1000).toFixed(2)} km`;
    }
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(2)} km`;
    }
    return `${Math.round(distance)} m`;
  };

  return (
    <div className="mb-6 space-y-3 animate-fadeIn">
      <div className="text-center mb-4">
        <div className="mb-2 text-3xl">🎯</div>
        <h3 className="text-lg font-bold text-green-200">
          Top {ninjas.length} Ninjas Found!
        </h3>
      </div>

      {ninjas.map((ninja, index) => (
        <div
          key={ninja._id}
          className={`relative rounded-2xl border p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
            index === 0
              ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-400/50"
              : index === 1
              ? "bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/50"
              : "bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-400/50"
          }`}
        >
          {/* Rank badge */}
          <div className="absolute -top-2 -right-2">
            <div
              className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold ${
                index === 0
                  ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black"
                  : index === 1
                  ? "bg-gradient-to-r from-gray-300 to-slate-400 text-black"
                  : "bg-gradient-to-r from-orange-400 to-red-500 text-white"
              }`}
            >
              {index + 1}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">🥷</span>
                <div>
                  <h4 className="font-bold text-white text-lg">{ninja.name}</h4>
                  <div className="flex items-center text-sm text-purple-200">
                    <span className="mr-1">{getRankEmoji(ninja.rank)}</span>
                    <span className="capitalize">{ninja.rank}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-purple-200">
                  <span className="mr-1">📏</span>
                  <span>{formatDistance(ninja.distance, unit)} away</span>
                </div>

                <div className="flex items-center">
                  <span className="mr-1">
                    {ninja.availability ? "✅" : "❌"}
                  </span>
                  <span
                    className={
                      ninja.availability ? "text-green-300" : "text-red-300"
                    }
                  >
                    {ninja.availability ? "Available" : "Busy"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Coordinates info */}
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="text-xs text-purple-300 flex items-center">
              <span className="mr-1">📍</span>
              <span>
                {ninja.geometry.coordinates[1].toFixed(4)},{" "}
                {ninja.geometry.coordinates[0].toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ClosestNinjaBox() {
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

      // Get top 3 ninjas from the data
      const topNinjas = data.data?.slice(0, 3) || [];

      setResult({
        ninjas: topNinjas,
        unit: data.unit ?? "m",
        count: data.count || 0,
      });
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const canSearch = lat !== "" && lng !== "";
  const isMobile = useMediaQuery("(max-width: 767px)");

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
          {/* Combined Glass morphism card */}
          <div className="relative rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl overflow-hidden">
            
            {/* Main ninja finder section */}
            <div className="p-8">
              {/* Ninja emoji animation */}
              <div className="mb-6 text-center">
                <div className="inline-block text-6xl ">🥷</div>
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

              {/* Results display */}
              {result && result.ninjas && result.ninjas.length > 0 && (
                <NinjaResults ninjas={result.ninjas} unit={result.unit} />
              )}

              {result && (!result.ninjas || result.ninjas.length === 0) && (
                <div className="mb-4 rounded-2xl bg-yellow-500/20 border border-yellow-400/50 p-4 backdrop-blur-sm animate-fadeIn">
                  <p className="text-center text-sm text-yellow-200 flex items-center justify-center">
                    <span className="mr-2">🤷‍♂️</span>
                    No ninjas found in your area
                  </p>
                </div>
              )}

              {/* Footer tip */}
              <div className="text-center mb-6">
                <p className="text-xs text-purple-300 flex items-center justify-center">
                  <span className="mr-1">💡</span>
                  Allow location permission for quick autofill
                </p>
              </div>
            </div>

            {/* Divider with gradient */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent h-px"></div>
              <div className="flex justify-center py-4">
                <div className="bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                  <span className="text-purple-200 text-sm font-medium">⚔️ Join the Brotherhood ⚔️</span>
                </div>
              </div>
            </div>

            {/* Login/Signup section */}
            <div className="p-8 pt-4 bg-gradient-to-b from-transparent to-white/5">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Are you a ninja?
                </h2>
                <p className="text-purple-200 text-sm">Choose your path to get started</p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <NavLink
                  to="/login"
                  className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25 focus:ring-4 focus:ring-blue-300 focus:outline-none transform hover:scale-105 text-center"
                >
                  <span className="flex items-center justify-center">
                     Login
                  </span>
                </NavLink>

                <div className="flex items-center">
                  <div className="hidden sm:block w-8 h-px bg-white/30"></div>
                  <span className="text-purple-200 font-medium px-4 text-sm">or</span>
                  <div className="hidden sm:block w-8 h-px bg-white/30"></div>
                </div>

                <NavLink
                  to="/signup"
                  className="group w-full sm:w-auto bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white hover:text-white font-semibold px-8 py-3 rounded-2xl transition-all duration-300 shadow-lg backdrop-blur-sm focus:ring-4 focus:ring-white/30 focus:outline-none transform hover:scale-105 text-center"
                >
                  <span className="flex items-center justify-center">
                    SignUp
                  </span>
                </NavLink>
              </div>

              {/* Additional call-to-action */}
              <div className="mt-6 text-center">
                <p className="text-xs text-purple-300 flex items-center justify-center">
                  <span className="mr-1">🌟</span>
                  Join thousands of ninjas worldwide
                </p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="mt-6 text-center">
            <div className="inline-flex space-x-1 text-lg opacity-60">
              
            </div>
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
        .animation-delay-1000 {
          animation-delay: 1s;
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
