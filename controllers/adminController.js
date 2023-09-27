import User from "../models/User.js";
import bcrypt from "bcryptjs"

export const createAdmin = async (req, res) => {

    try {
        const {username, email, password, fullName} = req.body;

        const existingUsername = await User.findOne({username})
        const existingEmail = await User.findOne({email})

        if(existingEmail) {
            res.status(400).json({
                success : false,
                message: "Email sudah terdaftar, gunakan email lain."
            })
            return;
        }

        if(existingUsername){
            res.status(400).json({
                success: false,
                message: "username sudah ada, gunakan yang lain."
            })
            return;
        }

        //hashing password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const newUser = new User({ 
            username,
            email,
            password: hash,
            fullName,
            role: 'admin',
            // photo: req.body.photo
        })

        await newUser.save()

        res.status(200).json({
            success: true,
            message: "Berhasil membuat data admin baru",
        })
        
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Gagal membuat data admin baru",
        })
    }
}

export const getAllAdmin = async(req,res)=>{

    try {

        const admins = await User.find({role:'admin'})

        res
        .status(200)
        .json({
            success: true,
            message: "Successfully",
            data: admins
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

export const deleteAdmin = async(req,res) =>{
    const adminId = req.params.idAdmin;
    
    try {
        const deletedAdmin = await User.findByIdAndDelete(adminId)

        if(!deleteAdmin){
            return res.status(400).json({success: false, message: "Gagal menghapus data admin"})
        }

        res.status(200).json({success: true, data: deletedAdmin})
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}