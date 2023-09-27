import multer from "multer";

// Konfigurasi penyimpanan untuk file gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req.body)
    if(!req.body.imageDirectory){
      // Mengirim respons kesalahan jika direktori tidak dideklarasikan
      return cb(new Error("Direktori penyimpanan belum dideklarasi"), null);
    }
    cb(null, req.body.imageDirectory);
  },
  filename: (req, file, cb) => {
    // Nama file akan menjadi timestamp + nama asli file
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Inisialisasi multer dengan konfigurasi penyimpanan
const upload = multer({ storage: storage });

export { upload };