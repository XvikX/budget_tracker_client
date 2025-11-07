import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';

export const load: LayoutLoad = async () => {
	if (browser) {
		const userId = sessionStorage.getItem('userId');
		if (!userId) {
			throw redirect(303, '/');
		}
	}
};
