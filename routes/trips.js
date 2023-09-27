import express from 'express'
import { createTrip, deleteTrip, getAllTrip, getFeaturedTrip, getSingleTrip, getTripBySearch, getTripCount, updateTrip } from '../controllers/tripController.js'


import { verifyAdmin } from '../utils/verifyToken.js';
import { upload } from '../utils/multer.js';

const router = express.Router();
// create new Trip
router.post("/", upload.single('tripImage'), createTrip);

// update Trip
router.put("/:id", upload.single('tripImage') ,updateTrip);

// delete Trip
router.delete("/deleteTrip/:id", deleteTrip);

// get Single Trip
router.get("/:id", getSingleTrip);

// get All Trip
router.get("/", getAllTrip);

// get Trip by search
router.get("/search/getTripBySearch", getTripBySearch);

// get featured Trip
router.get("/search/getFeaturedTrips", getFeaturedTrip);

// get Trip Count
router.get("/search/getTripCount", getTripCount);


export default router;