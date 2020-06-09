import fs from 'fs-extra';
import FormData from 'form-data';
import Parent from './parent';
import { getRootApiURL } from '../utils/config';
import request, { requestAsText, requestWithFormData } from '../utils/request';

class DNS extends Parent {
	/**
	 * List DNS Records of a Zone
	 *
	 * @param {Array} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async list(args = {}) {
		const { type = 'A', name = '', content = '' } = args;
		const maybeZoneId = await DNS.convertZoneNameToId(args.zoneId);
		const zoneId = maybeZoneId || args.zoneId;

		let dnsRecordsApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}/dns_records`);

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

		const response = await request(dnsRecordsApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Create a DNS Records for a Zone
	 *
	 * @param {Array} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async create(args = {}) {
		const { type = 'A', name = '', content = '', ttl = 1, proxied = true, priority = 0 } = args;

		const maybeZoneId = await DNS.convertZoneNameToId(args.zoneId);
		const zoneId = maybeZoneId || args.zoneId;

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

	/**
	 * Delete a DNS Records for a Zone
	 *
	 * @param {Array} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async delete(args = {}) {
		const { recordId = '' } = args;
		const maybeZoneId = await DNS.convertZoneNameToId(args.zoneId);
		const zoneId = maybeZoneId || args.zoneId;

		const dnsRecordsApiUrl = new URL(
			`${getRootApiURL()}zones/${zoneId}/dns_records/${recordId}`,
		);

		const response = await request(dnsRecordsApiUrl.toString(), 'DELETE');

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Export all DNS Records for a Zone into a txt file
	 *
	 * @param {Array} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async export(args = {}) {
		const maybeZoneId = await DNS.convertZoneNameToId(args.zoneId);
		const zoneId = maybeZoneId || args.zoneId;

		const dnsRecordsApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}/dns_records/export`);

		return requestAsText(dnsRecordsApiUrl.toString());
	}

	/**
	 * Bulk Import DNS Records for a Zone from a txt file
	 *
	 * @param {Array} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async import(args = {}) {
		const { inputFile, proxied = true } = args;
		const maybeZoneId = await DNS.convertZoneNameToId(args.zoneId);
		const zoneId = maybeZoneId || args.zoneId;

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
