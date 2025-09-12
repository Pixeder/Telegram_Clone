import React from 'react'
import { useSelector } from 'react-redux'

function Profile({
  onClose
}) {

  const { currentUserOrGroup: selectedChat } = useSelector((state) => state.chat);
  const isGroupChat = selectedChat && 'members' in selectedChat;

  const chatName = isGroupChat ? selectedChat.groupName : selectedChat.fullName;
  const chatAvatar = isGroupChat ? selectedChat.avatarURL : selectedChat.avatarURL;

  

  return (
    <div>
      <img src={chatAvatar} alt="Avatar of chat" className='w-50 rounded-full h-50' />
      <h3>{chatName}</h3>
      {!isGroupChat && <p>{selectedChat.username}</p> }

    </div>
  )
}

export default Profile