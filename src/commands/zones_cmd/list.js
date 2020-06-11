import Zones from '../../classes/zones';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'list';
exports.desc = 'List, search, sort, and filter your zones';
exports.builder = {
	fields: {
		default: 'id,name,status',
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
		describe: 'Status of the zone',
		type: 'string',
	},
	zoneName: {
		default: [],
		describe: 'Array of domain names',
		type: 'array',
	},
};
exports.handler = async function (argv) {
	try {
		const { fields, separator, perPage, page, order, direction, status, zoneName } = argv;
		let { format } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		const requestArgs = { perPage, page, order, direction };

		if (zoneName) {
			requestArgs.zoneName = zoneName;
		}

		if (status) {
			requestArgs.status = status;
		}

		const response = await Zones.list(requestArgs);

		const results = formatter.mappingFields(fields, response.result);

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
