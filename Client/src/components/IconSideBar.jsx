import React from 'react';

// A helper component for the navigation icons
const NavItem = ({ icon, active = false, title }) => (
  <button
    className={`flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-200 ${
      active ? 'bg-sky-500 text-white' : 'text-gray-400 hover:bg-slate-700 hover:text-white'
    } `}
    title={title}
  >
    {icon}
  </button>
);

function IconSidebar() {
  const ChatIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='h-6 w-6'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.125 1.125 0 01-1.59 0l-3.72-3.72A2.122 2.122 0 013 17.286V12.75c0-.97 1.128-2.097 2.097-2.097.884.284 1.5 1.128 1.5 2.097v3.286c0 .878.712 1.5 1.5 1.5h1.5v-6.75c0-.97.616-1.813 1.5-2.097z'
      />
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 15v2.25A2.25 2.25 0 0014.25 19.5h1.5a2.25 2.25 0 002.25-2.25v-2.25'
      />
    </svg>
  );

  const SettingsIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='h-6 w-6'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.48.398.587 1.03.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.332.183-.582.495-.645.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.072-.044.146-.087.22-.127.332-.183.582-.495.645-.87l.213-1.281z'
      />
      <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
    </svg>
  );

  return (
    <div className='flex w-20 flex-col items-center space-y-4 bg-slate-800 p-3 dark:bg-black'>
      <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-sky-500 text-2xl font-bold text-white'>
        T
      </div>
      <div className='flex flex-1 flex-col items-center space-y-2'>
        <NavItem icon={ChatIcon} title='My Chats' active={true} />
        {/* Add more NavItems here as you build more features */}
      </div>
      <div className='flex flex-col items-center space-y-2'>
        <NavItem icon={SettingsIcon} title='Settings' />
        {/* Placeholder for user avatar at the bottom */}
        <img
          src='https://api.dicebear.com/8.x/adventurer/svg?seed=Felix'
          alt='User Avatar'
          className='h-12 w-12 rounded-full'
        />
      </div>
    </div>
  );
}

export default IconSidebar;
