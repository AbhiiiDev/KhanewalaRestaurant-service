import { Request,Response } from "express";
import Restaurant from "../models/Restaurant";

const getRestaurant=async (req:Request,res:Response)=>{
    try {
    const restaurantId=req.params.restaurantId;

    const restaurant=await Restaurant.findById(restaurantId);

    if(!restaurant){
        return res.status(404).json({message:"can't find any restaurant"})
    }

    return res.json(restaurant);

} catch (error) {
    console.log(error);
    res.status(400).json({message:"something went wrong while searching restaurant through city"});
}
}


const searchRestaurant=async(req:Request,res:Response)=>{
    try {
      const city=req.params.city;
      const searchQuery=(req.query.searchQuery as string )|| "";
      const selectedCuisines=(req.query.selectedCuisines as string) || "";
      const sortOptions=(req.query.sortOptions as string) || "lastUpdated";
      const page= parseInt(req.query.selectedCuisine as string) || 1;

      let query:any= {};
      query['city']=new RegExp(city,'i');

      const cityCheck=await Restaurant.countDocuments(query);

      if(cityCheck===0)
      {
        return res.status(404).json({
            data:[],
            pagination:{
                total:0,
                page:1,
                pages:1,
            }
        });
      }

      //query to search by cuisines filter
      if(selectedCuisines)
      {
        const cuisineArray=selectedCuisines.split(",").map((cuisine)=>new RegExp(cuisine,"i"));

        query['cuisines']={$in:cuisineArray};
      }
      if(searchQuery)
      {
        const searchRegex=new RegExp(searchQuery,"i");

        //search through either name of restaurant or cuisines  
        // mongodb query for OR method
        query["$or"]=[
            {restaurantName:searchRegex},
            {cuisines:{$in:[searchRegex]}}
        ]
      }

      const pageSize=10;
      const skip=   (page-1)* pageSize; // 3-1=2*10= 20 if page 3rd, then skip 20 items

      //sortOptions ="lastUpdated"

      const restaurants=await Restaurant.find(query).sort({[sortOptions]:1}).skip(skip).limit(pageSize).lean();


      const total=await Restaurant.countDocuments(query);

      const response={
        data:restaurants,
        pagination:{
            total,
            page,
            pages: Math.ceil(total/pageSize),
        }
      }

      res.json(response);
      

    } catch (error) {
        console.log(error);
        res.status(400).json({message:'Error while fetching restaurant using regex queries'})
    }
}

export {
    getRestaurant, 
    searchRestaurant
}