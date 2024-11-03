import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const authenticate = asyncHandler(async (req, res, next) => {
    const accesstoken = req.cookies.AccessToken || req.header("Authorization")?.replace("Bearer ","");
    
    if(!accesstoken){
        throw new ApiError(400, "access token not found");
    }

    jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
        if(err) {           
            throw new ApiError(403, "your`e session has been expired, you need to login again"); 
        }    
        req.user = result;
        return next();    
    })    
    
       
})

export {authenticate}