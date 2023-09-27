import express from "express";
import { createAdmin, deleteAdmin, getAllAdmin } from "../controllers/adminController.js";



const router = express.Router()

router.post('/addNewAdmin', createAdmin)
router.get('/getAllAdmin', getAllAdmin)
router.delete('/deleteAdmin/:idAdmin', deleteAdmin)

export default router