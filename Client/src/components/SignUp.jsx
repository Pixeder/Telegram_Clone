import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from './ui';
import { registerUser, uploadSignUpAvatar } from '../service/api.service';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';

function SignUp() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const fileInputRef = useRef(null);

  const Avatars = [
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Felix',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Luna',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Jasper',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Cleo',
    'https://api.dicebear.com/8.x/adventurer/svg?seed=Milo',
  ];

  useEffect(() => {
    if (!uploadedFile) {
      setPreviewURL('');
      return;
    }
    const objectURL = URL.createObjectURL(uploadedFile);
    setPreviewURL(objectURL);

    // This runs when the component unmounts or when 'uploadedFile' changes.
    return () => URL.revokeObjectURL(objectURL);
  }, [uploadedFile]);

  const onSelectAvatar = (url) => {
    setSelectedAvatarUrl(url);
    setUploadedFile(null); // Clear any uploaded file to avoid confusion
  };

  const onChangeUploadedFile = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      setSelectedAvatarUrl(''); // Clear any selected pre-made avatar
    }
  };

  const onSubmit = async (data) => {
    setApiError('');
    try {
      let finalAvatarUrl = selectedAvatarUrl;

      if (uploadedFile) {
        const uploadResponse = await uploadSignUpAvatar(uploadedFile);
        finalAvatarUrl = uploadResponse.url;
      }

      if (!finalAvatarUrl) {
        setApiError('Please select an avatar or upload an image.');
        return;
      }

      const lastOnline = Date.now();

      const payload = { ...data, avatarURL: finalAvatarUrl, lastOnline };
      await registerUser(payload);
      navigate('/login');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Registration failed. Please try again.';
      console.error('Registration error:', error);
      setApiError(errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  // Determine which URL to display in the main preview
  const displayURL =
    previewURL ||
    selectedAvatarUrl ||
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/800px-User-avatar.svg.png';

  return (
    // --- Start of restyled JSX block ---
  <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4 py-12 dark:bg-slate-900'>
    <motion.div
      // Animation for the card fading in
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // Styling with dark mode classes
      className='w-full max-w-lg space-y-6 rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-800'
    >
      <div className="text-center">
        <h2 className='text-3xl font-bold text-gray-800 dark:text-white'>Create your account</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Join the conversation!</p>
      </div>


      {apiError && (
        <p className='rounded-lg bg-red-100 p-3 text-center text-red-600 dark:bg-red-900/50 dark:text-red-400'>{apiError}</p>
      )}

      {/* --- Avatar Selection Section --- */}
      <div className='flex flex-col items-center space-y-4'>
        <p className='text-sm font-medium text-gray-600 dark:text-gray-300'>Choose your avatar</p>
        <img
          src={displayURL}
          className='h-24 w-24 rounded-full border-4 border-gray-200 object-cover dark:border-slate-600'
          alt='Selected Avatar'
        />

        <div className='flex space-x-3'>
          {Avatars.map((avatar, index) => (
            <motion.img
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              src={avatar}
              alt={`Default Avatar ${index + 1}`}
              key={index}
              className={`h-12 w-12 cursor-pointer rounded-full transition-all ${selectedAvatarUrl === avatar ? 'border-4 border-sky-500' : 'border-2 border-gray-300 dark:border-slate-500'}`}
              onClick={() => onSelectAvatar(avatar)}
            />
          ))}
        </div>
        <div className='text-center'>
          <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>Or upload your own</p>
          <input
            type='file'
            ref={fileInputRef}
            onChange={onChangeUploadedFile}
            className='hidden'
            accept='image/*'
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type='button'
              onClick={() => fileInputRef.current.click()}
              bgColor='bg-gray-200 dark:bg-slate-600'
              textColor='text-black dark:text-white'
              className="font-semibold"
            >
              Upload a file
            </Button>
          </motion.div>
        </div>
      </div>

      {/* --- Form Section --- */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <Input
            label='Full Name'
            placeholder='Enter your Full Name'
            type='text'
            {...register('fullName', { required: 'Name is required' })}
          />
          {errors.fullName && (
            <p className='mt-1 text-sm text-red-600'>{errors.fullName.message}</p>
          )}
        </div>
        <div>
          <Input
            label='Username'
            type='text'
            placeholder='Enter your username'
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username && (
            <p className='mt-1 text-sm text-red-600'>{errors.username.message}</p>
          )}
        </div>
        <div>
          <Input
            label='Email'
            type='email'
            placeholder='Enter your email'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: 'Please enter a valid email address',
              },
            })}
          />
          {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>}
        </div>
        <div>
          <Input
            label='Password'
            type={passwordShown ? 'text' : 'password'}
            placeholder='Enter your password'
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
          />
          {errors.password && (
            <p className='mt-1 text-sm text-red-600'>{errors.password.message}</p>
          )}
        </div>

        <div className='flex items-center space-x-2'>
          <input
            id='show-password-checkbox'
            type='checkbox'
            checked={passwordShown}
            onChange={togglePasswordVisibility}
            className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-sky-600 focus:ring-sky-500 dark:bg-slate-600 dark:border-slate-500'
          />
          <label
            htmlFor='show-password-checkbox'
            className='cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Show Password
          </label>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button type='submit' className="w-full font-semibold">Create Account</Button>
        </motion.div>
      </form>
      <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
        Already have an account?{' '}
        <Link to='/login' className='font-medium text-sky-600 hover:underline dark:text-sky-400'>
          Log in
        </Link>
      </p>
    </motion.div>
  </div>
  // --- End of restyled JSX block ---
  );
}

export default SignUp;
