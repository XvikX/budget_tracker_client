<script lang="ts">
	import { requestPasswordReset } from "$lib/api/api";
	import { goto } from "$app/navigation";

	let email: string = "";
	let isLoading: boolean = false;
	let successMessage: string = "";
	let errorMessage: string = "";
	let step: 'email' | 'instructions' = 'email';

	async function handleForgotPassword(event: Event): Promise<void> {
		event.preventDefault();
		errorMessage = "";
		successMessage = "";

		if (!email) {
			errorMessage = "Please enter your email address";
			return;
		}

		if (!email.includes("@")) {
			errorMessage = "Please enter a valid email address";
			return;
		}

		isLoading = true;

		try {
			await requestPasswordReset(email);
			step = 'instructions';
			successMessage = `Reset instructions have been sent to ${email}`;
		} catch (error) {
			console.log(error);
			errorMessage = "Failed to send reset email. Please try again.";
		} finally {
			isLoading = false;
		}
	}

	function goBack(): void {
		goto("/");
	}
</script>

<svelte:head>
	<title>Forgot Password - Budget Tracker</title>
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4"
>
	<div class="max-w-md w-full space-y-8">
		<!-- Header -->
		<div class="text-center">
			<button
				type="button"
				on:click={goBack}
				class="inline-flex items-center justify-center text-white/60 hover:text-white transition-colors mb-6"
				title="Go back"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					></path>
				</svg>
				<span class="ml-2 text-sm font-medium">Back</span>
			</button>

			<h1 class="text-4xl font-bold text-white">Reset Password</h1>
			<p class="mt-3 text-lg text-white/70">
				{#if step === 'email'}
					Enter your email to receive reset instructions
				{:else}
					Check your email for reset link
				{/if}
			</p>
		</div>

		{#if step === 'email'}
			<!-- Forgot Password Form -->
			<form on:submit={handleForgotPassword} class="mt-10 space-y-6">
				<div class="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-xl">
					<!-- Email Input -->
					<div>
						<label for="email" class="block text-sm font-semibold text-white mb-2">
							Email Address
						</label>
						<div class="relative">
							<input
								id="email"
								type="email"
								bind:value={email}
								class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 bg-white/90 hover:bg-white"
								placeholder="Enter your email address"
								disabled={isLoading}
								required
							/>
							<div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
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
						Sending...
					{:else}
						Send Reset Link
					{/if}
				</button>

				<div class="text-center text-sm text-white/60">
					Remember your password?
					<button
						type="button"
						on:click={goBack}
						class="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
					>
						Sign in
					</button>
				</div>
			</form>
		{:else}
			<!-- Instructions -->
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
						Check your inbox and follow the link to reset your password. The link will expire in 1 hour.
					</p>
				</div>

				<!-- Instructions List -->
				<div class="bg-white/5 rounded-lg p-4 space-y-3">
					<div class="flex items-start space-x-3">
						<span class="flex-shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-full bg-purple-600 text-white text-sm font-medium">1</span>
						<p class="text-white/70 text-sm">Open the reset link from your email</p>
					</div>
					<div class="flex items-start space-x-3">
						<span class="flex-shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-full bg-purple-600 text-white text-sm font-medium">2</span>
						<p class="text-white/70 text-sm">Enter your new password</p>
					</div>
					<div class="flex items-start space-x-3">
						<span class="flex-shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-full bg-purple-600 text-white text-sm font-medium">3</span>
						<p class="text-white/70 text-sm">Sign in with your new password</p>
					</div>
				</div>

				<!-- Resend Link Option -->
				<div class="text-center pt-4 border-t border-white/10">
					<p class="text-white/60 text-sm mb-3">Didn't receive the email?</p>
					<button
						type="button"
						on:click={() => {
							step = 'email';
							email = '';
							successMessage = '';
						}}
						class="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors text-sm"
					>
						Try another email
					</button>
				</div>

				<!-- Back Button -->
				<button
					type="button"
					on:click={goBack}
					class="w-full py-2 px-4 text-sm font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
				>
					Back to Login
				</button>
			</div>
		{/if}
	</div>
</div>
