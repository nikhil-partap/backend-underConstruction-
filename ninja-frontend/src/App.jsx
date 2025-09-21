import React, {useState} from "react";

export default function ClosestNinjaBox() {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleGetCoords = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(String(pos.coords.latitude));
        setLng(String(pos.coords.longitude));
      },
      () => alert("Location permission denied")
    );
  };
  const handleSearch = async () => {
    // basic validation
    if (!lat || !lng) {
      setError("Please enter both latitude and longitude.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Example endpoint: replace with your real API URL
      // Query params are common for simple GET endpoints
      const url = `http://localhost:4000/api/ninjas/?lat=${encodeURIComponent(
        lat
      )}&lng=${encodeURIComponent(lng)}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        // optional: parse server error body
        const text = await res.text();
        throw new Error(text || `Request failed with ${res.status}`);
      }

      const data = await res.json(); // e.g. { name, distance_km, coords: {lat,lng} }
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
    <div
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{backgroundImage: "url('img/bg/O9FG4W0.jpg')"}}
    >
      {/* dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/70 p-6 shadow-2xl backdrop-blur-md">
          {/* header */}
          <h1 className="mb-1 text-center text-lg font-bold text-gray-900">
            Find the Closest Ninja
          </h1>
          <p className="mb-6 text-center text-sm text-gray-700">
            Enter coordinates or use your device location
          </p>

          {/* latitude */}
          <label className="mb-4 block">
            <span className="mb-1 block text-sm font-medium text-gray-800">
              Latitude
            </span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="e.g. 28.6139"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
          </label>

          {/* longitude */}
          <label className="mb-6 block">
            <span className="mb-1 block text-sm font-medium text-gray-800">
              Longitude
            </span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="e.g. 77.2090"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
          </label>

          {/* actions */}
          <div className="flex flex-col gap-3">
            <button
              disabled={!canSearch || loading}
              onClick={handleSearch}
              className={`w-full rounded-lg px-4 py-2 text-sm font-semibold text-white shadow transition-colors
                ${
                  canSearch && !loading
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-indigo-300 cursor-not-allowed"
                }`}
            >
              {loading ? "Searching..." : "Search"}
            </button>

            <button
              onClick={handleGetCoords}
              type="button"
              className="w-full rounded-lg border px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors"
            >
              Get My Coordinates
            </button>
          </div>

          {/* helper */}
          {error && (
            <p className="mt-4 text-center text-sm text-red-500">{error}</p>
          )}
          {result && (
            <div className="mt-4 rounded-lg bg-gray-100 p-3 text-sm text-gray-800">
              Closest Ninja: <b>{result.item.name}</b> (
              {result.item.distance_km} {result.unit} {result.item.availability}{" "}
              {result.item.rank})
            </div>
          )}
          <p className="mt-4 text-center text-xs text-gray-600">
            Tip: Allow location permission for quick autofill.
          </p>
        </div>
      </div>
    </div>
  );
}
