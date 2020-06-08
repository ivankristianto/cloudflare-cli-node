import DNS from '../../classes/dns';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'import <zoneId>';
exports.desc = 'Bulk import dns records for a zone';
exports.builder = {
	inputFile: {
		describe: 'Input file path',
		type: 'string',
		demandOption: true,
	},
};
exports.handler = async function (argv) {
	try {
		const { inputFile, zoneId } = argv;

		const response = await DNS.import({ inputFile, zoneId });

		formatter.toJson(response.result);
		log.success(`DNS records imported successfully`);
	} catch (err) {
		log.error(err);
	}
};
