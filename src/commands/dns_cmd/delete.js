import DNS from '../../classes/dns';
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
	const { records, spinner, zone } = argv;
	const requestArgs = { zone, records };

	spinner.text = `Deleting DNS record ${records}…`;

	const response = await DNS.delete(requestArgs);

	const fields = 'recordId,status,message';
	const results = formatter.mappingFields(fields, response);
	formatter.output(results, { fields, format: 'table' });

	spinner.text = `DNS record ${records} deleted successfully!`;
}

exports.command = 'delete <zone> [records...]';
exports.desc = 'Delete a dns record in a zone';
exports.builder = {};
exports.handler = withSpinner(runCommand);
