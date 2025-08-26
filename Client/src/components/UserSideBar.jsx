import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserList , getGroups} from '../service/api.service';
import { setUsers, setCurrentUserOrGroup , setGroups } from '../store/chatSlice';
import { useState } from 'react';

function UserSideBar() {
  const dispatch = useDispatch();
  const [ members , setMembers ] = useState([]);
  const { users, groups , currentUserOrGroup, onlineUsers } = useSelector((state) => state.chat);
  const rightClickMenu = [ 'select' , 'inspect' , 'show' ]

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUserList();
        dispatch(setUsers(response.data.data));
      } catch (error) {
        console.error("Failed to fetch user list:", error.message);
      }
    };

    fetchUsers();

    const fetchGroups = async () => {
      try {
        const fetchedGroups = await getGroups();
        dispatch(setGroups(fetchedGroups.data.data))
      } catch (error) {
        console.log(error.message)
      }
    }

    fetchGroups();
  }, [dispatch]);

  const handleSelectUserOrGroup = (user) => {
    dispatch(setCurrentUserOrGroup(user));
  };

  

  return (
    <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-100 border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">Chats</h2>
      </div>
      <div className="flex flex-col">
        {users.map((user) => {
          // Check if the current user is in the onlineUsers list
          const isOnline = onlineUsers.includes(user._id);

          return (
            <div
              key={user._id}
              onClick={() => handleSelectUserOrGroup(user)}
              className={`flex items-center p-3 cursor-pointer transition-colors duration-200
                          ${currentUserOrGroup?._id === user._id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}
                          ${members.includes(user._id) ?? 'bg-gray-200'}  `}>

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
        {
          groups.map((group) => (
            <div
              key={group._id}
              onClick={() => handleSelectUserOrGroup(group)}>
                <div>
                  <img src={group.avatarURL} alt="Avatar of group" />
                </div>
                <span>{group.groupName}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default UserSideBar;
