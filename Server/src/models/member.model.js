import { Schema ,model } from 'mongoose'

const memberSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isAdmin: {
      type: Boolean,
    },
    isCreatedByUser: {
      type: Boolean,
    }
  },
  {timestamps: true}
)

export const Member = model("Member" , memberSchema);