import { asyncHandler } from "../utils/AsyncHandler.js";
import { apiError } from "../utils/ApiError.js";
import { apiResponse } from "../utils/ApiResponse.js";
import { Group } from "../models/group.model.js";
import { Member } from '../models/member.model.js'
import { User } from "../models/user.model.js"

// --- CREATE GROUP ---
const createGroup = asyncHandler(async (req, res) => {
    const { groupName , members } = req.body;
    const createdBy = req.user._id;

    if (!groupName?.trim() || !members || !Array.isArray(members) || members.length === 0) {
        throw new apiError(400, "Group name and at least one member are required.");
    }

    const initialAdmins = [createdBy];
    // Use a Set to prevent the creator from being added twice if they are also in the members list.
    const allMembers = [...new Set([...members , createdBy])];

    const group = await Group.create({
        groupName,
    });

    allMembers.map(async (member) => {
        const isAdmin = member && initialAdmins.includes(member) ;
        const isCreatedByUser = member === createdBy;
        await Member.create({
            groupId: group._id,
            userId: member,
            isAdmin,
            isCreatedByUser,
        })
    })

    return res.status(201).json(new apiResponse(201, group, "Group created successfully"));
});

// --- DELETE GROUP ---
const deleteGroup = asyncHandler(async (req, res) => {
    const groupId = req.params?.groupId;
    console.log(groupId)

    if (!groupId) {
        throw new apiError(400, "Group ID is required");
    }

    const group = await Group.findById(groupId);
    if (!group) {
        throw new apiError(404, "Group not found");
    }

    // Only the original creator of the group can delete it.
    if (group.createdBy.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Forbidden: Only the group creator can delete the group.");
    }

    await Group.findByIdAndDelete(groupId);

    return res.status(200).json(new apiResponse(200, {}, "Group deleted successfully"));
});

// --- ADD MEMBER ---
const addMember = asyncHandler(async (req, res) => {
    const { groupId, userId } = req.body;

    if (!groupId || !userId) {
        throw new ApiError(400, "Group ID and User ID are required.");
    }

    const group = await Group.findById(groupId);
    if (!group) {
        throw new ApiError(404, "Group not found");
    }

    // Check if the person making the request is an admin.
    if (!group.admins.includes(req.user._id)) {
        throw new ApiError(403, "Forbidden: Only admins can add members.");
    }

    if (group.members.includes(userId)) {
        throw new ApiError(400, "User is already in the group.");
    }

    // Use findByIdAndUpdate to get the updated document back.
    const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        { $addToSet: { members: userId } },
        { new: true } // This option returns the modified document.
    );

    return res.status(200).json(new apiResponse(200, updatedGroup, "User added to group successfully"));
});

// --- REMOVE MEMBER ---
const removeMember = asyncHandler(async (req, res) => {
    const { groupId, userId } = req.body;

    if (!groupId || !userId) {
        throw new ApiError(400, "Group ID and User ID are required.");
    }

    const group = await Group.findById(groupId);
    if (!group) {
        throw new ApiError(404, "Group not found");
    }

    // SECURITY: Only admins can remove members.
    if (!group.admins.includes(req.user._id)) {
        throw new ApiError(403, "Forbidden: Only admins can remove members.");
    }
    
    // Prevent the last member from being removed.
    if (group.members.length <= 1) {
        throw new ApiError(400, "Cannot remove the last member of the group.");
    }

    const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        { $pull: { members: userId, admins: userId } },
        { new: true }
    );

    return res.status(200).json(new apiResponse(200, updatedGroup, "User removed from group successfully"));
});

// --- ADD ADMIN ---
const addAdmin = asyncHandler(async (req, res) => {
    const { groupId, userId } = req.body;

    if (!groupId || !userId) {
        throw new ApiError(400, "Group ID and User ID are required.");
    }

    const group = await Group.findById(groupId);
    if (!group) {
        throw new ApiError(404, "Group not found");
    }

    // Only existing admins can make new admins.
    if (!group.admins.includes(req.user._id)) {
        throw new ApiError(403, "Forbidden: Only admins can add other admins.");
    }

    // A user must be a member to become an admin.
    if (!group.members.includes(userId)) {
        throw new ApiError(400, "User must be a member of the group to be made an admin.");
    }

    if (group.admins.includes(userId)) {
        throw new ApiError(400, "User is already an admin.");
    }

    const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        { $addToSet: { admins: userId } },
        { new: true }
    );

    return res.status(200).json(new apiResponse(200, updatedGroup, "User promoted to admin successfully"));
});

// --- REMOVE ADMIN ---
const removeAdmin = asyncHandler(async (req, res) => {
    const { groupId, userId } = req.body;
    
    if (!groupId || !userId) {
        throw new ApiError(400, "Group ID and User ID are required.");
    }

    const group = await Group.findById(groupId);
    if (!group) {
        throw new ApiError(404, "Group not found");
    }

    // Only the group creator can demote other admins.
    if (group.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Forbidden: Only the group creator can remove admins.");
    }

    // The creator cannot be removed as an admin.
    if (group.createdBy.toString() === userId.toString()) {
        throw new ApiError(400, "The group creator cannot be removed as an admin.");
    }

    const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        { $pull: { admins: userId } },
        { new: true }
    );

    return res.status(200).json(new apiResponse(200, updatedGroup, "Admin removed successfully"));
});

// --- GET GROUP ---
const getGroups = asyncHandler(async (req , res) => {
  const userId = req.user._id;

  if(!userId){
    throw new apiError(401 , "User is not logged in ")
  }

  const groups = await Member.aggregate([
    {
        $lookup:{
            from: "groups",
            localField: "groupId",
            foreignField: "_id",
            as: "groupData",
        }
    },
    {
        $project: {
    	    "userId": 1,
    	    "groupData": 1,
        }
    },
    {
        $match: {
            "userId": userId,
        }
    }
  ])
  let allGroupsUserIsPartOf = [];
  groups.map((group) => {
    allGroupsUserIsPartOf.push(group.groupData[0])
  })
//   console.log(allGroupsUserIsPartOf)

  if(allGroupsUserIsPartOf.length === 0){
    return res
      .status(200)
      .json(new apiResponse(200, {} , "User is not a member of any groups"));
  }

  return res
    .status(200)
    .json(new apiResponse(200, allGroupsUserIsPartOf , "Groups fetched successfully"));

})

// --- GET GROUPS MEMBERS DATA ---
const getGroupsMembersData = asyncHandler(async (req , res) => {

})

export {
    createGroup,
    deleteGroup,
    addMember,
    removeMember,
    addAdmin,
    removeAdmin,
    getGroups,
};
