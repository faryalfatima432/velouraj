import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="text-center">

        <h1 className="text-7xl font-extrabold text-green-500">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold text-slate-900">
          Page Not Found
        </h2>

        <p className="mt-3 text-slate-500">
          Sorry, the page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="mt-7 inline-block rounded-lg bg-green-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Back to Home
        </Link>

      </div>
    </div>
  );
}

export default NotFound;