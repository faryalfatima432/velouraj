import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (!token || !userParam) {
      navigate("/login?oauthError=Social login could not be completed.", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(userParam);
      localStorage.setItem("userToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.location.replace("/");
    } catch {
      navigate("/login?oauthError=Social login returned invalid account data.", { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#f4f7f3] px-4">
      <div className="rounded-2xl border border-[#e2e9e2] bg-white px-8 py-10 text-center shadow-xl">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#17633a]" />
        <p className="mt-4 text-sm font-semibold text-slate-700">Signing you in securely...</p>
      </div>
    </main>
  );
}

export default OAuthCallback;
