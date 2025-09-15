import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getGroupsMembersData } from '../service/api.service'; // You will need to create this API service function

function Profile({ onClose }) {
  // 1. Get the selected chat from the Redux store
  const { currentUserOrGroup: selectedChat } = useSelector((state) => state.chat);

  // 2. State to hold the detailed member data for groups
  const [membersData, setMembersData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 3. Determine if the selected chat is a group
  const isGroupChat = selectedChat && 'groupName' in selectedChat;

  // 4. CORRECTED useEffect for fetching data
  useEffect(() => {
    // Define the async function inside the effect
    const fetchGroupMembers = async () => {
      // Only fetch if it's a group chat
      if (isGroupChat && selectedChat?._id) {
        setIsLoading(true);
        try {
          // Call the new API service function
          const response = await getGroupsMembersData(selectedChat._id);
          setMembersData(response.data.data);
        } catch (error) {
          console.error('Failed to fetch group members:', error);
          setMembersData([]); // Reset on error
        } finally {
          setIsLoading(false);
        }
      } else {
        setMembersData([]); // Clear members if it's not a group chat
      }
    };

    fetchGroupMembers();
  }, [selectedChat, isGroupChat]); // Correct dependency array

  // 5. Dynamic data based on chat type
  const chatName = isGroupChat ? selectedChat.groupName : selectedChat.fullName;
  const chatAvatar = isGroupChat ? selectedChat.avatarURL : selectedChat.avatarURL;
  const chatUsername = !isGroupChat && selectedChat.username;

  return (
    // Backdrop Overlay
    <div onClick={onClose} className='bg-opacity-30 fixed inset-0 z-40 bg-black backdrop-blur-sm'>
      {/* Profile Panel */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the panel
        className='fixed top-0 right-0 z-50 h-full w-full max-w-sm transform bg-white shadow-xl transition-transform duration-300 ease-in-out'
      >
        <div className='flex h-full flex-col'>
          {/* Header */}
          <div className='flex items-center border-b border-gray-200 p-4'>
            <button onClick={onClose} className='rounded-full p-2 hover:bg-gray-100'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-6 w-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
            <h2 className='ml-4 text-xl font-bold'>Profile</h2>
          </div>

          {/* Profile Info */}
          <div className='flex flex-col items-center space-y-2 p-6'>
            <img
              src={chatAvatar}
              alt='Avatar'
              className='mb-4 h-24 w-24 rounded-full object-cover'
            />
            <h3 className='text-2xl font-bold'>{chatName}</h3>
            <p className='text-gray-500'>{chatUsername}</p>
          </div>

          {/* Members List for Groups */}
          {isGroupChat && (
            <div className='flex-1 overflow-y-auto border-t border-gray-200'>
              <h4 className='p-4 text-lg font-semibold text-gray-700'>Members</h4>
              {isLoading ? (
                <p className='p-4 text-gray-500'>Loading members...</p>
              ) : (
                // 6. CORRECTED and styled member mapping
                membersData.map((member) => (
                  <div key={member._id} className='flex items-center px-4 py-3 hover:bg-gray-50'>
                    <img
                      src={member.avatarURL}
                      alt={member.username}
                      className='mr-4 h-10 w-10 rounded-full object-cover'
                    />
                    <div className='flex-1'>
                      <p className='font-semibold'>{member.fullName}</p>
                      <p className='text-sm text-gray-500'>@{member.username}</p>
                    </div>
                    {member.isAdmin && (
                      <span className='rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600'>
                        Admin
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
