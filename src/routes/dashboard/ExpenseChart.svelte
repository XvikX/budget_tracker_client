<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	interface Expense {
		id: number;
		amount: number;
		category: string;
		description: string;
		date_posted: Date | string;
	}

	export let expenses: Expense[] = [];

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	function getDayOfMonth(date: Date | string): number {
		const dateObj = new Date(date);
		return dateObj.getDate();
	}

	function getCurrentMonthExpenses() {
		const now = new Date();
		const currentMonth = now.getMonth();
		const currentYear = now.getFullYear();

		return expenses.filter((expense) => {
			const expenseDate = new Date(expense.date_posted);
			return (
				expenseDate.getMonth() === currentMonth &&
				expenseDate.getFullYear() === currentYear
			);
		});
	}

	function generateChartData() {
		const now = new Date();
		const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

		// Initialize array with days of month
		const dailyExpenses: Record<number, number> = {};
		for (let i = 1; i <= daysInMonth; i++) {
			dailyExpenses[i] = 0;
		}

		// Get current month expenses
		const monthExpenses = getCurrentMonthExpenses();

		// Aggregate expenses by day
		monthExpenses.forEach((expense) => {
			const day = getDayOfMonth(expense.date_posted);
			dailyExpenses[day] += expense.amount;
		});

		// Create cumulative data
		const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
		const dataPoints = Array.from({ length: daysInMonth }, (_, i) => {
			let sum = 0;
			for (let j = 1; j <= i + 1; j++) {
				sum += dailyExpenses[j];
			}
			return sum;
		});

		return { labels, dataPoints, dailyExpenses };
	}

	function updateChart() {
		if (!canvas) return;

		const { labels, dataPoints } = generateChartData();

		if (chart) {
			chart.data.labels = labels;
			chart.data.datasets[0].data = dataPoints;
			chart.update('none'); // Update without animation for snappy feel
		} else {
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			chart = new Chart(ctx, {
				type: 'line',
				data: {
					labels,
					datasets: [
						{
							label: 'Cumulative Expenses',
							data: dataPoints,
							borderColor: 'rgb(99, 102, 241)',
							backgroundColor: 'rgba(99, 102, 241, 0.1)',
							fill: true,
							tension: 0.4,
							pointBackgroundColor: 'rgb(99, 102, 241)',
							pointBorderColor: '#fff',
							pointBorderWidth: 2,
							pointRadius: 5,
							pointHoverRadius: 7,
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: true,
					plugins: {
						legend: {
							display: true,
							labels: {
								color: 'rgba(255, 255, 255, 0.7)',
								font: {
									size: 13,
									weight: 'bold',
								},
							},
						},
						tooltip: {
							backgroundColor: 'rgba(0, 0, 0, 0.8)',
							padding: 12,
							titleColor: '#fff',
							bodyColor: '#fff',
							borderColor: 'rgba(255, 255, 255, 0.2)',
							borderWidth: 1,
							callbacks: {
								label: function (context) {
									return `$${context.parsed.y.toFixed(2)}`;
								},
							},
						},
					},
					scales: {
						y: {
							beginAtZero: true,
							ticks: {
								color: 'rgba(255, 255, 255, 0.5)',
								callback: function (value) {
									return `$${value}`;
								},
							},
							grid: {
								color: 'rgba(255, 255, 255, 0.1)',
							},
						},
						x: {
							ticks: {
								color: 'rgba(255, 255, 255, 0.5)',
							},
							grid: {
								color: 'rgba(255, 255, 255, 0.05)',
							},
						},
					},
				},
			});
		}
	}

	onMount(() => {
		updateChart();
	});

	$: if (expenses && expenses.length >= 0) {
		updateChart();
	}
</script>

<div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-xl">
	<h2 class="text-2xl font-bold text-white mb-6">
		📈 Monthly Expense Evolution
	</h2>
	<div class="relative h-80">
		<canvas bind:this={canvas}></canvas>
	</div>
	<div class="mt-4 text-center text-sm text-white/60">
		{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Overview
	</div>
</div>
