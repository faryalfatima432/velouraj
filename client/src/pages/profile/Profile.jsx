import { useAuth } from "../../context/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

function Profile() {
  const { user } = useAuth();

  return (
    <div className="min-h-[75vh] bg-[#f4f7f3] px-4 py-12">

      <div className="mx-auto max-w-4xl">

        <div className="overflow-hidden rounded-2xl border border-[#e2e9e2] bg-white shadow-lg">

          {/* Header */}
          <div className="bg-[#17633a] px-6 py-10 text-center">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/15 text-4xl font-bold text-white ring-4 ring-white/20">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h1 className="mt-4 text-2xl font-bold text-white">
              {user?.name}
            </h1>

            <p className="mt-1 text-slate-400">
              <span className="text-white/75">ShopHub Customer</span>
            </p>

          </div>

          {/* Information */}
          <div className="p-6 sm:p-8">

            <h2 className="text-xl font-bold text-[#202a22]">
              Account Information
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              {/* Name */}
              <div className="rounded-xl border border-[#e2e9e2] p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf6f0] text-[#17633a]">
                    <FaUser />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Full Name
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {user?.name || "Not provided"}
                    </p>
                  </div>

                </div>

              </div>

              {/* Email */}
              <div className="rounded-xl border border-[#e2e9e2] p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf6f0] text-[#17633a]">
                    <FaEnvelope />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Email
                    </p>

                    <p className="mt-1 break-all font-semibold text-slate-900">
                      {user?.email || "Not provided"}
                    </p>
                  </div>

                </div>

              </div>

              {/* Phone */}
              <div className="rounded-xl border border-[#e2e9e2] p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf6f0] text-[#17633a]">
                    <FaPhone />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Phone
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {user?.phone || "Not provided"}
                    </p>
                  </div>

                </div>

              </div>

              {/* Role */}
              <div className="rounded-xl border border-slate-200 p-5">

                <div>
                  <p className="text-xs text-slate-500">
                    Account Type
                  </p>

                  <p className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold capitalize text-green-700">
                    {user?.role || "customer"}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;