<script lang="ts">
	import { onMount } from "svelte";
	import { userId } from "$lib/stores/user";
	import ExpenseDialog from "../dashboard/ExpenseDialog.svelte";
	import ExpenseChart from "../dashboard/ExpenseChart.svelte";
    import { addExpense, getExpenses, deleteExpense, updateExpense, getExpenseStats, getCategoryBreakdown } from "$lib/api/api";

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
	let errorMessage = "";
	let categoryBreakdown: Array<[string, number]> = [];
	let stats: any = null;
	let totalSpent = 0;
	let averageExpense = 0;

	// Dialog state
	let isExpenseDialogOpen: boolean = false;
	let selectedExpense: Expense | null = null;

	onMount(async () => {
		// Check if user is authenticated
		const currentUserId = $userId;
		if (!currentUserId) {
			window.location.href = "/";
			return;
		}

		try {
			const userIdStr = String(currentUserId);
			try {
				expenses = await getExpenses(userIdStr);
				// Load statistics
				stats = await getExpenseStats(userIdStr);
				totalSpent = stats.total_spent;
				averageExpense = stats.average_expense;
				console.log("Expenses:", expenses);
				console.log("Stats:", stats);
			} catch (error) {
				console.error("Failed to fetch expenses:", error);
			}

			// Calculate last 7 days expenses
			const now = new Date();
			const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

			currentWeekExpenses = expenses.filter((expense) => {
				const expenseDate = new Date(expense.date_posted);
				return expenseDate >= sevenDaysAgo && expenseDate <= now;
			});

			// Calculate weekly total
			weeklyTotal = currentWeekExpenses.reduce(
				(sum, expense) => sum + expense.amount,
				0,
			);

			// Get recent expenses (last 5)
			recentExpenses = expenses
				.sort(
					(a, b) =>
						new Date(b.date_posted).getTime() -
						new Date(a.date_posted).getTime(),
				)
				.slice(0, 5);

			// Calculate category breakdown
			const breakdown = expenses.reduce(
				(acc: Record<string, number>, expense) => {
					acc[expense.category] =
						(acc[expense.category] || 0) + expense.amount;
					return acc;
				},
				{},
			);
			categoryBreakdown = Object.entries(breakdown);
		} catch (error) {
			errorMessage = "Failed to load expenses";
			console.error("Error loading expenses:", error);
		} finally {
			isLoading = false;
		}
	});

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	}

	function formatDate(date: Date | string): string {
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	function getCategoryIcon(category: string): string {
		const icons: Record<string, string> = {
			Food: "🍽️",
			Transport: "🚗",
			Shopping: "🛒",
			Entertainment: "🎬",
			Health: "🏥",
			Bills: "📄",
			Other: "💸",
		};
		return icons[category] || "💸";
	}

	function openAddExpenseDialog() {
		selectedExpense = null;
		isExpenseDialogOpen = true;
	}

	function openEditExpenseDialog(expense: Expense) {
		selectedExpense = expense;
		isExpenseDialogOpen = true;
	}

	async function handleLogout() {
		userId.set(null);
		window.location.href = "/";
	}

	async function handleExpenseSubmit(event: CustomEvent<Expense>) {
		const currentUserId = $userId;
		if (!currentUserId) return;

		const userIdStr = String(currentUserId);

		try {
			if (selectedExpense && selectedExpense.id) {
				// Update existing expense
				await updateExpense(userIdStr, String(selectedExpense.id), {
					amount: event.detail.amount,
					category: event.detail.category,
					description: event.detail.description
				});
				
				// Refresh expenses
				expenses = await getExpenses(userIdStr);
				selectedExpense = null;
			} else {
				// Add new expense
				const response = await addExpense(currentUserId, event.detail);
				expenses = await getExpenses(userIdStr);
			}

			// Reload statistics
			stats = await getExpenseStats(userIdStr);
			totalSpent = stats.total_spent;
			averageExpense = stats.average_expense;

			// Recalculate data
			updateExpenseData();

			console.log("Expense operation completed successfully");
		} catch (error) {
			console.error("Failed to save expense:", error);
			errorMessage = "Failed to save expense";
		}

		isExpenseDialogOpen = false;
	}

	async function handleDeleteExpense(expenseId: string) {
		if (!confirm("Are you sure you want to delete this expense?")) {
			return;
		}

		const currentUserId = $userId;
		if (!currentUserId) return;

		const userIdStr = String(currentUserId);

		try {
			await deleteExpense(userIdStr, expenseId);
			
			// Refresh expenses
			expenses = await getExpenses(userIdStr);
			
			// Reload statistics
			stats = await getExpenseStats(userIdStr);
			totalSpent = stats.total_spent;
			averageExpense = stats.average_expense;

			// Recalculate data
			updateExpenseData();

			console.log("Expense deleted successfully");
		} catch (error) {
			console.error("Failed to delete expense:", error);
			errorMessage = "Failed to delete expense";
		}
	}

	function updateExpenseData() {
		// Recalculate last 7 days expenses
		const now = new Date();
		const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

		currentWeekExpenses = expenses.filter((expense) => {
			const expenseDate = new Date(expense.date_posted);
			return expenseDate >= sevenDaysAgo && expenseDate <= now;
		});

		// Recalculate weekly total
		weeklyTotal = currentWeekExpenses.reduce(
			(sum, expense) => sum + expense.amount,
			0,
		);

		// Get recent expenses (last 5)
		recentExpenses = expenses
			.sort(
				(a, b) =>
					new Date(b.date_posted).getTime() -
					new Date(a.date_posted).getTime(),
			)
			.slice(0, 5);

		// Calculate category breakdown
		const breakdown = expenses.reduce(
			(acc: Record<string, number>, expense) => {
				acc[expense.category] =
					(acc[expense.category] || 0) + expense.amount;
				return acc;
			},
			{},
		);
		categoryBreakdown = Object.entries(breakdown);
	}
</script>

<svelte:head>
	<title>Dashboard - Budget Tracker</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
	<!-- Header -->
	<header class="bg-white/10 backdrop-blur-md border-b border-white/20">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center py-6">
				<div>
					<h1 class="text-4xl font-bold text-white">
						Budget Tracker
					</h1>
					<p class="text-sm text-white/70 mt-1">
						Manage your finances with intelligence
					</p>
				</div>
				<div class="flex items-center space-x-4">
					<button
						class="bg-white text-purple-900 px-6 py-2.5 rounded-full hover:bg-white/90 transition-all font-semibold shadow-lg"
						on:click={openAddExpenseDialog}
					>
						+ Add Expense
					</button>
					<button
						class="text-white/70 hover:text-white transition-colors p-2"
						on:click={handleLogout}
						title="Logout"
					>
						<svg
							class="h-6 w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							></path>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		{#if isLoading}
			<div class="flex justify-center items-center h-64">
				<div
					class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"
				></div>
			</div>
		{:else if errorMessage}
			<div
				class="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg backdrop-blur-md"
			>
				{errorMessage}
			</div>
		{:else}
			<!-- Expense Chart -->
			<div class="mb-8">
				<ExpenseChart {expenses} />
			</div>

			<!-- Dashboard Content -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Left Column - Current Week Expenses -->
				<div class="lg:col-span-2 space-y-6">
					<!-- Weekly Summary Card -->
					<div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-xl">
						<div class="flex items-center justify-between mb-6">
							<h2 class="text-2xl font-bold text-white">
								Last 7 Days Expenses
							</h2>
							<span class="text-sm text-white/60 bg-white/10 px-4 py-2 rounded-full">
								{new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								})} -
								{new Date().toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								})}
							</span>
						</div>

						<div class="text-center py-12">
							<div class="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">
								{formatCurrency(weeklyTotal)}
							</div>
							<p class="text-white/70 mb-6 text-lg">
								{currentWeekExpenses.length} transactions in the last 7 days
							</p>

							<!-- Progress bar for weekly budget -->
							<div class="w-full bg-white/10 rounded-full h-3 mb-3 border border-white/20">
								<div
									class="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full"
									style="width: {Math.min(
										(weeklyTotal / 500) * 100,
										100,
									)}%"
								></div>
							</div>
							<p class="text-sm text-white/60">
								{formatCurrency(weeklyTotal)} of {formatCurrency(
									500,
								)} weekly budget
							</p>
						</div>
					</div>

					<!-- Weekly Expenses List -->
					<div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden">
						<div class="p-6 border-b border-white/20">
							<h3 class="text-xl font-bold text-white">
								Recent Transactions
							</h3>
						</div>
						<div class="divide-y divide-white/10">
							{#each currentWeekExpenses as expense}
								<div
									class="p-6 flex items-center justify-between hover:bg-white/5 transition-all duration-200 group"
								>
									<div class="flex items-center space-x-4">
										<div class="text-3xl bg-white/10 p-3 rounded-lg group-hover:bg-white/20 transition-colors">
											{getCategoryIcon(expense.category)}
										</div>
										<div>
											<div
												class="font-semibold text-white text-lg"
											>
												{expense.description}
											</div>
											<div class="text-sm text-white/50">
												{expense.category}
											</div>
										</div>
									</div>
									<div class="flex items-center space-x-4">
										<div class="text-right">
											<div
												class="font-bold text-white text-lg"
											>
												{formatCurrency(expense.amount)}
											</div>
											<div class="text-sm text-white/50">
												{formatDate(expense.date_posted)}
											</div>
										</div>
										<div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
											<button
												on:click={() => openEditExpenseDialog(expense)}
												class="p-2 text-cyan-400 hover:bg-white/10 rounded-lg transition-colors"
												title="Edit"
											>
												<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
												</svg>
											</button>
											<button
												on:click={() => handleDeleteExpense(String(expense.id))}
												class="p-2 text-red-400 hover:bg-white/10 rounded-lg transition-colors"
												title="Delete"
											>
												<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
												</svg>
											</button>
										</div>
									</div>
								</div>
							{/each}

							{#if currentWeekExpenses.length === 0}
								<div class="p-12 text-center text-white/50">
									No expenses recorded in the last 7 days yet.
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Right Column - Recent Expenses & Stats -->
				<div class="space-y-6">
					<!-- Recent Expenses Card -->
					<div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden">
						<div class="p-6 border-b border-white/20">
							<h3 class="text-xl font-bold text-white">
								Recent
							</h3>
							<p class="text-sm text-white/50 mt-1">
								Latest 5 transactions
							</p>
						</div>
						<div class="divide-y divide-white/10">
							{#each recentExpenses as expense}
								<div
									class="p-4 hover:bg-white/5 transition-all duration-200 group flex items-center justify-between"
								>
									<div class="flex items-center space-x-3 flex-1">
										<div class="text-2xl">
											{getCategoryIcon(expense.category)}
										</div>
										<div class="flex-1 min-w-0">
											<div
												class="font-semibold text-white truncate"
											>
												{expense.description}
											</div>
											<div class="text-xs text-white/50">
												{expense.category}
											</div>
										</div>
									</div>
									<div class="flex items-center space-x-2">
										<div class="text-right">
											<div
												class="font-bold text-white"
											>
												{formatCurrency(expense.amount)}
											</div>
											<div class="text-xs text-white/50">
												{formatDate(
													expense.date_posted,
												)}
											</div>
										</div>
										<div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
											<button
												on:click={() => openEditExpenseDialog(expense)}
												class="p-1.5 text-cyan-400 hover:bg-white/10 rounded transition-colors"
												title="Edit"
											>
												<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
												</svg>
											</button>
											<button
												on:click={() => handleDeleteExpense(String(expense.id))}
												class="p-1.5 text-red-400 hover:bg-white/10 rounded transition-colors"
												title="Delete"
											>
												<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
												</svg>
											</button>
										</div>
									</div>
								</div>
							{/each}

							{#if recentExpenses.length === 0}
								<div class="p-8 text-center text-white/50">
									<div class="text-4xl mb-2">📊</div>
									<p class="font-semibold">No expenses yet</p>
									<p class="text-sm">
										Add your first expense to get started
									</p>
								</div>
							{/if}
						</div>
					</div>

					<!-- Quick Stats Card -->
					<div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl">
						<h3 class="text-xl font-bold text-white mb-5">
							Quick Stats
						</h3>
						<div class="space-y-4">
							<div class="flex justify-between items-center pb-4 border-b border-white/10">
								<span class="text-white/70">Total Expenses</span>
								<span class="font-bold text-white text-lg"
									>{stats?.expense_count || expenses.length}</span
								>
							</div>
							<div class="flex justify-between items-center pb-4 border-b border-white/10">
								<span class="text-white/70">This Week</span>
								<span class="font-bold text-white text-lg"
									>{currentWeekExpenses.length}</span
								>
							</div>
							<div class="flex justify-between items-center pb-4 border-b border-white/10">
								<span class="text-white/70"
									>Total Spent</span
								>
								<span class="font-bold text-cyan-400 text-lg">
									{formatCurrency(totalSpent)}
								</span>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-white/70"
									>Average per Expense</span
								>
								<span class="font-bold text-blue-400 text-lg">
									{formatCurrency(averageExpense)}
								</span>
							</div>
						</div>
					</div>

					<!-- Category Breakdown -->
					<div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl">
						<h3 class="text-xl font-bold text-white mb-5">
							Category Breakdown
						</h3>
						<div class="space-y-4">
							{#each categoryBreakdown as [category, total]}
								<div class="flex items-center justify-between pb-3 border-b border-white/10 last:border-b-0">
									<div class="flex items-center space-x-3">
										<span class="text-xl"
											>{getCategoryIcon(category)}</span
										>
										<span class="text-sm text-white/70"
											>{category}</span
										>
									</div>
									<span class="font-bold text-white"
										>{formatCurrency(total)}</span
									>
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
