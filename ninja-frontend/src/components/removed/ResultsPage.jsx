import React, {useEffect, useState} from "react";

export default function ResultsPage() {
  const [data, setData] = useState({ninjas: [], unit: "m"});
  const [error, setError] = useState("");

  useEffect(() => {
    // naive attempt: if coords are in sessionStorage from previous page, use them
    const lat = sessionStorage.getItem("lat");
    const lng = sessionStorage.getItem("lng");
    if (!lat || !lng) return;

    const run = async () => {
      try {
        const res = await fetch(
          `/api/ninjas/?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(
            lng
          )}`
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to fetch results");
        setData({ninjas: json.data?.slice(0, 5) || [], unit: json.unit || "m"});
      } catch (e) {
        setError(e.message || "Failed to fetch results");
      }
    };
    run();
  }, []);

  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Nearby Ninjas</h1>
      {error && <div className="mb-4 text-red-300">{error}</div>}
      {data.ninjas.length === 0 ? (
        <p className="opacity-80">No results yet. Go back and search.</p>
      ) : (
        <ul className="space-y-3">
          {data.ninjas.map((n) => (
            <li
              key={n._id}
              className="rounded-xl border border-white/20 p-4 bg-white/10"
            >
              <div className="font-semibold">{n.name}</div>
              <div className="text-sm opacity-80">{n.rank}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
