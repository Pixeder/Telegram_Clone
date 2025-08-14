import { User } from "../models/user.model";
import { asynHandler } from "../utils/AsyncHandler.js";
import { apiError } from "../utils/ApiError.js";
import { apiResponse } from "../utils/ApiResponse.js";

const registerUser = asynHandler( async (req , res) => {
  const {username , email , password} = req.body;

  if([username , email , password].some((field) => (field?.trim() === "" ))){
    throw new apiError(400 , "All fields are required")
  }

  const existedUser = await User.findOne(
    { 
      $or : [{email} , {username}]
    }
  )

  if(existedUser){
    throw new apiError(400 , "User already exists")
  }

  const user = await User.create({
    username,
    email,
    password,
  })

  const createdUser = user.toObject()
  delete createdUser.password

  if (!userToReturn) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }


  return res
    .status(201)
    .json(
      new apiResponse(201 , createdUser , "User created successfully")
    )

})

const loginUser = asynHandler( async (req , res) => {
  const {email , password} = req.body;

  if([email , password].some((field) => field?.trim() === "")){
    throw new apiError(400 , "All fields are required")
  }

  const isPasswordCorrect = await User.ispasswordCorrect(password)

  if(!isPasswordCorrect){
    throw new apiError(401 , "Invalid credentials")
  }

  const user = await User.findOne({email})

  if(!user){
    throw new apiError(404 , "Anauthorized user")
  }

  const createdUser = await User.findById(user?._id).select("-password")

  if(!createdUser){
    throw new apiError(400 , "Something went wrong in logging in user")
  }

  return res
    .status(200)
    .json(
      new apiResponse(200 , createdUser , "User logged in successfully")
    )

  })

export {
  registerUser,
  loginUser
}