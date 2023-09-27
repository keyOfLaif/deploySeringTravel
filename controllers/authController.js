import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


//user registration
export const register = async (req, res) => {

    try {

        const {username, email, password} = req.body;

        const existingUsername = await User.findOne({username})
        const existingEmail = await User.findOne({email})

        if(existingEmail) {
            return res.status(400).json({
                success : false,
                message: "Email sudah terdaftar, gunakan yang lain atau silahkan log in."
            })
        }

        if(existingUsername){
            return res.status(400).json({
                success: false,
                message: "Username sudah ada, cari yang lain atau silahkan log in."
            })
        }

        //hashing password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const newUser = new User({ 
            username,
            email,
            password: hash,
            // photo: req.body.photo
        })

        await newUser.save()

        res.status(200).json({
            success: true,
            message: "Berhasil membuat akun",
        })
        
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Gagal membuat akun, silahkan coba lagi",
        })
    }
}

//user login
export const login = async (req, res) => {

    const email = req.body.email;

    try {

        const user = await User.findOne({email}).populate(
            {
                path:'bookings', 
                populate : 
                {
                    path:'tripBooked',
                    populate : {
                        path:'productIdofTrip'
                    }
        }})

        // jika user tidak ditemukan
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User tidak ada, email tidak terdaftar",
            })
        }

        // jika user ada maka check password

        const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password)

        // jika password tidak benar/sesuai
        if(!checkCorrectPassword){
            return res.status(401).json({
                success: false,
                message: "Password tidak sesuai"
            })
        }

        const {password, ... rest} = user._doc

        // membuat token jwt
        const token = jwt.sign({
            id: user._id,
            role: user._doc.role
        }, process.env.JWT_SECRET_KEY,
        {
            expiresIn: '1d'
        })

        // tempatkan token pada browser cookies dan selanjutnya mengirimkan response ke client side
        res.cookie('accessToken', token, {
            httpOnly: true,
            expires:token.expiresIn
        }).status(200).json({
            token,
            data: {... rest},
            role: user._doc.role
        })
        
    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Gagal melakukan login"
        })
        
    }
}