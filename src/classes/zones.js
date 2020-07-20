import Cloudflare from './cloudflare';

class Zones extends Cloudflare {
	/**
	 * Force zones activation checks
	 *
	 * @param {object} args Object contain params
	 * @param {Array} args.zones List of zones name to check for.
	 *
	 * @returns {Array}
	 */
	static async activationCheck({ zones = [] }) {
		const zoneIds = await Promise.all(
			zones.map(async function (zone) {
				const maybeZoneId = await Zones.convertZoneNameToId(zone);
				return maybeZoneId || zone;
			}),
		);

		const output = [];
		const promises = [];
		zoneIds.forEach((zoneId) => {
			const zonesApiUrl = Zones.buildApiURL(`zones/${zoneId}/activation_check`);
			promises.push(Zones.request(zonesApiUrl.toString(), 'PUT', {}));
		});

		const responses = await Promise.all(promises);

		responses.forEach((response, index) => {
			if (response.success !== true) {
				output.push({
					name: zones[index],
					status: false,
					message: response.errors[0].message,
				});
				return;
			}
			output.push({
				name: zones[index],
				status: true,
				message: response.messages.length > 0 ? response.messages[0].message : '',
			});
		});

		return output;
	}

	/**
	 * Create a new Zone
	 *
	 * @param {object} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async create(args = {}) {
		const { accountId, jumpStart = true, name, type = 'full' } = args;

		const requestArgs = { account: { id: accountId }, jump_start: jumpStart, name, type };

		const zonesApiUrl = Zones.buildApiURL('zones');

		const response = await Zones.request(zonesApiUrl.toString(), 'POST', requestArgs);

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

		const zonesApiUrl = Zones.buildApiURL(`zones/${zoneId}`);

		const response = await Zones.request(zonesApiUrl.toString(), 'DELETE');

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

		const zonesApiUrl = Zones.buildApiURL(`zones/${zoneId}`);

		const response = await Zones.request(zonesApiUrl.toString());

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

		const zonesApiUrl = Zones.buildApiURL(`zones/${zoneId}/settings/${setting}`);

		const response = await Zones.request(zonesApiUrl.toString());

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
		const { account = '', status = '', zoneName = '' } = args;
		let zonesApiUrl = Zones.buildApiURL('zones');

		if (account) {
			zonesApiUrl.searchParams.append('account.id', account);
		}

		if (zoneName) {
			zonesApiUrl.searchParams.append('name', zoneName);
		}

		if (status) {
			zonesApiUrl.searchParams.append('status', status);
		}

		zonesApiUrl = Zones.optionalParams(zonesApiUrl, args);

		const response = await Zones.request(zonesApiUrl.toString());

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

		const zonesApiUrl = Zones.buildApiURL(`zones/${zoneId}/purge_cache`);

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

		const response = await Zones.request(zonesApiUrl.toString(), 'POST', requestArgs);

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

		const zonesApiUrl = Zones.buildApiURL(`zones/${zoneId}/settings/${setting}`);

		const response = await Zones.request(zonesApiUrl.toString(), 'PATCH', args);

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}
}

export default Zones;
