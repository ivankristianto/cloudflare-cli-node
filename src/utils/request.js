import fetch from 'node-fetch';
import { getAuthToken } from './config';
import log from './logger';

function defaultHeaders() {
	return {
		'Content-Type': 'application/json',
	};
}

async function constructHeaders(headersOpt = {}) {
	const authToken = await getAuthToken();
	return {
		Authorization: `Bearer ${authToken}`,
		...headersOpt,
	};
}

async function requestInterface(url, method = 'GET', body = null, headersOpt = {}) {
	const headers = await constructHeaders(headersOpt);

	const opts = { method, headers: { ...headers, ...defaultHeaders() } };

	if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
		opts.body = JSON.stringify(body);
	}

	try {
		return await fetch(url, opts);
	} catch (err) {
		log.error(err);
		return false;
	}
}

export async function requestAsText(url, method = 'GET', body = null, headersOpt = {}) {
	const response = await requestInterface(url, method, body, headersOpt);

	if (response === false) {
		return response;
	}

	return response.text();
}

export async function requestWithFormData(url, method = 'POST', body = null, headersOpt = {}) {
	const headers = await constructHeaders(headersOpt);

	const opts = { method, headers, body };

	try {
		const response = await fetch(url, opts);

		return response.json();
	} catch (err) {
		log.error(err);
		return false;
	}
}

export default async function request(url, method = 'GET', body = null, headersOpt = {}) {
	const response = await requestInterface(url, method, body, headersOpt);

	if (response === false) {
		return response;
	}

	return response.json();
}
