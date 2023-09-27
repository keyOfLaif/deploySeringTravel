import Trip from '../models/Trip.js'
import Schedule from '../models/Schedule.js';
import fs from 'fs';

// create new Trip
export const createTrip = async (req,res)=>{

    try {
        const { title, city, address, desc, featured } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "File gambar gagal diunggah" });
        }

        const photo = `/tripImages/${req.file.filename}`;
        const newTrip = new Trip({
            title,
            city,
            address,
            desc,
            featured,
            photo, // Simpan nama file gambar ke dalam model Trip
          });
        const savedTrip = await newTrip.save();

        return res.status(200).json(
            {
                success: true,
                message: "Berhasil membuat Trip baru.",
                data: savedTrip,
            })
    } catch (err) {
        console.log("error : ",err)
        return res
            .status(500)
            .json({
                success: false,
                message: "Gagal membuat Trip baru, silahkan coba lagi."
            })
    }
};

//update Trip
export const updateTrip = async(req,res)=>{

    try {
        const id = req.params.id
        const { title, city, address, desc } = req.body;
        const dataForUpdate = {};
        if(title !== ""){
            dataForUpdate.title = title
        }
        if(city !== ""){
            dataForUpdate.city = city
        }
        if(address !== ""){
            dataForUpdate.address = address
        }
        if(desc !== ""){
            dataForUpdate.desc = desc
        }

        const oldTripData = await Trip.findById(id);
        console.log("datanya : ", req.file.filename)

        //Jika user tidak merubah gambar trip
        if (!req.file) {
            const updatedTrip = await Trip.findByIdAndUpdate(id, {
                $set : dataForUpdate,
            })

            //jika gagal mengupdate data trip
            if(!updatedTrip){
                return res.status(400).json({success:false, message:"Gagal merubah Trip"})
            }

            return res.status(200).json({success:true, message:"Berhasil merubah trip tanpa merubah gambar"})
        }
        

        dataForUpdate.photo = `/tripImages/${req.file.filename}`;

        const updatedTrip = await Trip.findByIdAndUpdate(id,{
            $set: dataForUpdate
        }, {new:true})

        if(oldTripData.photo) {
            const oldTripImagePath = `../frontend/public${oldTripData.photo}`
            fs.unlinkSync(oldTripImagePath)
        }

        res
            .status(200)
            .json({
                success: true,
                message: "Berhasil mengubah data Trip.",
                data: updatedTrip,
            })

    } catch (err) {
        res
            .status(500)
            .json({
                success: false,
                message: "Gagal mengubah data Trip, coba lagi.",
            })
    }
}

//delete Trip
export const deleteTrip = async(req,res)=>{
    const id = req.params.id;

    try {
        const tripDeleted = await Trip.findByIdAndDelete(id)

        if(!tripDeleted){
            return res.status(404).json(
                {
                    success: false,
                    message: "Trip tidak ditemukan.",
                })
        }

        if(tripDeleted.photo) {
            const tripImagePath = `../frontend/public${tripDeleted.photo}`
            fs.unlinkSync(tripImagePath)
        }

        res.status(200).json(
            {
                success: true,
                message: "Trip berhasil dihapus.",
            })
        
    } catch (err) {
        console.log("errornya : ",err)
        res
            .status(500)
            .json({
                success: false,
                message: "Trip gagal dihapus.",
            })
    }
}

//getSingle Trip
export const getSingleTrip = async(req,res)=>{
    const id = req.params.id;
    try {

        const trip = await Trip.findById(id).populate("schedules").populate("reviews");

        res
            .status(200)
            .json({
                success: true,
                message: "Successfully",
                data: trip
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

//getAll Trip
export const getAllTrip = async(req,res)=>{


    //for pagination
    const page = parseInt(req.query.page)

    try {
        const trips = await Trip.find({})
            .populate("reviews").populate("schedules")
            .skip(page * 8)
            .limit(8);

        res.status(200).json({
            success: true,
            count: trips.length,
            message: "Berhasil memuat semua trip",
            data: trips
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

// get Trip by search
export const getTripBySearch = async(req,res)=>{

    const city = new RegExp(req.query.city, "i");
    const distance = parseInt(req.query.distance);
    const maxGroupSize = parseInt(req.query.maxGroupSize);

    try {
        const trips = await Trip.find({
            city,
            distance: {$gte:distance},
            maxGroupSize: {$gte:maxGroupSize},
        }).populate('reviews').populate('schedules')

        res.status(200).json({
            success:true,
            message:"Successful",
            data:trips,
        })

    } catch (err) {
        res.status(404).json({
            success:false,
            message:"not found",
        })
    }

}

//getFeatured Trip
export const getFeaturedTrip = async(req,res)=>{

    try {
        const currentDate = new Date();
        const scheduleIds = await Schedule.find({
            tripDate: { $gt: currentDate }
        }).distinct('_id');
          
          // Langkah 2: Mencari Trip dengan field schedules yang mengandung ID dari Schedules yang sesuai
        const trips = await Trip.find({
        'schedules': { $in: scheduleIds }
        }).populate('reviews').populate('schedules');

        res
        .status(200)
        .json({
            success: true,
            message: "Berhasil mengambil Trip featured",
            data: trips
        })
        
    } catch (err) {
        res
        .status(404)
        .json({
            success: false,
            message: "Pencarian tidak ada.",
        })   
    }
}

// get Trip counts
export const getTripCount = async()=>{
    try {
        const tripCount = await Trip.estimatedDocumentCount();
        res.status(200).json({
            success:true,
            data:tripCount,
        })
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"Failed to Fetch",
        })
    }
}