export const prerender = false;

// Don't access url.searchParams on the server during prerendering
export async function load() {
	return {};
}
