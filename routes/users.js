import express from "express";
import { deleteUser, getAllUser, getSingleUser, updateUser } from "../controllers/userController.js";
const router = express.Router()

import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

// update USer
router.put("/:id", updateUser);

// delete user
router.delete("/:id", verifyUser, deleteUser);

// get Single user
router.get("/:id", verifyUser, getSingleUser);

// get All user
router.get("/", getAllUser);

export default router;