import axios from 'axios';

// Create an Axios instance with a base URL
// Uses VITE_API_BASE_URL environment variable
const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true
});

// Add JWT token to request headers if available
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('authToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// A simple API function to handle user registration
export async function registerUser(userData: { email: string; password: string }) {
	const response = await api.post('/register', userData);
	return response.data;
}

// A simple API function to handle user login
export async function loginUser(userData: { email: string; password: string }) {
	const response = await api.post('/login', userData);
	// Store the token in localStorage
	if (response.data.token) {
		localStorage.setItem('authToken', response.data.token);
	}
	return response.data;
}

// A function to add a new expense for a specific user
export async function addExpense(userId: string | number, expenseData: { amount: number; category: string; description: string }) {
	const response = await api.post(`/users/${userId}/expenses`, expenseData);
	return response.data;
}

// A function to get all expenses for a specific user
export async function getExpenses(userId: string | number) {
	const response = await api.get(`/users/${userId}/expenses`);
	return response.data.expenses;
}

// A function to get expenses from a specific date for a specific user
export async function getExpensesFromDate(userId: string | number, startDate: string) {
	const response = await api.get(`/users/${userId}/expenses/from/${startDate}`);
	return response.data.expenses;
}

// A function to handle user logout
export async function logoutUser() {
	// Remove token from localStorage
	localStorage.removeItem('authToken');
	const response = await api.get('/logout');
	return response.data;
}

// Get current logged-in user info
export async function getCurrentUser() {
	const response = await api.get('/users/current');
	return response.data;
}

// Get user profile
export async function getUserProfile(userId: string) {
	const response = await api.get(`/users/${userId}`);
	return response.data;
}

// Delete an expense
export async function deleteExpense(userId: string, expenseId: string) {
	const response = await api.delete(`/users/${userId}/expenses/${expenseId}`);
	return response.data;
}

// Update an expense
export async function updateExpense(userId: string, expenseId: string, expenseData: { amount?: number; category?: string; description?: string }) {
	const response = await api.put(`/users/${userId}/expenses/${expenseId}`, expenseData);
	return response.data;
}

// Get expenses within a date range
export async function getExpensesInRange(userId: string, startDate: string, endDate: string) {
	const response = await api.get(`/users/${userId}/expenses/range/${startDate}/${endDate}`);
	return response.data.expenses;
}

// Get expense statistics
export async function getExpenseStats(userId: string) {
	const response = await api.get(`/users/${userId}/expenses/stats`);
	return response.data;
}

// Get category breakdown
export async function getCategoryBreakdown(userId: string) {
	const response = await api.get(`/users/${userId}/expenses/categories`);
	return response.data.categories;
}

// Request password reset
export async function requestPasswordReset(email: string) {
	const response = await api.post('/forgot-password', { email });
	return response.data;
}

// Reset password with token
export async function resetPassword(email: string, token: string, newPassword: string) {
	const response = await api.post('/reset-password', { 
		email, 
		token, 
		new_password: newPassword 
	});
	return response.data;
}