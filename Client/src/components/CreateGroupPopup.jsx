import React, { useState ,useEffect } from 'react';
import { Input, Button } from './ui';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createGroup } from '../service/api.service';
import { useNavigate } from 'react-router-dom';
import onOutsideClick from '../utils/onOutsideClick';
import { motion } from 'motion/react';

// 1. The component now accepts an `onClose` prop to allow the parent to close it.
function CreateGroupPopup({ onClose }) {
  const [members, setMembers] = useState([]);
  const [apiError, setApiError] = useState('');
  const { users } = useSelector((state) => state.chat);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const createGroupRef = onOutsideClick(onClose);

  // 2. Improved member selection logic: Toggles selection on click.
  const handleToggleMember = (userId) => {
    setMembers(
      (prevMembers) =>
        prevMembers.includes(userId)
          ? prevMembers.filter((id) => id !== userId) // Remove member if already selected
          : [...prevMembers, userId] // Add member if not selected
    );
  };

  const handleCreateGroup = async (data) => {
    setApiError('');
    if (members.length === 0) {
      setApiError('Please select at least one member for the group.');
      return;
    }

    const { groupName } = data;
    const payload = { groupName, members };

    try {
      await createGroup(payload);
      onClose(); // Close the popup on success
      // You might want to refresh the group list in the sidebar here
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create group.';
      setApiError(errorMessage);
    }
  };

   useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        }
    } , [])

  return (
    // 3. Modal Overlay: Covers the screen with a semi-transparent backdrop
    // --- Start of restyled JSX block ---
  <motion.div
    // Animation for the backdrop fading in
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    // Styling with dark mode classes for the overlay
    className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm'
  >
    <motion.div
      // Animation for the modal scaling and fading in
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      // Styling for the modal panel
      className='flex h-[90vh] max-h-[700px] w-full max-w-md flex-col rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800'
      ref={createGroupRef} // Your existing ref
    >
      {/* Modal Header */}
      <div className='mb-4 flex flex-shrink-0 items-center justify-between'>
        <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Create New Group</h2>
        <motion.Button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className='rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700'
            title="Close"
        >
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
        </motion.Button>
      </div>

      {apiError && <p className='mb-4 text-center text-red-600'>{apiError}</p>}

      {/* Form for Group Name */}
      <form onSubmit={handleSubmit(handleCreateGroup)} className='mb-4 flex-shrink-0'>
        <Input
          placeholder='Enter Group Name'
          label='Group Name'
          {...register('groupName', { required: 'Group Name is required' })}
        />
        {errors.groupName && (
          <p className='mt-1 text-sm text-red-600'>{errors.groupName.message}</p>
        )}
      </form>

      {/* User List for Selection */}
      <h3 className='mb-2 flex-shrink-0 font-semibold text-gray-800 dark:text-gray-200'>Select Members</h3>
      <div className='flex-1 space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-slate-700 dark:bg-slate-900/50'>
        {users.map((user) => {
          const isSelected = members.includes(user._id);
          return (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleToggleMember(user._id)}
              className={`flex cursor-pointer items-center rounded-lg p-2 transition-colors ${
                isSelected
                  ? 'bg-sky-100 dark:bg-sky-900'
                  : 'hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              <img
                src={user.avatarURL}
                alt={user.username}
                className='mr-3 h-10 w-10 rounded-full object-cover'
              />
              <span className={`flex-1 font-medium text-gray-800 dark:text-gray-200`}>{user.fullName}</span>
              {isSelected && (
                <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      className='h-6 w-6 text-sky-500'
                    >
                      <path
                        fillRule='evenodd'
                        d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06L10.5 12.94l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l3.75-3.75z'
                        clipRule='evenodd'
                      />
                    </svg>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Action Button */}
      <div className='mt-4 flex-shrink-0'>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type='Button'
              onClick={handleSubmit(handleCreateGroup)}
              className='w-full'
              disabled={members.length === 0} // Disable Button if no members are selected
            >
              Create Group ({members.length} selected)
            </Button>
        </motion.div>
      </div>
    </motion.div>
  </motion.div>
  // --- End of restyled JSX block ---
  );
}

export default CreateGroupPopup;
