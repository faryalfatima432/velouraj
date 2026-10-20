import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const createVerificationCode = () =>
  String(crypto.randomInt(100000, 1000000));

const hashCode = (code) =>
  crypto.createHash("sha256").update(code).digest("hex");

const sendVerificationEmail = async (user, code) => {
  if (!process.env.MAIL_USER || !process.env.MAIL_APP_PASSWORD) {
    throw new Error("Email service is not configured.");
  }

  const mailer = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_APP_PASSWORD,
    },
  });

  await mailer.sendMail({
    from: `ShopHub <${process.env.MAIL_USER}>`,
    to: user.email,
    subject: "Your ShopHub verification code",
    text: `Your ShopHub verification code is ${code}. It expires in 10 minutes.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#172033"><h2>Verify your ShopHub account</h2><p>Use this code to verify your email address:</p><div style="font-size:32px;font-weight:700;letter-spacing:8px;background:#f8fafc;padding:18px;text-align:center">${code}</div><p>This code expires in 10 minutes. If you did not create this account, you can ignore this email.</p></div>`,
  });
};

// ==============================
// Generate JWT
// ==============================
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ==============================
// Register User
// ==============================
export const registerUser = async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);

    const {
      name,
      email,
      password,
      phone,
    } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone || "",
      role: "customer",
      isEmailVerified: false,
    });

    const verificationCode = createVerificationCode();
    user.emailVerificationToken = hashCode(verificationCode);
    user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendVerificationEmail(user, verificationCode);

    return res.status(201).json({
      success: true,
      message: "Account created. Check your email for the verification code.",
      requiresVerification: true,
      email: user.email,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Login User
// ==============================
export const loginUser = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordCorrect = user.password && await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";

const finishSocialLogin = (res, user) => {
  user.lastLogin = new Date();
  return user.save().then(() => {
    const token = generateToken(user);
    const params = new URLSearchParams({
      token,
      user: JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }),
    });
    return res.redirect(`${frontendUrl}/oauth/callback?${params.toString()}`);
  });
};

export const startGoogleLogin = (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({ success: false, message: "Google login is not configured on the server." });
  }
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });
  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};

export const googleCallback = async (req, res) => {
  try {
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback";
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code: req.query.code, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, redirect_uri: redirectUri, grant_type: "authorization_code" }),
    });
    const tokens = await tokenResponse.json();
    if (!tokens.access_token) throw new Error("Google authorization failed.");
    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    const profile = await profileResponse.json();
    let user = await User.findOne({ $or: [{ googleId: profile.sub }, { email: profile.email.toLowerCase() }] });
    if (!user) user = await User.create({ name: profile.name || profile.email.split("@")[0], email: profile.email.toLowerCase(), googleId: profile.sub, profileImage: profile.picture || "", isEmailVerified: true, role: "customer" });
    if (!user.googleId) user.googleId = profile.sub;
    return finishSocialLogin(res, user);
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);
    return res.redirect(`${frontendUrl}/login?oauthError=${encodeURIComponent("Google login failed. Please try again.")}`);
  }
};

export const startFacebookLogin = (req, res) => {
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    return res.status(503).json({ success: false, message: "Facebook login is not configured on the server." });
  }
  const params = new URLSearchParams({ client_id: process.env.FACEBOOK_APP_ID, redirect_uri: process.env.FACEBOOK_CALLBACK_URL || "http://localhost:5000/api/auth/facebook/callback", response_type: "code", scope: "email,public_profile" });
  return res.redirect(`https://www.facebook.com/v20.0/dialog/oauth?${params.toString()}`);
};

export const facebookCallback = async (req, res) => {
  try {
    const redirectUri = process.env.FACEBOOK_CALLBACK_URL || "http://localhost:5000/api/auth/facebook/callback";
    const tokenUrl = new URL("https://graph.facebook.com/v20.0/oauth/access_token");
    tokenUrl.search = new URLSearchParams({ client_id: process.env.FACEBOOK_APP_ID, client_secret: process.env.FACEBOOK_APP_SECRET, redirect_uri: redirectUri, code: req.query.code });
    const tokens = await (await fetch(tokenUrl)).json();
    const profileUrl = new URL("https://graph.facebook.com/me");
    profileUrl.search = new URLSearchParams({ fields: "id,name,email,picture", access_token: tokens.access_token });
    const profile = await (await fetch(profileUrl)).json();
    if (!profile.id || !profile.email) throw new Error("Facebook did not return an email address.");
    let user = await User.findOne({ $or: [{ facebookId: profile.id }, { email: profile.email.toLowerCase() }] });
    if (!user) user = await User.create({ name: profile.name, email: profile.email.toLowerCase(), facebookId: profile.id, profileImage: profile.picture?.data?.url || "", isEmailVerified: true, role: "customer" });
    if (!user.facebookId) user.facebookId = profile.id;
    return finishSocialLogin(res, user);
  } catch (error) {
    console.error("FACEBOOK LOGIN ERROR:", error);
    return res.redirect(`${frontendUrl}/login?oauthError=${encodeURIComponent("Facebook login failed. Please try again.")}`);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const email = req.body?.email?.toLowerCase().trim();
    const code = req.body?.code?.trim();
    const user = await User.findOne({ email });

    if (!user || !code || !user.emailVerificationToken || user.emailVerificationExpires < new Date() || hashCode(code) !== user.emailVerificationToken) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("VERIFY EMAIL ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to verify email." });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const email = req.body?.email?.toLowerCase().trim();
    const user = await User.findOne({ email });

    if (!user || user.isEmailVerified) {
      return res.json({ success: true, message: "If the account exists, a verification code has been sent." });
    }

    const code = createVerificationCode();
    user.emailVerificationToken = hashCode(code);
    user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendVerificationEmail(user, code);

    return res.json({ success: true, message: "A new verification code has been sent." });
  } catch (error) {
    console.error("RESEND VERIFICATION ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to send verification email." });
  }
};