import { merge } from 'lodash';
import Cloudflare from './cloudflare';

class Rules extends Cloudflare {
	/**
	 * Create a DNS Records for a Zone
	 *
	 * @param {object} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async create(args) {
		const { target = {}, action = {}, priority = 1, status = 'active' } = args;

		const maybeZoneId = await Rules.convertZoneNameToId(args.zone);
		const zoneId = maybeZoneId || args.zone;

		const requestArgs = { targets: [target], actions: [action], priority, status };

		if (priority) {
			requestArgs.priority = priority;
		}

		const ruleRecordApiUrl = Rules.buildApiURL(`zones/${zoneId}/pagerules`);

		const response = await Rules.request(ruleRecordApiUrl.toString(), 'POST', requestArgs);

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Delete a DNS Records for a Zone
	 *
	 * @param {object} args Object contain params
	 * @param {Array} args.zone List of zones name to check for.
	 * @param {Array} args.records List of DNS records to delete.
	 * @returns {Promise<*>}
	 */
	static async delete({ zone, records }) {
		const maybeZoneId = await Rules.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;

		const output = [];
		const promises = [];
		records.forEach((record) => {
			const deleteSequence = async () => {
				const maybeRecordId = await Rules.convertRecordNameToId(zoneId, record);
				const recordId = maybeRecordId || record;

				const ruleRecordsApiUrl = Rules.buildApiURL(
					`zones/${zoneId}/pagerules/${recordId}`,
				);

				return Rules.request(ruleRecordsApiUrl.toString(), 'DELETE');
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
	 * Get Rule Records details
	 *
	 * @param {object} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async get(args) {
		const maybeZoneId = await Rules.convertZoneNameToId(args.zone);
		const zoneId = maybeZoneId || args.zone;

		const maybeRecordId = await Rules.convertRecordNameToId(zoneId, args.record);
		const recordId = maybeRecordId || args.record;

		const ruleRecordApiUrl = Rules.buildApiURL(`zones/${zoneId}/pagerules/${recordId}`);

		const response = await Rules.request(ruleRecordApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * List Rule Records of a Zone
	 *
	 * @param {object} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async list(args = {}) {
		const { status = '', order = 'status', direction = 'desc' } = args;
		const maybeZoneId = await Rules.convertZoneNameToId(args.zone);
		const zoneId = maybeZoneId || args.zone;

		let rulesUrl = Rules.buildApiURL(`zones/${zoneId}/pagerules`);

		if (status) {
			rulesUrl.searchParams.append('status', status);
		}

		if (order) {
			rulesUrl.searchParams.append('order', order);
		}

		if (direction) {
			rulesUrl.searchParams.append('direction', direction);
		}

		rulesUrl = Rules.optionalParams(rulesUrl, args);

		const response = await Rules.request(rulesUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Update a Rule Records for a Zone
	 *
	 * @param {object} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async update(args) {
		const { target = {}, action = {}, priority = 1, status = 'active', record, zone } = args;

		const maybeZoneId = await Rules.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;

		const ruleResponse = await Rules.get({ record, zone });
		const ruleRecord = ruleResponse.result;

		const {
			targets: originTargets,
			actions: originActions,
			priority: originPriority,
			status: originStatus,
			id: recordId,
		} = ruleRecord;

		const requestArgs = merge(
			{
				targets: originTargets,
				actions: originActions,
				priority: originPriority,
				status: originStatus,
			},
			{ targets: [target], actions: [action], priority, status },
		);

		const ruleRecordsApiUrl = Rules.buildApiURL(`zones/${zoneId}/pagerules/${recordId}`);

		const response = await Rules.request(ruleRecordsApiUrl.toString(), 'PUT', requestArgs);

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}
}

export default Rules;
