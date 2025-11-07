<script lang="ts">
	import { registerUser } from "$lib/api/api";
	import { goto } from "$app/navigation";

	let email: string = "";
	let password: string = "";
	let confirmPassword: string = "";
	let isLoading: boolean = false;
	let errorMessage: string = "";
	let successMessage: string = "";
	let showPassword: boolean = false;
	let showConfirmPassword: boolean = false;

	// Email validation regex
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	// Form validation
	function validateForm(): boolean {
		if (!email) {
			errorMessage = "Please enter your email";
			return false;
		}
		if (!emailRegex.test(email)) {
			errorMessage = "Please enter a valid email address";
			return false;
		}
		if (!password || password.length < 6) {
			errorMessage = "Password must be at least 6 characters long";
			return false;
		}
		if (password !== confirmPassword) {
			errorMessage = "Passwords do not match";
			return false;
		}
		return true;
	}

	async function handleSignup(event: Event): Promise<void> {
		event.preventDefault();
		errorMessage = "";
		successMessage = "";

		if (!validateForm()) return;

		isLoading = true;

		try {
			const response = await registerUser({ email, password });
			successMessage = "Account created successfully! Redirecting to login...";
			setTimeout(() => {
				goto("/");
			}, 2000);
		} catch (error: any) {
			console.log(error);
			errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
		} finally {
			isLoading = false;
		}
	}

	function togglePasswordVisibility(): void {
		showPassword = !showPassword;
	}

	function toggleConfirmPasswordVisibility(): void {
		showConfirmPassword = !showConfirmPassword;
	}
</script>

<svelte:head>
	<title>Sign Up - Budget Tracker</title>
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4"
>
	<div class="max-w-md w-full space-y-8">
		<!-- Logo/Header Section -->
		<div class="text-center">
			<div
				class="mx-auto h-20 w-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl"
			>
				<svg
					class="h-10 w-10 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
					></path>
				</svg>
			</div>
			<h2 class="mt-8 text-4xl font-bold text-white">Create Account</h2>
			<p class="mt-3 text-lg text-white/70">
				Start managing your finances today
			</p>
		</div>

		<!-- Signup Form -->
		<form class="mt-10 space-y-6" on:submit={handleSignup}>
			<div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-xl space-y-4">
				<!-- Email Input -->
				<div>
					<label
						for="email"
						class="block text-sm font-semibold text-white mb-2"
					>
						Email Address
					</label>
					<div class="relative">
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							bind:value={email}
							class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 bg-white/90 hover:bg-white"
							placeholder="you@example.com"
							disabled={isLoading}
						/>
						<div
							class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"
						>
							<svg
								class="h-5 w-5 text-slate-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								></path>
							</svg>
						</div>
					</div>
				</div>

				<!-- Password Input -->
				<div>
					<label
						for="password"
						class="block text-sm font-semibold text-white mb-2"
					>
						Password
					</label>
					<div class="relative">
						{#if showPassword}
							<input
								id="password"
								name="password"
								type="text"
								autocomplete="new-password"
								required
								bind:value={password}
								class="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 bg-white/90 hover:bg-white"
								placeholder="At least 6 characters"
								disabled={isLoading}
							/>
						{:else}
							<input
								id="password"
								name="password"
								type="password"
								autocomplete="new-password"
								required
								bind:value={password}
								class="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 bg-white/90 hover:bg-white"
								placeholder="At least 6 characters"
								disabled={isLoading}
							/>
						{/if}
						<button
							type="button"
							class="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-slate-600 transition-colors"
							on:click={togglePasswordVisibility}
							disabled={isLoading}
						>
							{#if showPassword}
								<svg
									class="h-5 w-5 text-slate-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.414 1.414M14.12 14.12L9.878 9.878m4.242 4.242L9.878 9.878"
									></path>
								</svg>
							{:else}
								<svg
									class="h-5 w-5 text-slate-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									></path>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									></path>
								</svg>
							{/if}
						</button>
					</div>
				</div>

				<!-- Confirm Password Input -->
				<div>
					<label
						for="confirmPassword"
						class="block text-sm font-semibold text-white mb-2"
					>
						Confirm Password
					</label>
					<div class="relative">
						{#if showConfirmPassword}
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="text"
								autocomplete="new-password"
								required
								bind:value={confirmPassword}
								class="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 bg-white/90 hover:bg-white"
								placeholder="Re-enter your password"
								disabled={isLoading}
							/>
						{:else}
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								autocomplete="new-password"
								required
								bind:value={confirmPassword}
								class="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 bg-white/90 hover:bg-white"
								placeholder="Re-enter your password"
								disabled={isLoading}
							/>
						{/if}
						<button
							type="button"
							class="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-slate-600 transition-colors"
							on:click={toggleConfirmPasswordVisibility}
							disabled={isLoading}
						>
							{#if showConfirmPassword}
								<svg
									class="h-5 w-5 text-slate-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.414 1.414M14.12 14.12L9.878 9.878m4.242 4.242L9.878 9.878"
									></path>
								</svg>
							{:else}
								<svg
									class="h-5 w-5 text-slate-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									></path>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									></path>
								</svg>
							{/if}
						</button>
					</div>
				</div>
			</div>

			<!-- Error Message -->
			{#if errorMessage}
				<div
					class="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm backdrop-blur-md"
				>
					{errorMessage}
				</div>
			{/if}

			<!-- Success Message -->
			{#if successMessage}
				<div
					class="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl text-sm backdrop-blur-md"
				>
					{successMessage}
				</div>
			{/if}

			<!-- Signup Button -->
			<div>
				<button
					type="submit"
					disabled={isLoading}
					class="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
				>
					{#if isLoading}
						<span class="flex items-center justify-center">
							<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Creating account...
						</span>
					{:else}
						Create Account
					{/if}
				</button>
			</div>

			<!-- Login Link -->
			<div class="text-center pt-4">
				<p class="text-white/70">
					Already have an account?
					<a href="/" class="font-medium text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
						Login here
					</a>
				</p>
			</div>
		</form>

		<!-- Features Section -->
		<div class="mt-12 grid grid-cols-3 gap-4 text-center">
			<div class="bg-white/5 backdrop-blur rounded-lg p-4 border border-white/10">
				<svg class="h-8 w-8 text-cyan-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<p class="text-xs text-white/60">Secure</p>
			</div>
			<div class="bg-white/5 backdrop-blur rounded-lg p-4 border border-white/10">
				<svg class="h-8 w-8 text-cyan-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
				</svg>
				<p class="text-xs text-white/60">Fast</p>
			</div>
			<div class="bg-white/5 backdrop-blur rounded-lg p-4 border border-white/10">
				<svg class="h-8 w-8 text-cyan-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
				</svg>
				<p class="text-xs text-white/60">Analytics</p>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background: linear-gradient(to bottom right, rgb(15, 23, 42), rgb(88, 28, 135), rgb(15, 23, 42));
	}
</style>
