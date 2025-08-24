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
  memebers:{
    type: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    required: true,
    trim: true,
  },
  avatarURL: {
    type: String,
    default : "https://via.placeholder.com/150/771796/FFFFFF?text=Group"
  }

} ,{ timestamps : true})

export const Group = model("Group" , groupSchema)