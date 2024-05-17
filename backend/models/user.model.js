import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: {
      type: String,
      default: "https://clipground.com/images/user-icon-vector-png-6.png",
    },
  },
  {
    timeStamp: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
