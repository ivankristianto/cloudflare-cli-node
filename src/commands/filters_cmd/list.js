import { map } from 'lodash';
import Filters from '../../classes/filters';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'list <zoneId|zoneName>';
exports.desc = 'List of filters';
exports.builder = {
	zoneId: {
		describe: 'Zone ID',
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
};
exports.handler = async function (argv) {
	try {
		const { fields, separator, perPage, page, zoneId } = argv;
		let { format } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		const requestArgs = { perPage, page };
		const response = await Filters.list(zoneId, requestArgs);

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
