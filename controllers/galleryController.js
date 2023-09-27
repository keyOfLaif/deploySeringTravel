import User from '../models/User.js'
import Booking from '../models/Booking.js'
import Trip from '../models/Trip.js'
import Schedule from '../models/Schedule.js'
import multer from 'multer';
import Image from '../models/Image.js'; // Import the Image model or schema




export const insertImage = async (req, res) => {
    const directory = req.query.directory;
    const storage = multer.diskStorage({
        destination: directory,
        filename: (req, file, cb) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          cb(null, fileName);
        },
      });
      
      const upload = multer({
        storage,
        fileFilter: (req, file, cb) => {
          const allowedTypes = ['image/jpeg', 'image/png'];
          if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(new Error('Invalid file type. Only JPEG and PNG images are allowed'));
          }
        },
        limits: { fileSize: 200 * 1024 },
      });
  try {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success:false, error: 'Failed to upload file' });
      }

      if (!req.file) {
        return res.status(400).json({ success:false, error: 'No file uploaded' });
      }

      const newImage = new Image({
        imageName: req.file.filename,
        indexNum: 0,
      });

      try {
        await newImage.save();
        return res.status(200).json({
          success: true,
          message: 'Successfully created',
        });
      } catch (saveErr) {
        console.error('Failed to save image:', saveErr);
        return res.status(500).json({
          success: false,
          message: 'Failed to create. Please try again.',
        });
      }
    });
  } catch (err) {
    console.error('Error occurred while uploading image:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create. Please try again.',
    });
  }
};


// // get single booking
// export const  getBooking = async(req,res)=>{
//     const id = req.params.id

//     try {
//         const book = await Booking.findById(id)

//         res.status(200).json({
//             success: true,
//             message: "successful",
//             data: book,
//         })
//     } catch (err) {
//         res.status(404).json({
//             success: true,
//             message: "not found"
//         })
//     }
// }

// get All Image
export const getAllImage = async(req,res)=>{

    try {
        const images = await Image.find()

        res.status(200).json({
            success: true,
            message: "successful",
            data: images,
        })
    } catch (err) {
        res.status(500).json({
            success: true,
            message: "internal server error",
        })
    }
}