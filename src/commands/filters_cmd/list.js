import Filters from '../../classes/filters';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'list <zone>';
exports.desc = 'List of zone available firewall filters';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,expression',
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
};
exports.handler = async function (argv) {
	try {
		const { fields, separator, perPage, page, zone } = argv;
		let { format = 'table' } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		const requestArgs = { perPage, page };
		const response = await Filters.list(zone, requestArgs);

		const results = formatter.mappingFields(fields, response.result);

		formatter.output(results, { fields, format, separator });
	} catch (err) {
		log.error(err);
	}
};
