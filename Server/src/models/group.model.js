import { Schema, model } from 'mongoose';

const groupSchema = new Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    avatarURL: {
      type: String,
      default:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/800px-User-avatar.svg.png',
    },
  },
  { timestamps: true }
);

export const Group = model('Group', groupSchema);
