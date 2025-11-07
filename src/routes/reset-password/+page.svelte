<script lang="ts">
	import { resetPassword } from "$lib/api/api";
	import { goto } from "$app/navigation";

	export let data;

	let email: string = data.email || "";
	let token: string = data.token || "";
	let newPassword: string = "";
	let confirmPassword: string = "";
	let showPassword: boolean = false;
	let isLoading: boolean = false;
	let successMessage: string = "";
	let errorMessage: string = "";
	let step: 'form' | 'success' = 'form';

	function validateForm(): boolean {
		if (!newPassword || !confirmPassword) {
			errorMessage = "Please fill in all fields";
			return false;
		}

		if (newPassword.length < 6) {
			errorMessage = "Password must be at least 6 characters long";
			return false;
		}

		if (newPassword !== confirmPassword) {
			errorMessage = "Passwords do not match";
			return false;
		}

		return true;
	}

	async function handleResetPassword(event: Event): Promise<void> {
		event.preventDefault();
		errorMessage = "";
		successMessage = "";

		if (!email || !token) {
			errorMessage = "Invalid reset link. Please request a new password reset.";
			return;
		}

		if (!validateForm()) return;

		isLoading = true;

		try {
			await resetPassword(email, token, newPassword);
			step = 'success';
			successMessage = "Your password has been reset successfully!";
		} catch (error: any) {
			console.log(error);
			errorMessage = error.response?.data?.message || "Failed to reset password. Please try again.";
		} finally {
			isLoading = false;
		}
	}

	function goToLogin(): void {
		goto("/");
	}

	function togglePasswordVisibility(): void {
		showPassword = !showPassword;
	}
</script>

<svelte:head>
	<title>Reset Password - Budget Tracker</title>
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4"
>
	<div class="max-w-md w-full space-y-8">
		<!-- Header -->
		<div class="text-center">
			<h1 class="text-4xl font-bold text-white">Create New Password</h1>
			<p class="mt-3 text-lg text-white/70">
				{#if step === 'form'}
					Enter your new password below
				{:else}
					Password updated successfully
				{/if}
			</p>
		</div>

		{#if step === 'form'}
			{#if !email || !token}
				<!-- Invalid Link -->
				<div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-xl">
					<div class="flex flex-col items-center space-y-4">
						<svg class="h-16 w-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<p class="text-white text-center">
							Invalid or expired reset link. Please request a new password reset.
						</p>
						<button
							type="button"
							on:click={goToLogin}
							class="w-full py-2 px-4 text-sm font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all"
						>
							Back to Login
						</button>
					</div>
				</div>
			{:else}
				<!-- Reset Form -->
				<form on:submit={handleResetPassword} class="mt-10 space-y-6">
					<div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-xl space-y-4">
						<!-- New Password Input -->
						<div>
							<label for="newPassword" class="block text-sm font-semibold text-white mb-2">
								New Password
							</label>
							<div class="relative">
								{#if showPassword}
									<input
										id="newPassword"
										type="text"
										bind:value={newPassword}
										class="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 bg-white/90 hover:bg-white"
										placeholder="Enter your new password"
										disabled={isLoading}
										required
									/>
								{:else}
									<input
										id="newPassword"
										type="password"
										bind:value={newPassword}
										class="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 bg-white/90 hover:bg-white"
										placeholder="Enter your new password"
										disabled={isLoading}
										required
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
							<p class="text-xs text-white/50 mt-1">Minimum 6 characters</p>
						</div>

						<!-- Confirm Password Input -->
						<div>
							<label for="confirmPassword" class="block text-sm font-semibold text-white mb-2">
								Confirm Password
							</label>
							<div class="relative">
								<input
									id="confirmPassword"
									type="password"
									bind:value={confirmPassword}
									class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 bg-white/90 hover:bg-white"
									placeholder="Confirm your new password"
									disabled={isLoading}
									required
								/>
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

					<!-- Submit Button -->
					<button
						type="submit"
						disabled={isLoading}
						class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
					>
						{#if isLoading}
							<svg
								class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Resetting...
						{:else}
							Reset Password
						{/if}
					</button>

					<div class="text-center text-sm text-white/60">
						<button
							type="button"
							on:click={goToLogin}
							class="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
						>
							Back to Login
						</button>
					</div>
				</form>
			{/if}
		{:else}
			<!-- Success State -->
			<div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-xl space-y-6">
				<!-- Success Icon -->
				<div class="flex justify-center">
					<div class="relative inline-flex items-center justify-center h-20 w-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full">
						<svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
						</svg>
					</div>
				</div>

				<!-- Success Message -->
				<div class="text-center">
					<p class="text-white text-lg font-semibold">{successMessage}</p>
					<p class="text-white/60 text-sm mt-2">
						You can now sign in with your new password.
					</p>
				</div>

				<!-- Login Button -->
				<button
					type="button"
					on:click={goToLogin}
					class="w-full py-3 px-4 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all shadow-lg hover:shadow-xl"
				>
					Go to Login
				</button>
			</div>
		{/if}
	</div>
</div>
