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
	const { fields, filterId, separator, spinner, zone } = argv;
	let { format = 'list' } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	spinner.text = `Requesting Filter information…`;

	const response = await Filters.get(zone, filterId);

	const results = formatter.mappingField(fields, response.result);

	formatter.output([results], { fields, format, separator });

	spinner.text = `Get Filter information done!`;
}

exports.command = 'get <zone> <filterId>';
exports.desc = 'Get detail of a zone firewall filters';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,expression,paused',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
