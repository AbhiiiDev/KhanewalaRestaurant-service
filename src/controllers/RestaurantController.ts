import Restaurant from "../models/Restaurant";
import {v2 as cloudinary} from 'cloudinary'
import {Request,Response} from 'express';
import mongoose from "mongoose";
import User from "../models/User";
import PendingRestaurant from "../models/PendingRestaurant";


const getRestaurant=async(req:Request,res:Response)=>{
    try {
        const currentRestaurant=await Restaurant.findOne({
         user:req.userId
        });
        if(!currentRestaurant)
        {
            return res.status(404).json({message:'Restaurant not found'})
        }
      
        res.json(currentRestaurant);
    } catch (error) {
        res.status(400).json({message:'Error while finding user'})
    }
}




const approveRestaurant=async(req:Request,res:Response)=>{

try {
const {id}=req.params;
   const pending=await PendingRestaurant.findById(id);
   if(!pending || pending.isApproved!=='pending')
    return res.status(404).json({message:"No Restaurant Request found"});
 

    const restaurant=new Restaurant({
...pending.toObject(),
user:pending.user,
lastUpdated:new Date()
    })

    await restaurant.save();
  const user=await User.findById(pending.user);
        if(user) 
      {  user.role="restaurant";
        await user.save();}
        pending.isApproved="approved";
        await pending.save();
        res.status(200).json({message:"Restaurant Approved",restaurant})

} catch (error) {
    return res.status(400).json({
     error,
        message:"problem creating Restaurant"
    })
}

}


const updateRestaurant= async(req:Request,res:Response)=>{


    const restaurant=await Restaurant.findOne({
        user:req.userId
    })

    if(!restaurant)
    {
        return res.status(404).json({message:'No Restaurant found'});
    }

    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems=req.body.menuItems;
    restaurant.lastUpdated = new Date();


    if(req.file)
    {
        const imageUrl=await uploadImage(req.file as Express.Multer.File);
        restaurant.imageUrl=imageUrl;
    }

    if (req.body.menuItems && Array.isArray(req.body.menuItems)) {
        restaurant.menuItems = req.body.menuItems.map((item: any) => ({
            name: item.name,
            price: item.price,        }));
    }

    await restaurant.save();
    res.status(200).json({message:"Successfully update restaurants"});

}

const getApprovalRestaurant=async(req:Request,res:Response)=>{
   try {

    if (!req.file) {
        return res.status(400).json({ message: 'File is required' });
    }
 
    // const existingRestaurant=await Restaurant.findOne({user:req.userId});
    // if(existingRestaurant)
    //     {
    //         return res.status(409).json({message:"Restaurant already exists"});
    //     }
const existingPending=await PendingRestaurant.findOne({
    user:req.userId,
    status:"pending"
});
if(existingPending)
{return res.status(409).json({message:"Restaurant request already created"})}

        const imageUrl=await uploadImage(req.file as Express.Multer.File);

        const pendingRestaurant=new PendingRestaurant({
            ...req.body,
            imageUrl,
            user:req.userId
        });
        await pendingRestaurant.save();
            return res.status(202).json({ message: "Restaurant submitted for approval" });

} catch (error) {
    return res.status(400).json({
     error,
        message:"problem creating Restaurant"
    })
}
}

const uploadImage = async (file: Express.Multer.File) => {
    try {
        const base64Image = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${base64Image}`;

        const uploadResponse = await cloudinary.uploader.upload(dataURI);
        return uploadResponse.url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw new Error('Image upload failed');
    }



  };

export {
    approveRestaurant,
    getRestaurant,
    updateRestaurant,
    getApprovalRestaurant
}