import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("adminToken");

  const admin = JSON.parse(
    localStorage.getItem("admin") || "null"
  );

  if (!token || admin?.role !== "admin") {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;