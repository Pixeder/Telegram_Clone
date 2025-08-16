import React from 'react'
import { useForm} from 'react-hook-form'
import { Button , Input } from './ui'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'


function Login() {

  const dispatch = useDispatch()
  const { register, handleSubmit , formState: { errors } } = useForm()

  const onSubmit = (userData) => {
    console.log(userData)
    dispatch(login(userData))
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input 
          label="email"
          type="email"
          placeholder="Enter your email"
          {...register('email' ,{
            required: "Email is required",
            pattern: {
              alue: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
              message: "Email address must be a valid address"
            }
          })}
        />
        <Input 
          label="password"
          type="password"
          placeholder="Enter your password"
          {...register('password' ,{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters"
            }
          })}
        />
        <Button 
          type="submit" 
          children="Login"
        />
      </form>
    </div>
  )
}

export default Login

