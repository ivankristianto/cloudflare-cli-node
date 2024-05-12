import Filters from '../../classes/filters';
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
	const { fields, separator, perPage, page, spinner, zone } = argv;
	let { format = 'table' } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	const requestArgs = { perPage, page };

	spinner.text = `Requesting Filters list…`;

	const response = await Filters.list(zone, requestArgs);

	const results = formatter.mappingFields(fields, response.result);

	formatter.output(results, { fields, format, separator });

	spinner.text = `Get Filters list done!`;
}

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
exports.handler = withSpinner(runCommand);
