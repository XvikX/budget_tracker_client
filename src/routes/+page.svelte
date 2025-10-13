<script lang="ts">
	import { loginUser } from '$lib/api/api';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let username: string = '';
	let password: string = '';
	let rememberMe: boolean = false;
	let isLoading: boolean = false;
	let errorMessage: string = '';
	let showPassword: boolean = false;

	// Form validation
	function validateForm(): boolean {
		if (!username) {
			errorMessage = 'Please enter a username';
			return false;
		}
		if (!password || password.length < 6) {
			errorMessage = 'Password must be at least 6 characters long';
			return false;
		}
		return true;
	}

	async function handleLogin(event: Event): Promise<void> {
		event.preventDefault();
		errorMessage = '';

		if (!validateForm()) return;

		isLoading = true;

		try {
			await loginUser({ username, password });
			goto('/dashboard');
		} catch (error) {
            console.log(error)
			errorMessage = 'Login failed. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function togglePasswordVisibility(): void {
		showPassword = !showPassword;
	}
</script>

<svelte:head>
	<title>Login - Budget Tracker</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
	<div class="max-w-md w-full space-y-8">
		<!-- Logo/Header Section -->
		<div class="text-center">
			<div class="mx-auto h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
				<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
				</svg>
			</div>
			<h2 class="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
			<p class="mt-2 text-sm text-gray-600">Sign in to your Budget Tracker account</p>
		</div>

		<!-- Login Form -->
		<form class="mt-8 space-y-6" on:submit={handleLogin}>
			<div class="space-y-4">
				<!-- Email Input -->
                <div>
                    <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
                        Username
                    </label>
                    <div class="relative">
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autocomplete="username"
                            required
                            bind:value={username}
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                            placeholder="Enter your username"
                            disabled={isLoading}
                        />
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                            </svg>
                        </div>
                    </div>
                </div>

				<!-- Password Input -->
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 mb-1">
						Password
					</label>
					<div class="relative">
						{#if showPassword}
							<input
								id="password"
								name="password"
								type="text"
								autocomplete="current-password"
								required
								bind:value={password}
								class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
								placeholder="Enter your password"
								disabled={isLoading}
							/>
						{:else}
							<input
								id="password"
								name="password"
								type="password"
								autocomplete="current-password"
								required
								bind:value={password}
								class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
								placeholder="Enter your password"
								disabled={isLoading}
							/>
						{/if}
						<button
							type="button"
							class="absolute inset-y-0 right-0 pr-3 flex items-center"
							on:click={togglePasswordVisibility}
							disabled={isLoading}
						>
							{#if showPassword}
								<svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.414 1.414M14.12 14.12L9.878 9.878m4.242 4.242L9.878 9.878"></path>
								</svg>
							{:else}
								<svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
								</svg>
							{/if}
						</button>
					</div>
				</div>
			</div>

			<!-- Remember Me & Forgot Password -->
			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<input
						id="remember-me"
						name="remember-me"
						type="checkbox"
						bind:checked={rememberMe}
						class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						disabled={isLoading}
					/>
					<label for="remember-me" class="ml-2 block text-sm text-gray-700">
						Remember me
					</label>
				</div>

				<div class="text-sm">
					<a href="#" class="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
						Forgot your password?
					</a>
				</div>
			</div>

			<!-- Error Message -->
			{#if errorMessage}
				<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
					{errorMessage}
				</div>
			{/if}

			<!-- Login Button -->
			<div>
				<button
					type="submit"
					disabled={isLoading}
					class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
				>
					{#if isLoading}
						<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Signing in...
					{:else}
						<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
						</svg>
						Sign in
					{/if}
				</button>
			</div>

			<!-- Sign Up Link -->
			<div class="text-center">
				<p class="text-sm text-gray-600">
					Don't have an account?
					<a href="#" class="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
						Sign up here
					</a>
				</p>
			</div>
		</form>

		<!-- Decorative Elements -->
		<div class="mt-8 flex justify-center space-x-4">
			<div class="h-1 w-1 bg-blue-200 rounded-full"></div>
			<div class="h-1 w-1 bg-blue-300 rounded-full"></div>
			<div class="h-1 w-1 bg-blue-400 rounded-full"></div>
			<div class="h-1 w-1 bg-blue-300 rounded-full"></div>
			<div class="h-1 w-1 bg-blue-200 rounded-full"></div>
		</div>
	</div>
</div>
