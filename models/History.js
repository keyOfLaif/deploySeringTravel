import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    idUser : {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    userFullName : {
      type: String,
      required: true
    },

    information : {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("History", historySchema);
