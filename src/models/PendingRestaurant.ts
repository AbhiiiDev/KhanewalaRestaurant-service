import mongoose from 'mongoose';
import { menuItemSchema } from './Restaurant';


const PendingRestaurantSchema=new mongoose.Schema({
     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        restaurantName: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        deliveryPrice: { type: Number, required: true },
        estimatedDeliveryTime: { type: Number, required: true },
        cuisines: [{ type: String, required: true }],
        menuItems: [menuItemSchema],
        imageUrl: { type: String, required: true },
        lastUpdated: { type: Date, required: true,default:new Date() },
        isApproved:{
            type:String,
            enum:["pending","approved","suspected","rejected"],
            default:"pending",
            required:true,
        }
})

const PendingRestaurant=mongoose.model("PendingRestaurant",PendingRestaurantSchema);
export default PendingRestaurant;