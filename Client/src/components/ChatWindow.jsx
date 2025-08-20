import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getMessages } from '../service/api.service';
import { Input, Button } from './ui';
import { useForm } from 'react-hook-form';
import connectSocket from '../service/socket.service';
import EmojiPicker from 'emoji-picker-react';

function ChatWindow() {
  const { currentUser: selectedUser } = useSelector((state) => state.chat);
  const { user: loggedInUser, token } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const { register, handleSubmit, reset, setValue, getValues } = useForm();
  
  const messagesEndRef = useRef(null);
  // 1. Ref to prevent stale data in socket listener
  const selectedUserRef = useRef(selectedUser);
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) {
        setMessages([]); // Clear messages when no user is selected
        return;
      }
      try {
        const response = await getMessages(selectedUser._id);
        setMessages(response.data.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error.message);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  // 2. Corrected useEffect for stable socket connection
  useEffect(() => {
    if (!token) {
      return;
    }

    const newSocket = connectSocket(token);
    setSocket(newSocket);

    newSocket.on('receive_message', (newMessage) => {
      const currentChatPartner = selectedUserRef.current;
      if (newMessage.senderId === currentChatPartner?._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => newSocket.disconnect();
  }, [token]); // Only depends on the token

  const onSendMessage = (data) => {
    if (!socket || !data.message?.trim() || !selectedUser) return;

    const messagePayload = {
      recipientId: selectedUser._id,
      message: data.message,
    };
    
    socket.emit('private_message', messagePayload);
    
    // 3. Corrected optimistic update object
    const optimisticMessage = {
      _id: Date.now(),
      senderId: loggedInUser._id,
      recipientId: selectedUser._id,
      message: data.message,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    reset();
    setShowPicker(false); // Hide picker after sending
  };

  const handleEmojiClick = (emojiObject) => {
    const currentMessage = getValues('message') || '';
    setValue('message', currentMessage + emojiObject.emoji);
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.794 9 8.25z" /></svg>
        <p className="text-xl">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen bg-white">
      {/* Chat Header */}
      <div className="flex items-center p-3 border-b border-gray-200">
        <img src={selectedUser.avatarURL} alt="Avatar" className="w-10 h-10 rounded-full mr-3 object-cover" />
        <p className="text-lg font-bold">{selectedUser.username}</p>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((message) => {
          const isSentByMe = message.senderId === loggedInUser._id;
          return (
            <div key={message._id} className={`flex mb-4 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg px-4 py-2 max-w-sm ${isSentByMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                {/* 4. Corrected property to render */}
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
          {/* 5. Styled Emoji Picker and Button */}
          <div className="relative">
            <Button
              type="button"
              onClick={() => setShowPicker(!showPicker)}
              className="p-2 rounded-full hover:bg-gray-200"
              bgColor="bg-transparent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75a.75.75 0 01.75-.75h.008a.75.75 0 010 1.5H9.75a.75.75 0 01-.75-.75zm4.5 0a.75.75 0 01.75-.75h.008a.75.75 0 010 1.5H14.25a.75.75 0 01-.75-.75z" />
              </svg>
            </Button>
            {showPicker && (
              <div className="absolute bottom-14 left-0">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
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
