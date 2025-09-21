import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { logoutUser } from '../service/api.service';
import { Button, Container } from './ui';
import DarkModeButton from './DarkModeButton';
import { motion, AnimatePresence } from 'motion/react';

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
    // --- Start of restyled JSX block ---
    <motion.header
      // Animation for the header sliding in
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      // Styling with dark mode classes
      className='sticky top-0 z-50 bg-white/80 py-3 shadow-sm backdrop-blur-lg dark:bg-slate-800/80 dark:shadow-slate-700/50'
    >
      <Container>
        <nav className='flex items-center justify-between'>
          <div className='mr-4'>
            <Link to='/' className='flex items-center space-x-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='h-8 w-8 text-sky-500' // Changed to sky blue for consistency
              >
                <path d='M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z' />
              </svg>
              <span className='hidden text-xl font-bold text-gray-800 sm:inline-block dark:text-white'>
                TeleClone
              </span>
            </Link>
          </div>

          <div className='flex items-center space-x-2 md:space-x-4'>
            <AnimatePresence mode='wait'>
              {isAuthenticated ? (
                <motion.div
                  key='loggedIn'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className='flex items-center space-x-2 md:space-x-4'
                >
                  <DarkModeButton />
                  <span className='hidden font-medium text-gray-700 md:inline-block dark:text-gray-300'>
                    Welcome, {user?.fullName || 'User'}
                  </span>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleLogout}
                      className='w-auto rounded-full px-4 py-2 text-sm' // Use rounded-full for modern look
                    >
                      Logout
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key='loggedOut'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className='flex items-center space-x-2 md:space-x-4'
                >
                  <DarkModeButton />
                  <Link to='/login'>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        bgColor='bg-transparent'
                        textColor='text-sky-500'
                        className='w-auto rounded-full px-4 py-2 text-sm font-semibold hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-slate-700'
                      >
                        Login
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to='/register'>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className='w-30'
                    >
                      <Button className='w-auto rounded-full px-4 py-2 text-sm'>Sign Up</Button>
                    </motion.div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </Container>
    </motion.header>
    // --- End of restyled JSX block ---
  );
}

export default Header;
