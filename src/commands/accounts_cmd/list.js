import Accounts from '../../classes/accounts';
import formatter from '../../utils/formatter';
import withSpinner from '../../utils/withSpinner';

/**
 * Run Command
 *
 * @param {object} argv Command params
 * @param {string} argv.format Output format
 * @returns {Promise<void>}
 */
async function runCommand(argv) {
	const { direction, fields, order, perPage, page, separator, spinner } = argv;
	let { format = 'table' } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	const requestArgs = { perPage, page, order, direction };

	spinner.text = `Requesting Account list information…`;
	const response = await Accounts.list(requestArgs);

	const results = formatter.mappingFields(fields, response.result);

	formatter.output(results, { fields, format, separator });
	spinner.text = `Get Account list done!`;
}

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
exports.handler = withSpinner(runCommand);
