import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import "dotenv/config";
import RestaurantRoute from "./routes/RestaurantRoute";
import { v2 as cloudinary } from "cloudinary";
import RestaurantSearchRoute from "./routes/RestaurantSearchRoute";
const app=express();

app.use(
  cors()
);

mongoose.connect(process.env.MONGO_URI as string).then(()=>{
    console.log('MongoDb connected');
}).catch((err)=> console.log('Mongo connection error',err))

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use("/api/v1/restaurant", RestaurantRoute);
app.use(express.json({ limit: "50MB" }));
app.use("/api/restaurant", RestaurantSearchRoute);

app.listen(8002,()=>{
    console.log('server connected to port : 8002');
})
