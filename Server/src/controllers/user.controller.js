import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { apiError } from '../utils/ApiError.js';
import { apiResponse } from '../utils/ApiResponse.js';

const options = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findOne(userId);

    if (!user) {
      throw new apiError(404, 'Invalid User Request');
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new apiError(
      500,
      error.message || 'Something went wrong while genrating refresh and access tokens'
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullName, avatarURL, lastOnline } = req.body;

  if ([username, email, password, fullName].some((field) => field?.trim() === '')) {
    throw new apiError(400, 'All fields are required');
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new apiError(400, 'User already exists');
  }

  const user = await User.create({
    username,
    email,
    password,
    fullName,
    avatarURL,
    lastOnline
  });

  const createdUser = user.toObject();
  delete createdUser.password;
  delete createdUser.refreshToken;
  delete createdUser.lastOnline;

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  return res.status(201).json(new apiResponse(201, createdUser, 'User created successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, lastOnline } = req.body;
  // console.log(lastOnline)

  if ([email, password].some((field) => field?.trim() === '')) {
    throw new apiError(400, 'All fields are required');
  }

  const user = await User.findOneAndUpdate({ email } , {$set: {lastOnline}} , {returnDocument: "after"});

  if (!user) {
    throw new apiError(404, 'User with entered email not exist');
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new apiError(401, 'Invalid credentials');
  }
  const createdUser = user.toObject();
  delete createdUser.password;
  delete createdUser.refreshToken;
  delete createdUser.lastOnline;

  if (!createdUser) {
    throw new apiError(400, 'Something went wrong in logging in user');
  }

  const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user?._id);

  if (!refreshToken || !accessToken) {
    throw new apiError(500, 'Something went wrong in getting access and refresh tokens');
  }

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: createdUser,
          accessToken,
          refreshToken,
        },
        'User logged in successfully'
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new apiResponse(200, {}, 'User logged out successfully'));
});

const getUsersList = asyncHandler(async (req, res) => {
  const usersList = await User.find({
    _id: { $ne: req.user?._id },
  }).select('-password -refreshToken');

  return res.status(200).json(new apiResponse(200, usersList, 'Users list fetched successfully'));
});

export { registerUser, loginUser, logoutUser, getUsersList };
