import Trip from "../models/Trip.js"
import Schedule from "../models/Schedule.js";

export const createSchedule = async (req,res)  => {
    
    const tripId = req.params.tripId;
    const newSchedule = new Schedule({productIdofTrip : tripId, ...req.body})

    try {

        const savedSchedule = await newSchedule.save()

        // after creating a new review now update the review array of the trip
        const updatedTrip = await Trip.findByIdAndUpdate(tripId, {
            $push: {schedules: savedSchedule._id}
        })

        if(!updatedTrip){
            return res.status(400).json({})
        }

        res.status(200).json({
            success: true,
            message: "Jadwal berhasil ditambahkan",
            data: savedSchedule
        })
        
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Jadwal gagal ditambahkan"
        })
    }
};

export const getAllSchedules = async(req,res)=>{

    try {
        const schedules = await Schedule.find({})

        res.status(200).json({
            success: true,
            count: schedules.length,
            message: "Successfully",
            data: schedules
        })
        
    } catch (err) {
        res
        .status(404)
        .json({
            success: false,
            message: "Not Found.",
        })   
    }
}

//update Schedule
export const updateSchedule = async(req,res)=>{

    const id = req.params.idSchedule

    try {
        
        const updatedSchedule = await Schedule.findByIdAndUpdate(id,{
            $set: req.body
        }, {new:true})

        res
            .status(200)
            .json({
                success: true,
                message: "Berhasil mengubah data Schedule",
                data: updatedSchedule,
            })

    } catch (err) {
        res
            .status(500)
            .json({
                success: false,
                message: "Gagal mengubah data Schedule, coba lagi",
            })
    }
}

//delete Schedule
export const deleteSchedule = async(req,res)=>{
    const scheduleId = req.params.idSchedule;

    try {
        const scheduleToDelete = await Schedule.findByIdAndDelete(scheduleId)

        if(!scheduleToDelete){
            return res.status(404).json({success: false, message: "data jadwal tidak ditemukan"})
        }

        const deleteScheduleOnTrip = await Trip.findByIdAndUpdate(scheduleToDelete.productIdofTrip,{
            $pull : {schedules: scheduleId}
        })
  
        if(!deleteScheduleOnTrip){
        return res.status(400).json({success: false, message: "data pesanan belum terhapus"})
        }

        const deletedSchedule = await scheduleToDelete.deleteOne()

        res.status(200).json(
            {
                success: true,
                message: "Jadwal berhasil dihapus.",
                data: deletedSchedule
            })
        
    } catch (err) {
        res
            .status(500)
            .json({
                success: false,
                message: "Jadwal gagal dihapus.",
            })
    }
}