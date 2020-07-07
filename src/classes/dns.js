import fs from 'fs-extra';
import FormData from 'form-data';
import Cloudflare from './cloudflare';

class DNS extends Cloudflare {
	/**
	 * Create a DNS Records for a Zone
	 *
	 * @param {object} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async create(args) {
		const { type = 'A', name = '', content = '', ttl = 1, proxied = true, priority = 0 } = args;

		const maybeZoneId = await DNS.convertZoneNameToId(args.zone);
		const zoneId = maybeZoneId || args.zone;

		const requestArgs = { type, name, content, ttl, proxied };

		if (priority) {
			requestArgs.priority = priority;
		}

		if (type === 'TXT' || type === 'MX') {
			requestArgs.proxied = false;
		}

		const dnsRecordsApiUrl = DNS.buildApiURL(`zones/${zoneId}/dns_records`);

		const response = await DNS.request(dnsRecordsApiUrl.toString(), 'POST', requestArgs);

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Delete a DNS Records for a Zone
	 *
	 * @param {object} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async delete(args) {
		const maybeZoneId = await DNS.convertZoneNameToId(args.zone);
		const zoneId = maybeZoneId || args.zone;

		const maybeRecordId = await DNS.convertRecordNameToId(zoneId, args.record);
		const recordId = maybeRecordId || args.record;

		const dnsRecordsApiUrl = DNS.buildApiURL(`zones/${zoneId}/dns_records/${recordId}`);

		const response = await DNS.request(dnsRecordsApiUrl.toString(), 'DELETE');

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Export all DNS Records for a Zone into a txt file
	 *
	 * @param {object} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async export(args = {}) {
		const maybeZoneId = await DNS.convertZoneNameToId(args.zone);
		const zoneId = maybeZoneId || args.zone;

		const dnsRecordsApiUrl = DNS.buildApiURL(`zones/${zoneId}/dns_records/export`);

		return DNS.requestAsText(dnsRecordsApiUrl.toString());
	}

	/**
	 * Get DNS Records details
	 *
	 * @param {object} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async get(args) {
		const maybeZoneId = await DNS.convertZoneNameToId(args.zone);
		const zoneId = maybeZoneId || args.zone;

		const maybeRecordId = await DNS.convertRecordNameToId(zoneId, args.record);
		const recordId = maybeRecordId || args.record;

		const dnsRecordsApiUrl = DNS.buildApiURL(`zones/${zoneId}/dns_records/${recordId}`);

		const response = await DNS.request(dnsRecordsApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Bulk Import DNS Records for a Zone from a txt file
	 *
	 * @param {object} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async import(args = {}) {
		const { inputFile, proxied = true } = args;
		const maybeZoneId = await DNS.convertZoneNameToId(args.zone);
		const zoneId = maybeZoneId || args.zone;

		const dnsRecordsApiUrl = DNS.buildApiURL(`zones/${zoneId}/dns_records/import`);

		if (!(await fs.pathExists(inputFile))) {
			throw new Error(`Input File ${inputFile} does not exist`);
		}

		const formData = new FormData();
		formData.append('file', fs.createReadStream(inputFile));
		formData.append('proxied', proxied.toString());

		const response = await DNS.requestWithFormData(
			dnsRecordsApiUrl.toString(),
			'POST',
			formData,
		);

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * List DNS Records of a Zone
	 *
	 * @param {object} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async list(args = {}) {
		const { type = '', name = '', content = '' } = args;
		const maybeZoneId = await DNS.convertZoneNameToId(args.zone);
		const zoneId = maybeZoneId || args.zone;

		let dnsRecordsApiUrl = DNS.buildApiURL(`zones/${zoneId}/dns_records`);

		if (type) {
			dnsRecordsApiUrl.searchParams.append('type', type);
		}

		if (name) {
			dnsRecordsApiUrl.searchParams.append('name', name);
		}

		if (content) {
			dnsRecordsApiUrl.searchParams.append('content', content);
		}

		dnsRecordsApiUrl = DNS.optionalParams(dnsRecordsApiUrl, args);

		const response = await DNS.request(dnsRecordsApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Update a DNS Records for a Zone
	 *
	 * @param {object} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async update(args) {
		const { type = 'A', name = '', content = '', ttl = 1, proxied = true, priority = 0 } = args;

		const maybeZoneId = await DNS.convertZoneNameToId(args.zone);
		const zoneId = maybeZoneId || args.zone;

		const maybeRecordId = await DNS.convertRecordNameToId(zoneId, args.record);
		const recordId = maybeRecordId || args.record;

		const requestArgs = { type, name, content, ttl, proxied };

		if (priority) {
			requestArgs.priority = priority;
		}

		if (type === 'TXT' || type === 'MX') {
			requestArgs.proxied = false;
		}

		const dnsRecordsApiUrl = DNS.buildApiURL(`zones/${zoneId}/dns_records/${recordId}`);

		const response = await DNS.request(dnsRecordsApiUrl.toString(), 'PUT', requestArgs);

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}
}

export default DNS;
