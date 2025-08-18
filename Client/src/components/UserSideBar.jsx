import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserList } from '../service/api.service';
import { setUsers, setCurrentUser } from '../store/chatSlice';

function UserSideBar() {
  const dispatch = useDispatch();
  const { users, currentUser } = useSelector((state) => state.chat);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUserList();
        console.log(response.data.data);
        dispatch(setUsers(response.data.data));
      } catch (error) {
        console.error("Failed to fetch user list:", error.message);
      }
    };

    fetchUsers();
  }, [dispatch]);

  const handleSelectUser = (user) => {
    dispatch(setCurrentUser(user));
  };

  return (
    <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-100 border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">Chats</h2>
      </div>
      <div className="flex flex-col">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => handleSelectUser(user)}
            className={`flex items-center p-3 cursor-pointer transition-colors duration-200
                        ${currentUser?._id === user._id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
          >
            <img
              src={user.avatarURL}
              alt={user.username}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <span className="font-medium">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserSideBar;
