export const prerender = false;

export async function load({ url }) {
	return {
		email: url.searchParams.get('email') || '',
		token: url.searchParams.get('token') || ''
	};
}
