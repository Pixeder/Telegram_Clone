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
  const [apiError, setApiError] = useState("");
  // 1. State to manage password visibility
  const [passwordShown, setPasswordShown] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (userData) => {
    setApiError("");
    try {
      const response = await loginUser(userData);
      const { user, accessToken } = response.data.data;
      
      // The token from the response body is used for the Redux store
      dispatch(login({ user, accessToken }));
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
      console.error("Login error:", error.response);
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
        <h2 className="text-2xl font-bold text-center">Log in to your account</h2>

        {apiError && <p className="text-red-600 text-center">{apiError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            Login
          </Button>
        </form>
        <p className="text-center text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
