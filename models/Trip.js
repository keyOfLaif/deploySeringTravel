import mongoose, { mongo } from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },

    city: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
    },

    desc: {
      type: String,
    },

    schedules: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Schedule",
      },
    ],
    
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],

    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Trip", tripSchema);
