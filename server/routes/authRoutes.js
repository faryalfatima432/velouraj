// import express from "express";
// import {
//   registerUser,
//   loginUser
// } from "../controllers/authController.js";

// const router = express.Router();

// router.post("/register", registerUser);

// router.post("/login", loginUser);

// export default router;

import express from "express";

import {
  registerUser,
  loginUser
  ,verifyEmail,
  resendVerification
  ,startGoogleLogin,
  googleCallback,
  startFacebookLogin,
  facebookCallback
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.get("/google", startGoogleLogin);
router.get("/google/callback", googleCallback);
router.get("/facebook", startFacebookLogin);
router.get("/facebook/callback", facebookCallback);

export default router;