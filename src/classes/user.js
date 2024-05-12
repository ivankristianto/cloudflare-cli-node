import Cloudflare from './cloudflare';

class User extends Cloudflare {
	/**
	 * Get User Detail
	 *
	 * @return {Promise<*>} Cloudflare API response
	 */
	static async get() {
		const userApiUrl = User.buildApiURL('user');

		const response = await User.request(userApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}
}

export default User;
