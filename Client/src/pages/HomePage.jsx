import React, { useState } from 'react';
import {
  UserSideBar,
  ChatWindow,
  CreateGroupPopup,
  Profile,
  IconSidebar,
} from '../components/index';
import { setIsProfileOpen } from '../store/chatSlice';
import { useSelector, useDispatch } from 'react-redux';
import useOutsideClick from '../utils/onOutsideClick';

function HomePage() {
  const dispatch = useDispatch();
  const [isPopOn, setIsPopOn] = useState(false);

  const { isProfileOpen } = useSelector((state) => state.chat);
  // console.log(isprofileOpen)

  return (
    <div className='flex h-screen overflow-hidden bg-gray-100'>
      <UserSideBar onOpenCreateGroup={() => setIsPopOn(true)} />
      <ChatWindow />
      {isPopOn && <CreateGroupPopup onClose={() => setIsPopOn(false)} />}
      {isProfileOpen && <Profile onClose={() => dispatch(setIsProfileOpen(false))} />}
    </div>
  );
}

export default HomePage;
