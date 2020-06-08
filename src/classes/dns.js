import fs from 'fs-extra';
import FormData from 'form-data';
import { getRootApiURL } from '../utils/config';
import request, { requestAsText, requestWithFormData } from '../utils/request';

class DNS {
	static async list(args = {}) {
		const {
			zoneId = '',
			type = 'A',
			name = '',
			content = '',
			order = 'type',
			page = 1,
			perPage = 20,
			direction = 'asc',
			match = 'any',
		} = args;
		const dnsRecordsApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}/dns_records`);

		if (type) {
			dnsRecordsApiUrl.searchParams.append('type', type);
		}

		if (name) {
			dnsRecordsApiUrl.searchParams.append('name', name);
		}

		if (content) {
			dnsRecordsApiUrl.searchParams.append('content', content);
		}

		if (order) {
			dnsRecordsApiUrl.searchParams.append('order', order);
		}

		if (page) {
			dnsRecordsApiUrl.searchParams.append('page', page.toString());
		}

		if (perPage) {
			dnsRecordsApiUrl.searchParams.append('per_page', perPage.toString());
		}

		if (direction) {
			dnsRecordsApiUrl.searchParams.append('direction', direction);
		}

		if (match) {
			dnsRecordsApiUrl.searchParams.append('match', match);
		}

		const response = await request(dnsRecordsApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	static async create(args = {}) {
		const {
			zoneId = '',
			type = 'A',
			name = '',
			content = '',
			ttl = 1,
			proxied = true,
			priority = 0,
		} = args;

		const requestArgs = { type, name, content, ttl, proxied };

		if (priority) {
			requestArgs.priority = priority;
		}

		const dnsRecordsApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}/dns_records`);

		const response = await request(dnsRecordsApiUrl.toString(), 'POST', requestArgs);

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	static async delete(args = {}) {
		const { zoneId = '', recordId = '' } = args;

		const dnsRecordsApiUrl = new URL(
			`${getRootApiURL()}zones/${zoneId}/dns_records/${recordId}`,
		);

		const response = await request(dnsRecordsApiUrl.toString(), 'DELETE');

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	static async export(args = {}) {
		const { zoneId = '' } = args;

		const dnsRecordsApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}/dns_records/export`);

		return requestAsText(dnsRecordsApiUrl.toString());
	}

	static async import(args = {}) {
		const { inputFile, proxied = true, zoneId = '' } = args;

		const dnsRecordsApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}/dns_records/import`);

		if (!(await fs.pathExists(inputFile))) {
			throw new Error(`Input File ${inputFile} does not exist`);
		}

		const formData = new FormData();
		formData.append('file', fs.createReadStream(inputFile));
		formData.append('proxied', proxied.toString());

		const response = await requestWithFormData(dnsRecordsApiUrl.toString(), 'POST', formData);

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}
}

export default DNS;
