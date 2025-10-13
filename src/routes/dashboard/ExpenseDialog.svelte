<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    interface Expense {
        id?: number;
        amount: number;
        category: string;
        description: string;
        date_posted: Date | string;
    }
    
    export let isOpen = false;
    export let expense: Expense | null = null;
    
    const dispatch = createEventDispatcher();
    
    // Form data
    let formData: Expense = {
        amount: 0,
        category: '',
        description: '',
        date_posted: new Date().toISOString().split('T')[0]
    };
    
    // Category options
    const categories = [
        'Food',
        'Transport', 
        'Shopping',
        'Entertainment',
        'Health',
        'Bills',
        'Other'
    ];
    
    // Reset form when dialog opens
    $: if (isOpen) {
        if (expense) {
            // Edit mode - populate with existing expense data
            formData = {
                ...expense,
                date_posted: typeof expense.date_posted === 'string' 
                    ? expense.date_posted.split('T')[0] 
                    : expense.date_posted.toISOString().split('T')[0]
            };
        } else {
            // Add mode - reset to default values
            formData = {
                amount: 0,
                category: '',
                description: '',
                date_posted: new Date().toISOString().split('T')[0]
            };
        }
    }
    
    function handleSubmit() {
        // Convert date string back to Date object
        const expenseData = {
            ...formData,
            date_posted: new Date(formData.date_posted + 'T00:00:00')
        };
        
        dispatch('submit', expenseData);
        closeDialog();
    }
    
    function closeDialog() {
        isOpen = false;
        dispatch('close');
    }
    
    function handleBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            closeDialog();
        }
    }
</script>

{#if isOpen}
    <!-- Dialog Backdrop -->
    <div 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        on:click={handleBackdropClick}
        on:keydown={(e) => e.key === 'Escape' && closeDialog()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        tabindex="-1"
    >
        <!-- Dialog Content -->
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b">
                <h2 id="dialog-title" class="text-xl font-semibold text-gray-900">
                    {expense ? 'Edit Expense' : 'Add New Expense'}
                </h2>
                <button
                    on:click={closeDialog}
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close dialog"
                >
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <!-- Form -->
            <form on:submit|preventDefault={handleSubmit} class="p-6 space-y-6">
                <!-- Amount Field -->
                <div>
                    <label for="amount" class="block text-sm font-medium text-gray-700 mb-2">
                        Amount *
                    </label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            bind:value={formData.amount}
                            class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>
                
                <!-- Category Field -->
                <div>
                    <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                    </label>
                    <select
                        id="category"
                        bind:value={formData.category}
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        <option value="">Select a category</option>
                        {#each categories as category}
                            <option value={category}>{category}</option>
                        {/each}
                    </select>
                </div>
                
                <!-- Description Field -->
                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                    </label>
                    <textarea
                        id="description"
                        bind:value={formData.description}
                        rows="3"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Enter expense description..."
                        required
                    ></textarea>
                </div>
                
                <!-- Date Field -->
                <div>
                    <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                    </label>
                    <input
                        id="date"
                        type="date"
                        bind:value={formData.date_posted}
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>
                
                <!-- Action Buttons -->
                <div class="flex space-x-3 pt-4">
                    <button
                        type="button"
                        on:click={closeDialog}
                        class="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="flex-1 px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
                    >
                        {expense ? 'Update Expense' : 'Add Expense'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style>
    /* Ensure dialog appears above other content */
    :global(body:has(.fixed.inset-0)) {
        overflow: hidden;
    }
</style>

