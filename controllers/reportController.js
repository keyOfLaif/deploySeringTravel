import Trip from "../models/Trip.js";
import Schedule from "../models/Schedule.js";
  
export const getFullReport = async(req,res)=>{

  try {
        const trips = await Trip.find({}).populate('schedules').populate('reviews')

        let totalProfit = 0;
        let totalSchedule = 0;
        let totalReview = 0;
        let totalCompletedSchedules = 0;
        let totalUpcomingSchedules = 0;
        let participantsSet = new Set();
        let genderCounts = { male: 0, female: 0 };

      // Tanggal saat ini
        const currentDate = new Date();

        trips.forEach((trip) => {
            trip.schedules.forEach((schedule) => {
            const scheduleProfit = schedule.price * schedule.participants.length;
            totalProfit += scheduleProfit;
            totalSchedule += 1;
            

            if (schedule.tripDate < currentDate) {
                totalCompletedSchedules += 1;
              } else {
                totalUpcomingSchedules += 1;
              }

            schedule.participants.forEach((participant) => {
            // Gunakan email peserta sebagai identifier untuk memeriksa duplikasi
            const participantIdentifier = participant.email;
            // Tambahkan peserta ke participantsSet jika belum ada
            if (!participantsSet.has(participantIdentifier)) {
                participantsSet.add(participantIdentifier);
    
                // Hitung jenis kelamin peserta
                if (participant.gender === 'laki-laki') {
                genderCounts.male += 1; // Laki-laki
                } else if (participant.gender === 'perempuan') {
                genderCounts.female += 1; // Perempuan
                }
            }
            });
            
            })
            totalReview += trip.reviews.length;
        });
        const totalMaleParticipants = genderCounts.male;
        const totalFemaleParticipants = genderCounts.female;
        const totalParticipants = totalMaleParticipants+totalFemaleParticipants;
        const totalTrip = trips.length;

      res.status(200).json({
          success: true,
          message: "Berhasil memuat semua trip",
          data : {
            totalTrip,
            totalSchedule,
            totalProfit,
            totalReview,
            totalCompletedSchedules,
            totalUpcomingSchedules,
            totalMaleParticipants,
            totalFemaleParticipants,
            totalParticipants
          }
      })
      
  } catch (err) {
      res
      .status(404)
      .json({
          success: false,
          message: "Data tidak ditemukan.",
      })   
  }
}

export const getReportPerTrip = async(req,res)=>{
  const idTrip = req.params.idTrip

  try {
        const trip = await Trip.findById(idTrip).populate("reviews").populate("schedules")
          
        let totalProfit = 0;
        const totalSchedule = trip.schedules.length;
        const totalReview = trip.reviews.length;
        let totalCompletedSchedules = 0;
        let totalUpcomingSchedules = 0;
        let participantsSet = new Set();
        let genderCounts = { male: 0, female: 0 };

      // Tanggal saat ini
        const currentDate = new Date();

        trip.schedules.forEach((schedule)=>{
            const scheduleProfit = schedule.price * schedule.participants.length;
            totalProfit += scheduleProfit;

            if (schedule.tripDate < currentDate) {
                totalCompletedSchedules += 1;
            } else {
                totalUpcomingSchedules += 1;
            }

            schedule.participants.forEach((participant) => {
            // Gunakan email peserta sebagai identifier untuk memeriksa duplikasi
            const participantIdentifier = participant.email;
            // Tambahkan peserta ke participantsSet jika belum ada
            if (!participantsSet.has(participantIdentifier)) {
                participantsSet.add(participantIdentifier);
    
                // Hitung jenis kelamin peserta
                if (participant.gender === 'laki-laki') {
                genderCounts.male += 1; // Laki-laki
                } else if (participant.gender === 'perempuan') {
                genderCounts.female += 1; // Perempuan
                }
            }
            });

        })
        const totalMaleParticipants = genderCounts.male;
        const totalFemaleParticipants = genderCounts.female;
        const totalParticipants = totalMaleParticipants+totalFemaleParticipants;

      res.status(200).json({
          success: true,
          message: "Berhasil memuat report trip",
          data: {trip,
          totalSchedule,
          totalProfit,
          totalReview,
          totalCompletedSchedules,
          totalUpcomingSchedules,
          totalMaleParticipants,
          totalFemaleParticipants,
          totalParticipants}
      })
      
  } catch (err) {
    console.log("errornya : ", err)
      res
      .status(404)
      .json({
          success: false,
          message: "Data tidak ditemukan.",
      })   
  }
}

export const getReportPerSchedule = async(req,res)=>{
  const idSchedule = req.params.idSchedule

  try {
        const scheduleTrip = await Schedule.findById(idSchedule)
        const income = scheduleTrip.price * scheduleTrip.participants.length
        let participantsSet = new Set();
        let genderCounts = { male: 0, female: 0 };
        let cityCounts = {};
        const participantsData = scheduleTrip.participants

        scheduleTrip.participants.forEach((participant) => {
        // Gunakan email peserta sebagai identifier untuk memeriksa duplikasi
        const participantIdentifier = participant.email;
        // Tambahkan peserta ke participantsSet jika belum ada
        if (!participantsSet.has(participantIdentifier)) {
            participantsSet.add(participantIdentifier);

            // Hitung jenis kelamin peserta
            if (participant.gender === 'laki-laki') {
            genderCounts.male += 1; // Laki-laki
            } else if (participant.gender === 'perempuan') {
            genderCounts.female += 1; // Perempuan
            }
        }
        cityCounts[participant.city] = (cityCounts[participant.city] || 0)+1;
        });
        const totalMaleParticipants = genderCounts.male;
        const totalFemaleParticipants = genderCounts.female;
        const totalParticipants = totalMaleParticipants+totalFemaleParticipants;
        const totalCity = Object.keys(cityCounts).length;

      res.status(200).json({
          success: true,
          message: "Berhasil memuat semua trip",
          data : {
            income,
            totalMaleParticipants,
            totalFemaleParticipants,
            totalParticipants,
            totalCity,
            cityCounts,
            participantsData
          }
      })
      
  } catch (err) {
      res
      .status(404)
      .json({
          success: false,
          message: "Data tidak ditemukan.",
      })   
  }
}