import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserMessages, getGroupMessages } from '../service/api.service.js';
import { Input, Button } from './ui';
import { useForm } from 'react-hook-form';
import connectSocket from '../service/socket.service.js';
import EmojiPicker from 'emoji-picker-react';
import { setOnlineUsers, setIsProfileOpen } from '../store/chatSlice';
import { decryptMessage, encryptMessage } from '../utils/ETEE.js';
import { Profile, FileUploadModal } from './index.js';
import {motion, AnimatePresence} from 'motion/react'

function ChatWindow() {
  const dispatch = useDispatch();
  const { currentUserOrGroup: selectedChat } = useSelector((state) => state.chat);
  const { user: loggedInUser, token } = useSelector((state) => state.auth);

  const isGroupChat = selectedChat && 'groupName' in selectedChat;
  const secretKey = selectedChat
    ? isGroupChat
      ? selectedChat._id
      : [loggedInUser._id, selectedChat._id].sort().join('')
    : null;

  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);

  const { register, handleSubmit, reset, setValue, getValues, watch } = useForm();

  const messagesEndRef = useRef(null);
  const selectedChatRef = useRef(selectedChat);
  const typingTimeoutRef = useRef(null);
  const messageValue = watch('message');

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat?._id) {
        setMessages([]);
        return;
      }
      try {
        let response;
        if (isGroupChat) {
          response = await getGroupMessages(selectedChat._id);
        } else {
          response = await getUserMessages(selectedChat._id);
        }
        const decryptedMessages = response.data.data.map((msg) => ({
          ...msg,
          message: decryptMessage(msg.message, secretKey),
        }));
        setMessages(decryptedMessages);
        // console.log(selectedChat)
      } catch (error) {
        console.error('Failed to fetch messages:', error.message);
      }
    };
    fetchMessages();
  }, [selectedChat, isGroupChat]);

  useEffect(() => {
    if (!token) return;

    const newSocket = connectSocket(token);
    setSocket(newSocket);

    newSocket.on('receive_message', (newMessage) => {
      const currentChatPartner = selectedChatRef.current;
      if (!isGroupChat && newMessage.senderId === currentChatPartner?._id) {
        const decryptedMessage = decryptMessage(newMessage.message, secretKey);
        setMessages((prev) => [
          ...prev,
          {
            ...newMessage,
            message: decryptedMessage,
          },
        ]);
      }
    });

    newSocket.on('receive_group_message', (newMessage) => {
      if (newMessage.senderId === loggedInUser?._id) return;
      const currentChat = selectedChatRef.current;
      if (isGroupChat && newMessage.groupId === currentChat?._id) {
        const decryptedMessage = decryptMessage(newMessage.message, secretKey);
        setMessages((prev) => [
          ...prev,
          {
            ...newMessage,
            message: decryptedMessage,
          },
        ]);
      }
    });

    newSocket.on('update_online_users', (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });

    newSocket.on('typing_started', ({ senderId }) => {
      const currentChatPartner = selectedChatRef.current;
      if (!isGroupChat && senderId === currentChatPartner?._id) {
        setIsTyping(true);
      }
    });

    newSocket.on('typing_stopped', ({ senderId }) => {
      const currentChatPartner = selectedChatRef.current;
      if (!isGroupChat && senderId === currentChatPartner?._id) {
        setIsTyping(false);
      }
    });

    return () => newSocket.disconnect();
  }, [token, dispatch, isGroupChat, loggedInUser]);

  useEffect(() => {
    if (!socket || !selectedChat || isGroupChat) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    if (messageValue) {
      socket.emit('start_typing', { recipientId: selectedChat._id });
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { recipientId: selectedChat._id });
    }, 2000);
  }, [messageValue, socket, selectedChat, isGroupChat]);

  const onSendMessage = (data) => {
    // This function now only handles TEXT messages
    if (!socket || !data.message?.trim() || !selectedChat) return;

    // Call the universal handler to send the message
    handleSend({ message: data.message });
    reset();
    setShowPicker(false);
  };

  // 3. NEW: Universal handler for sending text, files, or both
  const handleSend = ({ message, fileURL, fileType }) => {
    if (!socket || (!message?.trim() && !fileURL) || !selectedChat) return;

    let payload;
    let eventName;
    const encryptedMessages = encryptMessage(message, secretKey);

    if (isGroupChat) {
      eventName = 'group_message';
      payload = { groupId: selectedChat._id, message: encryptedMessages, fileURL, fileType };
    } else {
      eventName = 'private_message';
      payload = { recipientId: selectedChat._id, message: encryptedMessages, fileURL, fileType };
    }

    socket.emit(eventName, payload);

    const optimisticMessage = {
      _id: Date.now(),
      senderId: loggedInUser._id,
      message: message,
      fileURL: fileURL,
      fileType: fileType,
      createdAt: new Date().toISOString(),
      ...(isGroupChat ? { groupId: selectedChat._id } : { recipientId: selectedChat._id }),
    };
    setMessages((prev) => [...prev, optimisticMessage]);
  };

  const handleEmojiClick = (emojiObject) => {
    const currentMessage = getValues('message') || '';
    setValue('message', currentMessage + emojiObject.emoji);
  };

  if (!selectedChat) {
    // --- Start of restyled JSX block for the placeholder ---
  return (
    <motion.div
      // Animation properties from framer-motion
      key="placeholder"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      // Styling with dark mode classes
      className='flex h-screen w-full flex-col items-center justify-center bg-gray-100 text-gray-500 dark:bg-slate-900 dark:text-gray-400'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='mb-4 h-16 w-16'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.794 9 8.25z'
        />
      </svg>
      <p className='text-xl font-semibold text-gray-700 dark:text-gray-300'>
        Select a chat to start messaging
      </p>
      <p className="mt-1 text-sm">Your conversations will appear here.</p>
    </motion.div>
  );
  // --- End of restyled JSX block ---
  }

  const chatName = isGroupChat ? selectedChat.groupName : selectedChat.username;
  // console.log(selectedChat)
  const chatAvatar = isGroupChat ? selectedChat.avatarURL : selectedChat.avatarURL;
  // console.log(selectedChat)
  return (
    // --- Start of restyled JSX block ---
  <>
      <div className='flex h-screen w-full flex-col bg-gray-100 dark:bg-slate-900'>
          {/* Chat Header */}
          <motion.header
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className='flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800'
          >
              <div
                  onClick={() => dispatch(setIsProfileOpen(true))}
                  className='-m-2 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700'
                  title='View profile'
              >
                  <img src={chatAvatar} alt='Avatar' className='h-10 w-10 rounded-full object-cover' />
                  <div>
                      <p className='font-bold text-gray-800 dark:text-white'>{chatName}</p>
                      <p className={`text-xs transition-colors ${!isGroupChat && isTyping ? 'text-sky-500' : 'text-gray-400 dark:text-slate-400'}`}>
                          {!isGroupChat && isTyping ? 'is typing...' : 'status placeholder'}
                      </p>
                  </div>
              </div>
              {/* Placeholder Icons */}
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Button className="rounded-full p-2 transition-colors hover:bg-gray-300 dark:hover:bg-slate-700" title="Search in conversation"> {/* Search Icon */} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg> </Button>
                  <Button onClick={() => dispatch(setIsProfileOpen(true))} className="rounded-full p-2 transition-colors hover:bg-gray-300 dark:hover:bg-slate-700" title="Conversation info"> {/* Info Icon */} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg> </Button>
              </div>
          </motion.header>

          {/* Message List */}
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='flex-1 space-y-4 overflow-y-auto p-4'
          >
            <AnimatePresence>
              {messages.map((message) => {
                  const isSentByMe = message.senderId === loggedInUser._id;
                  return (
                      <motion.div
                          key={message._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          layout
                          className={`flex items-end gap-2 ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                      >
                          <div
                              className={`max-w-md rounded-2xl px-4 py-2 shadow-sm ${
                                  isSentByMe
                                      ? 'rounded-br-none bg-sky-500 text-white'
                                      : 'rounded-bl-none bg-white text-gray-800 dark:bg-slate-700 dark:text-gray-200'
                              }`}
                          >
                              {/* File Rendering Logic */}
                              {message.fileURL && message.fileType.startsWith('image/') && (
                                  <img src={message.fileURL} alt='shared message' className='mb-2 max-w-xs rounded-lg' />
                              )}
                              {message.fileURL && !message.fileType.startsWith('image/') && (
                                  <a href={message.fileURL} target='_blank' rel='noopener noreferrer' className='mb-2 block rounded-md bg-black/20 p-2 transition-colors hover:underline dark:bg-white/10'>
                                      Download File
                                  </a>
                              )}
                              {/* Text Content */}
                              {message.message && <p className='text-sm'>{message.message}</p>}

                              {/* Timestamp and Read Receipt */}
                               <div className="flex items-center gap-1.5 justify-end mt-1">
                                    <p className={`text-xs ${isSentByMe ? 'text-sky-100/80' : 'text-gray-400 dark:text-slate-400'}`}>
                                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    {isSentByMe && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>}
                                </div>
                          </div>
                      </motion.div >
                  );
              })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
          </motion.div>

          {/* Message Input Form */}
          <footer className='border-t border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800'>
              <form onSubmit={handleSubmit(onSendMessage)} className='flex items-center gap-3'>
                  <div className='relative flex items-center'>
                      <motion.Button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type='button' onClick={() => setIsFileUploadOpen(true)} className='rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-300 dark:text-gray-400 dark:hover:bg-slate-700' title="Attach file">
                           {/* Attach Icon */} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" /></svg>
                      </motion.Button>
                      <motion.Button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type='button' onClick={() => setShowPicker(!showPicker)} className='rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-300 dark:text-gray-400 dark:hover:bg-slate-700' title="Add emoji">
                           {/* Emoji Icon */} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75a.75.75 0 01.75-.75h.008a.75.75 0 010 1.5H9.75a.75.75 0 01-.75-.75zm4.5 0a.75.75 0 01.75-.75h.008a.75.75 0 010 1.5H14.25a.75.75 0 01-.75-.75z" /></svg>
                      </motion.Button>
                      <AnimatePresence>
                          {showPicker && (
                              <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  className='absolute bottom-14 left-0 z-10'

                              >
                                  <EmojiPicker theme='auto' onEmojiClick={handleEmojiClick} />
                              </motion.div>
                          )}
                      </AnimatePresence>
                  </div>
                  <Input placeholder='Write your message...' className='flex-1 rounded-lg border-transparent bg-gray-100 px-4 py-2 text-gray-800 transition focus:outline-none focus:ring-2 focus:ring-sky-500 hover:bg-gray-300 dark:hover:bg-slate-500 dark:bg-slate-700 dark:text-gray-200' {...register('message')} />
                  <motion.Button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type='submit' className='rounded-lg bg-sky-500 p-3 text-white shadow-sm transition-colors hover:bg-sky-600 disabled:opacity-50' title="Send message">
                      {/* Send Icon */} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
                  </motion.Button>
              </form>
          </footer>
      </div>

      <AnimatePresence>
          {isFileUploadOpen && (
              <FileUploadModal onClose={() => setIsFileUploadOpen(false)} onSendFile={handleSend} />
          )}
      </AnimatePresence>
  </>
  );
}

export default ChatWindow;
