import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getGroupsMembersData } from '../service/api.service'; // You will need to create this API service function

function Profile({ onClose }) {
  // 1. Get the selected chat from the Redux store
  const { currentUserOrGroup: selectedChat } = useSelector((state) => state.chat);

  // 2. State to hold the detailed member data for groups
  const [membersData, setMembersData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 3. Determine if the selected chat is a group
  const isGroupChat = selectedChat && 'groupName' in selectedChat;

  // 4. CORRECTED useEffect for fetching data
  useEffect(() => {
    // Define the async function inside the effect
    const fetchGroupMembers = async () => {
      // Only fetch if it's a group chat
      if (isGroupChat && selectedChat?._id) {
        setIsLoading(true);
        try {
          // Call the new API service function
          const response = await getGroupsMembersData(selectedChat._id);
          setMembersData(response.data.data);
        } catch (error) {
          console.error("Failed to fetch group members:", error);
          setMembersData([]); // Reset on error
        } finally {
          setIsLoading(false);
        }
      } else {
        setMembersData([]); // Clear members if it's not a group chat
      }
    };

    fetchGroupMembers();
  }, [selectedChat, isGroupChat]); // Correct dependency array

  // 5. Dynamic data based on chat type
  const chatName = isGroupChat ? selectedChat.groupName : selectedChat.fullName;
  const chatAvatar = isGroupChat ? selectedChat.avatarURL : selectedChat.avatarURL;
  const chatUsername = !isGroupChat && selectedChat.username ;

  return (
    // Backdrop Overlay
    <div 
      onClick={onClose} 
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
    >
      {/* Profile Panel */}
      <div 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the panel
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center p-4 border-b border-gray-200">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold ml-4">Profile</h2>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col items-center p-6 space-y-2">
            <img src={chatAvatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover mb-4" />
            <h3 className="text-2xl font-bold">{chatName}</h3>
            <p className="text-gray-500">{chatUsername}</p>
          </div>

          {/* Members List for Groups */}
          {isGroupChat && (
            <div className="flex-1 border-t border-gray-200 overflow-y-auto">
              <h4 className="p-4 text-lg font-semibold text-gray-700">Members</h4>
              {isLoading ? (
                <p className="p-4 text-gray-500">Loading members...</p>
              ) : (
                // 6. CORRECTED and styled member mapping
                membersData.map((member) => (
                  <div key={member._id} className="flex items-center px-4 py-3 hover:bg-gray-50">
                    <img src={member.avatarURL} alt={member.username} className="w-10 h-10 rounded-full object-cover mr-4" />
                    <div className="flex-1">
                      <p className="font-semibold">{member.fullName}</p>
                      <p className="text-sm text-gray-500">@{member.username}</p>
                    </div>
                    {member.isAdmin && (
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
