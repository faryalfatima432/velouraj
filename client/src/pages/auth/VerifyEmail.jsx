import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";
import API from "../../services/api";

function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email || !/^\d{6}$/.test(code)) {
      setError("Enter your email and the 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/auth/verify-email", { email, code });
      setMessage(response.data.message);
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to verify email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    if (!email) {
      setError("Enter your email address first.");
      return;
    }

    try {
      setResending(true);
      const response = await API.post("/auth/resend-verification", { email });
      setMessage(response.data.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="flex min-h-[78vh] items-center justify-center bg-[#f4f7f3] px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-[#e2e9e2] bg-white p-6 shadow-xl sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf6f0] text-xl text-[#17633a]">
          <FaEnvelope />
        </div>
        <h1 className="mt-5 text-center text-2xl font-black text-slate-900">Verify your email</h1>
        <p className="mt-2 text-center text-sm leading-6 text-slate-500">We sent a 6-digit code to your email. The code expires in 10 minutes.</p>

        {message && <div className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"><FaCheckCircle /> {message}</div>}
        {error && <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d8e0d8] px-4 py-3 outline-none transition focus:border-[#17633a] focus:ring-2 focus:ring-[#edf6f0]" required /></label>
          <label className="block text-sm font-semibold text-slate-700">Verification code<input inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="000000" className="mt-2 w-full rounded-xl border border-[#d8e0d8] px-4 py-3 text-center text-xl tracking-[0.5em] outline-none transition focus:border-[#17633a] focus:ring-2 focus:ring-[#edf6f0]" required /></label>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#17633a] py-3 font-bold text-white transition hover:bg-[#12532f] disabled:opacity-60">{loading ? "Verifying..." : "Verify email"}</button>
        </form>

        <button type="button" onClick={handleResend} disabled={resending} className="mt-4 w-full text-sm font-semibold text-[#17633a] hover:text-[#12532f] disabled:opacity-60">{resending ? "Sending new code..." : "Resend verification code"}</button>
        <p className="mt-6 text-center text-sm text-slate-500"><Link to="/login" className="font-semibold text-slate-700 hover:text-[#17633a]">Back to login</Link></p>
      </section>
    </main>
  );
}

export default VerifyEmail;
