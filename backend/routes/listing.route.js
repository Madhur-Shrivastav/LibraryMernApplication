import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyuser } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyuser, createListing);
router.delete("/delete/:id", verifyuser, deleteListing);
router.post("/update/:id", verifyuser, updateListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);

export default router;
