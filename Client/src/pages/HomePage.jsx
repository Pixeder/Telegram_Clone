import React, { useState } from 'react'
import { UserSideBar , ChatWindow } from '../components/index'

function HomePage() {

  const [selectedUser , setSelectedUser] = useState(null)


  return (
    <div className='flex'>
      <UserSideBar />
      <ChatWindow />
    </div>
  )
}

export default HomePage