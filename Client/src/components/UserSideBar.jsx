import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserList, getGroups } from '../service/api.service';
import { setUsers, setCurrentUserOrGroup, setGroups, clearNotification } from '../store/chatSlice';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Input } from './ui';
import { useForm } from 'react-hook-form';
// --- SVG Icons for UI ---
const CreateGroupIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='currentColor'
    className='h-6 w-6'
  >
    <path
      fillRule='evenodd'
      d='M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 015.69 3.117A1.99 1.99 0 0118 15.75c.025.22.038.447.038.675a2.25 2.25 0 01-2.25 2.25H8.214a2.25 2.25 0 01-2.25-2.25c0-.228.013-.455.038-.675a1.99 1.99 0 01.308-.533zM15.75 15.75a1.5 1.5 0 01-1.5-1.5pM15.75 15.75a1.5 1.5 0 01-1.5-1.5p'
      clipRule='evenodd'
    />
    <path d='M16.5 19.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z' />
    <path
      fillRule='evenodd'
      d='M18 15.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z'
      clipRule='evenodd'
    />
    <path
      fillRule='evenodd'
      d='M16.5 18a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z'
      clipRule='evenodd'
    />
  </svg>
);
const SearchIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-5 w-5 text-gray-400 dark:text-gray-500'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
    />
  </svg>
);

// 2. --- Framer Motion Variants for Animation ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Each child will animate 0.05s after the previous one
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

function UserSideBar({ onOpenCreateGroup }) {
  // --- ALL YOUR EXISTING LOGIC REMAINS UNTOUCHED ---
  const dispatch = useDispatch();
  const { users, groups, currentUserOrGroup, onlineUsers, notifications } = useSelector(
    (state) => state.chat
  );
  const [selectedChat, setSelectedChat] = useState('allchat');
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [userResponse, groupResponse] = await Promise.all([getUserList(), getGroups()]);
        dispatch(setUsers(userResponse.data.data));
        dispatch(setGroups(groupResponse.data.data));
      } catch (error) {
        console.error('Failed to fetch sidebar data:', error.message);
      }
    };
    fetchAll();
  }, [dispatch, groups]);

  const handleSelect = (item) => {
    dispatch(setCurrentUserOrGroup(item));
    dispatch(clearNotification(item._id));
  };

  // --- END OF UNTOUCHED LOGIC ---

  return (
    // --- ALL STYLING AND ANIMATION CHANGES BEGIN HERE ---
    <div className='flex h-screen w-full max-w-xs flex-col border-r border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800'>
      {/* Header Area */}
      <header className='flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-4 dark:border-slate-700'>
        <h2 className='text-xl font-bold text-gray-800 dark:text-white'>My Chats</h2>
        <div>
          <Button
            onClick={onOpenCreateGroup}
            className='rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-400 dark:text-gray-400 dark:hover:bg-slate-700'
            title='Create new group'
          >
            <CreateGroupIcon />
          </Button>
        </div>
      </header>

      {/* Search Bar */}
      <div className='border-b border-gray-200 p-4 dark:border-slate-700'>
        <motion.div
          // Animation properties from framer-motion
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          // Your existing classes
          className='relative'
        >
          <Input
            type='text'
            placeholder='Search all chats...'
            className='w-full rounded-lg border-transparent bg-gray-100 py-2 pr-4 pl-10 text-sm text-gray-700 transition focus:ring-2 focus:ring-sky-500 focus:outline-none dark:bg-slate-700 dark:text-gray-200'
          />
          <span className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <SearchIcon />
          </span>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className='flex items-center space-x-2 border-b border-gray-200 p-2 dark:border-slate-700'>
        <Button
          className='flex-1 rounded-md bg-sky-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm'
          onClick={() => setSelectedChat('allchat')}
        >
          All Chats
        </Button>
        <Button
          className='flex-1 rounded-md px-3 py-1.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-400 dark:text-gray-300 dark:hover:bg-slate-700'
          onClick={() => setSelectedChat('groups')}
        >
          Groups
        </Button>
        <Button
          className='flex-1 rounded-md px-3 py-1.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-400 dark:text-gray-300 dark:hover:bg-slate-700'
          onClick={() => setSelectedChat('archived')}
        >
          Archived
        </Button>
      </div>

      {/* Chat List with Animation */}
      <motion.div
        className='flex-1 overflow-y-auto'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        {/* Groups Section */}
        {selectedChat === 'groups' && groups && groups.length > 0 && (
          <div className='p-2'>
            <h3 className='px-2 pt-2 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500'>
              Groups
            </h3>
            {groups.map((group) => {
              // 2. Get the notification count for this group
              const notificationCount = notifications[group._id] || 0;
              return (
                <motion.div
                  key={group._id}
                  variants={itemVariants}
                  onClick={() => handleSelect(group)}
                  className={`mt-1 flex cursor-pointer items-center rounded-lg p-2 transition-colors duration-200 ${currentUserOrGroup?._id === group._id ? 'bg-sky-100 dark:bg-sky-900' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                  <div className='relative mr-3'>
                    <img
                      src={group.avatarURL}
                      alt={group.groupName}
                      className='h-10 w-10 rounded-full object-cover'
                    />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <span
                      className={`block truncate font-semibold ${currentUserOrGroup?._id === group._id ? 'text-sky-800 dark:text-sky-200' : 'text-gray-800 dark:text-gray-200'}`}
                    >
                      {group.groupName}
                    </span>
                  </div>
                  {/* 3. Render the notification badge */}
                  <AnimatePresence>
                    {notificationCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className='flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white'
                      >
                        {notificationCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Users Section */}
        {selectedChat === 'allchat' && (
          <div className='p-2'>
            <h3 className='px-2 pt-2 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500'>
              Users
            </h3>
            {users.map((user) => {
              const isOnline = onlineUsers.includes(user._id);
              // 4. Get the notification count for this user
              const notificationCount = notifications[user._id] || 0;
              return (
                <motion.div
                  key={user._id}
                  variants={itemVariants}
                  onClick={() => handleSelect(user)}
                  className={`mt-1 flex cursor-pointer items-center rounded-lg p-2 transition-colors duration-200 ${currentUserOrGroup?._id === user._id ? 'bg-sky-100 dark:bg-sky-900' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                  <div className='relative mr-3'>
                    <img
                      src={user.avatarURL}
                      alt={user.username}
                      className='h-10 w-10 rounded-full object-cover'
                    />
                    {isOnline && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className='absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-slate-800'
                      ></motion.div>
                    )}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <span
                      className={`block truncate font-semibold ${currentUserOrGroup?._id === user._id ? 'text-sky-800 dark:text-sky-200' : 'text-gray-800 dark:text-gray-200'}`}
                    >
                      {user.fullName}
                    </span>
                    <p
                      className={`truncate text-xs ${currentUserOrGroup?._id === user._id ? 'text-sky-600 dark:text-sky-400' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      Last message placeholder...
                    </p>
                  </div>
                  {/* 5. Render the notification badge */}
                  <AnimatePresence>
                    {notificationCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className='flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white'
                      >
                        {notificationCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default UserSideBar;
