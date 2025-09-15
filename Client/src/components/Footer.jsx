import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from './ui';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='mt-auto border-t-2 border-t-gray-100 bg-white py-4'>
      <Container>
        <div className='flex flex-col items-center justify-between text-center sm:flex-row sm:text-left'>
          {/* Copyright Notice */}
          <p className='mb-2 text-sm text-gray-600 sm:mb-0'>
            &copy; {currentYear} TeleClone. All Rights Reserved.
          </p>

          {/* Footer Links */}
          <div className='flex items-center space-x-4'>
            <Link to='/privacy-policy' className='text-sm text-gray-600 hover:underline'>
              Privacy Policy
            </Link>
            <Link to='/terms-of-service' className='text-sm text-gray-600 hover:underline'>
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
