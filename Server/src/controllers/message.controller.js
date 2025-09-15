import { asyncHandler } from '../utils/AsyncHandler.js';
import { apiError } from '../utils/ApiError.js';
import { apiResponse } from '../utils/ApiResponse.js';
import { Message } from '../models/message.model.js';
import mongoose from 'mongoose';
import { Group } from '../models/group.model.js';

const getUserMessages = asyncHandler(async (req, res) => {
  const recipientId = req.params.recipientId;
  const senderId = req.user?._id;

  if (!recipientId) {
    throw new apiError(400, 'Recipient id is required');
  }

  const converstion = await Message.find({
    $or: [
      { senderId: senderId, recieverId: recipientId },
      { senderId: recipientId, recieverId: senderId },
    ],
  }).sort({ createdAt: 'asc' });

  return res.status(200).json(new apiResponse(200, converstion, 'Messages fetched successfully'));
});

const getGroupMessages = asyncHandler(async (req, res) => {
  const groupId = req.params.groupId;
  const senderId = req.user?._id;
  console.log(groupId);

  if (!groupId && !mongoose.Types.ObjectId.isValid(groupId)) {
    throw new apiError(401, 'Invalid group Id or not found');
  }

  const group = await Group.findById(groupId);

  if (!group && !group.members.includes(senderId)) {
    throw new apiError(402, 'User doesnot a member of the requested group');
  }

  const groupMessages = await Message.find({
    groupId: groupId,
  }).sort({ createdAt: 'asc' });

  return res
    .status(200)
    .json(new apiResponse(200, groupMessages, 'messages fetched successfully BSDK'));
});

export { getUserMessages, getGroupMessages };
