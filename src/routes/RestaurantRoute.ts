import express from 'express';
import multer from 'multer'
import {getApprovalRestaurant,getRestaurant,updateRestaurant, approveRestaurant} from '../controllers/RestaurantController'
import { isAdmin, jwtCheck, jwtParse } from '../middleware/auth';
import { getRestStatus ,getPendingRestaurant} from '../controllers/PendingRestController';

const router=express.Router();

const storage=multer.memoryStorage();

const upload=multer({
    storage:storage,
    limits:{
        fileSize: 5 * 1024 * 1024, //5mb
    },

})

router.get('/',jwtCheck,jwtParse,getRestaurant)
router.get('/pending',jwtCheck,jwtParse,getPendingRestaurant)
router.get('/status',jwtCheck,jwtParse,getRestStatus)
router.post('/approval',upload.single('imageFile'),jwtCheck,jwtParse,getApprovalRestaurant)
// router.post('/',upload.single('imageFile'),jwtCheck,jwtParse,createRestaurant);
router.post('/approve/:id',upload.single('imageFile'),jwtCheck,jwtParse,isAdmin,approveRestaurant);
router.put('/',upload.single('imageFile'),jwtCheck,jwtParse,updateRestaurant);


export default router;