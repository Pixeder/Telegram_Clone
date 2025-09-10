import React from 'react'
import { useSelector } from 'react-redux'

function Profile() {

  const { currentUserOrGroup: selectedChat } = useSelector((state) => state.chat);
  const isGroupChat = selectedChat && 'members' in selectedChat;

  return (
    <div>

    </div>
  )
}

export default Profile