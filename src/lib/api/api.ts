import axios from 'axios';

// Create an Axios instance with a base URL
// Replace with your backend URL, e.g., 'http://localhost:5000'
const api = axios.create({
	baseURL: 'https://budget-tracker-back-end.vercel.app' // 'https://budget-tracker-back-end.vercel.app' // Adjust the URL as needed
});

// A simple API function to handle user registration
export async function registerUser(userData: { username: string; password: string }) {
	const response = await api.post('/register', userData);
	return response.data;
}

// A simple API function to handle user login
export async function loginUser(userData: { username: string; password: string }) {
	const response = await api.post('/login', userData);
	return response.data;
}

// A function to add a new expense for a specific user
export async function addExpense(userId: number, expenseData: { amount: number; category: string; description: string }) {
	const response = await api.post(`/users/${userId}/expenses`, expenseData);
	return response.data;
}

// A function to get all expenses for a specific user
export async function getExpenses(userId: number) {
	const response = await api.get(`/users/${userId}/expenses`);
	return response.data.expenses;
}

// A function to handle user logout
export async function logoutUser() {
	const response = await api.get('/logout');
	return response.data;
}