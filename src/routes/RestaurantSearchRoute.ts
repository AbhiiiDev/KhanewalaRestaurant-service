import express from 'express';
import {param} from 'express-validator'
import {getRestaurant,searchRestaurant} from '../controllers/RestaurantSearchController';

const router=express.Router();


// route for "api/v1/restaurant/Lucknow" - city bases search for particular city restaurants

router.get(
    "/:restaurantId",
    param("restaurantId")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("RestaurantId paramenter must be a valid string"),getRestaurant
  );

//route to search the restaurant from search bar, along with filters and sortings

router.get('/search/:city',param('city').notEmpty().isString().trim().withMessage("city parameter must be valid string"),searchRestaurant)


export default router;