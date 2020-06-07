import fetch from 'node-fetch';
import { getAuthToken } from './config';

function defaultHeaders() {
	return {
		'Content-Type': 'application/json',
	};
}

export default async function request(url, method = 'GET', body = null, headersOpt = {}) {
	const authToken = await getAuthToken();
	const headers = {
		...defaultHeaders(authToken),
		Authorization: `Bearer ${authToken}`,
		...headersOpt,
	};

	const opts = { method, headers };

	if (method === 'POST' || method === 'PUT') {
		opts.body = JSON.stringify(body);
	}

	const response = await fetch(url, opts);

	return response.json();
}
