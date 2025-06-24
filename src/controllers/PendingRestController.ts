import { Request, Response } from "express";
import PendingRestaurant from "../models/PendingRestaurant";

const getAllPending=async(req:Request,res:Response)=>{
try {
    const pendingRestaurants=await PendingRestaurant.find({
        status:"pending"
    });

    if(!pendingRestaurants) return res.status(404).json({message:"Unable to find any pending restaurants"});

    res.json(pendingRestaurants);
} catch (error) {
    return res.status(400).json({error,message:"Problem fetching pending restaurnats"})
}
}
const getRestStatus=async(req:Request,res:Response)=>{
try {
    const pendingRestaurant=await PendingRestaurant.findOne({
        user:req.userId
    });

    if(!pendingRestaurant) return res.status(404).json({message:"Unable to find any pending restaurants"});

    res.json(pendingRestaurant);
} catch (error) {
    return res.status(400).json({error,message:"Problem fetching pending restaurnats"})
}
}

export { getAllPending,getRestStatus}