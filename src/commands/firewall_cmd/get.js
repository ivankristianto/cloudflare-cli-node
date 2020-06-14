import Firewall from '../../classes/firewall';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'get <zone> <firewallId>';
exports.desc = 'Get details of a zone firewall';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,description,filter',
		describe: 'Fields to return',
		type: 'string',
	},
	format: {
		default: 'list',
		describe: 'Format the output, value: table, string, json, list',
		type: 'string',
	},
};
exports.handler = async function (argv) {
	try {
		const { fields, firewallId, separator, zone } = argv;
		let { format = 'list' } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		const response = await Firewall.get(zone, firewallId);

		const results = formatter.mappingField(fields, response.result);

		formatter.output({
			fields,
			format,
			separator,
			results: format === 'table' ? [results] : results,
		});
	} catch (err) {
		log.error(err);
	}
};
