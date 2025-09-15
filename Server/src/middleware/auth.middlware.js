import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { apiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(async (req, _, next) => {
  const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new apiError(401, 'Unauthorized request');
  }
  try {
    const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?.id).select('-password -refreshToken');

    if (!user) {
      throw new apiError(401, 'Invalid Access Token');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new apiError(400, error.message);
  }
});
