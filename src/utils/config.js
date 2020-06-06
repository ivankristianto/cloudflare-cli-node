export function getRootApiURL() {
	return 'https://api.cloudflare.com/client/v4/';
}

export function getAuthToken() {
	return process.env.TOKEN;
}
