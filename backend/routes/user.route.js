import express from "express";
import {
  deleteUser,
  updateUser,
  getUserListings,
  getUser,
} from "../controllers/user.controller.js";
import { verifyuser } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/update/:id", verifyuser, updateUser);
router.delete("/delete/:id", verifyuser, deleteUser);
router.get("/listings/:id", verifyuser, getUserListings);
router.get("/:id", verifyuser, getUser);

export default router;
