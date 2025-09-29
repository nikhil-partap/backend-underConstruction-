// src/components/Dashboard.jsx
import React, {useEffect, useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Dashboard
 * - Expects a token (JWT) in localStorage.token
 * - GET current user: GET /auth/me       (or change to /auth/profile)
 * - UPDATE profile:        PUT /auth/me   (adjust route to your backend)
 * - Search ninjas:         GET /api/ninjas?lat=...&lng=...
 *
 * If you use different backend endpoints, change the URL strings below.
 */

const NinjaResultCard = ({ninjas = [], unit = "m"}) => {
  const formatDistance = (distance) => {
    if (!Number.isFinite(distance)) return "-";
    if (unit === "km") return `${(distance / 1000).toFixed(2)} km`;
    if (distance >= 1000) return `${(distance / 1000).toFixed(2)} km`;
    return `${Math.round(distance)} m`;
  };

  return (
    <div className="space-y-3">
      {ninjas.length === 0 && (
        <div className="rounded-lg bg-white/5 p-3 text-sm text-purple-200">
          No ninjas found
        </div>
      )}
      {ninjas.map((n, idx) => (
        <div
          key={n._id || idx}
          className="relative rounded-2xl border border-white/10 p-4 bg-white/5 backdrop-blur-sm"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🥷</div>
              <div>
                <div className="font-semibold text-white">
                  {n.name || "Unnamed"}
                </div>
                <div className="text-xs text-purple-200 flex items-center gap-2">
                  <span className="text-sm">{n.rank || "—"}</span>
                  <span className="opacity-60">•</span>
                  <span className="capitalize">
                    {n.availability ? "Available" : "Busy"}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right text-sm">
              <div className="font-medium text-white">
                {formatDistance(n.distance)}
              </div>
              <div className="text-xs text-purple-200 mt-1">
                {n.geometry?.coordinates
                  ? `${n.geometry.coordinates[1].toFixed(
                      3
                    )}, ${n.geometry.coordinates[0].toFixed(3)}`
                  : "coords N/A"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  // profile state
  let email = "";
  try {
    const storedEmail = localStorage.getItem("loggedInUserMail");
    if (storedEmail) {
      email = storedEmail;
    }
  } catch (error) {
    toast.error(error.message || "Failed to read email from storage");
  }

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [localProfile, setLocalProfile] = useState({
    name: "",
    email: email,
    rank: "",
    availability: false,
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);

  // ninja finder state (right panel)
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [ninjaResults, setNinjaResults] = useState([]);
  const [ninjaUnit, setNinjaUnit] = useState("m");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Backend endpoints (change if needed)
  const PROFILE_GET_URL = `/api/ninjas${email}`; // expected GET -> { user: { ... } } or { name, email, ... }
  const PROFILE_PUT_URL = "/api/ninjas"; // expected PUT with body -> updated user
  const NINJAS_URL = "/api/ninjas";

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProfile() {
    if (!token) {
      // no token, skip fetch (user might not be logged in)
      setProfile(null);
      return;
    }
    setLoadingProfile(true);
    try {
      const res = await fetch(PROFILE_GET_URL, {
        method: "GET",
        headers: {Authorization: `Bearer ${token}`, Accept: "application/json"},
      });

      let payload = {};
      try {
        payload = await res.json();
      } catch {
        const text = await res.text().catch(() => "");
        payload = {message: text};
      }

      if (!res.ok) {
        const serverMsg = payload?.message || "Failed to load profile";
        throw new Error(serverMsg);
      }

      // Normalize user object
      const user = payload.user || payload;
      setProfile(user);
      setLocalProfile({
        name: user.name || "",
        email: user.email || "",
        rank: user.rank || "",
        availability: user.availability ?? false,
      });
    } catch (err) {
      toast.error(err.message || "Could not fetch profile");
    } finally {
      setLoadingProfile(false);
    }
  }

  function startEdit() {
    setLocalProfile({
      name: profile?.name || "",
      email: profile?.email || "",
      rank: profile?.rank || "",
      availability: profile?.availability ?? false,
    });
    setEditing(true);
  }

  async function handleSaveProfile(e) {
    e?.preventDefault?.();
    if (!token) {
      toast.error("You must be logged in to update profile");
      return;
    }

    setSaving(true);
    let payload = {};
    try {
      const res = await fetch(PROFILE_PUT_URL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(localProfile),
      });

      try {
        payload = await res.json();
      } catch {
        payload = {message: await res.text().catch(() => "")};
      }

      if (!res.ok) {
        const serverMsg = payload?.message || "Failed to update profile";
        throw new Error(serverMsg);
      }

      toast.success(payload.message || "Profile updated");
      // refresh profile
      await fetchProfile();
      setEditing(false);
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  const handleFindNinjas = async () => {
    if (!lat || !lng) {
      toast.error("Please enter latitude and longitude");
      return;
    }
    setSearchLoading(true);
    setNinjaResults([]);
    try {
      const url = `${NINJAS_URL}?lat=${encodeURIComponent(
        lat
      )}&lng=${encodeURIComponent(lng)}&unit=km&maxDistance=100000`;
      const res = await fetch(url, {
        method: "GET",
        headers: {Accept: "application/json"},
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Search failed (${res.status})`);
      }

      const payload = await res.json();
      setNinjaResults(payload.data || []);
      setNinjaUnit(payload.unit || "m");
      if ((payload.data || []).length === 0)
        toast.info("No ninjas found nearby");
    } catch (err) {
      toast.error(err.message || "Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleGetCoords = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(String(pos.coords.latitude));
        setLng(String(pos.coords.longitude));
      },
      () => {
        toast.error("Location permission denied");
      }
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-900 via-blue-900 to-gray-600 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* LEFT: Profile mini card */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="rounded-3xl border border-white/20 bg-white/5 p-6 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl">
                🥷
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {profile?.name || "Guest Ninja"}
                </div>
                <div className="text-sm text-purple-200">
                  {profile?.email || "Not logged in"}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="text-sm text-purple-200">
                <span className="font-medium text-white">Rank:</span>{" "}
                {profile?.rank || "—"}
              </div>
              <div className="text-sm text-purple-200">
                <span className="font-medium text-white">Availability: </span>
                <span
                  className={
                    profile?.availability ? "text-green-300" : "text-red-300"
                  }
                >
                  {profile?.availability ? "Available" : "Busy"}
                </span>
              </div>
              <div className="text-sm text-purple-200">
                <span className="font-medium text-white">Joined:</span>{" "}
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : "—"}
              </div>

              <div className="pt-4">
                {token ? (
                  <button
                    onClick={() => (editing ? setEditing(false) : startEdit())}
                    className="w-full rounded-2xl px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold"
                  >
                    {editing ? "Cancel" : "Edit Profile"}
                  </button>
                ) : (
                  <div className="text-xs text-yellow-200">
                    Login to view / edit profile
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* MIDDLE: Big profile / overview or edit */}
        <section className="col-span-12 lg:col-span-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-xl min-h-[360px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Profile</h2>
              <div className="text-sm text-purple-200">
                {loadingProfile ? "Loading..." : "Overview"}
              </div>
            </div>

            {!editing && (
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-lg bg-white/3 p-6">
                  <ul className="text-sm text-purple-200 space-y-2">
                    <li>
                      <span className="font-medium text-white mr-2">Name:</span>{" "}
                      {profile?.name || "—"}
                    </li>
                    <li>
                      <span className="font-medium text-white mr-2">
                        Email:
                      </span>{" "}
                      {profile?.email || "—"}
                    </li>
                    <li>
                      <span className="font-medium text-white mr-2">Rank:</span>{" "}
                      {profile?.rank || "—"}
                    </li>
                    <li>
                      <span className="font-medium text-white mr-2">
                        Availability:
                      </span>{" "}
                      <span
                        className={
                          profile?.availability
                            ? "text-green-300"
                            : "text-red-300"
                        }
                      >
                        {profile?.availability ? "Available" : "Busy"}
                      </span>
                    </li>
                    <li>
                      <span className="font-medium text-white mr-2">
                        Coordinates:
                      </span>{" "}
                      {profile?.geometry?.coordinates
                        ? `${profile.geometry.coordinates[1].toFixed(
                            4
                          )}, ${profile.geometry.coordinates[0].toFixed(4)}`
                        : "—"}
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {editing && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm text-purple-200 mb-1">
                    Name
                  </label>
                  <input
                    name="name"
                    value={localProfile.name}
                    onChange={(e) =>
                      setLocalProfile((p) => ({...p, name: e.target.value}))
                    }
                    className="w-full rounded-2xl bg-white/10 px-4 py-3 text-white placeholder:text-purple-300"
                  />
                </div>

                <div>
                  <label className="block text-sm text-purple-200 mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={localProfile.email}
                    onChange={(e) =>
                      setLocalProfile((p) => ({...p, email: e.target.value}))
                    }
                    className="w-full rounded-2xl bg-white/10 px-4 py-3 text-white placeholder:text-purple-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-purple-200 mb-1">
                      Rank
                    </label>
                    <input
                      name="rank"
                      value={localProfile.rank}
                      onChange={(e) =>
                        setLocalProfile((p) => ({...p, rank: e.target.value}))
                      }
                      className="w-full rounded-2xl bg-white/10 px-4 py-3 text-white placeholder:text-purple-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-purple-200 mb-1">
                      Availability
                    </label>
                    <select
                      value={localProfile.availability ? "available" : "busy"}
                      onChange={(e) =>
                        setLocalProfile((p) => ({
                          ...p,
                          availability: e.target.value === "available",
                        }))
                      }
                      className="w-full rounded-2xl bg-white/10 px-4 py-3 text-white placeholder:text-purple-300"
                    >
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-2xl px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="rounded-2xl px-4 py-2 bg-white/5 text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* RIGHT: Ninja finder panel */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-3">
              Find closest ninja
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-purple-200 mb-1">
                  Latitude
                </label>
                <input
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="e.g. 28.6139"
                  className="w-full rounded-2xl bg-white/10 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-purple-200 mb-1">
                  Longitude
                </label>
                <input
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="e.g. 77.2090"
                  className="w-full rounded-2xl bg-white/10 px-3 py-2 text-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleFindNinjas}
                  disabled={searchLoading}
                  className="flex-1 rounded-2xl px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold"
                >
                  {searchLoading ? "Searching..." : "Search"}
                </button>
                <button
                  onClick={handleGetCoords}
                  className="rounded-2xl px-3 py-2 bg-white/5 text-white"
                >
                  Get My Location
                </button>
              </div>

              <div className="pt-3">
                <NinjaResultCard
                  ninjas={ninjaResults.slice(0, 4)}
                  unit={ninjaUnit}
                />
              </div>
            </div>
          </div>
        </aside>
      </div>

      <ToastContainer position="top-right" autoClose={4500} />
    </div>
  );
}
