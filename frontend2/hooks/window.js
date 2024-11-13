import { useState, useEffect } from 'react';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    let debounceTimeout;
    const debounceResize = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(handleResize, 100);
    };
    window.addEventListener('resize', debounceResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', debounceResize);
      clearTimeout(debounceTimeout);
    };
  }, []);

  return width;
}

export default useWindowWidth;
