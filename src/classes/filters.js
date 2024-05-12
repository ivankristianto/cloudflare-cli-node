import Cloudflare from './cloudflare';

class Filters extends Cloudflare {
	/**
	 * Update a single filter
	 *
	 * @param {string} zone Zone ID or Zone Name
	 * @param {Object} args Filter object
	 * @return {Promise<*>} Cloudflare API response
	 */
	static async create(zone, args) {
		const { expressions } = args;
		const maybeZoneId = await Filters.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;

		const filterApiUrl = Filters.buildApiURL(`zones/${zoneId}/filters`);
		const response = await Filters.request(filterApiUrl.toString(), 'POST', expressions);

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Delete a Firewall Filter
	 *
	 * @param {string} zone     Zone ID or Zone Name
	 * @param {string} filterId filter ID
	 * @return {Promise<*>} Cloudflare API response
	 */
	static async delete(zone, filterId) {
		const maybeZoneId = await Filters.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;
		const filterApiUrl = Filters.buildApiURL(`zones/${zoneId}/filters/${filterId}`);

		const response = await Filters.request(filterApiUrl.toString(), 'DELETE');

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Get Firewall Filter Detail
	 *
	 * @param {string} zone     Zone ID or Zone Name
	 * @param {string} filterId filter ID
	 * @return {Promise<*>} Cloudflare API response
	 */
	static async get(zone, filterId) {
		const maybeZoneId = await Filters.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;
		const filterApiUrl = Filters.buildApiURL(`zones/${zoneId}/filters/${filterId}`);

		const response = await Filters.request(filterApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * List Firewall Filter
	 *
	 * @param {string} zone Zone ID or Zone Name
	 * @param {Object} args Arguments to pass to request string
	 * @return {Promise<*>} Cloudflare API response
	 */
	static async list(zone, args = {}) {
		const maybeZoneId = await Filters.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;
		let filterApiUrl = Filters.buildApiURL(`zones/${zoneId}/filters`);

		filterApiUrl = Filters.optionalParams(filterApiUrl, args);

		const response = await Filters.request(filterApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Update a single filter
	 *
	 * @param {string} zone     Zone ID or Zone Name
	 * @param {string} filterId filter ID
	 * @param {Object} args     Filter object
	 * @return {Promise<*>}     Cloudflare API response
	 */
	static async update(zone, filterId, args) {
		const { paused = false, expression } = args;
		const maybeZoneId = await Filters.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;

		const filterResponse = await Filters.get(zone, filterId);
		const filter = { ...filterResponse.result, paused, expression };

		const filterApiUrl = Filters.buildApiURL(`zones/${zoneId}/filters/${filterId}`);
		const response = await Filters.request(filterApiUrl.toString(), 'PUT', filter);

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}
}

export default Filters;
