import Accounts from '../../classes/accounts';
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
	const { accountId, fields, separator, spinner } = argv;
	let { format = 'list' } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	spinner.text = `Requesting Account information…`;
	const response = await Accounts.get(accountId);

	const results = formatter.mappingField(fields, response.result);

	formatter.output([results], { fields, format, separator });
	spinner.text = `Get Account done!`;
}

exports.command = 'get <accountId>';
exports.desc = 'Get information about a specific account that you are a member of';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,name,type,created_on',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
