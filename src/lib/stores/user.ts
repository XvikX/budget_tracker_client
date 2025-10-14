import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Create a writable store for the user ID
// Initialize it with the value from sessionStorage, if available
const storedUserId = browser ? sessionStorage.getItem('userId') : null;
export const userId = writable<number | null>(storedUserId ? parseInt(storedUserId, 10) : null);

// Subscribe to changes in the userId store and update sessionStorage
if (browser) {
  userId.subscribe((value) => {
    if (value !== null) {
      sessionStorage.setItem('userId', value.toString());
    } else {
      sessionStorage.removeItem('userId');
    }
  });
}
