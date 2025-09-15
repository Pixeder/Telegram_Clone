import React, { useState } from 'react';
import { UserSideBar, ChatWindow, CreateGroupPopup } from '../components/index';

function HomePage() {
  const [isPopOn, setIsPopOn] = useState(false);

  return (
    <div className='flex h-screen overflow-hidden bg-gray-100'>
      <UserSideBar onOpenCreateGroup={() => setIsPopOn(true)} />
      <ChatWindow />
      {isPopOn && <CreateGroupPopup onClose={() => setIsPopOn(false)} />}
    </div>
  );
}

export default HomePage;
