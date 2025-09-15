import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { logoutUser } from '../service/api.service';
import { Button, Container } from './ui';

function Header() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <header className='sticky top-0 z-50 bg-white py-3 shadow-md'>
      <Container>
        <nav className='flex items-center justify-between'>
          <div className='mr-4'>
            <Link to='/' className='flex items-center space-x-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='h-8 w-8 text-blue-600'
              >
                <path d='M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z' />
              </svg>
              <span className='hidden text-xl font-bold sm:inline-block'>TeleClone</span>
            </Link>
          </div>

          <div className='flex items-center space-x-4'>
            {isAuthenticated ? (
              <>
                <span className='hidden font-medium md:inline-block'>
                  Welcome, {user?.username || 'User'}
                </span>
                <Button
                  onClick={handleLogout}
                  className='w-auto px-4 py-2 text-sm' // Override default full-width
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to='/login'>
                  <Button
                    bgColor='bg-transparent'
                    textColor='text-blue-600'
                    className='w-auto px-4 py-2 text-sm hover:bg-blue-50'
                  >
                    Login
                  </Button>
                </Link>
                <Link to='/register'>
                  <Button className='w-auto px-4 py-2 text-sm'>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
