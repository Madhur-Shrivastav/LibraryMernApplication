import express from "express";
import { deleteUser, updateUser } from "../controllers/user.controller.js";
import { verifyuser } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/update/:id", verifyuser, updateUser);
router.delete("/delete/:id", verifyuser, deleteUser);

export default router;
