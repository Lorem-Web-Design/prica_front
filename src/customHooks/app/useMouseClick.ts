import { useEffect, useState } from 'react';

const useMouseClick = () => {
  const [
    mouseClick,
    setMouseClick
  ] = useState(false);
  
  useEffect(() => {
    const updateMouseClick = () => {
        setMouseClick(true);
    };
    setInterval(()=>{setMouseClick(false)}, 50)
    window.addEventListener('click', updateMouseClick);
    return () => {
      window.removeEventListener('click', updateMouseClick);
    };
  }, []);

  return mouseClick;
};

export default useMouseClick;