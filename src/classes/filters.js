import { getRootApiURL } from '../utils/config';
import request from '../utils/request';

class Filters {
	static async list(zoneId, args = {}) {
		const { page = 1, perPage = 20 } = args;
		const filterApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}/filters`);

		if (page) {
			filterApiUrl.searchParams.append('page', page.toString());
		}

		if (perPage) {
			filterApiUrl.searchParams.append('per_page', perPage.toString());
		}

		const response = await request(filterApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	static async get(zoneId, filterId) {
		const filterApiUrl = new URL(`${getRootApiURL()}zones/${zoneId}/filters/${filterId}`);

		const response = await request(filterApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	static async delete(zoneId, filterId) {
		const filterApiUrl = `${getRootApiURL}zones/${zoneId}/filters/${filterId}`;

		const response = await request(filterApiUrl.toString(), 'DELETE');

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}
}

export default Filters;
