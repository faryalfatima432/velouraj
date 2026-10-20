import { useState } from "react";
import API from "../../services/api";

function Profile() {
  const saved = JSON.parse(localStorage.getItem("admin") || "{}");
  const [form, setForm] = useState({ name: saved.name || "", email: saved.email || "", phone: saved.phone || "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault(); setError(""); setMessage("");
    try { const response = await API.put("/users/profile", form); localStorage.setItem("admin", JSON.stringify(response.data.user)); setForm({ ...form, password: "" }); setMessage("Profile updated successfully."); }
    catch (error) { setError(error.response?.data?.message || "Unable to update profile."); }
  };

  return <div className="max-w-3xl space-y-6"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Account</p><h1 className="mt-2 text-3xl font-black text-slate-900">Admin Profile</h1><p className="mt-1 text-sm text-slate-500">Update your administrator information and password.</p></div><form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">{message && <div className="mb-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}{error && <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}<div className="grid gap-5 sm:grid-cols-2">{[["name","Full name"],["email","Email"],["phone","Phone"],["password","New password"]].map(([name,label]) => <label key={name} className="text-sm font-semibold text-slate-700">{label}<input type={name === "password" ? "password" : name === "email" ? "email" : "text"} value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" /></label>)}</div><button className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700">Save profile</button></form></div>;
}

export default Profile;