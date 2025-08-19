import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from './ui';
import { registerUser } from '../service/api.service';
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  // 1. State to manage password visibility
  const [passwordShown, setPasswordShown] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setApiError('');
    try {
      await registerUser(data);
      // On successful registration, redirect the user to the login page
      navigate('/login');
    } catch (error) {
      // Safely get the error message from the API response
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      console.error("Registration error:", error.response);
      setApiError(errorMessage);
    }
  };

  // 2. Function to toggle the password visibility state
  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Create your account</h2>

        {apiError && <p className="text-red-600 text-center">{apiError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              {...register('username', {
                required: "Username is required"
              })}
            />
            {errors.username && <p className="text-red-600 mt-1 text-sm">{errors.username.message}</p>}
          </div>
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              {...register('email', {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Please enter a valid email address"
                }
              })}
            />
            {errors.email && <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <Input
              label="Password"
              // 3. The input type is now controlled by our state
              type={passwordShown ? "text" : "password"}
              placeholder="Enter your password"
              {...register('password', {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters"
                }
              })}
            />
            {errors.password && <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>}
          </div>

          {/* 4. Styled "Show Password" Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              id="show-password-checkbox"
              type="checkbox"
              checked={passwordShown}
              onChange={togglePasswordVisibility}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="show-password-checkbox"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Show Password
            </label>
          </div>

          <Button type="submit">
            Create Account
          </Button>
        </form>
        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
