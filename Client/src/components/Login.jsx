import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from './ui';
import { useDispatch , useSelector} from 'react-redux';
import { login } from '../store/authSlice';
import { loginUser } from '../service/api.service'; 
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (userData) => {
    setApiError("");
    try {
      const response = await loginUser(userData);
      const { user, accessToken } = response.data.data;
      const token = accessToken;
      dispatch(login({ user, token }));
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
      console.error("Login error:", error.response);
      setApiError(errorMessage);
    }
  };

  const showPassword = () => {
    const toggle = document.getElementById('toggle')
    if(toggle.type === "password"){
      toggle.type = "text"
    } else {
      toggle.type = "password"
    }
  }

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
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, // Corrected typo: 'alue' -> 'value'
                  message: "Please enter a valid email address"
                }
              })}
            />
            {errors.email && <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <Input
              label="Password"
              type="password"
              id="toggle"
              placeholder="Enter your password"
              {...register('password', {
                required: "Password is required",
              })}
            />
            <div className='flex items-center'>
              <div className='w-4 mr-1.5'>
                <Input 
                  className="flex"
                  type="checkbox"
                  onClick = {showPassword}
                />
              </div>
              <p>
                Show Password
              </p>
            </div>
            {errors.password && <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>}
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
