import fs from 'fs-extra';
import { merge } from 'lodash';
import FormData from 'form-data';
import Cloudflare from './cloudflare';

class DNS extends Cloudflare {
	/**
	 * Create a DNS Records for a Zone
	 *
	 * @param {Object} args Arguments to pass to request string
	 * @return {Promise<*>} Cloudflare API response
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
	 * @param {Object} args         Object contain params
	 * @param {Array}  args.zone    List of zones name to check for.
	 * @param {Array}  args.records List of DNS records to delete.
	 * @return {Promise<*>} 	    Cloudflare API response
	 */
	static async delete({ zone, records }) {
		const maybeZoneId = await DNS.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;

		const output = [];
		const promises = [];
		records.forEach(record => {
			const deleteSequence = async () => {
				const maybeRecordId = await DNS.convertRecordNameToId(zoneId, record);
				const recordId = maybeRecordId || record;

				const dnsRecordsApiUrl = DNS.buildApiURL(`zones/${zoneId}/dns_records/${recordId}`);

				return DNS.request(dnsRecordsApiUrl.toString(), 'DELETE');
			};

			promises.push(deleteSequence());
		});

		const responses = await Promise.all(promises);

		responses.forEach((response, index) => {
			if (response.success !== true) {
				output.push({
					recordId: records[index],
					status: false,
					message: response.errors[0].message,
				});
				return;
			}
			output.push({
				recordId: records[index],
				status: true,
				message: response.messages.length > 0 ? response.messages[0].message : '',
			});
		});

		return output;
	}

	/**
	 * Export all DNS Records for a Zone into a txt file
	 *
	 * @param {Object} args Arguments to pass to request string
	 * @return {Promise<*>} Cloudflare API response
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
	 * @param {Object} args Arguments to pass to request string
	 * @return {Promise<*>} Cloudflare API response
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
	 * @param {Object} args Arguments to pass to request string
	 * @return {Promise<*>} Cloudflare API response
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

		const response = await DNS.requestWithFormData(dnsRecordsApiUrl.toString(), 'POST', formData);

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * List DNS Records of a Zone
	 *
	 * @param {Object} args Arguments to pass to request string
	 * @return {Promise<*>} Cloudflare API response
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
	 * @param {Object} args Arguments to pass to request string
	 * @return {Promise<*>} Cloudflare API response
	 */
	static async update(args) {
		const { type, name, content, ttl, proxied, priority, record, zone } = args;

		const dnsResponse = await DNS.get({ record, zone });
		const dnsRecord = dnsResponse.result;

		const {
			type: originType,
			name: originName,
			content: originContent,
			ttl: originTtl,
			proxied: originProxied,
			priority: originPriority,
			zone_id: zoneId,
			id: recordId,
		} = dnsRecord;

		const requestArgs = merge(
			{
				type: originType,
				name: originName,
				content: originContent,
				ttl: originTtl,
				proxied: originProxied,
				priority: originPriority,
			},
			{ type, name, content, ttl, proxied, priority },
		);

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
