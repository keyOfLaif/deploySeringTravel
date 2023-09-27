
import express from 'express'
import { insertImage, getAllImage } from '../controllers/galleryController.js';
import { verifyAdmin } from '../utils/verifyToken.js'


const router = express.Router()


router.post('/upImage', insertImage)
router.get('/', getAllImage)

export default router;