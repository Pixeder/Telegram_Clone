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
      required: true,
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group"
    }
  },
  { timestamps: true,}
)

export const Message = model("Message" , messageSchema)