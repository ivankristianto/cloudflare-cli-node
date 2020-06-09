import Parent from './parent';
import { getRootApiURL } from '../utils/config';
import request from '../utils/request';

class User extends Parent {
	/**
	 * Get User Detail
	 *
	 * @returns {Promise<*>}
	 */
	static async get() {
		const userApiUrl = new URL(`${getRootApiURL()}user`);

		const response = await request(userApiUrl.toString());

		if (response.success !== true) {
			throw new Error(response.errors[0].message);
		}

		return response;
	}
}

export default User;
