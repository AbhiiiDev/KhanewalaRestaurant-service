import {Request, Response,NextFunction} from 'express';
import {auth} from 'express-oauth2-jwt-bearer'
import jwt from 'jsonwebtoken';
import User from '../models/User';




declare global {
    namespace Express {
      interface Request {
        userId: string;
        auth0Id: string;
      }
    }
  }


export const jwtCheck=auth({
    audience:process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  tokenSigningAlg:process.env.TOKEN_SIGNING_ALGO,
})



export const jwtParse=async(
    req:Request,
    res:Response,
    next:NextFunction
)=>
{
const {authorization}=req.headers;

if(!authorization || !authorization.startsWith('Bearer '))
{
    return res.sendStatus(401);
}


const token=authorization.split(" ")[1];

try {
    
    const decoded=jwt.decode(token) as jwt.JwtPayload;
    const auth0Id=decoded.sub;

    const user=await User.findOne({auth0Id});

    if(!user)
        {
            return res.sendStatus(404);
        }

        req.auth0Id=user.auth0Id as string;
        req.userId=user._id.toString();
        
next();
} catch (error) {
    return res.sendStatus(401);
}
}