import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getGroupsMembersData } from '../service/api.service'; // You will need to create this API service function
import onOutsideClick from '../utils/onOutsideClick';
import { motion } from 'motion/react';
import { Button } from './ui';

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
   // --- Start of restyled JSX block ---
  <motion.div
    // Animation for the panel sliding in from the right
    key={selectedChat?._id} // Re-animate when the user changes
    initial={{ x: '100%' }}
    animate={{ x: '0%' }}
    exit={{ x: '100%' }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    // Styling with dark mode classes
    className='h-screen w-full max-w-sm flex-shrink-0 flex-col border-l border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800'
  >
    <div className='flex h-full flex-col'>
      {/* Header */}
      <header className='flex flex-shrink-0 items-center border-b border-gray-200 p-4 dark:border-slate-700'>
        <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Profile</h2>
        <motion.Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className='ml-auto rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700'
          title="Close profile"
        >
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='h-6 w-6'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
          </svg>
        </motion.Button>
      </header>

      {/* Main content area */}
      <div className='flex-1 overflow-y-auto'>
        {/* Profile Info */}
        <div className='flex flex-col items-center space-y-2 border-b border-gray-200 p-6 dark:border-slate-700'>
          <img src={chatAvatar} alt='Avatar' className='mb-4 h-24 w-24 rounded-full object-cover' />
          <h3 className='text-2xl font-bold text-gray-800 dark:text-white'>{chatName}</h3>
          <p className='text-sm text-gray-500 dark:text-gray-400'>{chatUsername}</p>
        </div>

        {/* Action Buttons (Call/Video) */}
        <div className="grid grid-cols-2 gap-4 p-6 border-b border-gray-200 dark:border-slate-700">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="w-full font-semibold">Call</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                 <Button className="w-full font-semibold" bgColor="bg-transparent dark:bg-slate-700" textColor="text-gray-700 dark:text-white" >Video</Button>
            </motion.div>
        </div>

        {/* Contact Info (for users) */}
        {!isGroupChat && (
            <div className="p-6 space-y-4 border-b border-gray-200 dark:border-slate-700">
                <h4 className="font-semibold text-gray-800 dark:text-white">Contact Information</h4>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                    <p className="text-gray-900 dark:text-gray-200">@{selectedChat.username}</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                    <p className="text-gray-900 dark:text-gray-200">{selectedChat.email}</p>
                </div>
            </div>
        )}

        {/* Members List for Groups */}
        {isGroupChat && (
          <div className='flex-1'>
            <h4 className='p-4 text-lg font-semibold text-gray-700 dark:text-gray-200'>Members</h4>
            {isLoading ? (
              <p className='px-4 text-gray-500 dark:text-gray-400'>Loading members...</p>
            ) : (
              membersData.map((member) => (
                <div key={member._id} className='flex items-center px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/50'>
                  <img
                    src={member.avatarURL}
                    alt={member.username}
                    className='mr-4 h-10 w-10 rounded-full object-cover'
                  />
                  <div className='flex-1'>
                    <p className='font-semibold text-gray-800 dark:text-gray-200'>{member.fullName}</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>@{member.username}</p>
                  </div>
                  {member.isAdmin && (
                    <span className='rounded-full bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-600 dark:bg-sky-900/50 dark:text-sky-300'>
                      Admin
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Placeholder for future actions */}
        <div className="p-6 space-y-4">
             <h4 className="font-semibold text-gray-800 dark:text-white">Actions</h4>
             <Button className="w-full text-left text-sm text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">Search in conversation</Button>
             <Button className="w-full text-left text-sm text-red-600 dark:text-red-500 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50">Block User</Button>
        </div>
      </div>
    </div>
  </motion.div>
  // --- End of restyled JSX block ---
  );
}

export default Profile;
