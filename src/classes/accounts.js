import Cloudflare from './cloudflare';

class Accounts extends Cloudflare {
	/**
	 * Get Accounts Detail
	 *
	 * @param {string} accountId Account ID
	 * @returns {Promise<*>}
	 */
	static async get(accountId) {
		const userApiUrl = Accounts.buildApiURL(`accounts/${accountId}`);

		const response = await Accounts.request(userApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}

	/**
	 * Get Accounts List
	 *
	 * @param {object} args Arguments to pass to request string
	 * @returns {Promise<*>}
	 */
	static async list(args) {
		let userApiUrl = Accounts.buildApiURL('accounts');

		userApiUrl = Accounts.optionalParams(userApiUrl, args);

		const response = await Accounts.request(userApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}
}

export default Accounts;
