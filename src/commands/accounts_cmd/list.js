import Accounts from '../../classes/accounts';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'list';
exports.desc = 'Get information about a specific account that you are a member of';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,name,type',
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
};
exports.handler = async function (argv) {
	try {
		const { fields, separator, perPage, page, order, direction } = argv;
		let { format = 'table' } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		const requestArgs = { perPage, page, order, direction };

		const response = await Accounts.list(requestArgs);

		const results = formatter.mappingFields(fields, response.result);

		formatter.output(results, { fields, format, separator });
	} catch (err) {
		log.error(err);
	}
};
