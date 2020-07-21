import Filters from '../../classes/filters';
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
	const { description, expression, paused, fields, filterId, separator, spinner, zone } = argv;
	let { format = 'list' } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	const requestArgs = { description, expression, paused };

	spinner.text = `Sending update to filter id ${filterId}…`;

	const response = await Filters.update(zone, filterId, requestArgs);

	const results = formatter.mappingField(fields, response.result);

	formatter.output([results], { fields, format, separator });

	spinner.text = `Filter ${filterId} successfully updated`;
}

exports.command = 'update <zone> <filterId>';
exports.desc = 'Update a single filter';
exports.builder = {
	...formatter.commandArgs(),
	expression: {
		describe: 'Filter Expression Rule',
		type: 'string',
		demandOption: true,
	},
	paused: {
		default: false,
		describe: 'Pause filter',
		type: 'boolean',
	},
	fields: {
		default: 'id,expression,paused',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
