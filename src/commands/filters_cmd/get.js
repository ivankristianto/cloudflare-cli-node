import Filters from '../../classes/filters';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'get <zone> <filterId>';
exports.desc = 'Get detail of a zone firewall filters';
exports.builder = {
	filterId: {
		describe: 'Filter ID',
		type: 'string',
	},
	fields: {
		default: 'id,expression',
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
		const { fields, filterId, separator, zone } = argv;
		let { format } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		const response = await Filters.get(zone, filterId);

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
