import { useEffect, useState } from "react";
import { FiEdit2, FiSearch, FiTrash2, FiUserCheck, FiUserX } from "react-icons/fi";
import API from "../../services/api";

const emptyForm = { name: "", email: "", phone: "", role: "customer", isActive: true, password: "" };

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try { setUsers((await API.get("/users/admin")).data.users || []); }
    catch (error) { setError(error.response?.data?.message || "Unable to load users."); }
  };

  useEffect(() => { loadUsers(); }, []);

  const saveUser = async (event) => {
    event.preventDefault();
    try {
      const response = await API.put(`/users/admin/${editing._id}`, form);
      setUsers((current) => current.map((user) => user._id === editing._id ? response.data.user : user));
      setEditing(null);
    } catch (error) { setError(error.response?.data?.message || "Unable to update user."); }
  };

  const removeUser = async (user) => {
    if (!window.confirm(`Delete ${user.name}'s account?`)) return;
    try { await API.delete(`/users/admin/${user._id}`); setUsers((current) => current.filter((item) => item._id !== user._id)); }
    catch (error) { setError(error.response?.data?.message || "Unable to delete user."); }
  };

  const visibleUsers = users.filter((user) => `${user.name} ${user.email} ${user.phone}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Administration</p><h1 className="mt-2 text-3xl font-black text-slate-900">Users</h1><p className="mt-1 text-sm text-slate-500">Manage accounts, permissions, and access.</p></div><div className="rounded-xl bg-blue-600 px-5 py-3 text-white"><p className="text-xs text-blue-100">Total accounts</p><p className="text-2xl font-black">{users.length}</p></div></div>
    {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-4"><div className="relative max-w-md"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users..." className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500" /></div></div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">User</th><th className="px-5 py-4">Phone</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{visibleUsers.map((user) => <tr key={user._id} className="hover:bg-slate-50"><td className="px-5 py-4"><p className="font-semibold text-slate-800">{user.name}</p><p className="text-xs text-slate-400">{user.email}</p></td><td className="px-5 py-4 text-sm text-slate-600">{user.phone || "-"}</td><td className="px-5 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold capitalize text-blue-700">{user.role}</span></td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1 text-xs font-bold ${user.isActive ? "text-emerald-600" : "text-red-500"}`}>{user.isActive ? <FiUserCheck /> : <FiUserX />}{user.isActive ? "Active" : "Disabled"}</span></td><td className="px-5 py-4 text-right"><button title="Edit user" onClick={() => { setEditing(user); setForm({ name: user.name, email: user.email, phone: user.phone || "", role: user.role, isActive: user.isActive, password: "" }); }} className="mr-2 rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-blue-600 hover:text-white"><FiEdit2 /></button><button title="Delete user" onClick={() => removeUser(user)} className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-600 hover:text-white"><FiTrash2 /></button></td></tr>)}</tbody></table></div></div>
    {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><form onSubmit={saveUser} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-slate-900">Edit user</h2><button type="button" onClick={() => setEditing(null)} className="text-slate-400">Close</button></div><div className="mt-5 grid gap-4 sm:grid-cols-2">{[["name","Name"],["email","Email"],["phone","Phone"],["password","New password"]].map(([name,label]) => <label key={name} className="text-sm font-medium text-slate-700">{label}<input type={name === "password" ? "password" : name === "email" ? "email" : "text"} value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500" /></label>)}<label className="text-sm font-medium text-slate-700">Role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5"><option value="customer">Customer</option><option value="admin">Admin</option></select></label><label className="flex items-center gap-2 pt-7 text-sm font-medium text-slate-700"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} /> Active account</label></div><button className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700">Save changes</button></form></div>}
  </div>;
}

export default Users;