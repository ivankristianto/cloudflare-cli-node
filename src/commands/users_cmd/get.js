import User from '../../classes/user';
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
	const { fields, separator, spinner } = argv;
	let { format = 'table' } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	spinner.text = `Requesting User information…`;
	const response = await User.get();

	const results = formatter.mappingField(fields, response.result);

	formatter.output([results], { fields, format, separator });
	spinner.text = `Get User done!`;
}

exports.command = 'get';
exports.desc = 'Get details of current user';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,email,username',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
