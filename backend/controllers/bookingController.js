import User from '../models/User.js'
import Booking from '../models/Booking.js'
import Trip from '../models/Trip.js'
import Schedule from '../models/Schedule.js'
import History from '../models/History.js'
import multer from 'multer'



export const createBooking = async(req,res) =>{

    const userID = req.params.userID
    const scheduleID = req.params.scheduleID
    const participantCount = req.body.participantCount
    const participants = [];
    for (let i = 0; i < participantCount; i++) {
      participants.push({
        name: '',
        email: '',
        phone: '',
        city:'',
        gender:'',
        job:'',
        birthDay:'',
      });
    }

    
    // Create a new booking instance and set the userBooking and tripBooked fields
    const newBooking = new Booking({
        ...req.body,
        userBooking: userID,
        tripBooked: scheduleID,
        participants: participants,
    });

    try {
        const savedBooking =  await (await newBooking.save()).populate({
          path: 'tripBooked',
          populate : {
            path: 'productIdofTrip'
          }
        })

        if(!savedBooking){
            return res.status(400).json({success:false, message:'Gagal Memesan Trip'})
        }

        await Schedule.findByIdAndUpdate(scheduleID,{
            $inc: {maxParticipants : -newBooking.participantCount}
        })

        await User.findByIdAndUpdate(userID, {
            $push: {bookings: savedBooking._id}
        })

        res.status(200).json({
            success: true,
            message: 'Berhasil booking jadwal Trip',
            data: savedBooking
        })
        
    } catch (err) {
      console.log("errornya : ",err)
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

// get single booking
export const  getBooking = async(req,res)=>{
    const id = req.params.id

    try {
        const book = await Booking.findById(id)

        res.status(200).json({
            success: true,
            message: "successful",
            data: book,
        })
    } catch (err) {
        res.status(404).json({
            success: true,
            message: "not found"
        })
    }
}

// get All booking
export const getAllBooking = async(req,res)=>{

    try {
        const books = await Booking.find({})

        res.status(200).json({
            success: true,
            message: "successful",
            data: books,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

//updateParticipantDataBooking
export const updateBookers = async (req, res) => {
  const bookingId = req.params.idBooking;
  
  // const participant = req.body; // Assumption: req.body.participants is an array of participant objects
  // const participants = req.body.map((participant) => ({
  //   name: participant.participantName,
  //   email: participant.participantEmail,
  //   phone: participant.participantPhoneNumber,
  //   city: participant.participantCity,
  //   gender: participant.participantGender,
  //   job: participant.participantJob,
  //   birthDay: participant.participantBirthDay,
  // }));

  console.log("peserta : ",req.body)
  

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          participants: req.body
        }
      },
      { new: true } // Ini akan mengembalikan dokumen yang sudah diperbarui
    );

    if (!updatedBooking) {
      return res.status(404).json({success:false, message: "Data pesanan tidak ditemukan" });
    }
    res.status(200).json({success:true, message: "Data peserta berhasil diperbarui", updatedBooking });
  } catch (error) {
    res.status(500).json({success:false, message: "Gagal memasukkan data, ada eror."});
  }
};

// updating booking status
export const updateBookingStatus = async (req, res) =>{
  const bookingId = req.params.idBooking;
  const { paymentStage } = req.params;
  const { value } = req.body;
  const userID = await Booking.findById(bookingId);

  try {
    let updateObject = {};
    let information = '';

    if (paymentStage === 'dp') {
      updateObject.dp = value;
      information = 'konfirmasi dp'
    } else if (paymentStage === 'fullPayment') {
      updateObject.fullPayment = value;
      information = 'konfirmasi pelunasan'
    } else {
      return res.status(400).json({ success: false, message: 'Eror, kesalahan parameter masukan' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updateObject,
      { new: true }
    );

    const userActor = await User.findById(userID.userBooking)

    const createNewHistory = new History({
      idUser : userID,
      userFullName : userActor.fullName,
      information,
    })

    await createNewHistory.save();

    if(!createNewHistory){
      return res.status(400).json({succes: false, message: 'gagal menyimpan history'})
    }
    
    res.status(200).json({ success: true, message:`berhasil ${information}`, data: updatedBooking });
  } catch (err) {
    
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

//deleting a booking
export const deleteBooking = async(req,res) =>{
    const bookingId = req.params.idBooking;
    
    try {
        const deleteBooking = await Booking.findById(bookingId)

        if(!deleteBooking){
            return res.status(400).json({success: false, message: "data pesanan tidak ditemukan"})
        }

        const deletedBookingOnUser = await User.findByIdAndUpdate(deleteBooking.userBooking._id,{
          $pull : {bookings: bookingId}
        })

        if(!deletedBookingOnUser){
          return res.status(400).json({success: false, message: "data pesanan belum terhapus"})
        }

        const tripBooked = deleteBooking.tripBooked._id
        if(tripBooked){
            await Schedule.findByIdAndUpdate(tripBooked,
                {
                    $inc : {maxParticipants : deleteBooking.participantCount},
                }
            )
        }

        const deletedBooking = await deleteBooking.deleteOne()

        res.status(200).json({success: true, data: deletedBooking, message: "Berhasil dihapus"})
    } catch (error) {
        console.err("Error:", error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}

//sending payment proof
export const payBooking = async (req, res) => {
  const bookingId = req.params.idBooking;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../frontend/src/assets/images/paymentProofs'); // Ganti dengan direktori yang sesuai
    },
    filename: (req, file, cb) => {
      // const paymentType = req.body.paymentType;
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      // const paymentProofName = paymentType; // Gunakan paymentType sebagai nama file
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${uniqueSuffix}.${fileExtension}`;
      cb(null, fileName);
    },
  });

  const upload = multer({ storage: storage });

  try {
    // Handle upload di dalam fungsi payBooking
    upload.single('paymentProof')(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error uploading paymentProof' });
      }

      const paymentProof = req.file.filename;

      // Menentukan objek bukti pembayaran sesuai dengan paymentTypes
      let updateFields = {};
      if (req.body.paymentType === 'DP') {
        updateFields.dpProofs = paymentProof;
      } else if (req.body.paymentType === 'FullPayment') {
        updateFields.fullPaymentProofs = paymentProof;
      }

      try {
        const updatedBooking = await Booking.findByIdAndUpdate(
          bookingId,
          { $set: updateFields },
          { new: true }
        );

        console.log("Data yang dirubah ", updateFields)

        if (!updatedBooking) {
          return res.status(404).json({ message: 'Booking not Found' });
        }
          return res.status(200).json({success: true, message: 'Payment processed Successfully', data: updateFields});
        } catch (err) {
          return res.status(500).json({ message: 'Error updating booking data' });
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const completeBooking = async(req, res) => {
  const idBooking = req.params.idBooking;
  const statusBooking = req.body.statusBooking;
  const scheduleBooked = await Booking.findById(idBooking)

  try {
    const updatedStatusBooking = await Booking.findByIdAndUpdate(idBooking,{
      $set : {
        paymentStatus : "lunas"
      }
    })

    if(!updatedStatusBooking){
      return res.status(400).json({success:false, message:"Gagal mengupdate status pesanan"})
    }

    const updatedParticipants = scheduleBooked.participants.map((participant) => ({
      name: participant.name,
      email: participant.email,
      phone: participant.phone,
      city: participant.city,
      gender: participant.gender,
      job: participant.job,
      birthDay: participant.birthDay,
    }));

    const updateSchedule = await Schedule.findByIdAndUpdate(scheduleBooked.tripBooked._id,{
      $push : {
        participants : {$each : updatedParticipants}
      }
    },{new:true})

    return res.status(200).json({success:true, message:"Berhasil", updateSchedule})

  } catch (error) {
    console.log("errornya :", error)
    return res.status(500).json({success:false, message:"Gagal"})
  }
}