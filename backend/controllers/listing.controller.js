import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/errror.js";
import { getUserListings } from "./user.controller.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = new Listing(req.body);
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(402, "Listing not found!"));
  }
  if (req.user.id !== listing.owner) {
    return next(errorHandler(402, "You can only delete your own listing"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findOne({ _id: req.params.id });
  if (!listing) {
    return next(errorHandler(402, "Listing not found!"));
  }
  if (req.user.id !== listing.owner) {
    return next(errorHandler(402, "You can only update your own listing"));
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let For = req.query.for;
    if (!For || For === "all") {
      For = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    console.log({ for: For, sort: sort, searchTerm: searchTerm, order: order });

    const listings = await Listing.find({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { author: { $regex: searchTerm, $options: "i" } },
        { publisher: { $regex: searchTerm, $options: "i" } },
        { releasedate: { $regex: searchTerm, $options: "i" } },
      ],

      for: For,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
