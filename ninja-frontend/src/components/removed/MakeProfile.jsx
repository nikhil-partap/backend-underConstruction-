// src/components/MakeProfile.jsx
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * MakeProfile
 * - Expects token in localStorage.token
 * - GET current user:  GET /auth/me
 * - UPDATE profile:    PUT /auth/me
 *
 * Adjust endpoints if your backend differs.
 */

export default function MakeProfile() {
  const navigate = useNavigate();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  let email = "";
  try {
    const storedEmail = localStorage.getItem("loggedInUserMail");
    if (storedEmail) {
      email = storedEmail;
    }
  } catch (error) {
    toast.error(error.message || "Failed to read email from storage");
  }

  //   const PROFILE_GET_URL = `/auth/data/${email}`;   // not needed any more i am calling for request
  const PROFILE_PUT_URL = "/api/ninjas";

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: email,
    rank: "",
    availability: false,
    lat: "",
    lng: "",
  });

  useEffect(() => {
    // if no token, keep user here but if you prefer redirect to login uncomment:
    // if (!token) {navigate("/login");return;}
    // if (!email) {
    //   navigate("/login");
    //   return;
    // }
    // fetchProfile();  // i am not using this function so cant call
    //   eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isProfileComplete = (user) => {
    if (!user) return false;
    // define "complete" as having a name + rank + geometry coordinates
    const hasName = !!user.name;
    const hasRank = !!user.rank;
    const hasGeo = !!(
      user.geometry &&
      Array.isArray(user.geometry.coordinates) &&
      user.geometry.coordinates.length === 2
    );
    return hasName && hasRank && hasGeo;
  };

  // no need to fetch the data fron the backend
  //   async function fetchProfile() {
  //     setLoading(true);
  //     if (!token) {
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       // one importan thing is that i dont have to make a get call if the user is redirected to this page
  //       const res = await fetch(PROFILE_GET_URL, {
  //         method: "GET",
  //         headers: {Authorization: `Bearer ${token}`, Accept: "application/json"},
  //       });

  //       let payload = {};
  //       try {
  //         payload = await res.json();
  //       } catch {
  //         const txt = await res.text().catch(() => "");
  //         payload = {message: txt};
  //       }

  //       if (!res.ok) {
  //         // can't fetch profile — inform user but don't crash
  //         const msg = payload?.message || "Unable to fetch profile";
  //         toast.error(msg);
  //         setLoading(false);
  //         return;
  //       }

  //       const user = payload.user || payload;
  //       setProfile(user);

  //       // prefill form fields (if available)
  //       setForm({
  //         name: user.name || "",
  //         email: user.email || "",
  //         rank: user.rank || "",
  //         availability: user.availability ?? false,
  //         lat: user.geometry?.coordinates?.[1]
  //           ? String(user.geometry.coordinates[1])
  //           : "",
  //         lng: user.geometry?.coordinates?.[0]
  //           ? String(user.geometry.coordinates[0])
  //           : "",
  //       });

  //       if (isProfileComplete(user)) {
  //         // user already complete → go to dashboard
  //         navigate("/dashboard");
  //       }
  //     } catch (err) {
  //       toast.error(err.message || "Profile load failed");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  const handleChange = (e) => {
    const {name, value, type, checked} = e.target;
    if (type === "checkbox") {
      setForm((p) => ({...p, [name]: checked}));
    } else {
      setForm((p) => ({...p, [name]: value}));
    }
  };

  const handleGetCoords = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((p) => ({
          ...p,
          lat: String(pos.coords.latitude),
          lng: String(pos.coords.longitude),
        }));
        toast.success("Coordinates filled from device location");
      },
      () => {
        toast.error("Location permission denied");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (!form.name?.trim() || !form.rank?.trim()) {
      toast.error("Please provide at least a name and rank.");
      return;
    }

    // coordinates optional but if provided ensure both present
    if ((form.lat && !form.lng) || (!form.lat && form.lng)) {
      toast.error("Please provide both latitude and longitude or none.");
      return;
    }

    // prepare payload matching your backend shape
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      rank: form.rank.trim(),
      availability: !!form.availability,
    };

    if (form.lat && form.lng) {
      const parsedLat = parseFloat(form.lat);
      const parsedLng = parseFloat(form.lng);
      if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
        toast.error("Latitude and longitude must be valid numbers");
        return;
      }
      payload.geometry = {type: "Point", coordinates: [parsedLng, parsedLat]};
    }

    setSaving(true);

    try {
      const res = await fetch(PROFILE_PUT_URL, {
        method: "PUT",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      let body = {};
      try {
        body = await res.json();
      } catch {
        body = {message: await res.text().catch(() => "")};
      }

      if (!res.ok) {
        const serverMsg = body?.message || "Failed to update profile";
        throw new Error(serverMsg);
      }

      toast.success(body.message || "Profile updated");
      // refresh profile in memory and navigate to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-900 via-blue-900 to-gray-600 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-3xl border border-white/20 bg-white/5 p-8 backdrop-blur-md shadow-lg">
          <div className="mb-6 text-center">
            <div className="inline-block text-6xl">⚔️</div>
            <h1 className="text-2xl font-bold text-white mt-3">
              Finish your profile
            </h1>
            <p className="text-sm text-purple-200 mt-2">
              Complete a few details so your fellow ninjas can find you.
            </p>
          </div>

          {loading ? (
            <div className="text-center text-purple-200">Loading profile…</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-purple-200 mb-1">
                  🧑 Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-white/10 px-4 py-3 text-white placeholder:text-purple-300"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm text-purple-200 mb-1">
                  📧 Email (readonly)
                </label>
                <input
                  name="email"
                  value={form.email}
                  readOnly
                  className="w-full rounded-2xl bg-white/5 px-4 py-3 text-white placeholder:text-purple-300 opacity-80"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-purple-200 mb-1">
                    🏷 Rank
                  </label>
                  <select
                    name="rank"
                    value={form.rank}
                    onChange={handleChange}
                    className="w-full rounded-2xl bg-white/10 px-4 py-3 text-white"
                  >
                    <option value="">Choose rank</option>
                    <option value="black belt">Black belt</option>
                    <option value="red belt">Red belt</option>
                    <option value="blue belt">Blue belt</option>
                    <option value="yellow belt">Yellow belt</option>
                    <option value="green belt">Green belt</option>
                    <option value="white belt">White belt</option>
                    <option value="brown belt">Brown belt</option>
                    <option value="purple belt">Purple belt</option>
                    <option value="orange belt">Orange belt</option>
                    <option value="pink belt">Pink belt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-purple-200 mb-1">
                    Availability
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="availability"
                        checked={!!form.availability}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <span className="text-white">Available</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-purple-200 mb-1">
                    Latitude
                  </label>
                  <input
                    name="lat"
                    value={form.lat}
                    onChange={handleChange}
                    placeholder="e.g. 28.6139"
                    className="w-full rounded-2xl bg-white/10 px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-purple-200 mb-1">
                    Longitude
                  </label>
                  <input
                    name="lng"
                    value={form.lng}
                    onChange={handleChange}
                    placeholder="e.g. 77.2090"
                    className="w-full rounded-2xl bg-white/10 px-4 py-3 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleGetCoords}
                  className="rounded-2xl px-4 py-2 bg-white/5 text-white"
                >
                  📍 Get my location
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="ml-auto rounded-2xl px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold"
                >
                  {saving ? "Saving..." : "Save & Continue"}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-xs text-purple-200 mt-4 text-center">
          You can update these details later from your dashboard.
        </p>
      </div>

      <ToastContainer position="top-right" autoClose={4500} />
    </div>
  );
}
