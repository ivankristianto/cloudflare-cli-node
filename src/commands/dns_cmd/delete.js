import DNS from '../../classes/dns';
import withSpinner from '../../utils/withSpinner';

/**
 * Run Command
 *
 * @param {object} argv Command params
 * @param {string} argv.format Output format
 * @returns {Promise<void>}
 */
async function runCommand(argv) {
	const { record, spinner } = argv;
	const requestArgs = { ...argv };

	spinner.text = `Deleting DNS record ${record}…`;

	await DNS.delete(requestArgs);

	spinner.text = `DNS record ${record} deleted successfully!`;
}

exports.command = 'delete <zone> <record>';
exports.desc = 'Delete a dns record in a zone';
exports.builder = {};
exports.handler = withSpinner(runCommand);
