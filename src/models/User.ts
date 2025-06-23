import mongoose from "mongoose";


const userSchema=new mongoose.Schema({
    auth0Id: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      addressLine1: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      postalCode: {
        type: String,
      },
      country: {
        type: String,
      },
      role: {
    type: String,
    enum: ["customer", "restaurant","admin"],
    default: "customer",
    required: true
  },
})

const User=mongoose.model("User",userSchema);

export default User;