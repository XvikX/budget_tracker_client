<script lang="ts">
	import { onMount } from 'svelte';
	import ExpenseDialog from '../dashboard/ExpenseDialog.svelte';
    
	interface Expense {
		id: number;
		amount: number;
		category: string;
		description: string;
		date_posted: Date | string;
	}
	
	let expenses: Expense[] = [];
	let currentWeekExpenses: Expense[] = [];
	let recentExpenses: Expense[] = [];
	let weeklyTotal = 0;
	let isLoading = true;
	let errorMessage = '';
	let categoryBreakdown: Array<[string, number]> = [];

    // Dialog state
    let isExpenseDialogOpen: boolean = false;
    let selectedExpense: Expense | null = null;

	// Mock data for demonstration - replace with actual API calls
	const mockExpenses = [
		{ id: 1, amount: 25.50, category: 'Food', description: 'Lunch at cafe', date_posted: new Date('2024-01-15T12:30:00') },
		{ id: 2, amount: 45.00, category: 'Transport', description: 'Bus pass', date_posted: new Date('2024-01-14T08:15:00') },
		{ id: 3, amount: 120.00, category: 'Shopping', description: 'Groceries', date_posted: new Date('2024-01-13T16:45:00') },
		{ id: 4, amount: 15.75, category: 'Food', description: 'Coffee', date_posted: new Date('2024-01-12T09:30:00') },
		{ id: 5, amount: 80.00, category: 'Entertainment', description: 'Movie tickets', date_posted: new Date('2024-01-11T19:00:00') },
		{ id: 6, amount: 32.40, category: 'Food', description: 'Dinner', date_posted: new Date('2024-01-10T18:30:00') },
		{ id: 7, amount: 12.00, category: 'Transport', description: 'Taxi fare', date_posted: new Date('2024-01-09T22:15:00') },
		{ id: 8, amount: 65.00, category: 'Health', description: 'Pharmacy', date_posted: new Date('2024-01-08T14:20:00') }
	];

	onMount(async () => {
		try {
			// Simulate API call delay
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// In real app, fetch from API: const response = await fetch('/api/users/1/expenses');
			expenses = mockExpenses;
			
			// Calculate current week expenses
			const now = new Date();
			const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
			const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
			
			currentWeekExpenses = expenses.filter(expense => {
				const expenseDate = new Date(expense.date_posted);
				return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
			});
			
			// Calculate weekly total
			weeklyTotal = currentWeekExpenses.reduce((sum, expense) => sum + expense.amount, 0);
			
			// Get recent expenses (last 5)
			recentExpenses = expenses
				.sort((a, b) => new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime())
				.slice(0, 5);
			
			// Calculate category breakdown
			const breakdown = expenses.reduce((acc: Record<string, number>, expense) => {
				acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
				return acc;
			}, {});
			categoryBreakdown = Object.entries(breakdown);
				
		} catch (error) {
			errorMessage = 'Failed to load expenses';
			console.error('Error loading expenses:', error);
		} finally {
			isLoading = false;
		}
	});

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	}

	function formatDate(date: Date | string): string {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getCategoryIcon(category: string): string {
		const icons: Record<string, string> = {
			'Food': '🍽️',
			'Transport': '🚗',
			'Shopping': '🛒',
			'Entertainment': '🎬',
			'Health': '🏥',
			'Bills': '📄',
			'Other': '💸'
		};
		return icons[category] || '💸';
	}

    function openAddExpenseDialog() {
		selectedExpense = null;
		isExpenseDialogOpen = true;
	}

	function handleExpenseSubmit(event: CustomEvent<Expense>) {
		const newExpense = {
			...event.detail,
			id: expenses.length + 1 // Generate ID for new expense
		};
		
		// Add to your expenses array
		expenses = [...expenses, newExpense];
		
		// Recalculate data
		updateExpenseData();
		
		console.log('New expense added:', newExpense);
	}

    function updateExpenseData() {
		// Recalculate current week expenses
		const now = new Date();
		const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
		const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
		
		currentWeekExpenses = expenses.filter(expense => {
			const expenseDate = new Date(expense.date_posted);
			return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
		});
		
		// Recalculate weekly total
		weeklyTotal = currentWeekExpenses.reduce((sum, expense) => sum + expense.amount, 0);
		
		// Get recent expenses (last 5)
		recentExpenses = expenses
			.sort((a, b) => new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime())
			.slice(0, 5);
		
		// Calculate category breakdown
		const breakdown = expenses.reduce((acc: Record<string, number>, expense) => {
			acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
			return acc;
		}, {});
		categoryBreakdown = Object.entries(breakdown);
	}
</script>

<svelte:head>
	<title>Dashboard - Budget Tracker</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center py-6">
				<div>
					<h1 class="text-2xl font-bold text-gray-900">Budget Dashboard</h1>
					<p class="text-sm text-gray-600">Track your expenses and manage your budget</p>
				</div>
				<div class="flex items-center space-x-4">
					<button 
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    on:click={openAddExpenseDialog}
                    >
						Add Expense
					</button>
					<button 
						class="text-gray-600 hover:text-gray-900 transition-colors"
						on:click={() => window.location.href = '/'}
						title="Logout"
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if isLoading}
			<div class="flex justify-center items-center h-64">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		{:else if errorMessage}
			<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
				{errorMessage}
			</div>
		{:else}
			<!-- Dashboard Content -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Left Column - Current Week Expenses -->
				<div class="lg:col-span-2 space-y-6">
					<!-- Weekly Summary Card -->
					<div class="bg-white rounded-xl shadow-sm border p-6">
						<div class="flex items-center justify-between mb-4">
							<h2 class="text-lg font-semibold text-gray-900">This Week's Expenses</h2>
							<span class="text-sm text-gray-500">
								{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - 
								{new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
							</span>
						</div>
						
						<div class="text-center py-8">
							<div class="text-4xl font-bold text-blue-600 mb-2">
								{formatCurrency(weeklyTotal)}
							</div>
							<p class="text-gray-600 mb-4">
								{currentWeekExpenses.length} expenses this week
							</p>
							
							<!-- Progress bar for weekly budget (assuming $500 budget) -->
							<div class="w-full bg-gray-200 rounded-full h-2 mb-2">
								<div class="bg-blue-600 h-2 rounded-full" style="width: {Math.min((weeklyTotal / 500) * 100, 100)}%"></div>
							</div>
							<p class="text-sm text-gray-500">
								{formatCurrency(weeklyTotal)} of {formatCurrency(500)} budget used
							</p>
						</div>
					</div>

					<!-- Weekly Expenses List -->
					<div class="bg-white rounded-xl shadow-sm border">
						<div class="p-6 border-b">
							<h3 class="text-lg font-semibold text-gray-900">This Week's Transactions</h3>
						</div>
						<div class="divide-y">
							{#each currentWeekExpenses as expense}
								<div class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
									<div class="flex items-center space-x-4">
										<div class="text-2xl">{getCategoryIcon(expense.category)}</div>
										<div>
											<div class="font-medium text-gray-900">{expense.description}</div>
											<div class="text-sm text-gray-500">{expense.category}</div>
										</div>
									</div>
									<div class="text-right">
										<div class="font-semibold text-gray-900">{formatCurrency(expense.amount)}</div>
										<div class="text-sm text-gray-500">{formatDate(expense.date_posted)}</div>
									</div>
								</div>
							{/each}
							
							{#if currentWeekExpenses.length === 0}
								<div class="p-6 text-center text-gray-500">
									No expenses recorded this week yet.
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Right Column - Recent Expenses -->
				<div class="space-y-6">
					<!-- Recent Expenses Card -->
					<div class="bg-white rounded-xl shadow-sm border">
						<div class="p-6 border-b">
							<h3 class="text-lg font-semibold text-gray-900">Recent Expenses</h3>
							<p class="text-sm text-gray-500">Latest 5 transactions</p>
						</div>
						<div class="divide-y">
							{#each recentExpenses as expense}
								<div class="p-4 hover:bg-gray-50 transition-colors">
									<div class="flex items-center space-x-3">
										<div class="text-lg">{getCategoryIcon(expense.category)}</div>
										<div class="flex-1 min-w-0">
											<div class="font-medium text-gray-900 truncate">{expense.description}</div>
											<div class="text-sm text-gray-500">{expense.category}</div>
										</div>
										<div class="text-right">
											<div class="font-semibold text-gray-900">{formatCurrency(expense.amount)}</div>
											<div class="text-xs text-gray-500">{formatDate(expense.date_posted)}</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Quick Stats Card -->
					<div class="bg-white rounded-xl shadow-sm border p-6">
						<h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
						<div class="space-y-4">
							<div class="flex justify-between items-center">
								<span class="text-gray-600">Total Expenses</span>
								<span class="font-semibold">{expenses.length}</span>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-gray-600">This Week</span>
								<span class="font-semibold">{currentWeekExpenses.length}</span>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-gray-600">Average per Expense</span>
								<span class="font-semibold">
									{formatCurrency(expenses.length > 0 ? expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length : 0)}
								</span>
							</div>
						</div>
					</div>

					<!-- Category Breakdown -->
					<div class="bg-white rounded-xl shadow-sm border p-6">
						<h3 class="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
						<div class="space-y-3">
							{#each categoryBreakdown as [category, total]}
								<div class="flex items-center justify-between">
									<div class="flex items-center space-x-2">
										<span class="text-lg">{getCategoryIcon(category)}</span>
										<span class="text-sm text-gray-600">{category}</span>
									</div>
									<span class="font-semibold text-sm">{formatCurrency(total)}</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</main>

    <ExpenseDialog
    bind:isOpen={isExpenseDialogOpen}
    expense={selectedExpense}
    on:submit={handleExpenseSubmit}
    />
</div>
