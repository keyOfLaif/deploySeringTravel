import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import tripRoute from './routes/trips.js'
import userRoute from './routes/users.js'
import authRoute from './routes/auth.js'
import reviewRoute from './routes/reviews.js'
import bookingRoute from './routes/bookings.js'
import scheduleRoute from './routes/schedules.js'
import galleryRoute from './routes/gallerys.js'
import adminRoute from './routes/admin.js'
import reportRoute from './routes/report.js'


dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
const corsOptions = {
    origin:true,
    credentials:true
}

//database connection
mongoose.set("strictQuery", false)
const connect = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })

        console.log('MongoDB database connected')
    } catch (err) {
        console.log('MongoDB database connection failed')
    }
}


//middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors(corsOptions))
app.use(cookieParser())
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/trips', tripRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/review', reviewRoute)
app.use('/api/v1/bookings', bookingRoute)
app.use('/api/v1/schedules', scheduleRoute)
app.use('/api/v1/gallerys', galleryRoute)
app.use('/api/v1/admin', adminRoute)
app.use('/api/v1/report', reportRoute)

app.listen(port, ()=>{
    connect();
    console.log('server listening on port', port)
})