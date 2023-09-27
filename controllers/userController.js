import User from '../models/User.js'

// create new User

// export const createUser = async (req,res)=>{
//     const newUser = new User(req.body)

//     try {
//         const savedUser = await newUser.save();

//         res
//             .status(200)
//             .json({
//                 success: true,
//                 message: "Successfully created",
//                 data: savedUser,
//             })
//     } catch (err) {
//         res
//             .status(500)
//             .json({
//                 success: false,
//                 message: "Failed to create, Try again."
//             })
//     }
// };

//update User
export const updateUser = async(req,res)=>{

    const id = req.params.id

    try {

        console.log("Data perubahan user : ", req.body)
        
        const updateUser = await User.findByIdAndUpdate(id,{
            $set: req.body
        }, {new:true})

        res
            .status(200)
            .json({
                success: true,
                message: "Successfully update",
                data: updateUser,
            })

    } catch (err) {
        res
            .status(500)
            .json({
                success: false,
                message: "Failed to update, Try again.",
            })
    }
}

//delete User
export const deleteUser = async(req,res)=>{
    try {

        await User.findByIdAndDelete(id,{
            $set: req.body
        }, {new:true})

        res
            .status(200)
            .json({
                success: true,
                message: "Successfully deleted",
            })
        
    } catch (err) {
        res
            .status(500)
            .json({
                success: false,
                message: "Failed to delete.",
            })
    }
}

//getSingle User
export const getSingleUser = async(req,res)=>{
    try {

        const user = await User.findById(id,{
            $set: req.body
        }, {new:true})

        res
            .status(200)
            .json({
                success: true,
                message: "Successfully",
                data: user
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

//getAll User
export const getAllUser = async(req,res)=>{

    try {

        const users = await User.find({})

        res
        .status(200)
        .json({
            success: true,
            message: "Successfully",
            data: users
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

// get User by search
export const getUserBySearch = async(req,res)=>{

    const city = new RegExp(req.query.city, "i");
    const distance = parseInt(req.query.distance);
    const maxGroupSize = parseInt(req.query.maxGroupSize);

    try {
        const Users = await User.find({
            city,
            distance: {$gte:distance},
            maxGroupSize: {$gte:maxGroupSize},
        })

        res.status(200).json({
            success:true,
            message:"Successful",
            data:Users,
        })

    } catch (err) {
        res.status(404).json({
            success:false,
            message:"not found",
        })
    }

}


// get User counts
export const getUserCount = async(req,res)=>{
    try {
        const UserCount = await User.estimatedDocumentCount();
        res.status(200).json({
            success:true,
            data:UserCount,
        })
    } catch (err) {
        res.status(500).json({
            success:false,
            message:"Failed to Fetch",
        })
    }
}

