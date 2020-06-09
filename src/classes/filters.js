import Parent from './parent';
import { getRootApiURL } from '../utils/config';
import request from '../utils/request';

class Filters extends Parent {
	/**
	 * List Firewall Filter
	 *
	 * @param {string} zone Zone ID or Zone Name
	 * @param {Array} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async list(zone, args = {}) {
		const maybeZoneId = await Filters.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;
		let filterApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}/filters`);

		filterApiUrl = Filters.optionalParams(filterApiUrl, args);

		const response = await request(filterApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Get Firewall Filter Detail
	 *
	 * @param {string} zone Zone ID or Zone Name
	 * @param {string} filterId filter ID
	 * @returns {Promise<*>}
	 */
	static async get(zone, filterId) {
		const maybeZoneId = await Filters.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;
		const filterApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}/filters/${filterId}`);

		const response = await request(filterApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Delete a Firewall Filter
	 *
	 * @param {string} zone Zone ID or Zone Name
	 * @param {string} filterId filter ID
	 * @returns {Promise<*>}
	 */
	static async delete(zone, filterId) {
		const maybeZoneId = await Filters.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;
		const filterApiUrl = `${getRootApiURL}zones/${zoneId}/filters/${filterId}`;

		const response = await request(filterApiUrl.toString(), 'DELETE');

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}
}

export default Filters;
