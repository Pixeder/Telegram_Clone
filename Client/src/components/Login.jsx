import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from './ui';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { loginUser } from '../service/api.service';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  // 1. State to manage password visibility
  const [passwordShown, setPasswordShown] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (userData) => {
    setApiError('');
    const lastOnline = Date.now();
    try {
      const updatedUserData = {...userData , lastOnline}
      const response = await loginUser(updatedUserData);
      const { user, accessToken } = response.data.data;
      const token = accessToken;
      dispatch(login({ user, token }));
      navigate('/');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Login failed. Please check your credentials or try again later.';
      console.error('Login error:', error.response || error); // Log the response if available, otherwise the full error
      setApiError(errorMessage);

      setApiError(errorMessage);
    }
  };

  // 2. Function to toggle the password visibility state
  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    // --- Start of restyled JSX block ---
  <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-slate-900'>
    <motion.div
      // Animation for the card fading in
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // Styling with dark mode classes
      className='w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md dark:bg-slate-800'
    >
      <div className="text-center">
        <h2 className='text-2xl font-bold text-gray-800 dark:text-white'>Log in to your account</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Welcome back!</p>
      </div>


      {apiError && <p className='text-center text-red-600'>{apiError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
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
            <Button type='submit' className="w-full font-semibold">Login</Button>
        </motion.div>
      </form>
      <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
        Don't have an account?{' '}
        <Link to='/register' className='font-medium text-sky-600 hover:underline dark:text-sky-400'>
          Sign up
        </Link>
      </p>
    </motion.div>
  </div>
  // --- End of restyled JSX block ---
  );
}

export default Login;
