// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";

// import connectDB from "./config/db.js";

// import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import categoryRoutes from "./routes/categoryRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
// import contactRoutes from "./routes/contactRoutes.js";

// dotenv.config();

// connectDB();

// const app = express();

// /*
// ==================================================
// MIDDLEWARE
// ==================================================
// */

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       const allowedOrigins = [
//         "http://localhost:5173",
//         "http://localhost:5174",
//         "http://127.0.0.1:5173",
//         "http://127.0.0.1:5174",
//       ];
//       const isLocalDevelopmentOrigin =
//         origin && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

//       if (!origin || allowedOrigins.includes(origin) || isLocalDevelopmentOrigin) {
//         callback(null, true);
//       } else {
//         callback(new Error("Origin is not allowed by CORS."));
//       }
//     },

//     credentials: true,
//   })
// );

// app.use(
//   express.json()
// );

// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

// /*
// ==================================================
// ROUTES
// ==================================================
// */

// app.use(
//   "/api/auth",
//   authRoutes
// );

// app.use(
//   "/api/users",
//   userRoutes
// );

// app.use(
//   "/api/products",
//   productRoutes
// );

// app.use(
//   "/api/categories",
//   categoryRoutes
// );

// app.use(
//   "/api/orders",
//   orderRoutes
// );

// app.use(
//   "/api/contact",
//   contactRoutes
// );

// /*
// ==================================================
// ROOT
// ==================================================
// */

// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message:
//       "ShopHub API is running",
//   });
// });

// /*
// ==================================================
// SERVER
// ==================================================
// */

// const PORT =
//   process.env.PORT || 5000;

// app.listen(
//   PORT,
//   () => {
//     console.log(
//       `Server running on http://localhost:${PORT}`
//     );
//   }
// );


import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();

/*
==================================================
CORS CONFIGURATION
==================================================
*/

const allowedOrigins = [
  // Local development
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",

  // Deployed frontend websites
  "https://velouraj.vercel.app",
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header, such as Postman.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`Origin not allowed by CORS: ${origin}`)
      );
    },
    credentials: true,
  })
);

/*
==================================================
MIDDLEWARE
==================================================
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
==================================================
DATABASE CONNECTION
==================================================
*/

connectDB();

/*
==================================================
API ROUTES
==================================================
*/

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);

/*
==================================================
ROOT / HEALTH CHECK
==================================================
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ShopHub API is running",
  });
});

/*
==================================================
ERROR HANDLER
==================================================
*/

app.use((err, req, res, next) => {
  if (err.message?.startsWith("Origin not allowed by CORS:")) {
    return res.status(403).json({
      success: false,
      message: "Origin is not allowed by CORS.",
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

/*
==================================================
SERVER
==================================================
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`ShopHub API running on port ${PORT}`);
});
