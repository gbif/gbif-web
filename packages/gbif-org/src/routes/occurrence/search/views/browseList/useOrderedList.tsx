// useOrderedList.js
import { useState, useEffect } from 'react';
import { getOrderedList, setOrderedList, subscribe } from './orderedListStore';

export const useOrderedList = () => {
  // Initialize state with the current ordered list
  const [orderedList, setOrderedListState] = useState(getOrderedList());

  useEffect(() => {
    // Subscribe to changes in the ordered list
    const unsubscribe = subscribe(setOrderedListState);

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    orderedList,
    setOrderedList,
  };
};
