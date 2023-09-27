import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    imageName : {
      type: String,
      required: true,
    },
    indexNum : {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Image", imageSchema);
