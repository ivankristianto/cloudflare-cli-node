import Parent from './parent';
import { getRootApiURL } from '../utils/config';
import request from '../utils/request';

class Zones extends Parent {
	/**
	 * Create a new Zone
	 *
	 * @param {object} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async create(args = {}) {
		const { accountId, jumpStart = true, name, type = 'full' } = args;

		const requestArgs = { account: { id: accountId }, jump_start: jumpStart, name, type };

		const zonesApiUrl = new URL(`${getRootApiURL()}zones`);

		const response = await request(zonesApiUrl.toString(), 'POST', requestArgs);

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Delete a Zone
	 *
	 * @param {string} zone Maybe Zone ID or Zone Name
	 * @returns {Promise<*>}
	 */
	static async delete(zone) {
		const maybeZoneId = await Zones.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;

		const zonesApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}`);

		const response = await request(zonesApiUrl.toString(), 'DELETE');

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Get details of a zone of the string given
	 *
	 * @param {string} zone Maybe Zone ID or Zone Name
	 * @returns {Promise<*>}
	 */
	static async get(zone) {
		const maybeZoneId = await Zones.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;

		const zonesApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}`);

		const response = await request(zonesApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Get details of a zone of the string given
	 *
	 * @param {string} zone Maybe Zone ID or Zone Name
	 * @param {string} setting Setting to get
	 * @returns {Promise<*>}
	 */
	static async getSettings(zone, setting) {
		const maybeZoneId = await Zones.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;

		const zonesApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}/settings/${setting}`);

		const response = await request(zonesApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * List all zones
	 *
	 * @param {object} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async list(args = {}) {
		const { status = '', zoneName = '' } = args;
		let zonesApiUrl = new URL(`${getRootApiURL()}zones`);

		if (zoneName) {
			zonesApiUrl.searchParams.append('name', zoneName);
		}

		if (status) {
			zonesApiUrl.searchParams.append('status', status);
		}

		zonesApiUrl = Zones.optionalParams(zonesApiUrl, args);

		const response = await request(zonesApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Purge Cache from a Zone
	 *
	 * @param {string} zone Maybe Zone ID or Zone Name
	 * @param {object} args optional parameters
	 * @returns {Promise<*>}
	 */
	static async purge(zone, { all = false, files = [], tags = [], hosts = [] }) {
		const maybeZoneId = await Zones.convertZoneNameToId(zone);

		const zoneId = maybeZoneId || zone;

		const zonesApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}/purge_cache`);

		const requestArgs = {};

		if (all) {
			requestArgs.purge_everything = true;
		}

		if (Array.isArray(files) && files.length) {
			requestArgs.files = files;
		}

		if (Array.isArray(tags) && tags.length) {
			requestArgs.tags = tags;
		}

		if (Array.isArray(hosts) && hosts.length) {
			requestArgs.hosts = hosts;
		}

		const response = await request(zonesApiUrl.toString(), 'POST', requestArgs);

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Get details of a zone of the string given
	 *
	 * @param {string} zone Maybe Zone ID or Zone Name
	 * @param {string} setting Setting to set
	 * @param {object} args Setting args
	 * @returns {Promise<*>}
	 */
	static async setSettings(zone, setting, args) {
		const maybeZoneId = await Zones.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;

		const zonesApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}/settings/${setting}`);

		const response = await request(zonesApiUrl.toString(), 'PATCH', args);

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}
}

export default Zones;
