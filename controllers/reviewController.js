import Trip from "../models/Trip.js"
import Review from "../models/Review.js"

export const createReview = async (req,res)  => {
    
    const tripId = req.params.tripId
    const newReview = new Review({...req.body})

    try {

        const savedReview = await newReview.save()

        // after creating a new review now update the review array of the trip
        await Trip.findByIdAndUpdate(tripId, {
            $push: {reviews: savedReview._id}
        })

        res.status(200).json({
            success: true,
            message: "Review berhasil dikirimkan",
            data: savedReview
        })
        
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Review gagal untuk dikirimkan"
        })
    }
};