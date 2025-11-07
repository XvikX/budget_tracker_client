<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    interface Expense {
        id?: string | number;
        amount: number;
        category: string;
        description: string;
        date_posted: Date | string;
    }
    
    export let isOpen = false;
    export let expense: Expense | null = null;
    
    const dispatch = createEventDispatcher();

    // Helper function to format date for input field (YYYY-MM-DD)
    function formatDateForInput(date: Date | string): string {
        let dateObj: Date;
        if (typeof date === 'string') {
            dateObj = new Date(date);
        } else {
            dateObj = date;
        }
        
        // Ensure we get the local date, not UTC
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }
    
    // Form data
    let formData: Expense = {
        amount: 0,
        category: '',
        description: '',
        date_posted: formatDateForInput(new Date())
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
                date_posted: formatDateForInput(expense.date_posted)
            };
        } else {
            // Add mode - reset to default values
            formData = {
                amount: 0,
                category: '',
                description: '',
                date_posted: formatDateForInput(new Date())
            };
        }
    }
    
    function handleSubmit() {
        // Validate required fields
        if (!formData.amount || !formData.category || !formData.description) {
            alert('Please fill in all required fields');
            return;
        }

        // Convert date string back to Date object
        const expenseData = {
            ...formData,
            amount: Number(formData.amount),
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
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        on:click={handleBackdropClick}
        on:keydown={(e) => e.key === 'Escape' && closeDialog()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        tabindex="-1"
    >
        <!-- Dialog Content -->
        <div class="bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-white/10">
                <h2 id="dialog-title" class="text-2xl font-bold bg-gradient-to-r from-slate-900 to-purple-900 bg-clip-text text-transparent">
                    {expense ? '✏️ Edit Expense' : '➕ Add Expense'}
                </h2>
                <button
                    on:click={closeDialog}
                    class="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-white/50 rounded-lg"
                    aria-label="Close dialog"
                >
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <!-- Form -->
            <form on:submit|preventDefault={handleSubmit} class="p-6 space-y-5">
                <!-- Amount Field -->
                <div>
                    <label for="amount" class="block text-sm font-semibold text-slate-700 mb-2">
                        Amount <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                        <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-semibold">$</span>
                        <input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            bind:value={formData.amount}
                            class="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 hover:bg-white transition-colors"
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>
                
                <!-- Category Field -->
                <div>
                    <label for="category" class="block text-sm font-semibold text-slate-700 mb-2">
                        Category <span class="text-red-500">*</span>
                    </label>
                    <select
                        id="category"
                        bind:value={formData.category}
                        class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 hover:bg-white transition-colors appearance-none cursor-pointer"
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
                    <label for="description" class="block text-sm font-semibold text-slate-700 mb-2">
                        Description <span class="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        bind:value={formData.description}
                        rows="3"
                        class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 hover:bg-white transition-colors resize-none"
                        placeholder="Enter expense description..."
                        required
                    ></textarea>
                </div>
                
                <!-- Date Field -->
                <div>
                    <label for="date" class="block text-sm font-semibold text-slate-700 mb-2">
                        Date <span class="text-red-500">*</span>
                    </label>
                    <input
                        id="date"
                        type="date"
                        bind:value={formData.date_posted}
                        class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 hover:bg-white transition-colors"
                        required
                    />
                </div>
                
                <!-- Action Buttons -->
                <div class="flex space-x-3 pt-2">
                    <button
                        type="button"
                        on:click={closeDialog}
                        class="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="flex-1 px-4 py-3 text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl transition-all font-semibold shadow-lg"
                    >
                        {expense ? 'Update' : 'Add'}
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

