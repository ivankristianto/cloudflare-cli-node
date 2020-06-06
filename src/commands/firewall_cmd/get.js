import Firewall from '../../classes/firewall';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'get <zoneId> <firewallId>';
exports.desc = 'Get detail of a zone';
exports.builder = {
	zoneId: {
		describe: 'Zone ID',
		type: 'string',
	},
	firewallId: {
		describe: 'Firewall ID',
		type: 'string',
	},
	fields: {
		default: 'id,description,filter',
		describe: 'Fields to return',
		type: 'string',
	},
	format: {
		default: 'table',
		describe: 'Format the output, value: table, string, json',
		type: 'string',
	},
	separator: {
		default: ' ',
		describe: 'Separator value when the output format is string',
		type: 'string',
	},
};
exports.handler = async function (argv) {
	try {
		const { fields, firewallId, separator, zoneId } = argv;
		let { format } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		const response = await Firewall.get(zoneId, firewallId);

		const results = [];

		fields.split(',').forEach((field) => {
			if (field === 'filter') {
				results.push(response.result[field].id);
				return;
			}
			results.push(response.result[field]);
		});

		switch (format) {
			case 'json':
				formatter.toJson(results);
				break;
			case 'string':
				formatter.toString(results, separator);
				break;
			case 'table':
			default:
				formatter.toTable(fields, [results]);
				break;
		}
	} catch (err) {
		log.error(err);
	}
};
