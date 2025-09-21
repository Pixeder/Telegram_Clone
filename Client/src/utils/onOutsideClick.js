import { useEffect, useRef } from 'react';

function onOutsideClick(handler) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the ref exists and the click was not inside the ref's element, call the handler
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handler]); // Re-run the effect if the handler function changes

  return ref;
}

export default onOutsideClick;
