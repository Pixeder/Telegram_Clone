import { Schema , model } from "mongoose";

const messageSchema = new Schema({
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recieverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group"
    },
    fileURL: {
      type: String,
    },
    fileType: {
      type: String,
    }
  },
  { timestamps: true,}
)

export const Message = model("Message" , messageSchema)