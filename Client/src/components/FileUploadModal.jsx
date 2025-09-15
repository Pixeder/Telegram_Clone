import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { uploadFile } from '../service/api.service';
import { Input, Button } from './ui';

function FileUploadModal({ onClose, onSendFile }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { register, handleSubmit, watch } = useForm();

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

  return (
    <div className='bg-opacity-25 fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm'>
      <div className='w-full max-w-lg space-y-4 rounded-lg bg-white p-6 shadow-xl'>
        <div className='flex items-center justify-between'>
          <h3 className='text-xl font-bold'>Share a File</h3>
          <Button onClick={onClose} bgColor='bg-transparent' className='p-1'>
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
          </Button>
        </div>

        {/* File Preview Area */}
        <div className='flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed bg-gray-100'>
          {previewURL ? (
            <img
              src={previewURL}
              alt='File Preview'
              className='max-h-full max-w-full rounded object-contain'
            />
          ) : (
            <p className='text-gray-500'>Select a file to preview</p>
          )}
        </div>

        {/* Hidden File Input and Upload Button */}
        <div className='text-center'>
          <input type='file' ref={fileInputRef} onChange={handleFileChange} className='hidden' />
          <Button
            type='button'
            onClick={() => fileInputRef.current.click()}
            bgColor='bg-gray-200'
            textColor='text-black'
          >
            {uploadedFile ? 'Change File' : 'Select File'}
          </Button>
        </div>

        {/* Form for sending the file with an optional message */}
        <form onSubmit={handleSubmit(handleSend)} className='space-y-3'>
          <Input placeholder='Add a caption... (optional)' {...register('message')} />
          <Button type='submit' disabled={!uploadedFile || isUploading}>
            {isUploading ? 'Sending...' : 'Send File'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default FileUploadModal;
