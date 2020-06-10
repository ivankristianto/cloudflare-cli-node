import Zones from '../../classes/zones';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'get <zone>';
exports.desc = 'Get zone details';
exports.builder = {
	fields: {
		default: 'id,name,status,name_servers',
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
		const { fields, separator, zone } = argv;
		let { format } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		if (fields === 'name_servers') {
			format = 'json';
		}

		const response = await Zones.get(zone);

		const results = [];

		fields.split(',').forEach((field) => {
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
