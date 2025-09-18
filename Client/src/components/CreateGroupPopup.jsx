import React, { useState ,useEffect } from 'react';
import { Input, Button } from './ui';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createGroup } from '../service/api.service';
import { useNavigate } from 'react-router-dom';
import onOutsideClick from '../utils/onOutsideClick';

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
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm'>
      {/* Modal Card */}
      <div className='flex w-full max-w-md flex-col rounded-lg bg-white p-6 shadow-xl' ref={createGroupRef}>
        {/* Modal Header */}
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-bold'>Create New Group</h2>
          <button onClick={onClose} className='rounded-full p-1 hover:bg-gray-200'>
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
        </div>

        {apiError && <p className='mb-4 text-center text-red-600'>{apiError}</p>}

        {/* Form for Group Name */}
        <form onSubmit={handleSubmit(handleCreateGroup)} className='mb-4'>
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
        <h3 className='mb-2 font-semibold'>Select Members</h3>
        <div className='flex-1 space-y-2 overflow-y-auto border-t border-b py-2'>
          {users.map((user) => {
            const isSelected = members.includes(user._id);
            return (
              <div
                key={user._id}
                onClick={() => handleToggleMember(user._id)}
                // 4. Visual feedback for selected users
                className={`flex cursor-pointer items-center rounded-lg p-2 transition-colors ${
                  isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
              >
                <img
                  src={user.avatarURL}
                  alt={user.username}
                  className='mr-3 h-10 w-10 rounded-full object-cover'
                />
                <span className='flex-1 font-medium'>{user.username}</span>
                {isSelected && (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='h-6 w-6 text-blue-600'
                  >
                    <path
                      fillRule='evenodd'
                      d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06L10.5 12.94l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l3.75-3.75z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className='mt-4'>
          <Button type='button' onClick={handleSubmit(handleCreateGroup)} className='w-full'>
            Create Group
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateGroupPopup;
