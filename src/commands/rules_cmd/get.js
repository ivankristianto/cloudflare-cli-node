import Rules from '../../classes/rules';
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
	const { fields, record, separator, spinner, zone } = argv;
	let { format = 'list' } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	spinner.text = `Requesting Zone Rule details…`;

	const response = await Rules.get({ record, zone });

	const results = formatter.mappingField(fields, response.result);

	formatter.output([results], { fields, format, separator });

	spinner.text = `Get Zone Rule details done!`;
}

exports.command = 'get <zone> <record>';
exports.desc = 'Get Zone rule details';
exports.builder = {
	...formatter.commandArgs(),
	format: {
		default: 'list',
		describe: 'Format the output, value: table, string, json, list',
		type: 'string',
	},
	fields: {
		default: 'id,targets,actions,priority,status',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
