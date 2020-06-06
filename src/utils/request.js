import fetch from 'node-fetch';
import { getAuthToken } from './config';

function defaultHeaders() {
	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${getAuthToken()}`,
	};
}

export default async function request(url, method = 'GET', body = null, headersOpt = {}) {
	const headers = { ...defaultHeaders(), ...headersOpt };

	const opts = { method, headers };

	if (method === 'POST' || method === 'PUT') {
		opts.body = JSON.stringify(body);
	}

	const response = await fetch(url, opts);

	return response.json();
}
