import Rules from '../../classes/rules';
import formatter from '../../utils/formatter';
import withSpinner from '../../utils/withSpinner';

/**
 * Run Command
 *
 * @param {Object} argv        Command params
 * @param {string} argv.format Output format
 * @return {Promise<void>}
 */
async function runCommand(argv) {
	const { fields, separator, perPage, page, order, direction, spinner, status, zone } = argv;
	let { format = 'table' } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	const requestArgs = { zone, perPage, page, order, direction, status };

	spinner.text = `Requesting Zone Rules list…`;

	const response = await Rules.list(requestArgs);

	const results = formatter.mappingFields(fields, response.result);

	formatter.output(results, { fields, format, separator });

	spinner.text = `Get Zone Rules list done!`;
}

exports.command = 'list <zone>';
exports.desc = 'List of rules of a zone';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,targets,actions,priority,status',
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
		default: 'active',
		describe: 'Status of the rule',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
