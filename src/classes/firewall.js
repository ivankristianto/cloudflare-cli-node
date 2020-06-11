import Parent from './parent';
import { getRootApiURL } from '../utils/config';
import request from '../utils/request';

class Firewall extends Parent {
	/**
	 * Create a new Firewall Rule
	 *
	 * @param {string} zone Zone ID or Zone Name
	 * @param {object} rules Firewall rule in json object
	 * @returns {Promise<*>}
	 */
	static async create(zone, rules) {
		const maybeZoneId = await Firewall.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;
		const firewallApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}/firewall/rules`);

		const response = await request(firewallApiUrl.toString(), 'POST', [rules]);

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Delete a Firewall Rule
	 *
	 * @param {string} zone Zone ID or Zone Name
	 * @param {string} firewallId Firewall ID
	 * @returns {Promise<*>}
	 */
	static async delete(zone, firewallId) {
		const maybeZoneId = await Firewall.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;
		const firewallApiUrl = `${getRootApiURL()}zones/${zoneId}/firewall/rules/${firewallId}`;

		const response = await request(firewallApiUrl.toString(), 'DELETE');

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Get Firewall Rule Detail
	 *
	 * @param {string} zone Zone ID or Zone Name
	 * @param {string} firewallId Firewall ID
	 * @returns {Promise<*>}
	 */
	static async get(zone, firewallId) {
		const maybeZoneId = await Firewall.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;
		const firewallApiUrl = new URL(
			`${getRootApiURL()}zones/${zoneId}/firewall/rules/${firewallId}`,
		);

		const response = await request(firewallApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * List Firewall Rules
	 *
	 * @param {string} zone Zone ID or Zone Name
	 * @param {object} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async list(zone, args = {}) {
		const { description = '', perPage = 20, page = 1 } = args;
		const maybeZoneId = await Firewall.convertZoneNameToId(zone);
		const zoneId = maybeZoneId || zone;
		let firewallApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}/firewall/rules`);

		if (description) {
			firewallApiUrl.searchParams.append('description', description);
		}

		firewallApiUrl = Firewall.optionalParams(firewallApiUrl, { perPage, page });

		const response = await request(firewallApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}
}

export default Firewall;
