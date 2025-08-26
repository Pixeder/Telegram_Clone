import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserList, getGroups } from '../service/api.service';
import { setUsers, setCurrentUserOrGroup, setGroups } from '../store/chatSlice';
import { Link } from 'react-router-dom';

// SVG Icon for creating a group
const CreateGroupIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-8 h-8"
  >
    <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 015.69 3.117A1.99 1.99 0 0118 15.75c.025.22.038.447.038.675a2.25 2.25 0 01-2.25 2.25H8.214a2.25 2.25 0 01-2.25-2.25c0-.228.013-.455.038-.675a1.99 1.99 0 01.308-.533zM15.75 15.75a1.5 1.5 0 01-1.5-1.5pM15.75 15.75a1.5 1.5 0 01-1.5-1.5p" clipRule="evenodd" />
    <path d="M16.5 19.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
    <path fillRule="evenodd" d="M18 15.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M16.5 18a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
  </svg>
);

function UserSideBar() {
  const dispatch = useDispatch();
  // 1. Removed unused 'members' and 'rightClickMenu' state/variables
  const { users, groups, currentUserOrGroup, onlineUsers } = useSelector((state) => state.chat);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [userResponse, groupResponse] = await Promise.all([
          getUserList(),
          getGroups()
        ]);
        dispatch(setUsers(userResponse.data.data));
        dispatch(setGroups(groupResponse.data.data));
      } catch (error) {
        console.error("Failed to fetch sidebar data:", error.message);
      }
    };
    fetchAll();
  }, [dispatch]);

  const handleSelect = (item) => {
    dispatch(setCurrentUserOrGroup(item));
  };

  return (
    <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-100 border-r border-gray-200 h-screen flex flex-col relative">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">Chats</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {/* Groups Section */}
        {groups && groups.length > 0 && (
          <div className="p-2">
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase">Groups</h3>
            {groups.map((group) => (
              <div
                key={group._id}
                onClick={() => handleSelect(group)}
                className={`flex items-center p-2 mt-1 rounded-lg cursor-pointer transition-colors duration-200 ${
                  currentUserOrGroup?._id === group._id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                }`}
              >
                <img
                  src={group.groupAvatarURL}
                  alt={group.groupName}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <span className="font-medium">{group.groupName}</span>
              </div>
            ))}
          </div>
        )}

        {/* Users Section */}
        <div className="p-2">
          <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase">Users</h3>
          {users.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            return (
              <div
                key={user._id}
                onClick={() => handleSelect(user)}
                className={`flex items-center p-2 mt-1 rounded-lg cursor-pointer transition-colors duration-200 ${
                  currentUserOrGroup?._id === user._id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                }`}
              >
                <div className="relative mr-3">
                  <img
                    src={user.avatarURL}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <span className="font-medium">{user.username}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Group Floating Action Button */}
      <Link
        to="/createGroup"
        className="absolute bottom-5 right-5 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors"
        title="Create new group"
      >
        <CreateGroupIcon />
      </Link>
    </div>
  );
}

export default UserSideBar;
