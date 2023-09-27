
import express from 'express'
import { createSchedule, deleteSchedule, getAllSchedules, updateSchedule } from '../controllers/scheduleController.js'


const router = express.Router()

router.post('/:tripId', createSchedule)
router.get('/', getAllSchedules)
router.put('/:idSchedule', updateSchedule)
router.delete('/deleteSchedule/:idSchedule', deleteSchedule)

export default router