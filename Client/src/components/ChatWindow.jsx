import { useState , useEffect , useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserMessages, getGroupMessages } from '../service/api.service.js';
import { Input, Button } from './ui';
import { useForm } from 'react-hook-form';
import connectSocket from '../service/socket.service.js';
import EmojiPicker from 'emoji-picker-react';
import { setOnlineUsers } from '../store/chatSlice';
import { decryptMessage , encryptMessage } from '../utils/ETEE.js';
import { Profile , FileUploadModal } from './index.js'

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
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [isProfileOpen , setIsProfileOpen] = useState(false);
  
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
          message: decryptMessage(msg.message , secretKey),}))
          setMessages(decryptedMessages);
          console.log(selectedChat)
      } catch (error) {
        console.error("Failed to fetch messages:", error.message);
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
       const decryptedMessage = decryptMessage(newMessage.message , secretKey)
        setMessages((prev) => [...prev, {
          ...newMessage ,
          message: decryptedMessage,}]);
        }
    });

    newSocket.on('receive_group_message', (newMessage) => {
      if (newMessage.senderId === loggedInUser?._id) return;
      const currentChat = selectedChatRef.current;
      if (isGroupChat && newMessage.groupId === currentChat?._id) {
        const decryptedMessage = decryptMessage(newMessage.message , secretKey)
        setMessages((prev) => [...prev, {
          ...newMessage ,
          message: decryptedMessage,}]);
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
    const encryptedMessages = encryptMessage(message , secretKey);
    
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
        ...(isGroupChat ? { groupId: selectedChat._id } : { recipientId: selectedChat._id })
    };
    setMessages((prev) => [...prev, optimisticMessage]);
  };

  const handleEmojiClick = (emojiObject) => {
    const currentMessage = getValues('message') || '';
    setValue('message', currentMessage + emojiObject.emoji);
  };

  if (!selectedChat) {
    return ( <div className="flex flex-col items-center justify-center w-full h-screen text-gray-500">...</div> );
  }

  const chatName = isGroupChat ? selectedChat.groupName : selectedChat.username;
  const chatAvatar = isGroupChat ? selectedChat.avatarURL : selectedChat.avatarURL;
  // console.log(selectedChat)
  return (
    <>
      <div className="flex flex-col w-full h-screen bg-white">
        {/* Chat Header */}
        <div className="flex items-center p-3 border-b border-gray-200">
          <div
            onClick={() => setIsProfileOpen(true)}
              className='flex items-center w-80 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors'>
                <img src={chatAvatar} alt="Avatar" className="w-10 h-10 rounded-full mr-3 object-cover" />
                <div className='flex flex-col'>
                <p className="text-lg font-bold">{chatName}</p>
                {!isGroupChat && isTyping && <p className="text-sm text-blue-500">is typing...</p>}
          </div>
          </div>
        </div>
        
        {isProfileOpen && <Profile onClose={() => setIsProfileOpen(false)} />}

        {/* Message List */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.map((message) => {
            const isSentByMe = message.senderId === loggedInUser._id;
            return (
              <div key={message._id} className={`flex mb-4 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg px-3 py-2 max-w-sm flex flex-col ${isSentByMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                  {/* 4. NEW: Render image if fileURL exists */}
                  {message.fileURL && message.fileType === 'image' && (
                    <img src={message.fileURL} alt="shared message" className="rounded-md max-w-xs mb-2 w-50" />
                  )}
                  {message.fileURL && message.fileType !== 'image' && (
                     <a href={message.fileURL} target="_blank" rel="noopener noreferrer" className="block p-2 bg-gray-500/20 rounded-md hover:underline">
                        Download File
                     </a>
                  )}
                  {/* Render text message if it exists */}
                  {message.message && <p>{message.message}</p>}
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
              <Button type="button" onClick={() => setShowPicker(!showPicker)} className="p-2 rounded-full hover:bg-gray-200" bgColor="bg-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}       stroke="currentColor" className="w-6 h-6 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75a.75.75 0 01.75-.75h.008a.75.75 0 010 1.5H9.75a.75.75 0 01-.75-.75zm4.5 0a.75.75 0 01.75-.75h.008a.75.75 0 010 1.5H14.25a.75.75 0 01-.75-.75z" />
                </svg>
              </Button>
              {showPicker && (<div className="absolute bottom-14 left-0 z-10"><EmojiPicker onEmojiClick={handleEmojiClick} /></div>)}
            </div>

            {/* 5. NEW: Attach File Button */}
            <div className='w-'>
              <Button type="button" onClick={() => setIsFileUploadOpen(true)} className="p-2 rounded-full hover:bg-gray-200" bgColor="bg-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
                </svg>
            </Button>
            </div>
            
            <Input
              placeholder="Type a message..."
              className="flex-1"
              {...register('message')}
            />
            <div className='w-40'><Button type="submit">Send</Button></div>
          </form>
        </div>
      </div>

      {/* 6. Render the modal and pass the correct props */}
      {isFileUploadOpen && (
        <FileUploadModal 
            onClose={() => setIsFileUploadOpen(false)} 
            onSendFile={handleSend}
        />
      )}
    </>
  );
}

export default ChatWindow;
