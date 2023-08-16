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

    noBooking: {
      type: String,
      required: true,
    },

    participantCount: {
      type: Number,
      required: true,
    },

    participants:[],

    dp: {
      type: Number,
      enum: [0,1,2],
      default: 0,
    },
    
    fullPayment: {
      type: Number,
      enum: [0,1,2],
      default: 0,
    },

    paymentProofs:[
      {
        type: String,
      }
    ],

    paymentStatus: {
      type: String,
      enum: ['pending', 'dpPaid', 'fullyPaid'],
      default: 'pending',
    },

    bookingExpiration: {
      type: Date,
    },
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
