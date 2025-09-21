import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { uploadFile } from '../service/api.service';
import { Input, Button } from './ui';
import onOutsideClick from '../utils/onOutsideClick';
import { motion } from 'motion/react';

function FileUploadModal({ onClose, onSendFile }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { register, handleSubmit, watch } = useForm();
  const fileUploadRef = onOutsideClick(onClose);

  useEffect(() => {
    if (!uploadedFile) {
      setPreviewURL('');
      return;
    }
    const objectUrl = URL.createObjectURL(uploadedFile);
    setPreviewURL(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [uploadedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSend = async (data) => {
    if (!uploadedFile) {
      alert('Please select a file to send.');
      return;
    }
    setIsUploading(true);
    try {
      const { url, fileType } = await uploadFile(uploadedFile);
      console.log(fileType, url);

      onSendFile({
        message: data.message,
        fileURL: url,
        fileType: fileType,
      });

      onClose();
    } catch (error) {
      console.error('File send failed:', error);
      alert('Failed to send file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    // --- Start of restyled JSX block ---
    <motion.div
      // Animation for the backdrop fading in
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // Styling with dark mode classes for the overlay
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm'
    >
      <motion.div
        // Animation for the modal scaling and fading in
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        // Styling for the modal panel
        className='w-full max-w-lg space-y-4 rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800'
        ref={fileUploadRef} // Your existing ref
      >
        <div className='flex items-center justify-between'>
          <h3 className='text-xl font-bold text-gray-800 dark:text-white'>Share a File</h3>
          <motion.Button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className='rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700'
            title='Close'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
            </svg>
          </motion.Button>
        </div>

        {/* File Preview Area */}
        <div className='flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-slate-600 dark:bg-slate-700/50'>
          {previewURL ? (
            <img
              src={previewURL}
              alt='File Preview'
              className='max-h-full max-w-full rounded object-contain'
            />
          ) : (
            <p className='text-gray-500 dark:text-gray-400'>Select a file to preview</p>
          )}
        </div>

        {/* Hidden File Input and Upload Button */}
        <div className='text-center'>
          <input type='file' ref={fileInputRef} onChange={handleFileChange} className='hidden' />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type='button'
              onClick={() => fileInputRef.current.click()}
              bgColor='bg-gray-200 dark:bg-slate-600'
              textColor='text-black dark:text-white'
              className='font-semibold'
            >
              {uploadedFile ? 'Change File' : 'Select File'}
            </Button>
          </motion.div>
        </div>

        {/* Form for sending the file with an optional message */}
        <form onSubmit={handleSubmit(handleSend)} className='space-y-3'>
          <Input placeholder='Add a caption... (optional)' {...register('message')} />
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button type='submit' disabled={!uploadedFile || isUploading} className='w-full'>
              {isUploading ? 'Sending...' : 'Send File'}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
    // --- End of restyled JSX block ---
  );
}

export default FileUploadModal;
