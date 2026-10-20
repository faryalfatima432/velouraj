// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true
//     },

//     password: {
//       type: String,
//       required: true
//     },

//     isAdmin: {
//       type: Boolean,
//       default: false
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// const User = mongoose.model("User", userSchema);

// export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // =========================
    // BASIC INFORMATION
    // =========================
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId && !this.facebookId;
      },
      minlength: [6, "Password must be at least 6 characters"],
    },

    googleId: {
      type: String,
      default: "",
      index: true,
    },

    facebookId: {
      type: String,
      default: "",
      index: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    // =========================
    // USER ROLE
    // =========================
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    // =========================
    // PROFILE
    // =========================
    profileImage: {
      type: String,
      default: "",
    },

    // =========================
    // ACCOUNT STATUS
    // =========================
    isActive: {
      type: Boolean,
      default: true,
    },

    // =========================
    // EMAIL VERIFICATION
    // =========================
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      default: null,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
    },

    // =========================
    // PASSWORD RESET
    // =========================
    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },

    // =========================
    // LOGIN INFORMATION
    // =========================
    lastLogin: {
      type: Date,
      default: null,
    },

    // =========================
    // SHOPPING INFORMATION
    // =========================
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // =========================
    // ADDRESS BOOK
    // =========================
    addresses: [
      {
        fullName: {
          type: String,
          trim: true,
        },

        phone: {
          type: String,
          trim: true,
        },

        address: {
          type: String,
          trim: true,
        },

        city: {
          type: String,
          trim: true,
        },

        state: {
          type: String,
          trim: true,
        },

        postalCode: {
          type: String,
          trim: true,
        },

        country: {
          type: String,
          trim: true,
          default: "Pakistan",
        },

        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },

  // =========================
  // TIMESTAMPS
  // =========================
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;