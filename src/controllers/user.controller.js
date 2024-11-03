import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const generateTokens = async (user) => {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshtoken = refreshToken;
    await user.save({validateBeforeSave: false})
    return {accessToken, refreshToken}
} 

const options = {
    httpOnly: true,
    secured: true
}

const register = asyncHandler(async (req, res) => {
    // gwt user data,
    // validate it,
    // check if user existed
    // if not create one and send response

    const {username, email, password} = req.body;

    if([username, email, password].some(feild => feild?.trim() === "")){
        throw new ApiError(400, "all feilds are required"); 
    }

    const existedUser = await User.findOne({
        $or:[{username}, {email}]
    })

    if(existedUser){        
        throw new ApiError(400, "user already existed");
    }

    const user = await User.create({
        username,
        email,
        password
    })

    if(!user){
        throw new ApiError(400, "user not created");
    }
    
    const createdUser = await User.findById(user.id).select("-refreshtoken -password");

    return res
    .status(200)
    .json(
        new ApiResponse(200, createdUser, "user registered")
    )    
})

const login = asyncHandler(async (req, res) => {
    // get user data
    // validate if its not empty
    // check if the user exist or not, 
    // if found check its password
    // if correct then generate tokens and send to cookies

    const {identifier, password} = req.body;

    if([identifier, password].some(feild => feild?.trim() === "")){
        throw new ApiError(400, "all feilds must be required");
    }  

    const userFound = await User.findOne({[identifier.match(/.*?@?[^@]*\.+.*/) ? "email" : "username"]: identifier});
    
    if(!userFound){
        throw new ApiError(400, "user not found");
    }   

    const isPasswordCorrect = await userFound.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(400, "password incorrect");
    }

    const {accessToken, refreshToken} = await generateTokens(userFound);

    const loggedInUser = await User.findById(userFound.id, "-refreshtoken -password") 

    return res
    .cookie("AccessToken", accessToken, options)
    .cookie("RefreshToken", refreshToken, options)
    .status(200)
    .json(
        new ApiResponse(200, loggedInUser, "user logged IN")
    )            
})

// logout

const logout = asyncHandler(async (req, res) => {
    // check jwt
    // if ok then remove it from db and cookies
    
    const loggedOutUser = await User.findByIdAndUpdate(
        req?.user.id,
        {
            $unset: {"refreshtoken": ""}
        },
        {new: true}         
    ).select("-refreshtoken -password"); 
    
    return res
    .status(200)
    .clearCookie("AccessToken")
    .clearCookie("RefreshToken")
    .json(
        new ApiResponse(200, loggedOutUser, "user logged out successfully")
    )
})

const dummy = asyncHandler(async (req, res) => {
    return res.json({
        user: req?.user.username,
        email: req?.user.email 
    })
}) 


export { login, register, logout, dummy }