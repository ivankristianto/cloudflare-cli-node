import Cloudflare from './cloudflare';

class IPs extends Cloudflare {
	/**
	 * Get Accounts List
	 *
	 * @param {Object} args Arguments to pass to request string
	 * @return {Promise<*>} Cloudflare API response
	 */
	static async list(args) {
		let userApiUrl = IPs.buildApiURL('ips');

		userApiUrl = IPs.optionalParams(userApiUrl, args);

		const response = await IPs.request(userApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}
}

export default IPs;
