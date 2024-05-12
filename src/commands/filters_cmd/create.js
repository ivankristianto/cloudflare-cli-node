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
	const { fields, separator, spinner, zone } = argv;
	let { expressions, format = 'list' } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	expressions = expressions.map(expression => JSON.parse(expression));

	const requestArgs = { expressions };

	spinner.text = `Creating firewall filter…`;

	const response = await Filters.create(zone, requestArgs);

	const results = formatter.mappingFields(fields, response.result);

	formatter.output([results], { fields, format, separator });

	spinner.text = `New firewall filter created successfully!`;
}

exports.command = 'create <zone>';
exports.desc = 'Create filters rules';
exports.builder = {
	...formatter.commandArgs(),
	expressions: {
		describe: 'Filter Expression Rule',
		type: 'array',
		demandOption: true,
	},
	fields: {
		default: 'id,description,expression,paused',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
