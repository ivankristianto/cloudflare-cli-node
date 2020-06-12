import Zones from '../../classes/zones';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'list';
exports.desc = 'List, search, sort, and filter your zones';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,name,status,name_servers',
		describe: 'Fields to return',
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

		formatter.output({ fields, format, separator, results });
	} catch (err) {
		log.error(err);
	}
};
