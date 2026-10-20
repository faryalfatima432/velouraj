// // import { useState } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import API from "../services/api";

// // function Register() {
// //   const navigate = useNavigate();

// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     phone: "",
// //     password: "",
// //     confirmPassword: "",
// //   });

// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;

// //     setFormData((previous) => ({
// //       ...previous,
// //       [name]: value,
// //     }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     setError("");
// //     setSuccess("");

// //     const {
// //       name,
// //       email,
// //       phone,
// //       password,
// //       confirmPassword,
// //     } = formData;

// //     // Basic validation
// //     if (!name || !email || !password || !confirmPassword) {
// //       setError("Please fill in all required fields.");
// //       return;
// //     }

// //     if (password !== confirmPassword) {
// //       setError("Passwords do not match.");
// //       return;
// //     }

// //     if (password.length < 6) {
// //       setError("Password must be at least 6 characters.");
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const response = await API.post("/auth/register", {
// //         name,
// //         email,
// //         password,
// //         phone,
// //       });

// //       setSuccess(
// //         response.data.message || "Registration successful!"
// //       );

// //       // Store login information returned by backend
// //       if (response.data.token) {
// //         localStorage.setItem(
// //           "userToken",
// //           response.data.token
// //         );
// //       }

// //       if (response.data.user) {
// //         localStorage.setItem(
// //           "user",
// //           JSON.stringify(response.data.user)
// //         );
// //       }

// //       // Go to home page after registration
// //       setTimeout(() => {
// //         navigate("/");
// //       }, 1000);
// //     } catch (error) {
// //       console.error("REGISTER ERROR:", error);

// //       setError(
// //         error.response?.data?.message ||
// //           "Registration failed. Please try again."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
// //       <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        
// //         {/* Heading */}
// //         <div className="text-center mb-8">
// //           <h1 className="text-3xl font-bold text-slate-800">
// //             Create Account
// //           </h1>

// //           <p className="text-slate-500 mt-2">
// //             Create your ShopHub account
// //           </p>
// //         </div>

// //         {/* Error */}
// //         {error && (
// //           <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
// //             {error}
// //           </div>
// //         )}

// //         {/* Success */}
// //         {success && (
// //           <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
// //             {success}
// //           </div>
// //         )}

// //         {/* Form */}
// //         <form
// //           onSubmit={handleSubmit}
// //           className="space-y-5"
// //         >
          
// //           {/* Name */}
// //           <div>
// //             <label
// //               htmlFor="name"
// //               className="block text-sm font-medium text-slate-700 mb-2"
// //             >
// //               Full Name *
// //             </label>

// //             <input
// //               id="name"
// //               name="name"
// //               type="text"
// //               value={formData.name}
// //               onChange={handleChange}
// //               placeholder="Enter your name"
// //               className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
// //             />
// //           </div>

// //           {/* Email */}
// //           <div>
// //             <label
// //               htmlFor="email"
// //               className="block text-sm font-medium text-slate-700 mb-2"
// //             >
// //               Email Address *
// //             </label>

// //             <input
// //               id="email"
// //               name="email"
// //               type="email"
// //               value={formData.email}
// //               onChange={handleChange}
// //               placeholder="Enter your email"
// //               className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
// //             />
// //           </div>

// //           {/* Phone */}
// //           <div>
// //             <label
// //               htmlFor="phone"
// //               className="block text-sm font-medium text-slate-700 mb-2"
// //             >
// //               Phone Number
// //             </label>

// //             <input
// //               id="phone"
// //               name="phone"
// //               type="tel"
// //               value={formData.phone}
// //               onChange={handleChange}
// //               placeholder="03XXXXXXXXX"
// //               className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
// //             />
// //           </div>

// //           {/* Password */}
// //           <div>
// //             <label
// //               htmlFor="password"
// //               className="block text-sm font-medium text-slate-700 mb-2"
// //             >
// //               Password *
// //             </label>

// //             <input
// //               id="password"
// //               name="password"
// //               type="password"
// //               value={formData.password}
// //               onChange={handleChange}
// //               placeholder="Enter password"
// //               className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
// //             />
// //           </div>

// //           {/* Confirm Password */}
// //           <div>
// //             <label
// //               htmlFor="confirmPassword"
// //               className="block text-sm font-medium text-slate-700 mb-2"
// //             >
// //               Confirm Password *
// //             </label>

// //             <input
// //               id="confirmPassword"
// //               name="confirmPassword"
// //               type="password"
// //               value={formData.confirmPassword}
// //               onChange={handleChange}
// //               placeholder="Confirm password"
// //               className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
// //             />
// //           </div>

// //           {/* Submit */}
// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className="w-full rounded-lg bg-slate-800 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
// //           >
// //             {loading ? "Creating Account..." : "Create Account"}
// //           </button>
// //         </form>

// //         {/* Login */}
// //         <div className="mt-6 text-center text-sm text-slate-600">
// //           Already have an account?{" "}
// //           <Link
// //             to="/login"
// //             className="font-semibold text-slate-800 hover:underline"
// //           >
// //             Login
// //           </Link>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Register;

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import API from "../../services/api";

// function Register() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     const {
//       name,
//       email,
//       phone,
//       password,
//       confirmPassword,
//     } = formData;

//     // Required fields
//     if (!name || !email || !password || !confirmPassword) {
//       setError("Please fill in all required fields.");
//       return;
//     }

//     // Password length
//     if (password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }

//     // Password confirmation
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await API.post("/auth/register", {
//         name,
//         email,
//         phone,
//         password,
//       });

//       setSuccess(
//         response.data.message ||
//           "Account created successfully!"
//       );

//       // Save token
//       if (response.data.token) {
//         localStorage.setItem(
//           "userToken",
//           response.data.token
//         );
//       }

//       // Save user
//       if (response.data.user) {
//         localStorage.setItem(
//           "user",
//           JSON.stringify(response.data.user)
//         );
//       }

//       // Redirect to home
//       setTimeout(() => {
//         navigate("/");
//       }, 1000);
//     } catch (error) {
//       console.error("REGISTER ERROR:", error);

//       setError(
//         error.response?.data?.message ||
//           "Registration failed. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">

//       <div className="w-full max-w-lg">

//         {/* Card */}
//         <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

//           {/* Header */}
//           <div className="bg-slate-900 px-8 py-8 text-center">
//             <h1 className="text-3xl font-bold text-white">
//               Create Account
//             </h1>

//             <p className="mt-2 text-slate-300">
//               Join ShopHub today
//             </p>
//           </div>

//           {/* Form Area */}
//           <div className="p-8">

//             {/* Error Message */}
//             {error && (
//               <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
//                 <p className="text-sm font-medium text-red-600">
//                   {error}
//                 </p>
//               </div>
//             )}

//             {/* Success Message */}
//             {success && (
//               <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
//                 <p className="text-sm font-medium text-green-600">
//                   {success}
//                 </p>
//               </div>
//             )}

//             <form
//               onSubmit={handleSubmit}
//               className="space-y-5"
//             >

//               {/* Name */}
//               <div>
//                 <label
//                   htmlFor="name"
//                   className="mb-2 block text-sm font-semibold text-slate-700"
//                 >
//                   Full Name
//                   <span className="text-red-500"> *</span>
//                 </label>

//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Enter your full name"
//                   className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                 />
//               </div>

//               {/* Email */}
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="mb-2 block text-sm font-semibold text-slate-700"
//                 >
//                   Email Address
//                   <span className="text-red-500"> *</span>
//                 </label>

//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="example@email.com"
//                   className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                 />
//               </div>

//               {/* Phone */}
//               <div>
//                 <label
//                   htmlFor="phone"
//                   className="mb-2 block text-sm font-semibold text-slate-700"
//                 >
//                   Phone Number
//                 </label>

//                 <input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   placeholder="03XX-XXXXXXX"
//                   className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                 />
//               </div>

//               {/* Password */}
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="mb-2 block text-sm font-semibold text-slate-700"
//                 >
//                   Password
//                   <span className="text-red-500"> *</span>
//                 </label>

//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Minimum 6 characters"
//                   className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                 />
//               </div>

//               {/* Confirm Password */}
//               <div>
//                 <label
//                   htmlFor="confirmPassword"
//                   className="mb-2 block text-sm font-semibold text-slate-700"
//                 >
//                   Confirm Password
//                   <span className="text-red-500"> *</span>
//                 </label>

//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type="password"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   placeholder="Enter password again"
//                   className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                 />
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full rounded-lg bg-slate-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {loading
//                   ? "Creating Account..."
//                   : "Create Account"}
//               </button>
//             </form>

//             {/* Login Link */}
//             <div className="mt-7 border-t border-slate-200 pt-6 text-center">
//               <p className="text-sm text-slate-500">
//                 Already have an account?
//               </p>

//               <Link
//                 to="/login"
//                 className="mt-2 inline-block text-sm font-bold text-slate-900 hover:underline"
//               >
//                 Login to your account
//               </Link>
//             </div>

//           </div>
//         </div>

//         {/* Footer */}
//         <p className="mt-6 text-center text-xs text-slate-500">
//           © 2026 ShopHub. All rights reserved.
//         </p>

//       </div>
//     </div>
//   );
// }

// export default Register;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      formData.password !== formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shop-page-enter flex min-h-[75vh] items-center justify-center bg-[#f4f7f3] px-4 py-12">

      <div className="w-full max-w-lg rounded-2xl border border-[#e2e9e2] bg-white p-6 shadow-xl sm:p-8">

        {/* Header */}
        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf6f0] text-2xl text-[#17633a]">
            <FaUser />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-[#202a22]">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Join ShopHub and start shopping
          </p>

        </div>

        {/* Error */}
        {error && (
          <div className="shop-page-enter mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-5"
        >

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Full Name *
            </label>

            <div className="relative">

              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-[#d8e0d8] py-3 pl-11 pr-4 outline-none transition focus:border-[#17633a] focus:ring-2 focus:ring-[#edf6f0]"
              />

            </div>
          </div>

          {/* Email */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email Address *
            </label>

            <div className="relative">

              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-[#d8e0d8] py-3 pl-11 pr-4 outline-none transition focus:border-[#17633a] focus:ring-2 focus:ring-[#edf6f0]"
              />

            </div>

          </div>

          {/* Phone */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Phone Number
            </label>

            <div className="relative">

              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="03XXXXXXXXX"
                className="w-full rounded-xl border border-[#d8e0d8] py-3 pl-11 pr-4 outline-none transition focus:border-[#17633a] focus:ring-2 focus:ring-[#edf6f0]"
              />

            </div>

          </div>

          {/* Password */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password *
            </label>

            <div className="relative">

              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-[#d8e0d8] py-3 pl-11 pr-12 outline-none transition focus:border-[#17633a] focus:ring-2 focus:ring-[#edf6f0]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

          </div>

          {/* Confirm Password */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Confirm Password *
            </label>

            <div className="relative">

              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full rounded-xl border border-[#d8e0d8] py-3 pl-11 pr-12 outline-none transition focus:border-[#17633a] focus:ring-2 focus:ring-[#edf6f0]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#17633a] py-3 font-semibold text-white transition hover:bg-[#12532f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* Login */}
        <div className="mt-7 border-t border-[#e3e9e3] pt-6 text-center text-sm text-slate-500">

          Already have an account?{" "}

          <Link
            to="/login"
            className="font-semibold text-[#17633a] hover:text-[#12532f]"
          >
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;