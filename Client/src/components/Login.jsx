import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from './ui';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { loginUser } from '../service/api.service';
import { useNavigate, Link } from 'react-router-dom';

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
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md'>
        <h2 className='text-center text-2xl font-bold'>Log in to your account</h2>

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
              // 3. The input type is now controlled by our state
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

          {/* 4. Styled "Show Password" Checkbox */}
          <div className='flex items-center space-x-2'>
            <input
              id='show-password-checkbox'
              type='checkbox'
              checked={passwordShown}
              onChange={togglePasswordVisibility}
              className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500'
            />
            <label
              htmlFor='show-password-checkbox'
              className='cursor-pointer text-sm font-medium text-gray-700'
            >
              Show Password
            </label>
          </div>

          <Button type='submit'>Login</Button>
        </form>
        <p className='text-center text-sm'>
          Don't have an account?{' '}
          <Link to='/register' className='font-medium text-blue-600 hover:underline'>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
