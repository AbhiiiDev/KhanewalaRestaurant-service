import express from 'express';
import multer from 'multer'
import {approveRestaurant, createRestaurant,getRestaurant,updateRestaurant} from '../controllers/RestaurantController'
import { jwtCheck, jwtParse } from '../middleware/auth';
import { getRestStatus } from '../controllers/PendingRestController';

const router=express.Router();

const storage=multer.memoryStorage();

const upload=multer({
    storage:storage,
    limits:{
        fileSize: 5 * 1024 * 1024, //5mb
    },

})

router.get('/',jwtCheck,jwtParse,getRestaurant)
router.get('/status',jwtCheck,jwtParse,getRestStatus)
router.post('/approve',upload.single('imageFile'),jwtCheck,jwtParse,approveRestaurant)
router.post('/',upload.single('imageFile'),jwtCheck,jwtParse,createRestaurant);
router.post('/approve',upload.single('imageFile'),jwtCheck,jwtParse,createRestaurant);
router.put('/',upload.single('imageFile'),jwtCheck,jwtParse,updateRestaurant);


export default router;