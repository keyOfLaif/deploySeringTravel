import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userBooking: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    tripBooked: {
      type: mongoose.Types.ObjectId,
      ref: 'Schedule',
    },

    participantCount: {
      type: Number,
      required: true,
    },

    participants:[{
      name : {
        type:String,
      },
      email : {
        type:String,
      },
      phone : {
        type:String,
      },
      city : {
        type:String,
      },
      gender : {
        type:String,
      },
      job : {
        type:String,
      },
      birthDay : {
        type:Date,
      },
    }
    ],

    dpProofs:{
      type:String,
      default:'',
    },

    fullPaymentProofs:{
      type:String,
      default:'',
    },

    bookingExpiration: {
      type: Date,
    },

    bookingComplete:{
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

bookingSchema.pre('save', function (next) {
  // Jika batas waktu belum diatur, set batas waktu menjadi 3 jam dari waktu pembuatan booking
  if (!this.bookingExpiration) {
    this.bookingExpiration = new Date(this.createdAt.getTime() + 3 * 60 * 60 * 1000);
  }

  next();
});

export default mongoose.model("Booking", bookingSchema);
