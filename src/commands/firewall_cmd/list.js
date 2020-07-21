import Firewall from '../../classes/firewall';
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
	const { description, fields, separator, perPage, page, spinner, zone } = argv;
	let { format = 'table' } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	const requestArgs = { description, perPage, page };

	spinner.text = `Requesting Firewall list…`;

	const response = await Firewall.list(zone, requestArgs);

	const results = formatter.mappingFields(fields, response.result);

	formatter.output(results, { fields, format, separator });

	spinner.text = `Get Firewall list done!`;
}

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
exports.handler = withSpinner(runCommand);
