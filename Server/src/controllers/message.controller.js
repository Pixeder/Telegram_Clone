import { asyncHandler } from "../utils/AsyncHandler.js";
import { apiError } from "../utils/ApiError.js";
import { apiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";

const getMessages = asyncHandler( async (req , res) => {
    const {recipientId} = req.params
    const senderId = req.user?._id

    if(!recipientId){
      throw new apiError(400 , "Recipient id is required")
    }

    const converstion = await Message.find({
      $or: [
        { senderId: senderId, recipientId: recipientId },
        { senderId: recipientId, recipientId: senderId },
      ],
    }).sort({ createdAt: "asc" });

    return res
      .status(200)
      .json(
        new apiResponse(200 , converstion , "Messages fetched successfully")
      )

});

export {
  getMessages,
}