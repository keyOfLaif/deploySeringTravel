import express from 'express'
import { getFullReport, getReportPerSchedule, getReportPerTrip } from '../controllers/reportController.js'

const router = express.Router()

router.get('/fullReport', getFullReport)
router.get('/reportPerTrip/:idTrip', getReportPerTrip)
router.get('/reportPerSchedule/:idSchedule', getReportPerSchedule)

export default router