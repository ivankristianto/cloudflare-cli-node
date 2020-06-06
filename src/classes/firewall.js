import { getRootApiURL } from '../utils/config';
import request from '../utils/request';

class Firewall {
	static async list(zoneId, args = {}) {
		const { page = 1, perPage = 20 } = args;
		const firewallApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}/firewall/rules`);

		if (page) {
			firewallApiUrl.searchParams.append('page', page.toString());
		}

		if (perPage) {
			firewallApiUrl.searchParams.append('per_page', perPage.toString());
		}

		const response = await request(firewallApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	static async get(zoneId, firewallId) {
		const firewallApiUrl = new URL(
			`${getRootApiURL()}zones/${zoneId}/firewall/rules/${firewallId}`,
		);

		const response = await request(firewallApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	static async add(zoneId, rules) {
		const firewallApiUrl = new URL(`${getRootApiURL}zones/${zoneId}/firewall/rules`);

		const response = await request(firewallApiUrl.toString(), 'POST', rules);

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	static async delete(zoneId, firewallId) {
		const firewallApiUrl = `${getRootApiURL}zones/${zoneId}/firewall/rules/${firewallId}`;

		const response = await request(firewallApiUrl.toString(), 'DELETE');

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}
}

export default Firewall;
