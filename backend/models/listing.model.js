import mongoose from "mongoose";
const Schema = mongoose.Schema;

const listingSchema = new Schema(
  {
    owner: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    releasedate: {
      type: String,
      required: true,
    },
    purchasedate: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    pages: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    for: {
      type: String,
      required: true,
    },
    imageURLS: {
      type: [String],
      required: true,
    },
  },
  {
    timeStamp: true,
  }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
