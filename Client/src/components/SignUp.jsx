import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from './ui';
import { registerUser, uploadSignUpAvatar } from '../service/api.service';
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
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
      setPreviewURL("");
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
        setApiError("Please select an avatar or upload an image.");
        return;
      }

      const payload = { ...data, avatarURL: finalAvatarUrl };
      await registerUser(payload);
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      console.error("Registration error:", error);
      setApiError(errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  // Determine which URL to display in the main preview
  const displayURL = previewURL || selectedAvatarUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/800px-User-avatar.svg.png";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">Create your account</h2>

        {apiError && <p className="text-red-600 text-center bg-red-100 p-3 rounded-lg">{apiError}</p>}
        
        {/* --- Avatar Selection Section --- */}
        <div className='flex flex-col items-center space-y-4'>
          <p className="text-sm font-medium text-gray-600">Choose your avatar</p>
          <img src={displayURL} className='w-24 h-24 rounded-full object-cover border-4 border-gray-200' alt="Selected Avatar" />
          
          <div className='flex space-x-3'>
            {Avatars.map((avatar, index) => (
              <img 
                src={avatar} 
                alt={`Default Avatar ${index + 1}`} 
                key={index} 
                className={`w-12 h-12 rounded-full cursor-pointer transition-transform transform hover:scale-110 ${selectedAvatarUrl === avatar ? 'border-4 border-blue-500' : 'border-2 border-gray-300'}`} 
                onClick={() => onSelectAvatar(avatar)} 
              />
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Or upload your own</p>
            <input type="file" ref={fileInputRef} onChange={onChangeUploadedFile} className="hidden" accept="image/*" />
            <Button type="button" onClick={() => fileInputRef.current.click()} bgColor="bg-gray-200" textColor="text-black">
              Upload a file
            </Button>
          </div>
        </div>
        
        {/* --- Form Section --- */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Assuming you have a 'fullName' field in your User model */}
          <div>
            <Input 
              label="Full Name"
              placeholder="Enter your Full Name"
              type="text"
              {...register("fullName", { required: "Name is required" })} 
            />
            {errors.fullName && <p className="text-red-600 mt-1 text-sm">{errors.fullName.message}</p>}
          </div>
          <div>
            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              {...register('username', { required: "Username is required" })}
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
