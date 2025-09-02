import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserMessages, getGroupMessages } from '../service/api.service.js';
import { Input, Button } from './ui';
import { useForm } from 'react-hook-form';
import connectSocket from '../service/socket.service.js';
import EmojiPicker from 'emoji-picker-react';
import { setOnlineUsers } from '../store/chatSlice';
import { encryptMessage , decryptMessage } from '../utils/ETEE.js';

function ChatWindow() {
  const dispatch = useDispatch();
  const { currentUserOrGroup: selectedChat } = useSelector((state) => state.chat);
  const { user: loggedInUser, token } = useSelector((state) => state.auth);

  const isGroupChat = selectedChat && 'members' in selectedChat;
  const secretKey = selectedChat ? ( isGroupChat ? selectedChat._id : [loggedInUser._id , selectedChat._id].sort().join('')) : null;

  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const { register, handleSubmit, reset, setValue, getValues, watch } = useForm();
  
  const messagesEndRef = useRef(null);
  const selectedChatRef = useRef(selectedChat);
  const typingTimeoutRef = useRef(null);
  const messageValue = watch('message');

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // 3. Effect to fetch history for either a user or a group
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) {
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
        const decryptedMessage = response.data.data.map( (msg) => ({
          ...msg,
          message: decryptMessage(msg.message , secretKey),
        }))
        setMessages(decryptedMessage);
      } catch (error) {
        console.error("Failed to fetch messages:", error.message);
      }
    };
    fetchMessages();
  }, [selectedChat, isGroupChat]);

  // Effect for managing the socket connection and listeners
  useEffect(() => {
    if (!token) return;

    const newSocket = connectSocket(token);
    setSocket(newSocket);

    // --- Listeners for real-time events ---
    newSocket.on('receive_message', (newMessage) => {
      const currentChatPartner = selectedChatRef.current;
      if (!isGroupChat && newMessage.senderId === currentChatPartner?._id) {
        const decryptedMessage = decryptMessage(newMessage.message , secretKey)
        setMessages((prev) => [...prev, {
          ...newMessage ,
          message: decryptedMessage,
        }]);
      }
    });

    // 4. Listener for incoming group messages
    newSocket.on('receive_group_message', (newMessage) => {
      if (newMessage.senderId === loggedInUser._id) {
        return;
      }
      const currentChat = selectedChatRef.current;
      if (isGroupChat && newMessage.groupId === currentChat?._id) {
        const decryptedMessage = decryptMessage(newMessage.message , secretKey)
        setMessages((prev) => [...prev, {
          ...newMessage ,
          message: decryptedMessage,
        }]);
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
  }, [token, dispatch, isGroupChat]);

  // Effect for sending typing events (only for private chats)
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

  // 5. Function to send either a private or group message
  const onSendMessage = (data) => {
    if (!socket || !data.message?.trim() || !selectedChat) return;

    let payload;
    let eventName;
    const message = encryptMessage(data.message , secretKey);

    if (isGroupChat) {
      eventName = 'group_message';
      payload = { groupId: selectedChat._id, message: message };
    } else {
      eventName = 'private_message';
      payload = { recipientId: selectedChat._id, message: message };
    }
    
    socket.emit(eventName, payload);
    
    const optimisticMessage = {
      _id: Date.now(),
      senderId: loggedInUser._id,
      message: data.message,
      createdAt: new Date().toISOString(),
      ...(isGroupChat ? { groupId: selectedChat._id } : { recipientId: selectedChat._id })
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    reset();
    setShowPicker(false);
  };

  const handleEmojiClick = (emojiObject) => {
    const currentMessage = getValues('message') || '';
    setValue('message', currentMessage + emojiObject.emoji);
  };

  if (!selectedChat) {
    return ( <div className="flex flex-col items-center justify-center w-full h-screen text-gray-500">...</div> );
  }

  // 6. Dynamic header info
  const chatName = isGroupChat ? selectedChat.groupName : selectedChat.username;
  const chatAvatar = isGroupChat ? selectedChat.avatarURL : selectedChat.avatarURL;

  return (
    <div className="flex flex-col w-full h-screen bg-white">
      {/* Chat Header */}
      <div className="flex items-center p-3 border-b border-gray-200">
        <img src={chatAvatar} alt="Avatar" className="w-10 h-10 rounded-full mr-3 object-cover" />
        <div className='flex flex-col'>
          <p className="text-lg font-bold">{chatName}</p>
          {!isGroupChat && isTyping && <p className="text-sm text-blue-500">is typing...</p>}
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((message) => {
          const isSentByMe = message.senderId === loggedInUser._id;
          return (
            <div key={message._id} className={`flex mb-4 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg px-4 py-2 max-w-sm ${isSentByMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                {message.message}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSubmit(onSendMessage)} className="flex items-center space-x-3">
          <div className="relative">
            <Button
              type="button"
              onClick={() => setShowPicker(!showPicker)}
              className="p-2 rounded-full hover:bg-gray-200"
              bgColor="bg-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}       stroke="currentColor" className="w-6 h-6 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75a.75.75 0 01.75-.75h.008a.75.75 0 010 1.5H9.75a.75.75 0 01-.75-.75zm4.5 0a.75.75 0 01.75-.75h.008a.75.75 0 010 1.5H14.25a.75.75 0 01-.75-.75z" />
                </svg>
          </Button>
          {showPicker && (
            <div className="absolute bottom-14 left-0">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>)}
          </div>
          <Input
            placeholder="Type a message..."
            className="flex-1"
            {...register('message', { required: true })}
          />
          <div className='w-30'><Button type="submit">Send</Button></div>
        </form>
      </div>
    </div>
  );
}

export default ChatWindow;
