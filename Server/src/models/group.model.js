import { Schema , model } from "mongoose";

const groupSchema = new Schema({
  createdBy:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    trim: true,
    immutable: true,
  },
  admins: {
    type:[{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    trim: true,
  },
  groupName : {
    type: String,
    required: true,
  },
  members:{
    type: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    required: true,
    trim: true,
  },
  avatarURL: {
    type: String,
    default : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/800px-User-avatar.svg.png"
  }

} ,{ timestamps : true})

export const Group = model("Group" , groupSchema)