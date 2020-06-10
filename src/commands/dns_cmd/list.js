import { map } from 'lodash';
import DNS from '../../classes/dns';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'list <zone>';
exports.desc = 'List of dns records of a zone';
exports.builder = {
	fields: {
		default: 'id,type,name,content',
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
	perPage: {
		default: 20,
		describe: 'Number of zones per page',
		type: 'integer',
	},
	page: {
		default: 1,
		describe: 'Page number of paginated results',
		type: 'integer',
	},
	order: {
		default: 'name',
		describe: 'Field to order zones by',
		type: 'string',
	},
	direction: {
		default: 'asc',
		describe: 'Direction to order zones',
		type: 'string',
	},
	status: {
		default: 'active',
		describe: 'Status of the zone',
		type: 'string',
	},
	type: {
		default: 'A',
		describe: 'DNS record type, default A',
		type: 'string',
	},
};
exports.handler = async function (argv) {
	try {
		const { fields, separator, perPage, page, order, direction, status, zone } = argv;
		let { format } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		const requestArgs = { zone, perPage, page, order, direction, status };

		const response = await DNS.list(requestArgs);

		const results = map(response.result, function (item) {
			const output = [];

			fields.split(',').forEach(function (field) {
				output.push(item[field] ? item[field] : '');
			});

			return output;
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
				formatter.toTable(fields, results);
				break;
		}
	} catch (err) {
		log.error(err);
	}
};
