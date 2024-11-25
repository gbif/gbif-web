import { SetStateAction } from "react";

// orderedListStore.js
let orderedList: string[] = []; // External state. Array of strings

const listeners = new Set<(newList: string[]) => void>(); // Track listeners

// Function to get the current ordered list
export const getOrderedList = () => orderedList;

// Function to set a new ordered list and notify listeners
export const setOrderedList = (newList: string[]) => {
  orderedList = newList;
  listeners.forEach((listener) => listener(newList)); // Notify listeners of the change
};

// Function to subscribe to changes (used by the hook)
export const subscribe = (listener: { (value: SetStateAction<string[]>): void; (newList: string[]): void; (newList: string[]): void; }) => {
  listeners.add(listener);
  return () => listeners.delete(listener); // Return an unsubscribe function
};
