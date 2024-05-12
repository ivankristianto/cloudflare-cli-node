import User from '../../classes/user';
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
	const { fields, separator, spinner } = argv;
	let { format = 'table' } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	spinner.text = `Requesting User Organizations information…`;
	const response = await User.get();

	const results = formatter.mappingFields(fields, response.result.organizations);

	formatter.output(results, { fields, format, separator });
	spinner.text = `Get User Organizations done!`;
}

exports.command = 'organizations';
exports.desc = 'List organizations of current user';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,name,status',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
