import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// from this form data i want to send name email password to /auth/signup
// and name , email , rank , availability , lat, lng to /api/ninjas
export default function SignupMakeProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rank: "",
    availability: false,
    lat: "",
    lng: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const {name, value, type, checked} = e.target;
    if (type === "checkbox") {
      setForm((p) => ({...p, [name]: checked})); // updating form state, merging the old state p and overwriting name, email, password etc
    } else {
      setForm((p) => ({...p, [name]: value}));
    }
  };

  // geting the coords form the device location
  const handleGetCoords = () => {
    if (!navigator.geolocation) {
      // If the browser doesn’t support geolocation then throw the toast error
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      // prompting the user for location permission if not already given
      (pos) => {
        setForm((p) => ({
          // updating form state, merging the old state p and overwriting lat and lng with string values of the coordinates
          ...p,
          lat: String(pos.coords.latitude), // converting them to the string bcz input fields and html forms always expects a string value even if it represents nos
          lng: String(pos.coords.longitude),
        }));
        toast.success("Coordinates filled from device location");
      },
      () => toast.error("Location permission denied")
    );
  };

  // defencive parsing fall back to text if res is not a valid json
  const parseJsonSafe = async (res) => {
    try {
      return await res.json(); // reading as a json
    } catch (e) {
      // clone so we can read the body again safely
      try {
        const text = await res.text(); // reading as plain text
        return {message: text};
      } catch {
        return {}; // if even reading text fails return a empty object
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validations
    const {name, email, password, rank, lat, lng} = form;
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Name, email and password are required");
      return;
    }
    if (!rank.trim()) {
      toast.error("Please choose a rank");
      return;
    }
    if ((lat && !lng) || (!lat && lng) || (!lat && !lng)) {
      toast.error("Please provide both latitude and longitude .");
      return;
    }

    setLoading(true);

    // 1) Signup call
    // this data is send to /auth/signup data - name, email, password
    let signupPayload = {};
    try {
      const res = await fetch("/auth/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      signupPayload = await parseJsonSafe(res); // calling the function that i made earlier for a defencive json parsing

      if (!res.ok) {
        const serverMsg =
          signupPayload?.error?.details?.[0]?.message ||
          signupPayload?.error?.[0]?.message ||
          signupPayload?.message ||
          `Signup failed (${res.status})`;
        throw new Error(serverMsg);
      }

      // save auth info
      if (signupPayload.token) {
        localStorage.setItem("token", signupPayload.token); // saving the token of the user to local storage with name "token"
        const nameToStore =
          signupPayload.user?.name || signupPayload.name || name.trim();
        const emailToStore =
          signupPayload.user?.email || signupPayload.email || email.trim();
        localStorage.setItem("loggedInUser", nameToStore);
        localStorage.setItem("loggedInUserMail", emailToStore);
      }
    } catch (err) {
      toast.error(err.message || "Signup failed");
      setLoading(false);
      return;
    }

    // 2) Create profile (POST /api/ninjas) — requires token   this data is for the /api/ninja   data - name , email, rank, availability, lat, lng
    const token = localStorage.getItem("token");
    const profilePayload = {
      name: name.trim(),
      email: email.trim(),
      rank: rank.trim(),
      availability: !!form.availability,
    };
    if (lat && lng) {
      const parsedLat = parseFloat(lat); // parsing lat and lng back to floats from strings
      const parsedLng = parseFloat(lng);
      if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
        toast.error("Latitude and longitude must be valid numbers");
        setLoading(false);
        return;
      }
      profilePayload.geometry = {
        // adding the lat & lng after converting them to float
        type: "Point",
        coordinates: [parsedLng, parsedLat],
      };
    }

    try {
      // this send the data that i just prepared to /api/ninja i wil fetch this data in the dashboard
      const res2 = await fetch("/api/ninjas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(profilePayload),
      });

      const body2 = await parseJsonSafe(res2);
      1;
      if (!res2.ok) {
        const serverMsg =
          body2?.message ||
          body2?.error ||
          `Profile creation failed (${res2.status})`;
        throw new Error(serverMsg);
      }

      toast.success(body2.message || "Signup + profile created successfully!");

      // short delay so user sees toast
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      toast.error(err.message || "Profile creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-900 via-blue-900 to-gray-600 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-3xl border border-white/20 bg-white/5 p-8 backdrop-blur-md shadow-lg">
          <div className="mb-6 text-center">
            <div className="inline-block text-6xl">⚔️</div>
            <h1 className="text-2xl font-bold text-white mt-3">
              Join & Create Profile
            </h1>
            <p className="text-sm text-purple-200 mt-2">
              Enter account and profile details in one go.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-purple-200 mb-1">
                🧑 Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full rounded-2xl bg-white/10 px-4 py-3 text-white placeholder:text-purple-300"
              />
            </div>

            <div>
              <label className="block text-sm text-purple-200 mb-1">
                📧 Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@domain.com"
                className="w-full rounded-2xl bg-white/10 px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-purple-200 mb-1">
                🔑 Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Choose a secure password"
                className="w-full rounded-2xl bg-white/10 px-4 py-3 text-white"
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
                disabled={loading}
                className="ml-auto rounded-2xl px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold"
              >
                {loading ? "Working…" : "Create account & profile"}
              </button>
            </div>
          </form>

          <p className="text-xs text-purple-200 mt-4 text-center">
            You can update these details later from your dashboard.
          </p>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={4500} />
    </div>
  );
}
