import Zones from '../../classes/zones';
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
	const { fields, separator, spinner, zones } = argv;
	let { format = 'table' } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	const requestArgs = { zones };

	spinner.text = `Sending Zone activation check request…`;
	const response = await Zones.activationCheck(requestArgs);

	const results = formatter.mappingFields(fields, response);

	formatter.output(results, { fields, format, separator });

	spinner.text = `Zone activation check request done!`;
}

exports.command = 'activation_check [zones...]';
exports.desc = 'Initiate another zone activation check';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'name,status,message',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
