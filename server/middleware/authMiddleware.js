// import jwt from "jsonwebtoken";
// import User from "../models/User.js";


// // ===============================
// // PROTECT USER ROUTES
// // ===============================
// export const protect = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     // Check Authorization header
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Not authorized. Please login.",
//       });
//     }

//     // Get token
//     const token = authHeader.split(" ")[1];

//     // Verify token
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     // Find user
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     // Attach user to request
//     req.user = user;

//     next();

//   } catch (error) {
//     console.error("AUTH ERROR:", error.message);

//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token.",
//     });
//   }
// };


// // ===============================
// // ADMIN ONLY
// // ===============================
// // export const adminOnly = (req, res, next) => {
// //   if (!req.user) {
// //     return res.status(401).json({
// //       success: false,
// //       message: "Not authorized.",
// //     });
// //   }

// //   if (!req.user.isAdmin) {
// //     return res.status(403).json({
// //       success: false,
// //       message: "Admin access required.",
// //     });
// //   }

// //   next();
// // };

// export const adminOnly = (req, res, next) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({
//       success: false,
//       message: "Admin access required",
//     });
//   }

//   next();
// };


import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ==============================
// Protect Route
// ==============================
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

// ==============================
// Admin Only
// ==============================
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authorized.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  next();
};