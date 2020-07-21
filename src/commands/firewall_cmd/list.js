import Firewall from '../../classes/firewall';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'list <zone>';
exports.desc = 'List of zone firewall rules';
exports.builder = {
	...formatter.commandArgs(),
	description: {
		describe: 'Find rules that has case-insensitive text in description value',
		type: 'string',
	},
	fields: {
		default: 'id,description,action',
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
		const { description, fields, separator, perPage, page, zone } = argv;
		let { format = 'table' } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		const requestArgs = { description, perPage, page };
		const response = await Firewall.list(zone, requestArgs);

		const results = formatter.mappingFields(fields, response.result);

		formatter.output(results, { fields, format, separator });
	} catch (err) {
		log.error(err);
	}
};
