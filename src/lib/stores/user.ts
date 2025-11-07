import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Create a writable store for the user ID
// Initialize it with the value from sessionStorage, if available
const storedUserId = browser ? sessionStorage.getItem('userId') : null;
export const userId = writable<number | null>(storedUserId ? parseInt(storedUserId, 10) : null);

// Create a writable store for the JWT token
// Initialize it with the value from localStorage, if available
const storedToken = browser ? localStorage.getItem('authToken') : null;
export const authToken = writable<string | null>(storedToken);

// Subscribe to changes in the userId store and update sessionStorage
if (browser) {
  userId.subscribe((value) => {
    if (value !== null) {
      sessionStorage.setItem('userId', value.toString());
    } else {
      sessionStorage.removeItem('userId');
    }
  });

  // Subscribe to changes in the authToken store and update localStorage
  authToken.subscribe((value) => {
    if (value) {
      localStorage.setItem('authToken', value);
    } else {
      localStorage.removeItem('authToken');
    }
  });
}
