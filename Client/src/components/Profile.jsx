import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getGroupsMembersData } from '../service/api.service'; // You will need to create this API service function
import onOutsideClick from '../utils/onOutsideClick';

function Profile({ onClose }) {
  const { currentUserOrGroup: selectedChat } = useSelector((state) => state.chat);

  const [membersData, setMembersData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const profileRef = onOutsideClick(onClose);

  const isGroupChat = selectedChat && 'groupName' in selectedChat;

  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (isGroupChat && selectedChat?._id) {
        setIsLoading(true);
        try {
          const response = await getGroupsMembersData(selectedChat._id);
          setMembersData(response.data.data);
        } catch (error) {
          console.error('Failed to fetch group members:', error);
          setMembersData([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setMembersData([]);
      }
    };

    fetchGroupMembers();
  }, [selectedChat, isGroupChat]);

  const chatName = isGroupChat ? selectedChat.groupName : selectedChat.fullName;
  const chatAvatar = isGroupChat ? selectedChat.avatarURL : selectedChat.avatarURL;
  const chatUsername = !isGroupChat && selectedChat.username;

  return (
    // Backdrop Overlay
    <div onClick={onClose} ref={profileRef} className='bg-opacity-30  h-screen z-4'>
      {/* Profile Panel */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the panel
        className='bottom-0 right-0 z-50 h-full w-full max-w-sm transform bg-white shadow-xl transition-transform duration-300 ease-in-out'
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
