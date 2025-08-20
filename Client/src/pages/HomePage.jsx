import React from 'react';
import { UserSideBar, ChatWindow } from '../components/index';

function HomePage() {

  return (
    // The main container for the chat interface.
    // - `flex`: Arranges the sidebar and chat window side-by-side.
    // - `h-screen`: Makes the container take up the full height of the viewport.
    // - `overflow-hidden`: Prevents any accidental scrolling on the main container itself.
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <UserSideBar />
      <ChatWindow />
    </div>
  );
}

export default HomePage;
