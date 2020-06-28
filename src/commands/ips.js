import IPs from '../classes/ips';
import log from '../utils/logger';

exports.command = 'ips';
exports.desc = 'Get list of Cloudflare IPs';
exports.builder = {};
exports.handler = async function () {
	try {
		const response = await IPs.list({});

		console.log(response.result);
	} catch (err) {
		log.error(err);
	}
};
