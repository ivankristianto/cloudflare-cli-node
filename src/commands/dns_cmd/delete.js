import DNS from '../../classes/dns';
import log from '../../utils/logger';

exports.command = 'delete <zoneId> <recordId>';
exports.desc = 'Delete a dns record in a zone';
exports.builder = {};
exports.handler = async function (argv) {
	try {
		const requestArgs = { ...argv };

		await DNS.delete(requestArgs);

		log.success('Record deleted');
	} catch (err) {
		log.error(err);
	}
};
