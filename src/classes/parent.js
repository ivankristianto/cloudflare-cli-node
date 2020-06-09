import { execSync } from 'child_process';

class Parent {
	static optionalParams(urlObject, args = {}) {
		const { order = '', page = 1, perPage = 20, direction = 'asc', match = 'all' } = args;

		if (order) {
			urlObject.searchParams.append('order', order);
		}

		if (page) {
			urlObject.searchParams.append('page', page.toString());
		}

		if (perPage) {
			urlObject.searchParams.append('per_page', perPage.toString());
		}

		if (direction) {
			urlObject.searchParams.append('direction', direction);
		}

		if (match) {
			urlObject.searchParams.append('match', match);
		}

		return urlObject;
	}

	static isDomain(str) {
		try {
			const regex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/s;
			if (regex.exec(str) !== null) {
				const urlTest = str.includes('http') ? str : `https://${str}`;
				const urlObj = new URL(urlTest);
				return urlObj.hostname === str;
			}
			return false;
		} catch (err) {
			console.log('DEBUG: err', err); // eslint-disable-line no-console
			return false;
		}
	}

	/**
	 * Convert Zone Name to Zone ID
	 *
	 * @param {string} zoneName Zone Name
	 *
	 * @returns {string|boolean} Return zone id or false if zone name is not found.
	 */
	static async convertZoneNameToId(zoneName) {
		if (Parent.isDomain(zoneName)) {
			// zoneId is a domain, need to change to zone id.
			let zoneListResponseString = await execSync(
				`cf zones list --zoneName=${zoneName} --fields=id`,
			);

			if (!zoneListResponseString) {
				throw new Error('Zone not found');
			}

			zoneListResponseString = zoneListResponseString.toString();
			// our child process return error
			if (!zoneListResponseString.includes('Error') && zoneListResponseString.length > 0) {
				return zoneListResponseString.trim();
			}

			return false;
		}

		return false;
	}
}

export default Parent;
