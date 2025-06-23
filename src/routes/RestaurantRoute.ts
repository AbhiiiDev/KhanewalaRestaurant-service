import express from 'express';
import multer from 'multer'
import {createRestaurant,getRestaurant,updateRestaurant} from '../controllers/RestaurantController'
import { jwtCheck, jwtParse } from '../middleware/auth';

const router=express.Router();

const storage=multer.memoryStorage();

const upload=multer({
    storage:storage,
    limits:{
        fileSize: 5 * 1024 * 1024, //5mb
    },

})

router.get('/',jwtCheck,jwtParse,getRestaurant)
router.post('/',upload.single('imageFile'),jwtCheck,jwtParse,createRestaurant);
router.put('/',upload.fields([
    { name: 'imageFile', maxCount: 1 }, // for restaurant image
    { name: 'menuItemsImages', maxCount: 20 }, // for menu item images
  ]),jwtCheck,jwtParse,updateRestaurant);


export default router;