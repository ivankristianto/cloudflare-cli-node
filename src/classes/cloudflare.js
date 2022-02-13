import { execSync } from 'child_process';
import yargs from 'yargs';
import Request from './request';

class Cloudflare extends Request {
	/**
	 * Get Root API URL
	 *
	 * @returns {string}
	 */
	static getRootApiUrl() {
		return 'https://api.cloudflare.com/client/v4';
	}

	/**
	 * Build object URL from given urlPath
	 *
	 * @param {string} urlPath URL path to concat with root api url
	 * @returns {URL}
	 */
	static buildApiURL(urlPath) {
		return new URL(`${Cloudflare.getRootApiUrl()}/${urlPath}`);
	}

	/**
	 * Add optional params to the url query string.
	 *
	 * @param {URL} urlObject URL Object
	 * @param {object} args Arguments of optional params
	 * @returns {URL}
	 */
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

	/**
	 * Try to test if the string given is a domain name
	 *
	 * @param {string} str String to test
	 * @returns {boolean} True of string a domain
	 */
	static isDomain(str) {
		try {
			const regex =
				/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/s;
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
		const { useToken = '' } = yargs.argv;

		if (Cloudflare.isDomain(zoneName)) {
			// zoneId is a domain, need to change to zone id.
			let zoneListResponseString = await execSync(
				`cf zones list --zoneName=${zoneName} --fields=id --disableSpinner --useToken=${useToken}`,
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

	/**
	 * Convert Record Name to Record ID
	 *
	 * @param {string} zoneId Zone ID
	 * @param {string} recordName Record Name
	 * @returns {string|boolean} Return zone id or false if zone name is not found.
	 */
	static async convertRecordNameToId(zoneId, recordName) {
		const { useToken = '' } = yargs.argv;
		// zoneId is a domain, need to change to zone id.
		let dnsListResponseString = await execSync(
			`cf dns list ${zoneId} --name=${recordName} --fields=id --disableSpinner --useToken=${useToken}`,
		);

		if (!dnsListResponseString) {
			throw new Error('DNS Record not found');
		}

		dnsListResponseString = dnsListResponseString.toString();
		// our child process return error
		if (!dnsListResponseString.includes('Error') && dnsListResponseString.length > 0) {
			return dnsListResponseString.trim();
		}

		return false;
	}
}

export default Cloudflare;
