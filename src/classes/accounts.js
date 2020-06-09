import Parent from './parent';
import { getRootApiURL } from '../utils/config';
import request from '../utils/request';

class Accounts extends Parent {
	/**
	 * Get Accounts Detail
	 *
	 * @param {string} accountId Account ID
	 * @returns {Promise<*>}
	 */
	static async get(accountId) {
		const userApiUrl = new URL(`${getRootApiURL()}accounts/${accountId}`);

		const response = await request(userApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}
}

export default Accounts;
