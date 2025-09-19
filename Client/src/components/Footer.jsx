import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from './ui';
import { motion } from 'motion/react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // --- Start of restyled JSX block ---
  <motion.footer
    // Animation for the footer fading in
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    // Styling with dark mode classes
    className='mt-auto border-t border-gray-200 bg-white py-4 dark:border-slate-700 dark:bg-slate-800'
  >
    <Container>
      <div className='flex flex-col items-center justify-between text-center sm:flex-row sm:text-left'>
        {/* Copyright Notice */}
        <p className='mb-2 text-sm text-gray-500 dark:text-gray-400 sm:mb-0'>
          &copy; {currentYear} TeleClone. All Rights Reserved.
        </p>

        {/* Footer Links */}
        <div className='flex items-center space-x-4'>
          <Link
            to='/privacy-policy'
            className='text-sm text-gray-500 transition-colors hover:text-sky-500 hover:underline dark:text-gray-400 dark:hover:text-sky-400'
          >
            Privacy Policy
          </Link>
          <Link
            to='/terms-of-service'
            className='text-sm text-gray-500 transition-colors hover:text-sky-500 hover:underline dark:text-gray-400 dark:hover:text-sky-400'
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </Container>
  </motion.footer>
  // --- End of restyled JSX block ---
  );
}

export default Footer;
