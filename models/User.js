import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
    },

    city: {
      type: String,
    },

    birthDate: {
      type: Date,
    },

    gender: {
      type: Boolean,
    },

    photo: {
      type: String,
    },

    whatsApp: {
      type: Number,
    },

    notifications: [],
    
    followedTrip: [
      {
      type: mongoose.Types.ObjectId,
      ref: "Schedule",
      }
    ],

    bookings: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Booking"
      }
    ],

    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
