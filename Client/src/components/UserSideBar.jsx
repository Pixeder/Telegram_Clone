import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserList, getGroups } from '../service/api.service';
import { setUsers, setCurrentUserOrGroup, setGroups } from '../store/chatSlice';
import { motion } from 'motion/react'; 
import { Button } from './ui';
// --- SVG Icons for UI ---
const CreateGroupIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 015.69 3.117A1.99 1.99 0 0118 15.75c.025.22.038.447.038.675a2.25 2.25 0 01-2.25 2.25H8.214a2.25 2.25 0 01-2.25-2.25c0-.228.013-.455.038-.675a1.99 1.99 0 01.308-.533zM15.75 15.75a1.5 1.5 0 01-1.5-1.5pM15.75 15.75a1.5 1.5 0 01-1.5-1.5p" clipRule="evenodd" />
        <path d="M16.5 19.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
        <path fillRule="evenodd" d="M18 15.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M16.5 18a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    </svg>
);
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 dark:text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

// 2. --- Framer Motion Variants for Animation ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Each child will animate 0.05s after the previous one
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};


function UserSideBar({ onOpenCreateGroup }) {
    // --- ALL YOUR EXISTING LOGIC REMAINS UNTOUCHED ---
    const dispatch = useDispatch();
    const { users, groups, currentUserOrGroup, onlineUsers } = useSelector((state) => state.chat);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [userResponse, groupResponse] = await Promise.all([getUserList(), getGroups()]);
                dispatch(setUsers(userResponse.data.data));
                dispatch(setGroups(groupResponse.data.data));
            } catch (error) {
                console.error('Failed to fetch sidebar data:', error.message);
            }
        };
        fetchAll();
    }, [dispatch, groups]);

    const handleSelect = (item) => {
        dispatch(setCurrentUserOrGroup(item));
    };
    // --- END OF UNTOUCHED LOGIC ---


    return (
        // --- ALL STYLING AND ANIMATION CHANGES BEGIN HERE ---
        <div className="w-full max-w-xs flex flex-col h-screen bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700">
            {/* Header Area */}
            <header className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">My Chats</h2>
                <Button 
                    onClick={onOpenCreateGroup} 
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    title="Create new group"
                >
                    <CreateGroupIcon />
                </Button>
            </header>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <SearchIcon />
                    </span>
                    <input 
                        type="text"
                        placeholder="Search all chats..."
                        className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-700 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="p-2 flex items-center space-x-2 border-b border-gray-200 dark:border-slate-700">
                <Button className="flex-1 px-3 py-1.5 text-sm font-semibold text-white bg-sky-500 rounded-md shadow-sm">All Chats</Button>
                <Button className="flex-1 px-3 py-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors">Groups</Button>
                <Button className="flex-1 px-3 py-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors">Archived</Button>
            </div>
            
            {/* Chat List with Animation */}
            <motion.div 
                className="flex-1 overflow-y-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Groups Section */}
                {groups && groups.length > 0 && (
                     <div className="p-2">
                        <h3 className="px-2 pt-2 text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider">Groups</h3>
                        {groups.map((group) => (
                             <motion.div
                                key={group._id} 
                                variants={itemVariants}
                                onClick={() => handleSelect(group)}
                                className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-200 mt-1 ${currentUserOrGroup?._id === group._id ? 'bg-sky-100 dark:bg-sky-900' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
                                <div className="relative mr-3">
                                    <img src={group.avatarURL} alt={group.groupName} className="w-10 h-10 rounded-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className={`font-semibold truncate block ${currentUserOrGroup?._id === group._id ? 'text-sky-800 dark:text-sky-200' : 'text-gray-800 dark:text-gray-200'}`}>{group.groupName}</span>
                                </div>
                             </motion.div>
                        ))}
                    </div>
                )}

                {/* Users Section */}
                 <div className="p-2">
                    <h3 className="px-2 pt-2 text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider">Users</h3>
                    {users.map((user) => {
                        const isOnline = onlineUsers.includes(user._id);
                        return (
                            <motion.div 
                                key={user._id} 
                                variants={itemVariants}
                                onClick={() => handleSelect(user)}
                                className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-200 mt-1 ${currentUserOrGroup?._id === user._id ? 'bg-sky-100 dark:bg-sky-900' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
                                <div className="relative mr-3">
                                    <img src={user.avatarURL} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                                    {isOnline && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></motion.div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                     <span className={`font-semibold truncate block ${currentUserOrGroup?._id === user._id ? 'text-sky-800 dark:text-sky-200' : 'text-gray-800 dark:text-gray-200'}`}>{user.fullName}</span>
                                     <p className={`text-xs truncate ${currentUserOrGroup?._id === user._id ? 'text-sky-600 dark:text-sky-400' : 'text-gray-500 dark:text-gray-400'}`}>Last message placeholder...</p>
                                </div>
                            </motion.div>
                        );
                    })}
                 </div>
            </motion.div>
        </div>
    );
}

export default UserSideBar;

