import { getRootApiURL } from '../utils/config';
import request from '../utils/request';

class Zones {
	static async list(args = {}) {
		const {
			status = 'active',
			zoneName = '',
			order = 'name',
			page = 1,
			perPage = 20,
			direction = 'asc',
		} = args;
		const zonesApiUrl = new URL(`${getRootApiURL()}zones`);

		if (zoneName) {
			zonesApiUrl.searchParams.append('name', zoneName);
		}

		if (status) {
			zonesApiUrl.searchParams.append('status', status);
		}

		if (order) {
			zonesApiUrl.searchParams.append('order', order);
		}

		if (page) {
			zonesApiUrl.searchParams.append('page', page.toString());
		}

		if (perPage) {
			zonesApiUrl.searchParams.append('per_page', perPage.toString());
		}

		if (direction) {
			zonesApiUrl.searchParams.append('direction', direction);
		}

		const response = await request(zonesApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	static async get(zoneId) {
		const zonesApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}`);

		const response = await request(zonesApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}
}

export default Zones;
