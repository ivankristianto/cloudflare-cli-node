import fs from 'fs';
import DNS from '../../classes/dns';
import log from '../../utils/logger';

exports.command = 'export <zoneId>';
exports.desc = 'Export dns records for a zone';
exports.builder = {
	output: {
		describe: 'Output file path',
		type: 'string',
		demandOption: true,
	},
};
exports.handler = async function (argv) {
	try {
		const { output, zoneId } = argv;

		const response = await DNS.export({ zoneId });

		const fd = fs.openSync(output, 'w+');
		fs.writeSync(fd, response);
		fs.closeSync(fd);

		log.success(`DNS records exported to ${output}`);
	} catch (err) {
		log.error(err);
	}
};
