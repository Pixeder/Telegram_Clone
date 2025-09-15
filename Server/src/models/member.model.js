import { Schema, model } from 'mongoose';

const memberSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
    },
    isCreatedByUser: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export const Member = model('Member', memberSchema);
